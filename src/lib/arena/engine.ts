import type { ArenaState, Player, Enemy, EnemyType, Vec2, Particle, XpOrb, DamageNumber, Projectile, HealDrop } from './types'
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
      hp: baseHp, maxHp: baseHp, speed: baseSpeed, damage: baseDmg,
      xp: 0, level: 1, xpToNext: 10,
      swordRange: 50 + swordLevel * 2, swordSpeed: 3 + swordLevel * 0.1, swordAngle: 0,
      invincibleUntil: 0, dashCooldown: 0, dashUntil: 0, hpRegen: 0,
    },
    enemies: [], particles: [], xpOrbs: [], damageNumbers: [], projectiles: [],
    time: 0, kills: 0, wave: 1, prevWave: 1,
    paused: false, gameOver: false, levelUpChoices: null,
    swordLevel, goldEarned: 0, nextEnemyId: 1, spawnTimer: 0,
    armorStacks: 0, goldBoostStacks: 0, orbitals: 0, thorns: 0, screenShake: 0,
    waveAnnouncement: null, projectileTimer: 0, projectileDamage: 0,
    aoeDamage: 0, aoeTimer: 0, aoeInterval: 180, magnetRange: 40,
    bossActive: false, mapTransition: 0,
    combo: 0, comboTimer: 0, hitstop: 0, healDrops: [],
  }
}

const ENEMY_DEFS: Record<EnemyType, { hp: number; speed: number; damage: number; size: number }> = {
  slime: { hp: 10, speed: 1, damage: 5, size: 12 },
  bat: { hp: 8, speed: 2.5, damage: 3, size: 8 },
  skeleton: { hp: 25, speed: 1.2, damage: 8, size: 14 },
  ghost: { hp: 15, speed: 1.8, damage: 6, size: 10 },
  demon: { hp: 60, speed: 0.8, damage: 15, size: 20 },
}

function spawnEnemy(state: ArenaState): Enemy {
  const wave = state.wave
  const types: EnemyType[] = wave < 3 ? ['slime'] : wave < 5 ? ['slime', 'bat'] : wave < 8 ? ['slime', 'bat', 'skeleton'] : wave < 12 ? ['slime', 'bat', 'skeleton', 'ghost'] : ['slime', 'bat', 'skeleton', 'ghost', 'demon']
  const type = types[Math.floor(Math.random() * types.length)]
  const def = ENEMY_DEFS[type]
  const waveMult = 1 + wave * 0.15

  const side = Math.floor(Math.random() * 4)
  let x: number, y: number
  if (side === 0) { x = -20; y = Math.random() * ARENA_H }
  else if (side === 1) { x = ARENA_W + 20; y = Math.random() * ARENA_H }
  else if (side === 2) { x = Math.random() * ARENA_W; y = -20 }
  else { x = Math.random() * ARENA_W; y = ARENA_H + 20 }

  return {
    id: state.nextEnemyId, pos: { x, y },
    hp: Math.floor(def.hp * waveMult), maxHp: Math.floor(def.hp * waveMult),
    speed: def.speed * (1 + wave * 0.02), damage: Math.floor(def.damage * waveMult),
    size: def.size, type,
    knockbackUntil: 0, knockbackDir: { x: 0, y: 0 },
    isBoss: false, bossPhase: 0, attackCooldown: 0,
  }
}

function spawnBoss(state: ArenaState): Enemy {
  const wave = state.wave
  const bossTypes: EnemyType[] = wave < 15 ? ['slime'] : wave < 25 ? ['skeleton'] : ['demon']
  const type = bossTypes[Math.floor(Math.random() * bossTypes.length)]
  const waveMult = 1 + wave * 0.2

  return {
    id: state.nextEnemyId, pos: { x: ARENA_W / 2, y: -40 },
    hp: Math.floor(200 * waveMult), maxHp: Math.floor(200 * waveMult),
    speed: 0.6, damage: Math.floor(20 * waveMult),
    size: 35, type,
    knockbackUntil: 0, knockbackDir: { x: 0, y: 0 },
    isBoss: true, bossPhase: 0, attackCooldown: 120,
  }
}

