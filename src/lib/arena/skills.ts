import type { Skill, Player, ArenaState } from './types'

const ALL_SKILLS: Skill[] = [
  {
    id: 'hp_up', name: 'HP 증가', icon: '❤️', desc: '최대 HP +20',
    apply: (p) => { p.maxHp += 20; p.hp = Math.min(p.hp + 20, p.maxHp) },
  },
  {
    id: 'speed_up', name: '이동속도', icon: '👟', desc: '이동속도 +15%',
    apply: (p) => { p.speed *= 1.15 },
  },
  {
    id: 'damage_up', name: '공격력', icon: '⚔️', desc: '공격력 +25%',
    apply: (p) => { p.damage *= 1.25 },
  },
  {
    id: 'range_up', name: '공격 범위', icon: '🔮', desc: '검 범위 +20%',
    apply: (p) => { p.swordRange *= 1.2 },
  },
  {
    id: 'atk_speed', name: '공격속도', icon: '⚡', desc: '검 회전 +20%',
    apply: (p) => { p.swordSpeed *= 1.2 },
  },
  {
    id: 'heal', name: '회복', icon: '💚', desc: 'HP 50% 회복',
    apply: (p) => { p.hp = Math.min(p.hp + p.maxHp * 0.5, p.maxHp) },
  },
  {
    id: 'orbital', name: '궤도 보호막', icon: '🛡️', desc: '궤도 무기 +1',
    apply: (_p, s) => { s.orbitals += 1 },
  },
  {
    id: 'thorns', name: '가시', icon: '🌵', desc: '접촉 시 반격 데미지',
    apply: (_p, s) => { s.thorns += 5 },
  },
]

export function getRandomSkills(count: number): Skill[] {
  const shuffled = [...ALL_SKILLS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
