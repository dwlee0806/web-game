import { ARENA_W, ARENA_H } from './types'

export interface MapTheme {
  name: string
  bgColor: string
  gridColor: string
  drawBackground: (ctx: CanvasRenderingContext2D, time: number) => void
  fogOfWar?: boolean
  fogRadius?: number
}

// ═══ 1-5: 평원 (Plains) ═══
const plains: MapTheme = {
  name: '평원',
  bgColor: '#1a2a15',
  gridColor: '#253520',
  drawBackground(ctx, time) {
    // Sky gradient at top
    const skyGrad = ctx.createLinearGradient(0, 0, 0, ARENA_H * 0.3)
    skyGrad.addColorStop(0, '#2a4a60')
    skyGrad.addColorStop(1, '#1a2a15')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, ARENA_W, ARENA_H * 0.3)

    // Grass base
    const grassGrad = ctx.createLinearGradient(0, ARENA_H * 0.3, 0, ARENA_H)
    grassGrad.addColorStop(0, '#1a3010')
    grassGrad.addColorStop(1, '#0f200a')
    ctx.fillStyle = grassGrad
    ctx.fillRect(0, ARENA_H * 0.3, ARENA_W, ARENA_H * 0.7)

    // Grass tufts
    ctx.strokeStyle = '#2a5020'
    ctx.lineWidth = 1
    for (let i = 0; i < 30; i++) {
      const x = (i * 137 + 23) % ARENA_W
      const y = ARENA_H * 0.4 + (i * 89) % (ARENA_H * 0.5)
      const sway = Math.sin(time * 0.02 + i) * 2
      ctx.beginPath()
      ctx.moveTo(x, y); ctx.lineTo(x + sway, y - 8)
      ctx.moveTo(x + 3, y); ctx.lineTo(x + 3 + sway, y - 6)
      ctx.stroke()
    }

    // Distant trees
    ctx.fillStyle = '#152810'
    for (let i = 0; i < 8; i++) {
      const x = (i * 107 + 50) % ARENA_W
      ctx.beginPath()
      ctx.arc(x, ARENA_H * 0.28, 15 + (i % 3) * 5, 0, Math.PI, true)
      ctx.fill()
    }

    // Flowers
    const flowerColors = ['#FF6B6B', '#FFD93D', '#FF8ED4', '#9C27B0']
    for (let i = 0; i < 12; i++) {
      const x = (i * 173 + 40) % ARENA_W
      const y = ARENA_H * 0.5 + (i * 113) % (ARENA_H * 0.4)
      ctx.fillStyle = flowerColors[i % 4]
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill()
    }

    // Path/road
    ctx.fillStyle = '#2a2418'
    ctx.fillRect(0, ARENA_H * 0.48, ARENA_W, 20)
    ctx.fillStyle = '#352e20'
    ctx.fillRect(0, ARENA_H * 0.48, ARENA_W, 2)
  },
}