function spawnParticles(pos: Vec2, color: string, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    pos: { ...pos }, vel: { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 },
    life: 20 + Math.random() * 15, maxLife: 35, color, size: 2 + Math.random() * 3,
  }))
}

function addDmgNum(nums: DamageNumber[], pos: Vec2, value: number, color: string, crit = false) {
  nums.push({ pos: { x: pos.x + (Math.random() - 0.5) * 10, y: pos.y - 10 }, value: Math.round(value), life: 40, color, crit })
}

// Exported event flags for sound
export interface GameEvents {
  hit: boolean
  kill: boolean
  playerDamage: boolean
  bossSpawn: boolean
  bossKill: boolean
  levelUp: boolean
  dash: boolean
}

export function updateGame(state: ArenaState, input: Vec2, dt: number, dashInput: boolean): { state: ArenaState; events: GameEvents } {
  const events: GameEvents = { hit: false, kill: false, playerDamage: false, bossSpawn: false, bossKill: false, levelUp: false, dash: false }
  if (state.gameOver || state.paused || state.levelUpChoices) return { state, events }

  // Hitstop: freeze frames for impact feel
  if (state.hitstop > 0) return { state: { ...state, hitstop: state.hitstop - 1 }, events }

  const s = { ...state }
  s.time += dt
  s.particles = [...s.particles]
  s.enemies = [...s.enemies]
  s.xpOrbs = [...s.xpOrbs]
  s.damageNumbers = [...s.damageNumbers]
  s.projectiles = [...s.projectiles]
  s.healDrops = [...s.healDrops]

  const p = { ...s.player }

  // Dash
  if (dashInput && p.dashCooldown <= 0 && p.dashUntil <= 0) {
    const dir = normalize(input)
    if (dir.x !== 0 || dir.y !== 0) {
      p.dashUntil = 8
      p.dashCooldown = 90 // 1.5s cooldown
      p.invincibleUntil = Math.max(p.invincibleUntil, s.time + 8)
      events.dash = true
      s.particles.push(...spawnParticles(p.pos, '#60A5FA', 5))
    }
  }
  if (p.dashCooldown > 0) p.dashCooldown--

  // Movement
  const dir = normalize(input)
  const moveSpeed = p.dashUntil > 0 ? p.speed * 3 : p.speed
  if (p.dashUntil > 0) p.dashUntil--
  p.pos = {
    x: Math.max(10, Math.min(ARENA_W - 10, p.pos.x + dir.x * moveSpeed)),
    y: Math.max(10, Math.min(ARENA_H - 10, p.pos.y + dir.y * moveSpeed)),
  }

  // HP regen
  if (p.hpRegen > 0 && s.time % 60 === 0) {
    p.hp = Math.min(p.hp + p.hpRegen, p.maxHp)
  }

  // Sword: auto-aim toward nearest enemy + swing oscillation
  if (s.enemies.length > 0) {
    const nearest = s.enemies.reduce((c, e) => dist(e.pos, p.pos) < dist(c.pos, p.pos) ? e : c)
    const targetAngle = Math.atan2(nearest.pos.y - p.pos.y, nearest.pos.x - p.pos.x)
    const diff = Math.atan2(Math.sin(targetAngle - p.swordAngle), Math.cos(targetAngle - p.swordAngle))
    p.swordAngle += diff * 0.15 // Strong tracking toward nearest enemy
  }
  p.swordAngle += p.swordSpeed * 0.03 // Slower base swing
  s.player = p

  // Wave progression (every 30 seconds)
  s.wave = 1 + Math.floor(s.time / 1800)

  // Wave announcement + map transition
  if (s.wave !== s.prevWave) {
    s.prevWave = s.wave
    const isBossWave = s.wave % 5 === 0
    const isMapChange = [6, 11, 16, 21].includes(s.wave)

    s.waveAnnouncement = {
      text: isBossWave ? `⚠️ BOSS WAVE ${s.wave}!` : isMapChange ? `🗺️ 새로운 지역!` : `Wave ${s.wave}`,
      life: isMapChange ? 120 : 90,
      color: isBossWave ? '#EF4444' : isMapChange ? '#4FC3F7' : '#FBBF24',
    }

    // Map transition on stage boundaries
    if (isMapChange) {
      s.mapTransition = 0.01 // Start transition
    }

    // Boss spawn every 5 waves
    if (isBossWave && !s.bossActive) {
      s.enemies.push(spawnBoss(s))
      s.nextEnemyId++
      s.bossActive = true
      s.screenShake = 15
      events.bossSpawn = true
    }
  }

  // Map transition progress
  if (s.mapTransition > 0 && s.mapTransition < 1) {
    s.mapTransition = Math.min(1, s.mapTransition + 0.015) // ~1.1 seconds
    if (s.mapTransition >= 1) s.mapTransition = 0
  }

  // Wave announcement decay
  if (s.waveAnnouncement) {
    s.waveAnnouncement = { ...s.waveAnnouncement, life: s.waveAnnouncement.life - 1 }
    if (s.waveAnnouncement.life <= 0) s.waveAnnouncement = null
  }

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

  // Projectile spawning
  if (s.projectileDamage > 0) {
    s.projectileTimer++
    if (s.projectileTimer >= 40) {
      s.projectileTimer = 0
      const target = s.enemies.length > 0
        ? s.enemies.reduce((closest, e) => dist(e.pos, p.pos) < dist(closest.pos, p.pos) ? e : closest)
        : null
      if (target) {
        const dir = normalize({ x: target.pos.x - p.pos.x, y: target.pos.y - p.pos.y })
        s.projectiles.push({
          pos: { ...p.pos }, vel: { x: dir.x * 6, y: dir.y * 6 },
          damage: s.projectileDamage, life: 60, size: 4, color: '#F59E0B', pierce: 0, hitIds: [],
        })
      }
    }
  }

  // AOE damage
  if (s.aoeDamage > 0) {
    s.aoeTimer++
    if (s.aoeTimer >= s.aoeInterval) {
      s.aoeTimer = 0
      s.particles.push(...spawnParticles(p.pos, '#EF4444', 8))
      s.screenShake = 3
      s.enemies = s.enemies.map(e => {
        if (dist(e.pos, p.pos) < 80) {
          const ne = { ...e, hp: e.hp - s.aoeDamage }
          addDmgNum(s.damageNumbers, e.pos, s.aoeDamage, '#EF4444')
          return ne
        }
        return e
      })
    }
  }

  // Projectile movement + collision
  s.projectiles = s.projectiles.map(proj => {
    const pr = { ...proj }
    pr.pos = { x: pr.pos.x + pr.vel.x, y: pr.pos.y + pr.vel.y }
    pr.life--
    // Hit enemies
    s.enemies = s.enemies.map(e => {
      if (pr.hitIds.includes(e.id)) return e
      if (dist(pr.pos, e.pos) < e.size + pr.size) {
        pr.hitIds = [...pr.hitIds, e.id]
        const ne = { ...e, hp: e.hp - pr.damage }
        addDmgNum(s.damageNumbers, e.pos, pr.damage, '#F59E0B')
        events.hit = true
        if (pr.pierce <= 0) pr.life = 0
        else pr.pierce--
        return ne
      }
      return e
    })
    return pr
  }).filter(pr => pr.life > 0 && pr.pos.x > -20 && pr.pos.x < ARENA_W + 20 && pr.pos.y > -20 && pr.pos.y < ARENA_H + 20)

  // Sword hit + enemy AI
  const swordTipX = p.pos.x + Math.cos(p.swordAngle) * p.swordRange
  const swordTipY = p.pos.y + Math.sin(p.swordAngle) * p.swordRange
  const deadEnemyIds: number[] = []

  s.enemies = s.enemies.map(e => {
    const enemy = { ...e }

    if (enemy.knockbackUntil > s.time) {
      enemy.pos = { x: enemy.pos.x + enemy.knockbackDir.x * 5, y: enemy.pos.y + enemy.knockbackDir.y * 5 }
      return enemy
    }

    // Boss special attacks
    if (enemy.isBoss && enemy.attackCooldown > 0) {
      enemy.attackCooldown--
      if (enemy.attackCooldown === 0) {
        // Boss charge toward player
        enemy.speed = 4
        enemy.attackCooldown = 180
        enemy.bossPhase = (enemy.bossPhase + 1) % 3
        // Spawn minions on phase 2
        if (enemy.bossPhase === 1) {
          for (let i = 0; i < 3; i++) {
            s.enemies.push(spawnEnemy(s))
            s.nextEnemyId++
          }
        }
        s.screenShake = 8
      }
    }
    if (enemy.isBoss && enemy.speed > 1) {
      enemy.speed = Math.max(enemy.speed * 0.98, 0.6)
    }

    // Move toward player
    const toPlayer = normalize({ x: p.pos.x - enemy.pos.x, y: p.pos.y - enemy.pos.y })
    enemy.pos = { x: enemy.pos.x + toPlayer.x * enemy.speed, y: enemy.pos.y + toPlayer.y * enemy.speed }

    // Sword hit check
    const distToSword = dist(enemy.pos, { x: swordTipX, y: swordTipY })
    if (distToSword < enemy.size + 8) {
      enemy.hp -= p.damage
      const kb = normalize({ x: enemy.pos.x - p.pos.x, y: enemy.pos.y - p.pos.y })
      enemy.knockbackDir = kb
      enemy.knockbackUntil = s.time + 10
      s.particles.push(...spawnParticles(enemy.pos, '#FFD700', 3))
      addDmgNum(s.damageNumbers, enemy.pos, p.damage, '#FFD700')
      events.hit = true
    }

    // Orbital hits
    for (let o = 0; o < s.orbitals; o++) {
      const orbAngle = p.swordAngle + (o + 1) * (Math.PI * 2 / (s.orbitals + 1))
      const orbX = p.pos.x + Math.cos(orbAngle) * (p.swordRange * 0.7)
      const orbY = p.pos.y + Math.sin(orbAngle) * (p.swordRange * 0.7)
      if (dist(enemy.pos, { x: orbX, y: orbY }) < enemy.size + 6) {
        enemy.hp -= p.damage * 0.3
        addDmgNum(s.damageNumbers, enemy.pos, p.damage * 0.3, '#A78BFA')
      }
    }

    // Dead check
    if (enemy.hp <= 0) {
      deadEnemyIds.push(enemy.id)
      s.kills++
      // Combo system
      s.combo++
      s.comboTimer = 120 // 2 seconds
      const comboMultiplier = 1 + Math.min(s.combo, 50) * 0.02
      const goldMultiplier = 1 + s.goldBoostStacks * 0.3
      const goldReward = enemy.isBoss ? Math.ceil(enemy.maxHp * 2 * goldMultiplier) : Math.ceil(enemy.maxHp * 0.5 * comboMultiplier * goldMultiplier)
      s.goldEarned += goldReward
      s.xpOrbs.push({ pos: { ...enemy.pos }, value: Math.ceil(enemy.maxHp * 0.3), life: 300 })
      s.particles.push(...spawnParticles(enemy.pos, enemy.isBoss ? '#FFD700' : '#888', enemy.isBoss ? 15 : 6))
      // Hitstop on kill (brief freeze frame)
      if (!enemy.isBoss) s.hitstop = 2
      // Heal drop (8% chance)
      if (Math.random() < 0.08) {
        s.healDrops.push({ pos: { ...enemy.pos }, value: Math.ceil(p.maxHp * 0.15), life: 600 })
      }
      if (enemy.isBoss) {
        events.bossKill = true
        s.bossActive = false
        s.screenShake = 20
        s.hitstop = 8
        s.levelUpChoices = getRandomSkills(3)
        // Boss always drops heal
        s.healDrops.push({ pos: { ...enemy.pos }, value: Math.ceil(p.maxHp * 0.4), life: 600 })
      } else {
        events.kill = true
      }
    }

    // Player collision
    const distToPlayer = dist(enemy.pos, p.pos)
    if (distToPlayer < enemy.size + 10 && p.invincibleUntil < s.time) {
      const armorReduction = 1 - Math.min(s.armorStacks * 0.15, 0.6)
      p.hp -= Math.floor(enemy.damage * armorReduction)
      p.invincibleUntil = s.time + 30
      s.particles.push(...spawnParticles(p.pos, '#EF4444', 4))
      s.screenShake = 5
      addDmgNum(s.damageNumbers, p.pos, enemy.damage, '#EF4444')
      events.playerDamage = true
      if (s.thorns > 0) enemy.hp -= s.thorns
    }

    return enemy
  })

  s.enemies = s.enemies.filter(e => !deadEnemyIds.includes(e.id))
  s.player = p

  // XP orb collection
  s.xpOrbs = s.xpOrbs.map(orb => {
    const o = { ...orb }; o.life--
    if (dist(o.pos, p.pos) < s.magnetRange) {
      const toP = normalize({ x: p.pos.x - o.pos.x, y: p.pos.y - o.pos.y })
      o.pos = { x: o.pos.x + toP.x * 6, y: o.pos.y + toP.y * 6 }
    }
    if (dist(o.pos, p.pos) < 12) { p.xp += o.value; o.life = 0 }
    return o
  }).filter(o => o.life > 0)
  s.player = p

  // Level up
  if (p.xp >= p.xpToNext && !s.levelUpChoices) {
    p.xp -= p.xpToNext
    p.level++
    p.xpToNext = Math.floor(p.xpToNext * 1.5)
    s.levelUpChoices = getRandomSkills(3)
    s.player = p
    events.levelUp = true
  }

  // Combo timer
  if (s.comboTimer > 0) { s.comboTimer--; if (s.comboTimer <= 0) s.combo = 0 }

  // Heal drops
  s.healDrops = s.healDrops.map(h => {
    const hd = { ...h }; hd.life--
    if (dist(hd.pos, p.pos) < 20) {
      p.hp = Math.min(p.hp + hd.value, p.maxHp)
      s.particles.push(...spawnParticles(hd.pos, '#4ADE80', 4))
      addDmgNum(s.damageNumbers, hd.pos, hd.value, '#4ADE80')
      hd.life = 0
    }
    return hd
  }).filter(h => h.life > 0)
  s.player = p

  // (auto-aim now handled in sword rotation section above)

  // Damage numbers decay
  s.damageNumbers = s.damageNumbers.map(d => ({ ...d, pos: { x: d.pos.x, y: d.pos.y - 1 }, life: d.life - 1 })).filter(d => d.life > 0)

  // Particles
  s.particles = s.particles.map(pt => ({ ...pt, pos: { x: pt.pos.x + pt.vel.x, y: pt.pos.y + pt.vel.y }, life: pt.life - 1 })).filter(pt => pt.life > 0)

  // Screen shake decay
  if (s.screenShake > 0) s.screenShake = Math.max(0, s.screenShake - 0.5)

  // Game over — "Last Stand": first time HP drops to 0, restore 1 HP + 2s invincibility
  if (p.hp <= 0) {
    if (!s.gameOver && p.level > 1 && p.invincibleUntil < s.time - 120) {
      // Last stand: one-time save
      p.hp = 1
      p.invincibleUntil = s.time + 120
      s.screenShake = 15
      s.waveAnnouncement = { text: '💀 LAST STAND!', life: 60, color: '#EF4444' }
      s.particles.push(...spawnParticles(p.pos, '#EF4444', 10))
      s.player = p
    } else {
      s.gameOver = true
      s.player = { ...p, hp: 0 }
    }
  }

  return { state: s, events }
}

export function applySkill(state: ArenaState, skillIndex: number): ArenaState {
  if (!state.levelUpChoices || skillIndex >= state.levelUpChoices.length) return state
  const skill = state.levelUpChoices[skillIndex]
  const p = { ...state.player }
  const s = { ...state }
  skill.apply(p, s)
  s.player = p
  s.levelUpChoices = null
  // Brief invincibility after skill select
  s.player.invincibleUntil = Math.max(s.player.invincibleUntil, s.time + 30)
  return s
}
