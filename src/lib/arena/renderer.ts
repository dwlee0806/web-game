import type { ArenaState, Enemy } from './types'
import { ARENA_W, ARENA_H } from './types'

const ENEMY_COLORS: Record<string, string> = {
  slime: '#4ADE80', bat: '#A78BFA', skeleton: '#E5E7EB', ghost: '#93C5FD', demon: '#EF4444',
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, time: number) {
  const color = ENEMY_COLORS[e.type] ?? '#888'
  const isKB = e.knockbackUntil > time

  ctx.save()
  ctx.translate(e.pos.x, e.pos.y)
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

  // Clear
  ctx.fillStyle = '#0a0a1a'
  ctx.fillRect(-10, -10, ARENA_W + 20, ARENA_H + 20)

  // Grid
  ctx.strokeStyle = '#1a1a2e'
  ctx.lineWidth = 1
  for (let x = 0; x < ARENA_W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ARENA_H); ctx.stroke() }
  for (let y = 0; y < ARENA_H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ARENA_W, y); ctx.stroke() }

  // XP orbs
  xpOrbs.forEach(orb => {
    ctx.globalAlpha = Math.min(orb.life / 30, 1)
    ctx.fillStyle = '#60A5FA'
    ctx.shadowColor = '#60A5FA'; ctx.shadowBlur = 8
    ctx.beginPath(); ctx.arc(orb.pos.x, orb.pos.y, 4, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0; ctx.globalAlpha = 1
  })

  // Projectiles
  projectiles.forEach(pr => {
    ctx.fillStyle = pr.color
    ctx.shadowColor = pr.color; ctx.shadowBlur = 6
    ctx.beginPath(); ctx.arc(pr.pos.x, pr.pos.y, pr.size, 0, Math.PI * 2); ctx.fill()
    ctx.shadowBlur = 0
  })

  // Enemies
  enemies.forEach(e => drawEnemy(ctx, e, state.time))

  // Particles
  particles.forEach(pt => {
    ctx.globalAlpha = pt.life / pt.maxLife
    ctx.fillStyle = pt.color
    ctx.beginPath(); ctx.arc(pt.pos.x, pt.pos.y, pt.size * (pt.life / pt.maxLife), 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 1
  })

  // Player
  const isInvincible = p.invincibleUntil > state.time
  const isDashing = p.dashUntil > 0
  if (isInvincible && !isDashing && Math.floor(state.time / 4) % 2 === 0) ctx.globalAlpha = 0.4

  // Dash trail
  if (isDashing) {
    ctx.fillStyle = '#60A5FA40'
    ctx.beginPath(); ctx.arc(p.pos.x, p.pos.y, 16, 0, Math.PI * 2); ctx.fill()
  }

  // Player body
  ctx.fillStyle = isDashing ? '#60A5FA' : '#FBBF24'
  ctx.shadowColor = isDashing ? '#60A5FA' : '#FBBF24'; ctx.shadowBlur = 10
  ctx.beginPath(); ctx.arc(p.pos.x, p.pos.y, 10, 0, Math.PI * 2); ctx.fill()
  ctx.shadowBlur = 0

  // Sword
  const tipX = p.pos.x + Math.cos(p.swordAngle) * p.swordRange
  const tipY = p.pos.y + Math.sin(p.swordAngle) * p.swordRange
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 3
  ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.moveTo(p.pos.x + Math.cos(p.swordAngle) * 12, p.pos.y + Math.sin(p.swordAngle) * 12)
  ctx.lineTo(tipX, tipY); ctx.stroke()
  ctx.shadowBlur = 0
  ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(tipX, tipY, 4, 0, Math.PI * 2); ctx.fill()

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

  ctx.restore() // End screen shake
}