// ═══ 6-10: 던전 초입 (Dungeon Entrance) ═══
const dungeonEntrance: MapTheme = {
  name: '던전 초입',
  bgColor: '#12100e',
  gridColor: '#1a1815',
  drawBackground(ctx, time) {
    // Stone floor gradient
    const floorGrad = ctx.createLinearGradient(0, 0, 0, ARENA_H)
    floorGrad.addColorStop(0, '#1a1612')
    floorGrad.addColorStop(1, '#0e0c0a')
    ctx.fillStyle = floorGrad
    ctx.fillRect(0, 0, ARENA_W, ARENA_H)

    // Stone brick pattern
    ctx.strokeStyle = '#252018'
    ctx.lineWidth = 0.5
    for (let y = 0; y < ARENA_H; y += 24) {
      const offset = (Math.floor(y / 24) % 2) * 20
      for (let x = -20 + offset; x < ARENA_W; x += 40) {
        ctx.strokeRect(x, y, 40, 24)
      }
    }

    // Wall stones at top
    ctx.fillStyle = '#1e1a15'
    ctx.fillRect(0, 0, ARENA_W, 30)
    ctx.fillStyle = '#252018'
    for (let x = 0; x < ARENA_W; x += 30) {
      ctx.fillRect(x + 1, 2, 28, 12)
      ctx.fillRect(x + 16, 16, 28, 12)
    }

    // Torches on walls
    for (let i = 0; i < 4; i++) {
      const x = 100 + i * 200
      const flicker = Math.sin(time * 0.1 + i * 2) * 3
      // Torch bracket
      ctx.fillStyle = '#4A3020'
      ctx.fillRect(x - 2, 20, 4, 15)
      // Flame
      ctx.fillStyle = '#FF8C00'
      ctx.beginPath(); ctx.ellipse(x, 18 + flicker * 0.3, 4, 6 + flicker, 0, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#FFD700'
      ctx.beginPath(); ctx.ellipse(x, 17, 2, 3, 0, 0, Math.PI * 2); ctx.fill()
      // Light radius
      const lightGrad = ctx.createRadialGradient(x, 25, 0, x, 25, 60 + flicker * 2)
      lightGrad.addColorStop(0, 'rgba(255,140,0,0.08)')
      lightGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = lightGrad
      ctx.fillRect(x - 80, 0, 160, 120)
    }

    // Cobwebs
    ctx.strokeStyle = 'rgba(200,200,200,0.06)'
    ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(30, 15, 60, 0); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(ARENA_W, 0); ctx.quadraticCurveTo(ARENA_W - 30, 15, ARENA_W - 60, 0); ctx.stroke()
  },
}

// ═══ 11-15: 지하 감옥 (Underground Prison) ═══
const prison: MapTheme = {
  name: '지하 감옥',
  bgColor: '#0a0808',
  gridColor: '#151210',
  drawBackground(ctx, time) {
    ctx.fillStyle = '#0a0808'
    ctx.fillRect(0, 0, ARENA_W, ARENA_H)

    // Iron bars pattern
    ctx.strokeStyle = '#2a2520'
    ctx.lineWidth = 3
    for (let x = 0; x < ARENA_W; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 25); ctx.stroke()
    }
    ctx.strokeStyle = '#2a2520'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(0, 12); ctx.lineTo(ARENA_W, 12); ctx.stroke()

    // Cracked stone floor
    ctx.strokeStyle = '#1a1510'
    ctx.lineWidth = 0.8
    for (let i = 0; i < 15; i++) {
      const x1 = (i * 137 + 20) % ARENA_W
      const y1 = (i * 89 + 50) % ARENA_H
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x1 + 20 + (i % 3) * 10, y1 + 10 - (i % 2) * 20)
      ctx.lineTo(x1 + 40, y1 + 5)
      ctx.stroke()
    }

    // Chains hanging
    ctx.strokeStyle = '#3a3530'
    ctx.lineWidth = 1.5
    for (let i = 0; i < 3; i++) {
      const x = 150 + i * 250
      const sway = Math.sin(time * 0.03 + i) * 3
      for (let j = 0; j < 5; j++) {
        ctx.beginPath()
        ctx.ellipse(x + sway * (j / 5), 10 + j * 8, 3, 4, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // Blood stains
    ctx.fillStyle = 'rgba(80, 10, 10, 0.15)'
    ctx.beginPath(); ctx.ellipse(200, 400, 20, 8, 0.3, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(550, 300, 15, 6, -0.2, 0, Math.PI * 2); ctx.fill()

    // Dim ambient light
    const ambientGrad = ctx.createRadialGradient(ARENA_W / 2, ARENA_H / 2, 100, ARENA_W / 2, ARENA_H / 2, 400)
    ambientGrad.addColorStop(0, 'rgba(60,30,10,0.04)')
    ambientGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = ambientGrad
    ctx.fillRect(0, 0, ARENA_W, ARENA_H)
  },
}

// ═══ 16-20: 보석 동굴 (Crystal Cave) ═══
const crystalCave: MapTheme = {
  name: '보석 동굴',
  bgColor: '#080812',
  gridColor: '#10101a',
  drawBackground(ctx, time) {
    // Deep blue-purple base
    const bg = ctx.createLinearGradient(0, 0, ARENA_W, ARENA_H)
    bg.addColorStop(0, '#0a0818')
    bg.addColorStop(0.5, '#080615')
    bg.addColorStop(1, '#0a0a1a')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, ARENA_W, ARENA_H)

    // Crystals (colorful gems embedded in walls/floor)
    const crystalColors = ['#4FC3F7', '#AB47BC', '#66BB6A', '#FF7043', '#FFD54F', '#EC407A']
    for (let i = 0; i < 20; i++) {
      const x = (i * 149 + 30) % ARENA_W
      const y = (i * 97 + 20) % ARENA_H
      const color = crystalColors[i % crystalColors.length]
      const size = 4 + (i % 3) * 3
      const pulse = Math.sin(time * 0.05 + i * 0.7) * 0.3 + 0.7

      ctx.save()
      ctx.globalAlpha = pulse * 0.6
      // Crystal glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
      glow.addColorStop(0, color + '30')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6)

      // Crystal shape (diamond)
      ctx.fillStyle = color
      ctx.globalAlpha = pulse * 0.8
      ctx.beginPath()
      ctx.moveTo(x, y - size)
      ctx.lineTo(x + size * 0.6, y)
      ctx.lineTo(x, y + size * 0.5)
      ctx.lineTo(x - size * 0.6, y)
      ctx.closePath()
      ctx.fill()

      // Highlight
      ctx.fillStyle = '#FFFFFF'
      ctx.globalAlpha = pulse * 0.4
      ctx.beginPath(); ctx.arc(x - 1, y - size * 0.4, 1, 0, Math.PI * 2); ctx.fill()
      ctx.restore()
    }

    // Stalactites from ceiling
    ctx.fillStyle = '#15122a'
    for (let i = 0; i < 10; i++) {
      const x = (i * 83 + 20) % ARENA_W
      const h = 15 + (i % 4) * 10
      ctx.beginPath()
      ctx.moveTo(x - 5, 0); ctx.lineTo(x, h); ctx.lineTo(x + 5, 0)
      ctx.fill()
    }
  },
}

// ═══ 21-25: 암흑 동굴 (Dark Cave — FOG OF WAR) ═══
const darkCave: MapTheme = {
  name: '암흑 동굴',
  bgColor: '#030304',
  gridColor: '#08080a',
  fogOfWar: true,
  fogRadius: 120,
  drawBackground(ctx, time) {
    ctx.fillStyle = '#030304'
    ctx.fillRect(0, 0, ARENA_W, ARENA_H)

    // Faint cracks in the darkness
    ctx.strokeStyle = '#0a0a0e'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 10; i++) {
      const x = (i * 167 + 30) % ARENA_W
      const y = (i * 103 + 40) % ARENA_H
      ctx.beginPath()
      ctx.moveTo(x, y); ctx.lineTo(x + 30, y + 15); ctx.lineTo(x + 50, y + 5)
      ctx.stroke()
    }

    // Rare glowing fungi
    for (let i = 0; i < 5; i++) {
      const x = (i * 193 + 60) % ARENA_W
      const y = (i * 131 + 80) % ARENA_H
      const pulse = Math.sin(time * 0.04 + i * 1.5) * 0.3 + 0.5
      ctx.globalAlpha = pulse * 0.3
      const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, 20)
      glowGrad.addColorStop(0, '#4ADE8020')
      glowGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = glowGrad
      ctx.fillRect(x - 20, y - 20, 40, 40)
      ctx.fillStyle = '#4ADE80'
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill()
      ctx.globalAlpha = 1
    }
  },
}

