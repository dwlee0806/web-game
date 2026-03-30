import type { GameState } from './gameLogic'
import { getLevelTier } from './gameLogic'

export async function generateResultCard(state: GameState): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 400
  const c = canvas.getContext('2d')!

  const tier = getLevelTier(state.level)
  const successRate = state.totalAttempts > 0
    ? Math.round((state.totalSuccess / state.totalAttempts) * 100)
    : 0

  // Background
  const bg = c.createLinearGradient(0, 0, 600, 400)
  bg.addColorStop(0, '#0f172a')
  bg.addColorStop(1, '#030712')
  c.fillStyle = bg
  c.fillRect(0, 0, 600, 400)

  // Glow circle
  const glow = c.createRadialGradient(300, 160, 0, 300, 160, 200)
  glow.addColorStop(0, tier.color + '30')
  glow.addColorStop(1, 'transparent')
  c.fillStyle = glow
  c.fillRect(0, 0, 600, 400)

  // Border
  c.strokeStyle = tier.color + '40'
  c.lineWidth = 2
  c.roundRect(10, 10, 580, 380, 16)
  c.stroke()

  // Title
  c.font = 'bold 18px sans-serif'
  c.fillStyle = '#9CA3AF'
  c.textAlign = 'center'
  c.fillText('⚔️ 검 강화 시뮬레이터', 300, 45)

  // Level
  c.font = 'bold 72px sans-serif'
  c.fillStyle = tier.color
  c.shadowColor = tier.color
  c.shadowBlur = 30
  c.fillText(`+${state.level}`, 300, 150)
  c.shadowBlur = 0

  // Tier name
  c.font = 'bold 20px sans-serif'
  c.fillStyle = tier.color
  c.fillText(tier.name, 300, 185)

  // Divider
  c.strokeStyle = '#374151'
  c.lineWidth = 1
  c.beginPath()
  c.moveTo(100, 210)
  c.lineTo(500, 210)
  c.stroke()

  // Stats
  c.font = '15px sans-serif'
  c.textAlign = 'left'
  const stats = [
    ['🏆 최고 기록', `+${state.highestLevel}`],
    ['🎯 총 시도', `${state.totalAttempts}회`],
    ['✨ 성공률', `${successRate}%`],
    ['💀 파괴', `${state.totalDestroy}회`],
    ['📅 연속 출석', `${state.checkInStreak}일`],
  ]
  stats.forEach(([label, val], i) => {
    const y = 245 + i * 26
    c.fillStyle = '#9CA3AF'
    c.fillText(label, 120, y)
    c.fillStyle = '#FFFFFF'
    c.textAlign = 'right'
    c.fillText(val, 480, y)
    c.textAlign = 'left'
  })

  // Footer
  c.font = '13px sans-serif'
  c.fillStyle = '#4B5563'
  c.textAlign = 'center'
  c.fillText('web-game-6cy.pages.dev', 300, 385)

  return new Promise(resolve => canvas.toBlob(blob => resolve(blob!), 'image/png'))
}
