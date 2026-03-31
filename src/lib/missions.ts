export interface Mission {
  id: string
  name: string
  icon: string
  target: number
  reward: number
  type: 'daily' | 'weekly' | 'monthly'
  tag: string // matching tag for progress tracking
}

export interface MissionProgress {
  progress: Record<string, number>
  claimed: string[]
}

export interface AllMissionsState {
  daily: { date: string; missions: string[]; data: MissionProgress }
  weekly: { week: string; missions: string[]; data: MissionProgress }
  monthly: { month: string; missions: string[]; data: MissionProgress }
}

// ═══ 미션 풀 ═══

const DAILY_POOL: Mission[] = [
  { id: 'd_enhance5', name: '강화 5회', icon: '🔥', target: 5, reward: 300, type: 'daily', tag: 'enhance' },
  { id: 'd_enhance15', name: '강화 15회', icon: '🔥', target: 15, reward: 800, type: 'daily', tag: 'enhance' },
  { id: 'd_enhance30', name: '강화 30회', icon: '🔥', target: 30, reward: 2000, type: 'daily', tag: 'enhance' },
  { id: 'd_success3', name: '강화 성공 3회', icon: '✨', target: 3, reward: 500, type: 'daily', tag: 'success' },
  { id: 'd_success10', name: '강화 성공 10회', icon: '✨', target: 10, reward: 1500, type: 'daily', tag: 'success' },
  { id: 'd_survive5', name: '파괴 없이 5회 강화', icon: '🛡️', target: 5, reward: 600, type: 'daily', tag: 'survive' },
  { id: 'd_checkin', name: '출석체크', icon: '📅', target: 1, reward: 200, type: 'daily', tag: 'checkin' },
  { id: 'd_buyitem', name: '주문서 구매', icon: '🏪', target: 1, reward: 200, type: 'daily', tag: 'buy' },
  { id: 'd_useprotect', name: '보호 주문서 사용', icon: '🛡️', target: 1, reward: 300, type: 'daily', tag: 'useprotect' },
  { id: 'd_usebless', name: '축복 주문서 사용', icon: '✨', target: 1, reward: 200, type: 'daily', tag: 'usebless' },
  { id: 'd_reach3', name: '+3 이상 달성', icon: '⚔️', target: 3, reward: 400, type: 'daily', tag: 'reach' },
  { id: 'd_reach5', name: '+5 이상 달성', icon: '💜', target: 5, reward: 1000, type: 'daily', tag: 'reach' },
]

const WEEKLY_POOL: Mission[] = [
  { id: 'w_enhance100', name: '강화 100회', icon: '🔨', target: 100, reward: 5000, type: 'weekly', tag: 'enhance' },
  { id: 'w_success30', name: '강화 성공 30회', icon: '✨', target: 30, reward: 4000, type: 'weekly', tag: 'success' },
  { id: 'w_destroy10', name: '파괴 10회 경험', icon: '💀', target: 10, reward: 3000, type: 'weekly', tag: 'destroy' },
  { id: 'w_streak5', name: '5일 연속 출석', icon: '📅', target: 5, reward: 5000, type: 'weekly', tag: 'streak' },
  { id: 'w_gold10k', name: '골드 10,000 보유', icon: '💰', target: 10000, reward: 3000, type: 'weekly', tag: 'gold' },
  { id: 'w_reach7', name: '+7 이상 달성', icon: '🌟', target: 7, reward: 6000, type: 'weekly', tag: 'reach' },
  { id: 'w_buy10', name: '주문서 10개 구매', icon: '🏪', target: 10, reward: 3000, type: 'weekly', tag: 'buy' },
  { id: 'w_dungeon3', name: '던전 3회 클리어', icon: '⚔️', target: 3, reward: 5000, type: 'weekly', tag: 'dungeon' },
]

