import type { ArenaState, Enemy } from './types'
import { ARENA_W, ARENA_H } from './types'
import { getMapTheme, drawMapTransition, drawFogOfWar } from './mapThemes'

const ENEMY_COLORS: Record<string, string> = {
  slime: '#4ADE80', bat: '#A78BFA', skeleton: '#E5E7EB', ghost: '#93C5FD', demon: '#EF4444',
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, time: number, playerX: number = 0) {
  const color = ENEMY_COLORS[e.type] ?? '#888'
  const isKB = e.knockbackUntil > time
  // Face toward player (left/right flip)
  const facingLeft = playerX < e.pos.x

  ctx.save()
  ctx.translate(e.pos.x, e.pos.y)
  if (facingLeft) ctx.scale(-1, 1)
  if (isKB) { ctx.shadowColor = '#FFF'; ctx.shadowBlur = 12 }

  const s = e.isBoss ? 1.8 : 1

  if (e.type === 'slime') {
    // Blob shape
    ctx.fillStyle = color
    ctx.beginPath()
    const wobble = Math.sin(time * 0.08) * 2
    ctx.ellipse(0, wobble, e.size * s, e.size * s * 0.8, 0, 0, Math.PI * 2)
    ctx.fill()
    // Eyes
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(-e.size * 0.3 * s, -e.size * 0.15 * s, 2 * s, 0, Math.PI * 2)
    ctx.arc(e.size * 0.3 * s, -e.size * 0.15 * s, 2 * s, 0, Math.PI * 2)
    ctx.fill()
  } else if (e.type === 'bat') {
    // Wings
    ctx.fillStyle = color
    const wingFlap = Math.sin(time * 0.2) * 8
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(-e.size * 2, -e.size + wingFlap, -e.size * 1.5, e.size * 0.5)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(e.size * 2, -e.size + wingFlap, e.size * 1.5, e.size * 0.5)
    ctx.fill()
    // Body
    ctx.beginPath()
    ctx.arc(0, 0, e.size * 0.6, 0, Math.PI * 2)
    ctx.fill()
    // Eyes
    ctx.fillStyle = '#FF0'
    ctx.beginPath()
    ctx.arc(-3, -2, 1.5, 0, Math.PI * 2)
    ctx.arc(3, -2, 1.5, 0, Math.PI * 2)
    ctx.fill()
  } else if (e.type === 'skeleton') {
    // Skull shape
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(0, -e.size * 0.3 * s, e.size * 0.7 * s, 0, Math.PI * 2)
    ctx.fill()
    // Jaw
    ctx.fillRect(-e.size * 0.4 * s, e.size * 0.1 * s, e.size * 0.8 * s, e.size * 0.4 * s)
    // Eyes
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(-e.size * 0.25 * s, -e.size * 0.35 * s, 3 * s, 0, Math.PI * 2)
    ctx.arc(e.size * 0.25 * s, -e.size * 0.35 * s, 3 * s, 0, Math.PI * 2)
    ctx.fill()
    // Boss crown
    if (e.isBoss) {
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.moveTo(-e.size * 0.5, -e.size * 0.9)
      ctx.lineTo(-e.size * 0.3, -e.size * 1.3)
      ctx.lineTo(0, -e.size * 1.0)
      ctx.lineTo(e.size * 0.3, -e.size * 1.3)
      ctx.lineTo(e.size * 0.5, -e.size * 0.9)
      ctx.fill()
    }
  } else if (e.type === 'ghost') {
    // Translucent ghost
    ctx.globalAlpha = 0.7 + Math.sin(time * 0.05) * 0.2
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(0, -e.size * 0.2, e.size, 0, Math.PI, true)
    // Wavy bottom
    const w = e.size
    ctx.lineTo(-w, e.size * 0.3)
    ctx.quadraticCurveTo(-w * 0.5, e.size * 0.8, 0, e.size * 0.3)
    ctx.quadraticCurveTo(w * 0.5, e.size * 0.8, w, e.size * 0.3)
    ctx.fill()
    ctx.globalAlpha = 1
    // Eyes
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.arc(-e.size * 0.3, -e.size * 0.3, 3, 0, Math.PI * 2)
    ctx.arc(e.size * 0.3, -e.size * 0.3, 3, 0, Math.PI * 2)
    ctx.fill()
  } else if (e.type === 'demon') {
    // Body
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(0, 0, e.size * s, 0, Math.PI * 2)
    ctx.fill()
    // Horns
    ctx.fillStyle = '#991B1B'
    ctx.beginPath()
    ctx.moveTo(-e.size * 0.5 * s, -e.size * 0.6 * s)
    ctx.lineTo(-e.size * 0.8 * s, -e.size * 1.4 * s)
    ctx.lineTo(-e.size * 0.2 * s, -e.size * 0.8 * s)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(e.size * 0.5 * s, -e.size * 0.6 * s)
    ctx.lineTo(e.size * 0.8 * s, -e.size * 1.4 * s)
    ctx.lineTo(e.size * 0.2 * s, -e.size * 0.8 * s)
    ctx.fill()
    // Eyes
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.arc(-e.size * 0.3 * s, -e.size * 0.15 * s, 3 * s, 0, Math.PI * 2)
    ctx.arc(e.size * 0.3 * s, -e.size * 0.15 * s, 3 * s, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()

  // HP bar (if damaged)
  const hpPct = e.hp / e.maxHp
  if (hpPct < 1) {
    const barW = e.isBoss ? 50 : e.size * 2
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(e.pos.x - barW / 2, e.pos.y - e.size * (e.isBoss ? 2.5 : 1.3), barW, 3)
    ctx.fillStyle = hpPct > 0.5 ? '#4ADE80' : hpPct > 0.2 ? '#FBBF24' : '#EF4444'
    ctx.fillRect(e.pos.x - barW / 2, e.pos.y - e.size * (e.isBoss ? 2.5 : 1.3), barW * hpPct, 3)
  }
}

export function renderGame(ctx: CanvasRenderingContext2D, state: ArenaState) {
  const { player: p, enemies, particles, xpOrbs, damageNumbers, projectiles } = state

  // Screen shake
  ctx.save()
  if (state.screenShake > 0) {
    const sx = (Math.random() - 0.5) * state.screenShake * 2
    const sy = (Math.random() - 0.5) * state.screenShake * 2
    ctx.translate(sx, sy)
  }

  // Map theme based on wave
  const theme = getMapTheme(state.wave)

  // Clear with theme color
  ctx.fillStyle = theme.bgColor
  ctx.fillRect(-10, -10, ARENA_W + 20, ARENA_H + 20)

  // Theme background
  theme.drawBackground(ctx, state.time)

  // Grid (subtle, theme-colored)
  ctx.strokeStyle = theme.gridColor
  ctx.lineWidth = 0.5
  for (let x = 0; x < ARENA_W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ARENA_H); ctx.stroke() }
  for (let y = 0; y < ARENA_H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ARENA_W, y); ctx.stroke() }

  // Heal drops
  state.healDrops.forEach(h => {
    ctx.globalAlpha = Math.min(h.life / 60, 1)
    ctx.fillStyle = '#4ADE80'
    ctx.shadowColor = '#4ADE80'; ctx.shadowBlur = 10
    ctx.font = '16px sans-serif'; ctx.textAlign = 'center'
    ctx.fillText('💚', h.pos.x, h.pos.y + 5)
    ctx.shadowBlur = 0; ctx.globalAlpha = 1
  })

  // XP orbs
  xpOrbs.forEach(orb => {
    ctx.globalAlpha = Math.min(orb.life / 30, 1)
    ctx.fillStyle = '#60A5FA'
    ctx.shadowColor = '#60A5FA'; ctx.shadowBlur = 8
    ctx.beginPath(); ctx.arc(orb.pos.x, orb.pos.y, 4, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0; ctx.globalAlpha = 1
  })

  // Projectiles (weapon-specific visuals)
  projectiles.forEach(pr => {
    const angle = Math.atan2(pr.vel.y, pr.vel.x)
    if (pr.color === '#DAA520' && pr.size <= 4) {
      // Arrow: elongated triangle
      ctx.save(); ctx.translate(pr.pos.x, pr.pos.y); ctx.rotate(angle)
      ctx.fillStyle = '#8B6914'
      ctx.fillRect(-8, -1, 16, 2) // shaft
      ctx.fillStyle = '#A0A8B0'
      ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(4, -3); ctx.lineTo(4, 3); ctx.fill() // head
      ctx.fillStyle = '#E04040'
      ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-5, -2); ctx.lineTo(-5, 2); ctx.fill() // fletching
      ctx.restore()
    } else if (pr.color === '#FF6B00') {
      // Fireball: glowing circle with trail
      ctx.fillStyle = '#FF8C00'; ctx.shadowColor = '#FF6B00'; ctx.shadowBlur = 12
      ctx.beginPath(); ctx.arc(pr.pos.x, pr.pos.y, pr.size, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(pr.pos.x, pr.pos.y, pr.size * 0.5, 0, Math.PI * 2); ctx.fill()
      // Fire trail
      for (let i = 1; i <= 3; i++) {
        ctx.globalAlpha = 0.3 - i * 0.08
        ctx.fillStyle = '#FF4500'
        ctx.beginPath(); ctx.arc(pr.pos.x - pr.vel.x * i * 0.5, pr.pos.y - pr.vel.y * i * 0.5, pr.size * (1 - i * 0.2), 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0
    } else {
      // Default orb
      ctx.fillStyle = pr.color; ctx.shadowColor = pr.color; ctx.shadowBlur = 6
      ctx.beginPath(); ctx.arc(pr.pos.x, pr.pos.y, pr.size, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0
    }
  })

  // Enemies
  enemies.forEach(e => drawEnemy(ctx, e, state.time, p.pos.x))

  // Particles
  particles.forEach(pt => {
    ctx.globalAlpha = pt.life / pt.maxLife
    ctx.fillStyle = pt.color
    ctx.beginPath(); ctx.arc(pt.pos.x, pt.pos.y, pt.size * (pt.life / pt.maxLife), 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 1
  })

  // ═══ HERO CHARACTER ═══
  const isInvincible = p.invincibleUntil > state.time
  const isDashing = p.dashUntil > 0
  if (isInvincible && !isDashing && Math.floor(state.time / 4) % 2 === 0) ctx.globalAlpha = 0.4

  // Dash trail
  if (isDashing) {
    ctx.fillStyle = '#60A5FA30'
    ctx.beginPath(); ctx.arc(p.pos.x, p.pos.y, 18, 0, Math.PI * 2); ctx.fill()
  }

  // Determine facing direction from sword angle (nearest enemy)
  const facingAngle = p.swordAngle
  const facingRight = Math.cos(facingAngle) >= 0

  ctx.save()
  ctx.translate(p.pos.x, p.pos.y)
  if (!facingRight) ctx.scale(-1, 1)

  // Hero body (SD character)
  const hSize = 10
  // Hair (golden blonde)
  ctx.fillStyle = '#F5C518'
  ctx.beginPath(); ctx.ellipse(0, -hSize * 0.6, hSize * 0.8, hSize * 0.7, 0, 0, Math.PI * 2); ctx.fill()
  // Face
  ctx.fillStyle = '#FFE4C4'
  ctx.beginPath(); ctx.arc(0, -hSize * 0.3, hSize * 0.55, 0, Math.PI * 2); ctx.fill()
  // Eyes
  ctx.fillStyle = '#2C1810'
  ctx.beginPath(); ctx.arc(-hSize * 0.18, -hSize * 0.35, 1.5, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(hSize * 0.18, -hSize * 0.35, 1.5, 0, Math.PI * 2); ctx.fill()
  // Eye highlights
  ctx.fillStyle = '#3D7A35'
  ctx.beginPath(); ctx.arc(-hSize * 0.18, -hSize * 0.38, 1, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(hSize * 0.18, -hSize * 0.38, 1, 0, Math.PI * 2); ctx.fill()
  // Red scarf
  ctx.fillStyle = '#DC2626'
  ctx.beginPath(); ctx.moveTo(-hSize * 0.4, hSize * 0.1); ctx.quadraticCurveTo(0, hSize * 0.3, hSize * 0.4, hSize * 0.1)
  ctx.lineTo(hSize * 0.3, hSize * 0.2); ctx.quadraticCurveTo(0, hSize * 0.4, -hSize * 0.3, hSize * 0.2); ctx.fill()
  // Armor
  ctx.fillStyle = isDashing ? '#4080C0' : '#607080'
  ctx.fillRect(-hSize * 0.45, hSize * 0.15, hSize * 0.9, hSize * 0.6)
  ctx.fillStyle = isDashing ? '#5090D0' : '#7A8A9A'
  ctx.fillRect(-hSize * 0.35, hSize * 0.2, hSize * 0.7, hSize * 0.3)
  // Legs
  ctx.fillStyle = '#505868'
  const legBob = Math.sin(state.time * 0.2) * 2
  ctx.fillRect(-hSize * 0.3, hSize * 0.75 + legBob, hSize * 0.25, hSize * 0.4)
  ctx.fillRect(hSize * 0.05, hSize * 0.75 - legBob, hSize * 0.25, hSize * 0.4)
  // Boots
  ctx.fillStyle = '#4A3020'
  ctx.fillRect(-hSize * 0.35, hSize * 1.1 + legBob, hSize * 0.35, hSize * 0.2)
  ctx.fillRect(0, hSize * 1.1 - legBob, hSize * 0.35, hSize * 0.2)

  ctx.restore()

  // ═══ WEAPON ATTACK RENDERING ═══
  const isRangedWeapon = state.weaponType === 'bow' || state.weaponType === 'staff'

  if (isRangedWeapon) {
    // Ranged: show aim line toward nearest enemy instead of melee slash
    const aimAngle = p.swordAngle
    const aimLen = 25
    const aimX = p.pos.x + Math.cos(aimAngle) * aimLen
    const aimY = p.pos.y + Math.sin(aimAngle) * aimLen

    if (state.weaponType === 'bow') {
      // Draw bow in hand
      ctx.strokeStyle = '#8B6914'; ctx.lineWidth = 2
      const bowAngle = aimAngle + Math.PI / 2
      ctx.beginPath()
      ctx.arc(p.pos.x + Math.cos(aimAngle) * 8, p.pos.y + Math.sin(aimAngle) * 8, 10, bowAngle - 1.2, bowAngle + 1.2)
      ctx.stroke()
      // Aim dot
      ctx.fillStyle = '#FF000060'; ctx.beginPath(); ctx.arc(aimX, aimY, 2, 0, Math.PI * 2); ctx.fill()
    } else {
      // Staff: orb glow at tip
      const orbX = p.pos.x + Math.cos(aimAngle) * 14
      const orbY = p.pos.y + Math.sin(aimAngle) * 14
      ctx.fillStyle = '#8B5CF6'; ctx.shadowColor = '#8B5CF6'; ctx.shadowBlur = 8
      ctx.beginPath(); ctx.arc(orbX, orbY, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#D0A0FF'; ctx.beginPath(); ctx.arc(orbX, orbY, 2, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0
      // Staff shaft
      ctx.strokeStyle = '#5A3A20'; ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(p.pos.x, p.pos.y)
      ctx.lineTo(orbX, orbY)
      ctx.stroke()
    }
  } else {

  // ═══ MELEE SLASH MOTION (sword/axe) ═══
  const sp = p.swingPhase
  const isSlashing = sp > 0.05 && sp < 0.95

  // Slash arc: raised position (-0.8 rad) → slashed position (+0.7 rad)
  // Fast ease-in on slash, slow ease-out on recovery
  let swingOffset: number
  if (sp > 0 && sp <= 1) {
    if (sp < 1) {
      // Slash phase: fast ease-out curve (quick strike)
      const t = Math.min(sp / 0.95, 1)
      swingOffset = -0.8 + t * t * 1.5 // -0.8 → +0.7 (quadratic ease-in)
    } else {
      swingOffset = 0.7
    }
  } else {
    swingOffset = -0.8 // Raised/ready position
  }

  const weaponAngle = facingAngle + swingOffset
  const swordLen = p.swordRange
  const swordStart = 14
  const tipX = p.pos.x + Math.cos(weaponAngle) * swordLen
  const tipY = p.pos.y + Math.sin(weaponAngle) * swordLen
  const startX = p.pos.x + Math.cos(weaponAngle) * swordStart
  const startY = p.pos.y + Math.sin(weaponAngle) * swordStart

  // Slash trail arc (only during fast slash)
  if (isSlashing && sp < 0.7) {
    const trailAlpha = (1 - sp) * 0.5
    ctx.strokeStyle = `rgba(255,255,255,${trailAlpha})`
    ctx.lineWidth = swordLen * 0.04
    ctx.beginPath()
    ctx.arc(p.pos.x, p.pos.y, swordLen * 0.85, facingAngle - 0.8, facingAngle + swingOffset)
    ctx.stroke()

    // Speed lines during slash
    for (let i = 0; i < 3; i++) {
      const lineAngle = facingAngle + swingOffset - 0.2 * i
      const lineStart = swordLen * (0.4 + i * 0.15)
      const lineEnd = swordLen * (0.6 + i * 0.15)
      ctx.strokeStyle = `rgba(255,255,255,${0.3 - i * 0.1})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(p.pos.x + Math.cos(lineAngle) * lineStart, p.pos.y + Math.sin(lineAngle) * lineStart)
      ctx.lineTo(p.pos.x + Math.cos(lineAngle) * lineEnd, p.pos.y + Math.sin(lineAngle) * lineEnd)
      ctx.stroke()
    }
  }

  // Weapon aura glow
  const tierColor = state.swordLevel < 3 ? '#9EAFC0' : state.swordLevel < 5 ? '#4FC3F7' : state.swordLevel < 7 ? '#AB47BC' : state.swordLevel < 9 ? '#FFB300' : state.swordLevel < 11 ? '#FF7043' : state.swordLevel < 13 ? '#EF5350' : state.swordLevel < 15 ? '#EC407A' : '#FFD700'
  if (state.swordLevel > 2) {
    ctx.strokeStyle = tierColor; ctx.lineWidth = 7
    ctx.globalAlpha = isSlashing ? 0.35 : 0.12
    ctx.shadowColor = tierColor; ctx.shadowBlur = 15
    ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(tipX, tipY); ctx.stroke()
    ctx.shadowBlur = 0; ctx.globalAlpha = 1
  }

  // Weapon blade (thicker during slash for impact feel)
  const bladeWidth = isSlashing ? 4 : 2.5
  ctx.strokeStyle = '#E8ECF0'; ctx.lineWidth = bladeWidth
  ctx.shadowColor = isSlashing ? '#FFF' : '#FFD700'; ctx.shadowBlur = isSlashing ? 8 : 3
  ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(tipX, tipY); ctx.stroke()
  ctx.shadowBlur = 0

  // Guard (small cross at blade base)
  const guardAngle = weaponAngle + Math.PI / 2
  const gx = p.pos.x + Math.cos(weaponAngle) * (swordStart + 2)
  const gy = p.pos.y + Math.sin(weaponAngle) * (swordStart + 2)
  ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(gx + Math.cos(guardAngle) * 4, gy + Math.sin(guardAngle) * 4)
  ctx.lineTo(gx - Math.cos(guardAngle) * 4, gy - Math.sin(guardAngle) * 4)
  ctx.stroke()

  // Tip spark on slash impact
  if (isSlashing && sp > 0.4 && sp < 0.7) {
    ctx.fillStyle = '#FFF'
    ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 10
    ctx.beginPath(); ctx.arc(tipX, tipY, 4 + Math.random() * 2, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0
  } else {
    ctx.fillStyle = '#DDD'; ctx.beginPath(); ctx.arc(tipX, tipY, 2, 0, Math.PI * 2); ctx.fill()
  }
  } // end melee else block

  // Orbitals
  for (let o = 0; o < state.orbitals; o++) {
    const a = p.swordAngle + (o + 1) * (Math.PI * 2 / (state.orbitals + 1))
    const ox = p.pos.x + Math.cos(a) * (p.swordRange * 0.7)
    const oy = p.pos.y + Math.sin(a) * (p.swordRange * 0.7)
    ctx.fillStyle = '#A78BFA'; ctx.shadowColor = '#A78BFA'; ctx.shadowBlur = 6
    ctx.beginPath(); ctx.arc(ox, oy, 5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0
  }

  ctx.globalAlpha = 1

  // Damage numbers
  damageNumbers.forEach(d => {
    ctx.globalAlpha = d.life / 40
    ctx.font = d.crit ? 'bold 16px sans-serif' : 'bold 12px sans-serif'
    ctx.fillStyle = d.color
    ctx.textAlign = 'center'
    ctx.fillText(`${d.value}`, d.pos.x, d.pos.y)
    ctx.globalAlpha = 1
  })

  // Boss HP bar (top of screen)
  const boss = enemies.find(e => e.isBoss)
  if (boss) {
    const bossHpPct = boss.hp / boss.maxHp
    ctx.fillStyle = '#1a1a1a80'
    ctx.fillRect(ARENA_W * 0.15, 48, ARENA_W * 0.7, 12)
    ctx.fillStyle = '#EF4444'
    ctx.fillRect(ARENA_W * 0.15, 48, ARENA_W * 0.7 * bossHpPct, 12)
    ctx.strokeStyle = '#444'; ctx.lineWidth = 1
    ctx.strokeRect(ARENA_W * 0.15, 48, ARENA_W * 0.7, 12)
    ctx.fillStyle = '#FFF'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'
    ctx.fillText(`BOSS`, ARENA_W / 2, 57)
  }

  // HUD
  const hpPct = Math.max(0, p.hp / p.maxHp)
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(10, 10, 200, 16)
  ctx.fillStyle = hpPct > 0.5 ? '#4ADE80' : hpPct > 0.2 ? '#FBBF24' : '#EF4444'
  ctx.fillRect(10, 10, 200 * hpPct, 16)
  ctx.strokeStyle = '#333'; ctx.strokeRect(10, 10, 200, 16)
  ctx.fillStyle = '#FFF'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'
  ctx.fillText(`HP ${Math.ceil(p.hp)}/${p.maxHp}`, 110, 22)

  const xpPct = p.xp / p.xpToNext
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(10, 30, 200, 8)
  ctx.fillStyle = '#60A5FA'; ctx.fillRect(10, 30, 200 * xpPct, 8)

  ctx.textAlign = 'left'; ctx.fillStyle = '#FFF'; ctx.font = 'bold 12px sans-serif'
  ctx.fillText(`Lv.${p.level}`, 10, 52)

  // Dash cooldown indicator
  if (p.dashCooldown > 0) {
    ctx.fillStyle = '#334155'; ctx.fillRect(10, 56, 40, 6)
    ctx.fillStyle = '#60A5FA'; ctx.fillRect(10, 56, 40 * (1 - p.dashCooldown / 90), 6)
  } else {
    ctx.fillStyle = '#60A5FA80'; ctx.font = '9px sans-serif'
    ctx.fillText('DASH ✓', 10, 62)
  }

  ctx.textAlign = 'right'
  const sec = Math.floor(state.time / 60)
  ctx.fillStyle = '#FFF'; ctx.font = 'bold 12px sans-serif'
  ctx.fillText(`${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')} | Wave ${state.wave} | ${state.kills} kills`, ARENA_W - 10, 22)
  ctx.fillStyle = '#FBBF24'; ctx.fillText(`💰 ${state.goldEarned}G`, ARENA_W - 10, 40)

  // Combo counter
  if (state.combo >= 3) {
    ctx.textAlign = 'center'
    ctx.fillStyle = state.combo >= 20 ? '#EF4444' : state.combo >= 10 ? '#F59E0B' : '#FBBF24'
    ctx.font = `bold ${16 + Math.min(state.combo, 30)}px sans-serif`
    ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10
    ctx.fillText(`${state.combo} COMBO!`, ARENA_W / 2, ARENA_H - 30)
    ctx.shadowBlur = 0
  }

  // Wave announcement
  if (state.waveAnnouncement) {
    const wa = state.waveAnnouncement
    ctx.globalAlpha = Math.min(wa.life / 20, 1)
    ctx.fillStyle = wa.color
    ctx.font = 'bold 28px sans-serif'
    ctx.textAlign = 'center'
    ctx.shadowColor = wa.color; ctx.shadowBlur = 15
    ctx.fillText(wa.text, ARENA_W / 2, ARENA_H / 2 - 40)
    ctx.shadowBlur = 0; ctx.globalAlpha = 1
  }

  // Mini-map (bottom-left)
  const mmSize = 80
  const mmX = 10, mmY = ARENA_H - mmSize - 10
  ctx.fillStyle = '#0a0a1a80'
  ctx.fillRect(mmX, mmY, mmSize, mmSize)
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 1
  ctx.strokeRect(mmX, mmY, mmSize, mmSize)
  // Player dot
  const ppx = mmX + (p.pos.x / ARENA_W) * mmSize
  const ppy = mmY + (p.pos.y / ARENA_H) * mmSize
  ctx.fillStyle = '#FBBF24'
  ctx.beginPath(); ctx.arc(ppx, ppy, 2, 0, Math.PI * 2); ctx.fill()
  // Enemy dots
  enemies.forEach(e => {
    const ex = mmX + (e.pos.x / ARENA_W) * mmSize
    const ey = mmY + (e.pos.y / ARENA_H) * mmSize
    ctx.fillStyle = e.isBoss ? '#EF4444' : '#666'
    ctx.beginPath(); ctx.arc(ex, ey, e.isBoss ? 3 : 1, 0, Math.PI * 2); ctx.fill()
  })

  ctx.restore() // End screen shake

  // Fog of war (wave 21+)
  if (theme.fogOfWar && theme.fogRadius) {
    drawFogOfWar(ctx, p.pos.x, p.pos.y, theme.fogRadius, state.time)
  }

  // Map transition overlay
  if (state.mapTransition > 0) {
    drawMapTransition(ctx, state.mapTransition)
  }
}
