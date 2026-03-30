const ACCOUNTS_KEY = 'sword-accounts'
const SESSION_KEY = 'sword-session'

interface Account {
  id: string
  passwordHash: string
  createdAt: number
}

interface AccountStore {
  accounts: Account[]
}

// Simple hash (not cryptographically secure, but sufficient for a game)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'sword-enhance-salt-2026')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function loadAccounts(): AccountStore {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    return raw ? JSON.parse(raw) : { accounts: [] }
  } catch {
    return { accounts: [] }
  }
}

function saveAccounts(store: AccountStore) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(store))
}

export function getCurrentUser(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_KEY)
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export async function register(id: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (id.length < 2 || id.length > 20) return { ok: false, error: 'ID는 2~20자여야 합니다.' }
  if (password.length < 4) return { ok: false, error: '비밀번호는 4자 이상이어야 합니다.' }
  if (!/^[a-zA-Z0-9_]+$/.test(id)) return { ok: false, error: 'ID는 영문, 숫자, _만 가능합니다.' }

  const store = loadAccounts()
  if (store.accounts.some(a => a.id === id)) {
    return { ok: false, error: '이미 존재하는 ID입니다.' }
  }

  const hash = await hashPassword(password)
  store.accounts.push({ id, passwordHash: hash, createdAt: Date.now() })
  saveAccounts(store)
  localStorage.setItem(SESSION_KEY, id)

  return { ok: true }
}

export async function login(id: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const store = loadAccounts()
  const account = store.accounts.find(a => a.id === id)
  if (!account) return { ok: false, error: 'ID 또는 비밀번호가 틀렸습니다.' }

  const hash = await hashPassword(password)
  if (hash !== account.passwordHash) {
    return { ok: false, error: 'ID 또는 비밀번호가 틀렸습니다.' }
  }

  localStorage.setItem(SESSION_KEY, id)
  return { ok: true }
}

// Per-user game save key
export function getUserSaveKey(userId: string): string {
  return `sword-save-${userId}`
}

export function getUserMissionKey(userId: string): string {
  return `sword-missions-${userId}`
}
