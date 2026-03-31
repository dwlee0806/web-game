import type { GameState } from './gameLogic'

export interface Achievement {
  id: string
  name: string
  desc: string
  icon: string
  reward: number
  check: (s: GameState) => boolean
  hidden?: boolean       // 히든 업적: 달성 전 물음표로 표시
  easterEgg?: boolean    // 이스터에그: easterEgg 필드로 따로 체크
}

// ═══ 일반 업적 (37개) — 초반에 자주 달성되도록 설계 ═══
const NORMAL_ACHIEVEMENTS: Achievement[] = [
  // === 첫 경험 (6개) ===
  { id: 'first_enhance', name: '첫 도전', desc: '첫 강화 시도', icon: '🔨', reward: 50, check: s => s.totalAttempts >= 1 },
  { id: 'first_success', name: '첫 발걸음', desc: '첫 강화 성공', icon: '🗡️', reward: 100, check: s => s.totalSuccess >= 1 },
  { id: 'first_destroy', name: '시련의 시작', desc: '첫 파괴 경험', icon: '💀', reward: 200, check: s => s.totalDestroy >= 1 },
  { id: 'first_checkin', name: '출석!', desc: '첫 출석체크', icon: '📅', reward: 100, check: s => s.checkInStreak >= 1 },
  { id: 'first_scroll', name: '준비된 모험가', desc: '주문서 첫 구매', icon: '📜', reward: 100, check: s => s.protectionScrolls + s.blessingScrolls >= 1 },
  { id: 'first_weapon', name: '무기 수집가', desc: '두 번째 무기 해금', icon: '🏹', reward: 300, check: s => Object.keys(s.weapons ?? {}).length >= 2 },

  // === 강화 단계 달성 (8개) ===
  { id: 'lv2', name: '시작이 반', desc: '+2 달성', icon: '⚔️', reward: 100, check: s => s.highestLevel >= 2 },
  { id: 'lv3', name: '고급 검사', desc: '+3 달성 (고급)', icon: '💙', reward: 300, check: s => s.highestLevel >= 3 },
  { id: 'lv5', name: '희귀한 검', desc: '+5 달성 (희귀)', icon: '💜', reward: 800, check: s => s.highestLevel >= 5 },
  { id: 'lv7', name: '영웅의 검', desc: '+7 달성 (영웅)', icon: '🌟', reward: 2000, check: s => s.highestLevel >= 7 },
  { id: 'lv9', name: '전설의 검', desc: '+9 달성 (전설)', icon: '🔥', reward: 5000, check: s => s.highestLevel >= 9 },
  { id: 'lv11', name: '신화의 검', desc: '+11 달성 (신화)', icon: '💎', reward: 15000, check: s => s.highestLevel >= 11 },
  { id: 'lv13', name: '초월의 검', desc: '+13 달성 (초월)', icon: '✨', reward: 40000, check: s => s.highestLevel >= 13 },
  { id: 'lv16', name: '태초의 검', desc: '+16 달성!', icon: '👑', reward: 100000, check: s => s.highestLevel >= 16 },

  // === 시도 횟수 (5개) ===
  { id: 'try10', name: '초보 대장장이', desc: '강화 10회', icon: '🔨', reward: 100, check: s => s.totalAttempts >= 10 },
  { id: 'try50', name: '숙련 대장장이', desc: '강화 50회', icon: '⚒️', reward: 500, check: s => s.totalAttempts >= 50 },
  { id: 'try100', name: '집념의 대장장이', desc: '강화 100회', icon: '🔨', reward: 1500, check: s => s.totalAttempts >= 100 },
  { id: 'try300', name: '마스터 대장장이', desc: '강화 300회', icon: '⚒️', reward: 5000, check: s => s.totalAttempts >= 300 },
  { id: 'try500', name: '전설의 대장장이', desc: '강화 500회', icon: '🏆', reward: 10000, check: s => s.totalAttempts >= 500 },

  // === 성공 횟수 (3개) ===
  { id: 'success10', name: '행운의 시작', desc: '성공 10회', icon: '🍀', reward: 300, check: s => s.totalSuccess >= 10 },
  { id: 'success30', name: '행운아', desc: '성공 30회', icon: '🍀', reward: 1500, check: s => s.totalSuccess >= 30 },
  { id: 'success50', name: '축복받은 자', desc: '성공 50회', icon: '✨', reward: 3000, check: s => s.totalSuccess >= 50 },

  // === 파괴 횟수 (4개) ===
  { id: 'destroy5', name: '강철 멘탈', desc: '파괴 5회 후에도 계속', icon: '💪', reward: 500, check: s => s.totalDestroy >= 5 },
  { id: 'destroy10', name: '불굴의 의지', desc: '파괴 10회 돌파', icon: '🔥', reward: 1000, check: s => s.totalDestroy >= 10 },
  { id: 'destroy25', name: '고통의 왕', desc: '파괴 25회', icon: '😈', reward: 3000, check: s => s.totalDestroy >= 25 },
  { id: 'destroy50', name: '파괴신', desc: '파괴 50회', icon: '💀', reward: 8000, check: s => s.totalDestroy >= 50 },

  // === 출석 (3개) ===
  { id: 'streak3', name: '꾸준함', desc: '3일 연속 출석', icon: '📅', reward: 500, check: s => s.checkInStreak >= 3 },
  { id: 'streak7', name: '출석왕', desc: '7일 연속 출석', icon: '📅', reward: 2000, check: s => s.checkInStreak >= 7 },
  { id: 'streak30', name: '한 달 개근', desc: '30일 연속 출석', icon: '🏅', reward: 10000, check: s => s.checkInStreak >= 30 },

  // === 골드 (3개) ===
  { id: 'gold5k', name: '재산 모으기', desc: '골드 5,000 이상 보유', icon: '💰', reward: 500, check: s => s.gold >= 5000 },
  { id: 'gold20k', name: '부자', desc: '골드 20,000 이상', icon: '💰', reward: 2000, check: s => s.gold >= 20000 },
  { id: 'gold100k', name: '재벌', desc: '골드 100,000 이상', icon: '💎', reward: 5000, check: s => s.gold >= 100000 },

  // === 프레스티지 (3개) ===
  { id: 'prestige1', name: '환생', desc: '첫 프레스티지', icon: '⭐', reward: 2000, check: s => (s.prestige ?? 0) >= 1 },
  { id: 'prestige3', name: '윤회', desc: '프레스티지 3회', icon: '🌀', reward: 5000, check: s => (s.prestige ?? 0) >= 3 },
  { id: 'prestige5', name: '영겁의 순환', desc: '프레스티지 5회', icon: '♾️', reward: 15000, check: s => (s.prestige ?? 0) >= 5 },

  // === 무기 (2개) ===
  { id: 'all_weapons', name: '무기 수집 완료', desc: '4종 무기 전부 해금', icon: '🗡️', reward: 5000, check: s => Object.keys(s.weapons ?? {}).length >= 4 },
  { id: 'multi_master', name: '다무기 마스터', desc: '2종 이상 +5 달성', icon: '⚔️', reward: 8000, check: s => { const w = s.weapons ?? {}; return Object.values(w).filter(v => v.highestLevel >= 5).length >= 2 } },
]

