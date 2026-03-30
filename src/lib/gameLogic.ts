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
  specialSkin: string | null
  discoveredSkins: string[]
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
  specialSkin: null,
  discoveredSkins: [],
}

export const SPECIAL_SKINS = ['rainbow', 'void', 'crystal', 'flame', 'shadow'] as const

export function rollSpecialSkin(discoveredSkins: string[]): string | null {
  if (Math.random() > 0.05) return null // 5% chance
  const available = SPECIAL_SKINS.filter(s => !discoveredSkins.includes(s))
  if (available.length === 0) {
    // All discovered, pick random
    return SPECIAL_SKINS[Math.floor(Math.random() * SPECIAL_SKINS.length)]
  }
  return available[Math.floor(Math.random() * available.length)]
}

export const MAX_LEVEL = 16
export const MAX_LOG = 20

export type EnhanceResult = 'success' | 'maintain' | 'destroy' | 'downgrade'

export function getEnhanceRates(level: number) {
  // +0~+16 system, 2 levels per tier
  if (level < 3) return { success: 95, maintain: 5, downgrade: 0, destroy: 0 }   // 일반 +0~2
  if (level < 5) return { success: 80, maintain: 15, downgrade: 5, destroy: 0 }   // 고급 +3~4
  if (level < 7) return { success: 65, maintain: 18, downgrade: 10, destroy: 7 }  // 희귀 +5~6
  if (level < 9) return { success: 50, maintain: 20, downgrade: 15, destroy: 15 } // 영웅 +7~8
  if (level < 11) return { success: 35, maintain: 20, downgrade: 20, destroy: 25 } // 전설 +9~10
  if (level < 13) return { success: 20, maintain: 18, downgrade: 22, destroy: 40 } // 신화 +11~12
  if (level < 15) return { success: 10, maintain: 15, downgrade: 25, destroy: 50 } // 초월 +13~14
  return { success: 5, maintain: 10, downgrade: 15, destroy: 70 }                  // 태초 +15~16
}

export function getEnhanceCost(level: number): number {
  if (level < 3) return 50      // 일반
  if (level < 5) return 150     // 고급
  if (level < 7) return 400     // 희귀
  if (level < 9) return 1000    // 영웅
  if (level < 11) return 2500   // 전설
  if (level < 13) return 6000   // 신화
  if (level < 15) return 15000  // 초월
  return 40000                   // 태초
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
  if (level < 3) return { name: '일반', color: '#9EAFC0', id: 'normal' }
  if (level < 5) return { name: '고급', color: '#4FC3F7', id: 'advanced' }
  if (level < 7) return { name: '희귀', color: '#AB47BC', id: 'rare' }
  if (level < 9) return { name: '영웅', color: '#FFB300', id: 'heroic' }
  if (level < 11) return { name: '전설', color: '#FF7043', id: 'legendary' }
  if (level < 13) return { name: '신화', color: '#EF5350', id: 'mythic' }
  if (level < 15) return { name: '초월', color: '#EC407A', id: 'transcend' }
  return { name: '태초', color: '#FFD700', id: 'genesis' }
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
  return highestLevel >= 7 // Need at least +7 (영웅) to prestige
}

export function getPrestigePoints(highestLevel: number): number {
  return Math.floor(highestLevel / 2)
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
