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
}

export const MAX_LEVEL = 30

export type EnhanceResult = 'success' | 'maintain' | 'destroy'

export function getEnhanceRates(level: number) {
  if (level < 3) return { success: 95, maintain: 5, destroy: 0 }
  if (level < 5) return { success: 85, maintain: 15, destroy: 0 }
  if (level < 7) return { success: 70, maintain: 20, destroy: 10 }
  if (level < 10) return { success: 55, maintain: 25, destroy: 20 }
  if (level < 13) return { success: 40, maintain: 30, destroy: 30 }
  if (level < 16) return { success: 25, maintain: 30, destroy: 45 }
  if (level < 20) return { success: 15, maintain: 25, destroy: 60 }
  if (level < 25) return { success: 7, maintain: 18, destroy: 75 }
  return { success: 3, maintain: 12, destroy: 85 }
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

export function rollEnhance(level: number): EnhanceResult {
  const rates = getEnhanceRates(level)
  const roll = Math.random() * 100
  if (roll < rates.success) return 'success'
  if (roll < rates.success + rates.maintain) return 'maintain'
  return 'destroy'
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
  const diffMs = today.getTime() - last.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
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
