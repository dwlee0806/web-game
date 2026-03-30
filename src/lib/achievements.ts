import type { GameState } from './gameLogic'

export interface Achievement {
  id: string
  name: string
  desc: string
  icon: string
  reward: number
  check: (s: GameState) => boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_success', name: '첫 발걸음', desc: '첫 강화 성공', icon: '🗡️', reward: 100, check: s => s.totalSuccess >= 1 },
  { id: 'first_destroy', name: '시련의 시작', desc: '첫 파괴 경험', icon: '💀', reward: 200, check: s => s.totalDestroy >= 1 },
  { id: 'lv5', name: '고급 검사', desc: '+5 달성', icon: '⚔️', reward: 500, check: s => s.highestLevel >= 5 },
  { id: 'lv10', name: '희귀한 검', desc: '+10 달성', icon: '💜', reward: 2000, check: s => s.highestLevel >= 10 },
  { id: 'lv15', name: '영웅의 검', desc: '+15 달성', icon: '🌟', reward: 5000, check: s => s.highestLevel >= 15 },
  { id: 'lv20', name: '전설의 검', desc: '+20 달성', icon: '🔥', reward: 15000, check: s => s.highestLevel >= 20 },
  { id: 'lv25', name: '신화의 검', desc: '+25 달성', icon: '💎', reward: 50000, check: s => s.highestLevel >= 25 },
  { id: 'lv30', name: '태초의 검', desc: '+30 달성!', icon: '👑', reward: 200000, check: s => s.highestLevel >= 30 },
  { id: 'try100', name: '집념의 대장장이', desc: '강화 100회 시도', icon: '🔨', reward: 3000, check: s => s.totalAttempts >= 100 },
  { id: 'try500', name: '전설의 대장장이', desc: '강화 500회 시도', icon: '⚒️', reward: 10000, check: s => s.totalAttempts >= 500 },
  { id: 'destroy10', name: '불굴의 의지', desc: '파괴 10회 후에도 계속', icon: '💪', reward: 1000, check: s => s.totalDestroy >= 10 },
  { id: 'destroy50', name: '강철 멘탈', desc: '파괴 50회 돌파', icon: '🧠', reward: 5000, check: s => s.totalDestroy >= 50 },
  { id: 'streak7', name: '출석왕', desc: '7일 연속 출석', icon: '📅', reward: 2000, check: s => s.checkInStreak >= 7 },
  { id: 'streak30', name: '한 달 개근', desc: '30일 연속 출석', icon: '🏅', reward: 10000, check: s => s.checkInStreak >= 30 },
  { id: 'success50', name: '행운아', desc: '강화 성공 50회', icon: '🍀', reward: 3000, check: s => s.totalSuccess >= 50 },
]

export function getNewAchievements(state: GameState): Achievement[] {
  return ACHIEVEMENTS.filter(
    a => !state.achievements.includes(a.id) && a.check(state),
  )
}
