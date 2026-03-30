export interface GameEvent {
  id: string
  name: string
  icon: string
  desc: string
  type: 'success_boost' | 'cost_discount' | 'gold_boost' | 'no_destroy'
  value: number // percentage (e.g., 10 = +10% or -10%)
  check: () => boolean
}

function getHour(): number {
  return new Date().getHours()
}

function getDayOfWeek(): number {
  return new Date().getDay() // 0=Sun, 6=Sat
}

export const EVENTS: GameEvent[] = [
  {
    id: 'happy_hour',
    name: '해피아워',
    icon: '🎉',
    desc: '성공 확률 +5%',
    type: 'success_boost',
    value: 5,
    check: () => { const h = getHour(); return h >= 20 && h < 23 },
  },
  {
    id: 'morning_boost',
    name: '얼리버드',
    icon: '🌅',
    desc: '골드 수입 2배',
    type: 'gold_boost',
    value: 100,
    check: () => { const h = getHour(); return h >= 6 && h < 9 },
  },
  {
    id: 'weekend_sale',
    name: '주말 세일',
    icon: '🏷️',
    desc: '강화 비용 -20%',
    type: 'cost_discount',
    value: 20,
    check: () => { const d = getDayOfWeek(); return d === 0 || d === 6 },
  },
  {
    id: 'lunch_safe',
    name: '점심 안전시간',
    icon: '🛡️',
    desc: '파괴 확률 절반',
    type: 'no_destroy',
    value: 50,
    check: () => { const h = getHour(); return h >= 12 && h < 13 },
  },
]

export function getActiveEvents(): GameEvent[] {
  return EVENTS.filter(e => e.check())
}

export function getSuccessBoost(): number {
  return getActiveEvents()
    .filter(e => e.type === 'success_boost')
    .reduce((sum, e) => sum + e.value, 0)
}

export function getCostDiscount(): number {
  return getActiveEvents()
    .filter(e => e.type === 'cost_discount')
    .reduce((sum, e) => sum + e.value, 0)
}

export function getDestroyReduction(): number {
  return getActiveEvents()
    .filter(e => e.type === 'no_destroy')
    .reduce((sum, e) => sum + e.value, 0)
}
