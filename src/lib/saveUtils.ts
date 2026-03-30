import { INITIAL_STATE } from './gameLogic'

const DEFAULT_KEY = 'sword-enhance-v2'

function getSaveKey(): string {
  const session = typeof window !== 'undefined' ? localStorage.getItem('sword-session') : null
  return session ? `sword-save-${session.replace(/[^a-zA-Z0-9_]/g, '')}` : DEFAULT_KEY
}

export function addGoldToSave(amount: number) {
  try {
    const key = getSaveKey()
    const raw = localStorage.getItem(key)
    if (raw) {
      const state = { ...INITIAL_STATE, ...JSON.parse(raw) }
      const updated = { ...state, gold: Math.max(0, (state.gold ?? 0) + amount) }
      localStorage.setItem(key, JSON.stringify(updated))
    }
  } catch { /* */ }
}

export function loadSwordLevel(): number {
  try {
    const key = getSaveKey()
    const raw = localStorage.getItem(key)
    if (raw) {
      const state = { ...INITIAL_STATE, ...JSON.parse(raw) }
      return state.weapons?.[state.activeWeapon]?.level ?? state.level
    }
  } catch { /* */ }
  return 0
}

export function loadPlayerInfo(): { level: number; name: string; weapon: string } {
  const session = typeof window !== 'undefined' ? localStorage.getItem('sword-session') : null
  return {
    level: loadSwordLevel(),
    name: session ?? 'Guest',
    weapon: 'sword',
  }
}
