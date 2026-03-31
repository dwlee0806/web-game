import type { Skill, Player, ArenaState } from './types'

// ═══ 공통 스킬 (모든 무기) ═══
const COMMON_SKILLS: Skill[] = [
  { id: 'hp_up', name: 'HP 증가', icon: '❤️', desc: '최대 HP +25', apply: (p) => { p.maxHp += 25; p.hp = Math.min(p.hp + 25, p.maxHp) } },
  { id: 'speed_up', name: '이동속도', icon: '👟', desc: '이동속도 +15%', apply: (p) => { p.speed *= 1.15 } },
  { id: 'heal', name: '즉시 회복', icon: '💚', desc: 'HP 50% 회복', apply: (p) => { p.hp = Math.min(p.hp + p.maxHp * 0.5, p.maxHp) } },
  { id: 'hp_regen', name: 'HP 재생', icon: '💗', desc: '초당 HP 1 재생', apply: (p) => { p.hpRegen += 1 } },
  { id: 'orbital', name: '궤도 보호막', icon: '🛡️', desc: '궤도 무기 +1', apply: (_p, s) => { s.orbitals += 1 } },
  { id: 'magnet', name: 'XP 자석', icon: '🧲', desc: 'XP 수집 범위 +50%', apply: (_p, s) => { s.magnetRange *= 1.5 } },
  { id: 'dash_cd', name: '대시 강화', icon: '💨', desc: '대시 쿨다운 -30%', apply: (p) => { p.dashCooldown = 0 } },
]

// ═══ 검/도끼 전용 (근접) ═══
const MELEE_SKILLS: Skill[] = [
  { id: 'damage_up', name: '공격력', icon: '⚔️', desc: '공격력 +25%', apply: (p) => { p.damage *= 1.25 } },
  { id: 'range_up', name: '공격 범위', icon: '🔮', desc: '검 범위 +20%', apply: (p) => { p.swordRange *= 1.2 } },
  { id: 'atk_speed', name: '공격속도', icon: '⚡', desc: '휘두르기 속도 +20%', apply: (p) => { p.swordSpeed *= 1.2 } },
  { id: 'thorns', name: '가시', icon: '🌵', desc: '접촉 반격 +5', apply: (_p, s) => { s.thorns += 5 } },
  { id: 'cleave', name: '광역 참격', icon: '💥', desc: '범위 폭발 데미지 추가', apply: (p, s) => { s.aoeDamage += Math.floor(p.damage * 0.4) } },
  { id: 'armor', name: '방어력', icon: '🛡️', desc: '받는 피해 -15%', apply: (_p, s) => { s.armorStacks++ } },
  { id: 'lifesteal', name: '흡혈', icon: '🩸', desc: '데미지의 5% 체력 회복', apply: (p) => { p.hpRegen += 2 } },
  { id: 'gold_melee', name: '약탈', icon: '💰', desc: '골드 획득 +30%', apply: (_p, s) => { s.goldBoostStacks++ } },
]

// ═══ 활 전용 (원거리 물리) ═══
const BOW_SKILLS: Skill[] = [
  { id: 'bow_dmg', name: '화살 강화', icon: '🏹', desc: '화살 데미지 +25%', apply: (p) => { p.damage *= 1.25 } },
  { id: 'bow_speed', name: '연사 속도', icon: '⚡', desc: '화살 발사 속도 +20%', apply: (p) => { p.swordSpeed *= 1.2 } },
  { id: 'bow_pierce', name: '관통 화살', icon: '➡️', desc: '화살이 적 1명 추가 관통', apply: (_p, s) => { s.projectileDamage += 1 } }, // reuse as pierce counter
  { id: 'bow_multi', name: '다중 사격', icon: '🎯', desc: '화살 2발 동시 발사', apply: (p) => { p.damage = Math.floor(p.damage * 0.7) } }, // trade: less per arrow but more arrows
  { id: 'bow_poison', name: '독 화살', icon: '☠️', desc: '명중 시 독 데미지 (지속)', apply: (_p, s) => { s.thorns += 3 } },
  { id: 'bow_range', name: '사거리 증가', icon: '📏', desc: '화살 사거리 +30%', apply: (p) => { p.swordRange *= 1.3 } },
  { id: 'bow_crit', name: '급소 사격', icon: '💀', desc: '화살 크리티컬 확률 증가', apply: (p) => { p.damage *= 1.15 } },
  { id: 'bow_gold', name: '헌터 보상', icon: '💰', desc: '골드 획득 +30%', apply: (_p, s) => { s.goldBoostStacks++ } },
]

// ═══ 지팡이 전용 (마법) ═══
const STAFF_SKILLS: Skill[] = [
  { id: 'staff_dmg', name: '마력 증폭', icon: '🪄', desc: '마법 데미지 +30%', apply: (p) => { p.damage *= 1.3 } },
  { id: 'staff_aoe', name: '폭발 범위', icon: '💥', desc: '파이어볼 폭발 범위 증가', apply: (p) => { p.swordRange *= 1.2 } },
  { id: 'staff_cd', name: '시전 속도', icon: '⚡', desc: '파이어볼 쿨다운 감소', apply: (p) => { p.swordSpeed *= 1.2 } },
  { id: 'staff_chain', name: '체인 라이트닝', icon: '⚡', desc: '번개 연쇄 공격 추가', apply: (p, s) => { s.aoeDamage += Math.floor(p.damage * 0.5) } },
  { id: 'staff_shield', name: '마법 방벽', icon: '🔵', desc: '받는 피해 -20%', apply: (_p, s) => { s.armorStacks += 2 } },
  { id: 'staff_freeze', name: '동결', icon: '❄️', desc: '적 이동속도 감소 효과', apply: (_p, s) => { s.thorns += 4 } },
  { id: 'staff_meteor', name: '메테오', icon: '☄️', desc: '주기적 대규모 범위 폭발', apply: (p, s) => { s.aoeDamage += Math.floor(p.damage * 0.8); s.aoeInterval = Math.max(60, s.aoeInterval - 30) } },
  { id: 'staff_gold', name: '현자의 축복', icon: '💰', desc: '골드 획득 +30%', apply: (_p, s) => { s.goldBoostStacks++ } },
]

export function getRandomSkills(count: number, weaponType?: string): Skill[] {
  // Build pool: common + weapon-specific
  let weaponPool: Skill[]
  switch (weaponType) {
    case 'bow': weaponPool = BOW_SKILLS; break
    case 'staff': weaponPool = STAFF_SKILLS; break
    default: weaponPool = MELEE_SKILLS; break // sword, axe
  }

  // 60% chance weapon-specific, 40% common
  const pool = [...weaponPool, ...weaponPool, ...COMMON_SKILLS] // weighted 2:1
  const shuffled = [...pool].sort(() => Math.random() - 0.5)

  // Remove duplicates
  const seen = new Set<string>()
  const unique: Skill[] = []
  for (const skill of shuffled) {
    if (!seen.has(skill.id)) {
      seen.add(skill.id)
      unique.push(skill)
    }
    if (unique.length >= count) break
  }
  return unique
}
