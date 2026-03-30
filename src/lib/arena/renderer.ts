import type { ArenaState } from './types'
import { ARENA_W, ARENA_H } from './types'

const ENEMY_COLORS: Record<string, string> = {
  slime: '#4ADE80', bat: '#A78BFA', skeleton: '#F3F4F6', ghost: '#93C5FD', demon: '#EF4444',
}

export function renderGame(ctx: CanvasRenderingContext2D, state: ArenaState) {
  const { player: p, enemies, particles, xpOrbs } = state

  // Clear
  ctx.fillStyle = '#0a0a1a'
  ctx.fillRect(0, 0, ARENA_W, ARENA_H)

  // Grid background
  ctx.strokeStyle = '#1a1a2e'
  ctx.lineWidth = 1
  for (let x = 0; x < ARENA_W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ARENA_H); ctx.stroke()
  }
  for (let y = 0; y < ARENA_H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ARENA_W, y); ctx.stroke()
  }

  // XP orbs
  xpOrbs.forEach(orb => {
    const alpha = Math.min(orb.life / 30, 1)
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#60A5FA'
    ctx.shadowColor = '#60A5FA'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(orb.pos.x, orb.pos.y, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  })

  // Enemies
  enemies.forEach(e => {
    const color = ENEMY_COLORS[e.type] ?? '#888'
    const hpPct = e.hp / e.maxHp

    // Body
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = e.knockbackUntil > state.time ? 10 : 0
    ctx.beginPath()
    ctx.arc(e.pos.x, e.pos.y, e.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // Eyes
    ctx.fillStyle = '#000'
    const eyeOff = e.size * 0.3
    ctx.beginPath()
    ctx.arc(e.pos.x - eyeOff, e.pos.y - eyeOff * 0.5, 2, 0, Math.PI * 2)
    ctx.arc(e.pos.x + eyeOff, e.pos.y - eyeOff * 0.5, 2, 0, Math.PI * 2)
    ctx.fill()

    // HP bar (if damaged)
    if (hpPct < 1) {
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(e.pos.x - e.size, e.pos.y - e.size - 6, e.size * 2, 3)
      ctx.fillStyle = hpPct > 0.5 ? '#4ADE80' : hpPct > 0.2 ? '#FBBF24' : '#EF4444'
      ctx.fillRect(e.pos.x - e.size, e.pos.y - e.size - 6, e.size * 2 * hpPct, 3)
    }
  })

  // Particles
  particles.forEach(pt => {
    ctx.globalAlpha = pt.life / pt.maxLife
    ctx.fillStyle = pt.color
    ctx.beginPath()
    ctx.arc(pt.pos.x, pt.pos.y, pt.size * (pt.life / pt.maxLife), 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  })

  // Player
  const isInvincible = p.invincibleUntil > state.time
  if (isInvincible && Math.floor(state.time / 4) % 2 === 0) {
    ctx.globalAlpha = 0.4
  }

  // Player body (circle)
  ctx.fillStyle = '#FBBF24'
  ctx.shadowColor = '#FBBF24'
  ctx.shadowBlur = 10
  ctx.beginPath()
  ctx.arc(p.pos.x, p.pos.y, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  // Player sword
  const swordTipX = p.pos.x + Math.cos(p.swordAngle) * p.swordRange
  const swordTipY = p.pos.y + Math.sin(p.swordAngle) * p.swordRange
  ctx.strokeStyle = '#FFD700'
  ctx.lineWidth = 3
  ctx.shadowColor = '#FFD700'
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.moveTo(p.pos.x + Math.cos(p.swordAngle) * 12, p.pos.y + Math.sin(p.swordAngle) * 12)
  ctx.lineTo(swordTipX, swordTipY)
  ctx.stroke()
  ctx.shadowBlur = 0

  // Sword tip glow
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(swordTipX, swordTipY, 4, 0, Math.PI * 2)
  ctx.fill()

  // Orbitals
  for (let o = 0; o < state.orbitals; o++) {
    const orbAngle = p.swordAngle + (o + 1) * (Math.PI * 2 / (state.orbitals + 1))
    const orbX = p.pos.x + Math.cos(orbAngle) * (p.swordRange * 0.7)
    const orbY = p.pos.y + Math.sin(orbAngle) * (p.swordRange * 0.7)
    ctx.fillStyle = '#A78BFA'
    ctx.shadowColor = '#A78BFA'
    ctx.shadowBlur = 6
    ctx.beginPath()
    ctx.arc(orbX, orbY, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }

  ctx.globalAlpha = 1

  // HUD - HP bar
  const hpPct = Math.max(0, p.hp / p.maxHp)
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(10, 10, 200, 16)
  ctx.fillStyle = hpPct > 0.5 ? '#4ADE80' : hpPct > 0.2 ? '#FBBF24' : '#EF4444'
  ctx.fillRect(10, 10, 200 * hpPct, 16)
  ctx.strokeStyle = '#333'
  ctx.strokeRect(10, 10, 200, 16)
  ctx.fillStyle = '#FFF'
  ctx.font = 'bold 11px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`HP ${Math.ceil(p.hp)}/${p.maxHp}`, 110, 22)

  // XP bar
  const xpPct = p.xp / p.xpToNext
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(10, 30, 200, 8)
  ctx.fillStyle = '#60A5FA'
  ctx.fillRect(10, 30, 200 * xpPct, 8)

  // Level
  ctx.textAlign = 'left'
  ctx.fillStyle = '#FFF'
  ctx.font = 'bold 12px sans-serif'
  ctx.fillText(`Lv.${p.level}`, 10, 52)

  // Timer + kills
  ctx.textAlign = 'right'
  const sec = Math.floor(state.time / 60)
  const min = Math.floor(sec / 60)
  ctx.fillText(`${min}:${(sec % 60).toString().padStart(2, '0')} | Wave ${state.wave} | Kills ${state.kills}`, ARENA_W - 10, 22)

  // Gold
  ctx.fillStyle = '#FBBF24'
  ctx.fillText(`💰 ${state.goldEarned}G`, ARENA_W - 10, 40)
}
