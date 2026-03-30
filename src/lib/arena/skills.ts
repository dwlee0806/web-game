import type { Skill, Player, ArenaState } from './types'

const ALL_SKILLS: Skill[] = [
  // Stat boosts
  { id: 'hp_up', name: 'HP 증가', icon: '❤️', desc: '최대 HP +25', apply: (p) => { p.maxHp += 25; p.hp = Math.min(p.hp + 25, p.maxHp) } },
  { id: 'speed_up', name: '이동속도', icon: '👟', desc: '이동속도 +15%', apply: (p) => { p.speed *= 1.15 } },
  { id: 'damage_up', name: '공격력', icon: '⚔️', desc: '공격력 +25%', apply: (p) => { p.damage *= 1.25 } },
  { id: 'range_up', name: '공격 범위', icon: '🔮', desc: '검 범위 +20%', apply: (p) => { p.swordRange *= 1.2 } },
  { id: 'atk_speed', name: '공격속도', icon: '⚡', desc: '검 회전 +20%', apply: (p) => { p.swordSpeed *= 1.2 } },

  // Healing
  { id: 'heal', name: '즉시 회복', icon: '💚', desc: 'HP 50% 회복', apply: (p) => { p.hp = Math.min(p.hp + p.maxHp * 0.5, p.maxHp) } },
  { id: 'hp_regen', name: 'HP 재생', icon: '💗', desc: '초당 HP 1 재생', apply: (p) => { p.hpRegen += 1 } },

  // Special weapons
  { id: 'orbital', name: '궤도 보호막', icon: '🛡️', desc: '궤도 무기 +1', apply: (_p, s) => { s.orbitals += 1 } },
  { id: 'thorns', name: '가시', icon: '🌵', desc: '접촉 반격 +5', apply: (_p, s) => { s.thorns += 5 } },
  { id: 'projectile', name: '자동 화살', icon: '🏹', desc: '자동 조준 화살 발사', apply: (p, s) => { s.projectileDamage += Math.floor(p.damage * 0.4) } },
  { id: 'aoe', name: '폭발 오라', icon: '💥', desc: '주기적 범위 폭발', apply: (p, s) => { s.aoeDamage += Math.floor(p.damage * 0.6) } },

  // Passive utilities
  { id: 'magnet', name: 'XP 자석', icon: '🧲', desc: 'XP 수집 범위 +50%', apply: (_p, s) => { s.magnetRange *= 1.5 } },
  { id: 'gold_boost', name: '골드 부스트', icon: '💰', desc: '골드 획득 +30%', apply: (_p, s) => { s.goldBoostStacks++ } },
  { id: 'armor', name: '방어력', icon: '🛡️', desc: '받는 피해 -15%', apply: (_p, s) => { s.armorStacks++ } },

  // Dash enhancement
  { id: 'dash_cd', name: '대시 강화', icon: '💨', desc: '대시 쿨다운 -30%', apply: (p) => { p.dashCooldown = 0 } },
]

export function getRandomSkills(count: number): Skill[] {
  const shuffled = [...ALL_SKILLS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