const MONTHLY_POOL: Mission[] = [
  { id: 'm_enhance500', name: '강화 500회', icon: '🏆', target: 500, reward: 20000, type: 'monthly', tag: 'enhance' },
  { id: 'm_reach11', name: '+11 이상 달성', icon: '💎', target: 11, reward: 30000, type: 'monthly', tag: 'reach' },
  { id: 'm_prestige', name: '프레스티지 1회', icon: '⭐', target: 1, reward: 15000, type: 'monthly', tag: 'prestige' },
  { id: 'm_streak20', name: '20일 연속 출석', icon: '🏅', target: 20, reward: 25000, type: 'monthly', tag: 'streak' },
  { id: 'm_destroy30', name: '파괴 30회 (근성)', icon: '💪', target: 30, reward: 15000, type: 'monthly', tag: 'destroy' },
  { id: 'm_allweapons', name: '무기 4종 해금', icon: '🗡️', target: 4, reward: 20000, type: 'monthly', tag: 'weapons' },
]

// ═══ Seeded random ═══

function seededRandom(seed: number): () => number {
  let s = Math.abs(seed) || 1
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

function dateSeed(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) | 0
  return Math.abs(hash) || 1
}

function pickRandom<T>(pool: T[], count: number, seed: string): T[] {
  const rng = seededRandom(dateSeed(seed))
  const shuffled = [...pool].sort(() => rng() - 0.5)
  return shuffled.slice(0, count)
}

// ═══ State management ═══

function getToday(): string { return new Date().toISOString().split('T')[0] }

function getWeekKey(): string {
  const d = new Date()
  const year = d.getFullYear()
  const oneJan = new Date(year, 0, 1)
  const week = Math.ceil(((d.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7)
  return `${year}-W${week}`
}

function getMonthKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function initProgress(ids: string[]): MissionProgress {
  const progress: Record<string, number> = {}
  ids.forEach(id => { progress[id] = 0 })
  return { progress, claimed: [] }
}

const MISSIONS_KEY = 'sword-missions-v2'

export function loadAllMissions(): AllMissionsState {
  const today = getToday()
  const week = getWeekKey()
  const month = getMonthKey()

  try {
    const raw = localStorage.getItem(MISSIONS_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as AllMissionsState
      // Check if each period needs reset
      if (saved.daily.date === today && saved.weekly.week === week && saved.monthly.month === month) {
        return saved
      }
      // Partial reset
      const result = { ...saved }
      if (result.daily.date !== today) {
        const ids = pickRandom(DAILY_POOL, 3, today).map(m => m.id)
        result.daily = { date: today, missions: ids, data: initProgress(ids) }
      }
      if (result.weekly.week !== week) {
        const ids = pickRandom(WEEKLY_POOL, 3, week).map(m => m.id)
        result.weekly = { week, missions: ids, data: initProgress(ids) }
      }
      if (result.monthly.month !== month) {
        const ids = pickRandom(MONTHLY_POOL, 2, month).map(m => m.id)
        result.monthly = { month, missions: ids, data: initProgress(ids) }
      }
      return result
    }
  } catch { /* */ }

  // Fresh state
  const dailyIds = pickRandom(DAILY_POOL, 3, today).map(m => m.id)
  const weeklyIds = pickRandom(WEEKLY_POOL, 3, week).map(m => m.id)
  const monthlyIds = pickRandom(MONTHLY_POOL, 2, month).map(m => m.id)

  return {
    daily: { date: today, missions: dailyIds, data: initProgress(dailyIds) },
    weekly: { week, missions: weeklyIds, data: initProgress(weeklyIds) },
    monthly: { month, missions: monthlyIds, data: initProgress(monthlyIds) },
  }
}

export function saveAllMissions(state: AllMissionsState) {
  try { localStorage.setItem(MISSIONS_KEY, JSON.stringify(state)) } catch { /* */ }
}

const ALL_MISSIONS = [...DAILY_POOL, ...WEEKLY_POOL, ...MONTHLY_POOL]

export function getMissionById(id: string): Mission | undefined {
  return ALL_MISSIONS.find(m => m.id === id)
}

export function getMissionTag(id: string): string | undefined {
  return ALL_MISSIONS.find(m => m.id === id)?.tag
}
