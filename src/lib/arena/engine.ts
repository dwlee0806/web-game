import type { ArenaState, Player, Enemy, EnemyType, Vec2, Particle, XpOrb } from './types'
import { ARENA_W, ARENA_H } from './types'
import { getRandomSkills } from './skills'

function dist(a: Vec2, b: Vec2): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function normalize(v: Vec2): Vec2 {
  const d = Math.sqrt(v.x ** 2 + v.y ** 2)
  return d > 0 ? { x: v.x / d, y: v.y / d } : { x: 0, y: 0 }
}

export function createInitialState(swordLevel: number): ArenaState {
  const baseDmg = 5 + swordLevel * 2
  const baseHp = 50 + swordLevel * 5
  const baseSpeed = 3 + swordLevel * 0.1

  return {
    player: {
      pos: { x: ARENA_W / 2, y: ARENA_H / 2 },
      hp: baseHp,
      maxHp: baseHp,
      speed: baseSpeed,
      damage: baseDmg,
      xp: 0,
      level: 1,
      xpToNext: 10,
      swordRange: 50 + swordLevel * 2,
      swordSpeed: 3 + swordLevel * 0.1,
      swordAngle: 0,
      invincibleUntil: 0,
    },
    enemies: [],
    particles: [],
    xpOrbs: [],
    time: 0,
    kills: 0,
    wave: 1,
    paused: false,
    gameOver: false,
    levelUpChoices: null,
    swordLevel,
    goldEarned: 0,
    nextEnemyId: 1,
    spawnTimer: 0,
    extraProjectiles: 0,
    orbitals: 0,
    thorns: 0,
  }
}

const ENEMY_DEFS: Record<EnemyType, { hp: number; speed: number; damage: number; size: number; color: string }> = {
  slime: { hp: 10, speed: 1, damage: 5, size: 12, color: '#4ADE80' },
  bat: { hp: 8, speed: 2.5, damage: 3, size: 8, color: '#A78BFA' },
  skeleton: { hp: 25, speed: 1.2, damage: 8, size: 14, color: '#F3F4F6' },
  ghost: { hp: 15, speed: 1.8, damage: 6, size: 10, color: '#93C5FD' },
  demon: { hp: 60, speed: 0.8, damage: 15, size: 20, color: '#EF4444' },
}

function spawnEnemy(state: ArenaState): Enemy {
  const wave = state.wave
  const types: EnemyType[] = wave < 3 ? ['slime'] : wave < 5 ? ['slime', 'bat'] : wave < 8 ? ['slime', 'bat', 'skeleton'] : wave < 12 ? ['slime', 'bat', 'skeleton', 'ghost'] : ['slime', 'bat', 'skeleton', 'ghost', 'demon']
  const type = types[Math.floor(Math.random() * types.length)]
  const def = ENEMY_DEFS[type]
  const waveMult = 1 + wave * 0.15

  // Spawn from edges
  const side = Math.floor(Math.random() * 4)
  let x: number, y: number
  if (side === 0) { x = -20; y = Math.random() * ARENA_H }
  else if (side === 1) { x = ARENA_W + 20; y = Math.random() * ARENA_H }
  else if (side === 2) { x = Math.random() * ARENA_W; y = -20 }
  else { x = Math.random() * ARENA_W; y = ARENA_H + 20 }

  return {
    id: state.nextEnemyId,
    pos: { x, y },
    hp: Math.floor(def.hp * waveMult),
    maxHp: Math.floor(def.hp * waveMult),
    speed: def.speed * (1 + wave * 0.02),
    damage: Math.floor(def.damage * waveMult),
    size: def.size,
    type,
    knockbackUntil: 0,
    knockbackDir: { x: 0, y: 0 },
  }
}

function spawnParticles(pos: Vec2, color: string, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    pos: { ...pos },
    vel: { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 },
    life: 20 + Math.random() * 15,
    maxLife: 35,
    color,
    size: 2 + Math.random() * 3,
  }))
}

