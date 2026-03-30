const ACCOUNTS_KEY = 'sword-accounts-v2'
const SESSION_KEY = 'sword-session'
const LOGIN_ATTEMPTS_KEY = 'sword-login-attempts'

interface Account {
  id: string
  passwordHash: string
  salt: string
  createdAt: number
}

interface AccountStore {
  accounts: Account[]
}

interface LoginAttempts {
  count: number
  lockedUntil: number
}

// PBKDF2-based password hashing (much stronger than plain SHA-256)
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'],
  )
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256,
  )
  return Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function generateSalt(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
}

function loadAccounts(): AccountStore {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (raw) return JSON.parse(raw)
    // Migrate v1 accounts
    const v1 = localStorage.getItem('sword-accounts')
    if (v1) {
      const old = JSON.parse(v1) as { accounts: Array<{ id: string; passwordHash: string; createdAt: number }> }
      // v1 accounts can't be migrated (no salt), keep as-is with a dummy salt marker
      const migrated: AccountStore = {
        accounts: old.accounts.map(a => ({ ...a, salt: '__v1__' })),
      }
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(migrated))
      return migrated
    }
    return { accounts: [] }
  } catch {
    return { accounts: [] }
  }
}

function saveAccounts(store: AccountStore) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(store))
}

// Brute force protection
function getLoginAttempts(): LoginAttempts {
  try {
    const raw = localStorage.getItem(LOGIN_ATTEMPTS_KEY)
    return raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 }
  } catch {
    return { count: 0, lockedUntil: 0 }
  }
}

function recordFailedAttempt() {
  const attempts = getLoginAttempts()
  attempts.count++
  if (attempts.count >= 5) {
    attempts.lockedUntil = Date.now() + 60000 // Lock for 1 minute after 5 failures
  }
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts))
}

function resetAttempts() {
  localStorage.removeItem(LOGIN_ATTEMPTS_KEY)
}

function isLocked(): { locked: boolean; remainingMs: number } {
  const attempts = getLoginAttempts()
  if (attempts.lockedUntil > Date.now()) {
    return { locked: true, remainingMs: attempts.lockedUntil - Date.now() }
  }
  if (attempts.count >= 5) resetAttempts() // Reset after lockout expires
  return { locked: false, remainingMs: 0 }
}

export function getCurrentUser(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_KEY)
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

// Input sanitization
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20)
}

export async function register(id: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const cleanId = sanitizeId(id)
  if (cleanId.length < 2 || cleanId.length > 20) return { ok: false, error: 'ID는 2~20자 (영문, 숫자, _)' }
  if (password.length < 4 || password.length > 128) return { ok: false, error: '비밀번호는 4~128자' }

  const store = loadAccounts()
  if (store.accounts.some(a => a.id === cleanId)) {
    return { ok: false, error: '이미 존재하는 ID입니다.' }
  }

  const salt = generateSalt()
  const hash = await hashPassword(password, salt)
  store.accounts.push({ id: cleanId, passwordHash: hash, salt, createdAt: Date.now() })
  saveAccounts(store)
  localStorage.setItem(SESSION_KEY, cleanId)
  resetAttempts()

  return { ok: true }
}

export async function login(id: string, password: string): Promise<{ ok: boolean; error?: string }> {
  // Brute force check
  const lockStatus = isLocked()
  if (lockStatus.locked) {
    const sec = Math.ceil(lockStatus.remainingMs / 1000)
    return { ok: false, error: `너무 많은 시도. ${sec}초 후 다시 시도하세요.` }
  }

  const cleanId = sanitizeId(id)
  const store = loadAccounts()
  const account = store.accounts.find(a => a.id === cleanId)

  // Constant-time-ish: always hash even if account not found (prevents timing attacks)
  const dummySalt = 'dummy-salt-for-timing'
  const salt = account?.salt ?? dummySalt

  let hash: string
  if (salt === '__v1__') {
    // Legacy v1 account: use old SHA-256 method
    const encoder = new TextEncoder()
    const data = encoder.encode(password + 'sword-enhance-salt-2026')
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  } else {
    hash = await hashPassword(password, salt)
  }

  if (!account || hash !== account.passwordHash) {
    recordFailedAttempt()
    // Generic error: prevents account enumeration
    return { ok: false, error: 'ID 또는 비밀번호가 틀렸습니다.' }
  }

  // Migrate v1 to v2 on successful login
  if (account.salt === '__v1__') {
    const newSalt = generateSalt()
    const newHash = await hashPassword(password, newSalt)
    account.salt = newSalt
    account.passwordHash = newHash
    saveAccounts(store)
  }

  localStorage.setItem(SESSION_KEY, cleanId)
  resetAttempts()
  return { ok: true }
}

// Per-user game save key (sanitized)
export function getUserSaveKey(userId: string): string {
  return `sword-save-${sanitizeId(userId)}`
}

export function getUserMissionKey(userId: string): string {
  return `sword-missions-${sanitizeId(userId)}`
}