// ═══ 히든 업적 (10개) — 달성 전 물음표로 표시 ═══
const HIDDEN_ACHIEVEMENTS: Achievement[] = [
  { id: 'h_failstack20', name: '고통 속의 희망', desc: '페일스택 20 달성', icon: '🔥', reward: 3000, hidden: true, check: s => (s.maxFailStack ?? 0) >= 20 },
  { id: 'h_goldspent50k', name: '투자의 왕', desc: '총 50,000G 소비', icon: '💸', reward: 5000, hidden: true, check: s => (s.totalGoldSpent ?? 0) >= 50000 },
  { id: 'h_goldspent200k', name: '탕진잼', desc: '총 200,000G 소비', icon: '🤑', reward: 10000, hidden: true, check: s => (s.totalGoldSpent ?? 0) >= 200000 },
  { id: 'h_destroy_at_high', name: '절망의 순간', desc: '+7 이상에서 파괴 경험', icon: '😭', reward: 3000, hidden: true, check: s => s.totalDestroy >= 1 && s.highestLevel >= 7 },
  { id: 'h_comeback', name: '역전의 용사', desc: '파괴 후 같은 세션에서 +5 재달성', icon: '🔄', reward: 5000, hidden: true, check: s => s.totalDestroy >= 1 && s.level >= 5 },
  { id: 'h_speed_enhance', name: '스피드러너', desc: '자동 강화로 +5 달성', icon: '⚡', reward: 2000, hidden: true, check: s => s.highestLevel >= 5 },
  { id: 'h_all_scrolls', name: '완전무장', desc: '보호+축복 동시 10개 이상 보유', icon: '📦', reward: 3000, hidden: true, check: s => s.protectionScrolls >= 10 && s.blessingScrolls >= 10 },
  { id: 'h_no_destroy', name: '무파괴 달인', desc: '파괴 0회로 +5 달성', icon: '🛡️', reward: 8000, hidden: true, check: s => s.totalDestroy === 0 && s.highestLevel >= 5 },
  { id: 'h_special_skin', name: '운명의 검', desc: '특수 스킨 검 획득', icon: '🌈', reward: 5000, hidden: true, check: s => (s.discoveredSkins ?? []).length >= 1 },
  { id: 'h_all_skins', name: '컬렉터', desc: '특수 스킨 5종 수집', icon: '🏆', reward: 20000, hidden: true, check: s => (s.discoveredSkins ?? []).length >= 5 },
]

// ═══ 이스터에그 업적 (3개) — 숨겨진 인터랙션으로 달성 ═══
const EASTER_EGG_ACHIEVEMENTS: Achievement[] = [
  { id: 'ee_npc_click', name: '마을의 인싸', desc: '배경 캐릭터 10번 클릭', icon: '👋', reward: 1000, hidden: true, easterEgg: true, check: s => (s as GameState & { npcClicks?: number }).npcClicks !== undefined },
  { id: 'ee_title_click', name: '비밀의 문', desc: '타이틀 로고 5번 연타', icon: '🚪', reward: 500, hidden: true, easterEgg: true, check: () => false },
  { id: 'ee_konami', name: '전설의 커맨드', desc: '코나미 커맨드 입력', icon: '🎮', reward: 2000, hidden: true, easterEgg: true, check: () => false },
]

export const ACHIEVEMENTS: Achievement[] = [
  ...NORMAL_ACHIEVEMENTS,
  ...HIDDEN_ACHIEVEMENTS,
  ...EASTER_EGG_ACHIEVEMENTS,
]

export function getNewAchievements(state: GameState): Achievement[] {
  return ACHIEVEMENTS.filter(
    a => !a.easterEgg && !state.achievements.includes(a.id) && a.check(state),
  )
}

// Easter eggs are checked separately (triggered by UI interactions)
export function checkEasterEgg(id: string, state: GameState): boolean {
  return !state.achievements.includes(id)
}