export function updateGame(state: ArenaState, input: Vec2, dt: number): ArenaState {
  if (state.gameOver || state.paused || state.levelUpChoices) return state

  const s = { ...state }
  s.time += dt
  s.particles = [...s.particles]
  s.enemies = [...s.enemies]
  s.xpOrbs = [...s.xpOrbs]

  // Player movement
  const p = { ...s.player }
  const dir = normalize(input)
  p.pos = {
    x: Math.max(10, Math.min(ARENA_W - 10, p.pos.x + dir.x * p.speed)),
    y: Math.max(10, Math.min(ARENA_H - 10, p.pos.y + dir.y * p.speed)),
  }

  // Sword rotation
  p.swordAngle += p.swordSpeed * 0.05
  s.player = p

  // Enemy spawning
  s.spawnTimer += dt
  const spawnInterval = Math.max(20, 60 - s.wave * 3)
  if (s.spawnTimer >= spawnInterval) {
    s.spawnTimer = 0
    const count = Math.min(1 + Math.floor(s.wave / 3), 5)
    for (let i = 0; i < count; i++) {
      s.enemies.push(spawnEnemy(s))
      s.nextEnemyId++
    }
  }

  // Wave progression (every 30 seconds)
  s.wave = 1 + Math.floor(s.time / (30 * 60)) // 60fps * 30s

  // Enemy movement + collision
  const now = s.time
  const swordTipX = p.pos.x + Math.cos(p.swordAngle) * p.swordRange
  const swordTipY = p.pos.y + Math.sin(p.swordAngle) * p.swordRange
  const deadEnemyIds: number[] = []

  s.enemies = s.enemies.map(e => {
    const enemy = { ...e }

    // Knockback
    if (enemy.knockbackUntil > now) {
      enemy.pos = {
        x: enemy.pos.x + enemy.knockbackDir.x * 5,
        y: enemy.pos.y + enemy.knockbackDir.y * 5,
      }
      return enemy
    }

    // Move toward player
    const toPlayer = normalize({ x: p.pos.x - enemy.pos.x, y: p.pos.y - enemy.pos.y })
    enemy.pos = {
      x: enemy.pos.x + toPlayer.x * enemy.speed,
      y: enemy.pos.y + toPlayer.y * enemy.speed,
    }

    // Check sword hit
    const distToSword = dist(enemy.pos, { x: swordTipX, y: swordTipY })
    if (distToSword < enemy.size + 8) {
      enemy.hp -= p.damage
      const kb = normalize({ x: enemy.pos.x - p.pos.x, y: enemy.pos.y - p.pos.y })
      enemy.knockbackDir = kb
      enemy.knockbackUntil = now + 10
      s.particles.push(...spawnParticles(enemy.pos, '#FFD700', 3))
    }

    // Orbital hits
    for (let o = 0; o < s.orbitals; o++) {
      const orbAngle = p.swordAngle + (o + 1) * (Math.PI * 2 / (s.orbitals + 1))
      const orbX = p.pos.x + Math.cos(orbAngle) * (p.swordRange * 0.7)
      const orbY = p.pos.y + Math.sin(orbAngle) * (p.swordRange * 0.7)
      if (dist(enemy.pos, { x: orbX, y: orbY }) < enemy.size + 6) {
        enemy.hp -= p.damage * 0.3
      }
    }

    // Check if dead
    if (enemy.hp <= 0) {
      deadEnemyIds.push(enemy.id)
      s.kills++
      s.goldEarned += Math.ceil(enemy.maxHp * 0.5)
      s.xpOrbs.push({ pos: { ...enemy.pos }, value: Math.ceil(enemy.maxHp * 0.3), life: 300 })
      s.particles.push(...spawnParticles(enemy.pos, ENEMY_DEFS[enemy.type].color, 6))
    }

    // Check player collision (damage)
    const distToPlayer = dist(enemy.pos, p.pos)
    if (distToPlayer < enemy.size + 10 && p.invincibleUntil < now) {
      p.hp -= enemy.damage
      p.invincibleUntil = now + 30 // 0.5s invincibility
      s.particles.push(...spawnParticles(p.pos, '#EF4444', 4))

      // Thorns
      if (s.thorns > 0) {
        enemy.hp -= s.thorns
      }
    }

    return enemy
  })

  s.enemies = s.enemies.filter(e => !deadEnemyIds.includes(e.id))
  s.player = p

  // XP orbs collection
  s.xpOrbs = s.xpOrbs.map(orb => {
    const o = { ...orb }
    o.life--
    if (dist(o.pos, p.pos) < 40) {
      // Attract toward player
      const toP = normalize({ x: p.pos.x - o.pos.x, y: p.pos.y - o.pos.y })
      o.pos = { x: o.pos.x + toP.x * 6, y: o.pos.y + toP.y * 6 }
    }
    if (dist(o.pos, p.pos) < 12) {
      p.xp += o.value
      o.life = 0
    }
    return o
  }).filter(o => o.life > 0)
  s.player = p

  // Level up check
  if (p.xp >= p.xpToNext) {
    p.xp -= p.xpToNext
    p.level++
    p.xpToNext = Math.floor(p.xpToNext * 1.5)
    s.levelUpChoices = getRandomSkills(3)
    s.player = p
  }

  // Particles
  s.particles = s.particles.map(pt => ({
    ...pt,
    pos: { x: pt.pos.x + pt.vel.x, y: pt.pos.y + pt.vel.y },
    life: pt.life - 1,
  })).filter(pt => pt.life > 0)

  // Game over
  if (p.hp <= 0) {
    s.gameOver = true
    s.player = { ...p, hp: 0 }
  }

  return s
}

export function applySkill(state: ArenaState, skillIndex: number): ArenaState {
  if (!state.levelUpChoices || skillIndex >= state.levelUpChoices.length) return state
  const skill = state.levelUpChoices[skillIndex]
  const p = { ...state.player }
  const s = { ...state }
  skill.apply(p, s)
  s.player = p
  s.levelUpChoices = null
  return s
}
