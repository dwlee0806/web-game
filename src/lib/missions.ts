export interface Mission {
  id: string
  name: string
  icon: string
  target: number
  reward: number
}

export interface DailyMissionState {
  date: string
  missionIds: string[]
  progress: Record<string, number>
  claimed: string[]
}

const MISSION_POOL: Mission[] = [
  { id: 'enhance5', name: '강화 5회', icon: '🔥', target: 5, reward: 300 },
  { id: 'enhance15', name: '강화 15회', icon: '🔥', target: 15, reward: 800 },
  { id: 'enhance30', name: '강화 30회', icon: '🔥', target: 30, reward: 2000 },
  { id: 'success3', name: '강화 성공 3회', icon: '✨', target: 3, reward: 500 },
  { id: 'success10', name: '강화 성공 10회', icon: '✨', target: 10, reward: 1500 },
  { id: 'survive5', name: '파괴 없이 5회 강화', icon: '🛡️', target: 5, reward: 600 },
  { id: 'reach5', name: '+5 이상 달성', icon: '⚔️', target: 5, reward: 400 },
  { id: 'reach10', name: '+10 이상 달성', icon: '💜', target: 10, reward: 1000 },
  { id: 'buyitem', name: '주문서 구매 1회', icon: '🏪', target: 1, reward: 200 },
  { id: 'useprotect', name: '보호 주문서 사용', icon: '🛡️', target: 1, reward: 300 },
  { id: 'usebless', name: '축복 주문서 사용', icon: '✨', target: 1, reward: 200 },
  { id: 'checkin', name: '출석체크', icon: '📅', target: 1, reward: 200 },
]

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function dateSeed(dateStr: string): number {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function getDailyMissions(dateStr: string): Mission[] {
  const rng = seededRandom(dateSeed(dateStr))
  const pool = [...MISSION_POOL]
  const picked: Mission[] = []

  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length)
    picked.push(pool[idx])
    pool.splice(idx, 1)
  }

  return picked
}

export function getInitialMissionState(dateStr: string): DailyMissionState {
  const missions = getDailyMissions(dateStr)
  const progress: Record<string, number> = {}
  missions.forEach(m => { progress[m.id] = 0 })
  return { date: dateStr, missionIds: missions.map(m => m.id), progress, claimed: [] }
}

export function getMissionById(id: string): Mission | undefined {
  return MISSION_POOL.find(m => m.id === id)
}