// ═══ Theme selector ═══
export function getMapTheme(wave: number): MapTheme {
  if (wave <= 5) return plains
  if (wave <= 10) return dungeonEntrance
  if (wave <= 15) return prison
  if (wave <= 20) return crystalCave
  return darkCave
}

// ═══ Map transition effect ═══
export function drawMapTransition(ctx: CanvasRenderingContext2D, progress: number) {
  // Circle wipe: black circle expands then shrinks
  const phase = progress < 0.5 ? progress * 2 : (1 - progress) * 2 // 0→1→0
  const maxR = Math.sqrt(ARENA_W * ARENA_W + ARENA_H * ARENA_H) / 2
  const radius = maxR * (1 - phase)

  ctx.save()
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.rect(0, 0, ARENA_W, ARENA_H)
  ctx.arc(ARENA_W / 2, ARENA_H / 2, Math.max(0, radius), 0, Math.PI * 2, true)
  ctx.fill()

  // Text at midpoint
  if (progress > 0.3 && progress < 0.7) {
    ctx.fillStyle = '#FFF'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'center'
    ctx.globalAlpha = Math.min((progress - 0.3) * 5, (0.7 - progress) * 5, 1)
    const wave = 0 // Will be passed separately
    ctx.fillText('STAGE CLEAR', ARENA_W / 2, ARENA_H / 2 - 10)
    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#FFD700'
    ctx.fillText('새로운 지역으로 이동 중…', ARENA_W / 2, ARENA_H / 2 + 15)
    ctx.globalAlpha = 1
  }
  ctx.restore()
}

// ═══ Fog of war (player vision circle) ═══
export function drawFogOfWar(ctx: CanvasRenderingContext2D, playerX: number, playerY: number, radius: number, time: number) {
  ctx.save()
  // Create a dark overlay with a clear circle around player
  ctx.fillStyle = '#000'
  ctx.globalCompositeOperation = 'source-over'

  // Draw full darkness first
  ctx.globalAlpha = 0.92
  ctx.fillRect(0, 0, ARENA_W, ARENA_H)

  // Cut out the vision circle with gradient edge
  ctx.globalCompositeOperation = 'destination-out'
  const flickerR = radius + Math.sin(time * 0.05) * 5
  const visionGrad = ctx.createRadialGradient(playerX, playerY, 0, playerX, playerY, flickerR)
  visionGrad.addColorStop(0, 'rgba(0,0,0,1)')
  visionGrad.addColorStop(0.7, 'rgba(0,0,0,0.9)')
  visionGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = visionGrad
  ctx.fillRect(0, 0, ARENA_W, ARENA_H)

  ctx.restore()
}
