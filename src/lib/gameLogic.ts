export interface EnhanceLogEntry {
  from: number
  result: EnhanceResult
  ts: number
  usedProtection: boolean
  usedBlessing: boolean
}

export interface WeaponData {
  level: number
  highestLevel: number
}

export interface GameState {
  level: number
  gold: number
  totalAttempts: number
  totalSuccess: number
  totalMaintain: number
  totalDestroy: number
  highestLevel: number
  lastCheckIn: string | null
  checkInStreak: number
  protectionScrolls: number
  blessingScrolls: number
  achievements: string[]
  enhanceLog: EnhanceLogEntry[]
  activeWeapon: string
  weapons: Record<string, WeaponData>
  failStack: number
  maxFailStack: number
  prestige: number
  prestigeBonus: number
  totalGoldSpent: number
  lastOnline: number
}

export const INITIAL_STATE: GameState = {
  level: 0,
  gold: 1000,
  totalAttempts: 0,
  totalSuccess: 0,
  totalMaintain: 0,
  totalDestroy: 0,
  highestLevel: 0,
  lastCheckIn: null,
  checkInStreak: 0,
  protectionScrolls: 0,
  blessingScrolls: 0,
  achievements: [],
  enhanceLog: [],
  activeWeapon: 'sword',
  weapons: { sword: { level: 0, highestLevel: 0 } },
  failStack: 0,
  maxFailStack: 0,
  prestige: 0,
  prestigeBonus: 0,
  totalGoldSpent: 0,
  lastOnline: Date.now(),
}

export const MAX_LEVEL = 30
export const MAX_LOG = 20

export type EnhanceResult = 'success' | 'maintain' | 'destroy' | 'downgrade'

export function getEnhanceRates(level: number) {
  // downgrade = level -1 (instead of full destroy)
  if (level < 3) return { success: 95, maintain: 5, downgrade: 0, destroy: 0 }
  if (level < 5) return { success: 85, maintain: 15, downgrade: 0, destroy: 0 }
  if (level < 7) return { success: 70, maintain: 20, downgrade: 5, destroy: 5 }
  if (level < 10) return { success: 55, maintain: 25, downgrade: 10, destroy: 10 }
  if (level < 13) return { success: 40, maintain: 25, downgrade: 15, destroy: 20 }
  if (level < 16) return { success: 25, maintain: 25, downgrade: 20, destroy: 30 }
  if (level < 20) return { success: 15, maintain: 20, downgrade: 25, destroy: 40 }
  if (level < 25) return { success: 7, maintain: 13, downgrade: 20, destroy: 60 }
  return { success: 3, maintain: 7, downgrade: 15, destroy: 75 }
}

export function getEnhanceCost(level: number): number {
  if (level < 3) return 50
  if (level < 5) return 100
  if (level < 7) return 300
  if (level < 10) return 600
  if (level < 13) return 1500
  if (level < 16) return 3000
  if (level < 20) return 8000
  if (level < 25) return 20000
  return 50000
}

export function rollEnhance(level: number, useBlessing: boolean, failStack: number = 0): EnhanceResult {
  const rates = getEnhanceRates(level)
  const blessingBonus = useBlessing ? 10 : 0
  const stackBonus = Math.min(failStack * 0.5, 30)
  const successRate = Math.min(99, rates.success + blessingBonus + stackBonus)

  const roll = Math.random() * 100
  if (roll < successRate) return 'success'
  if (roll < successRate + rates.maintain) return 'maintain'
  if (roll < successRate + rates.maintain + rates.downgrade) return 'downgrade'
  return 'destroy'
}

export function getFailStackBonus(failStack: number): number {
  return Math.min(failStack * 0.5, 30)
}

export function getCheckInReward(streak: number): number {
  return 500 + Math.min(streak, 30) * 50
}

export function canCheckIn(lastCheckIn: string | null): boolean {
  if (!lastCheckIn) return true
  const today = new Date().toISOString().split('T')[0]
  return today !== lastCheckIn
}

export function isStreakContinued(lastCheckIn: string | null): boolean {
  if (!lastCheckIn) return false
  const last = new Date(lastCheckIn + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.round(
    (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
  )
  return diffDays === 1
}

export function getLevelTier(level: number) {
  if (level === 0) return { name: '일반', color: '#9CA3AF' }
  if (level < 5) return { name: '고급', color: '#60A5FA' }
  if (level < 10) return { name: '희귀', color: '#A78BFA' }
  if (level < 15) return { name: '영웅', color: '#FBBF24' }
  if (level < 20) return { name: '전설', color: '#F97316' }
  if (level < 25) return { name: '신화', color: '#EF4444' }
  if (level < 30) return { name: '초월', color: '#EC4899' }
  return { name: '태초', color: '#FFD700' }
}

export const SHOP = {
  protection: { name: '파괴방지 주문서', icon: '🛡️', price: 800, desc: '파괴 시 레벨 유지' },
  blessing: { name: '축복 주문서', icon: '✨', price: 500, desc: '성공 확률 +10%' },
} as const

export type ShopItem = keyof typeof SHOP

// Prestige: reset level/weapons, gain permanent bonuses
export function getPrestigeReward(highestLevel: number, currentPrestige: number): { bonus: number; goldMultiplier: number } {
  // Each prestige point gives +0.5% success rate and 1.1x gold multiplier
  const newPoints = Math.floor(highestLevel / 5) // 1 point per 5 levels achieved
  const totalBonus = (currentPrestige + newPoints) * 0.5
  const goldMultiplier = 1 + (currentPrestige + newPoints) * 0.1
  return { bonus: Math.min(totalBonus, 50), goldMultiplier: Math.min(goldMultiplier, 5) }
}

export function canPrestige(highestLevel: number): boolean {
  return highestLevel >= 10 // Need at least +10 to prestige
}

export function getPrestigePoints(highestLevel: number): number {
  return Math.floor(highestLevel / 5)
}

// Offline gold: based on time away and prestige level
export function getOfflineGold(lastOnline: number, prestige: number): { gold: number; minutes: number } {
  const now = Date.now()
  const diffMs = now - lastOnline
  const minutes = Math.floor(diffMs / (1000 * 60))
  if (minutes < 1) return { gold: 0, minutes: 0 }

  const cappedMinutes = Math.min(minutes, 480) // Max 8 hours
  const baseRate = 10 // 10 gold per minute base
  const prestigeMultiplier = 1 + prestige * 0.5
  const gold = Math.floor(cappedMinutes * baseRate * prestigeMultiplier)

  return { gold, minutes: cappedMinutes }
}
