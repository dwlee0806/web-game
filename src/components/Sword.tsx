'use client'

import { memo } from 'react'
import { getLevelTier } from '@/lib/gameLogic'

interface SwordProps {
  level: number
  color: string
  weaponType?: string
  specialSkin?: string | null
}

export default memo(function Sword({ level, color }: SwordProps) {
  const tier = getLevelTier(level)
  const glow = Math.min(level * 4, 55)

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 220 }}>
      {/* Ambient glow behind sword */}
      {level > 0 && (
        <div
          className="absolute rounded-full blur-2xl animate-pulse"
          style={{
            width: 80 + level * 4,
            height: 80 + level * 4,
            backgroundColor: `${color}15`,
          }}
        />
      )}

      {/* SVG sword image */}
      <img
        src={`/swords/sword_lv${level}.svg`}
        alt={`+${level} ${tier.name} 검`}
        width={120}
        height={220}
        className="relative z-10 transition-all duration-500"
        style={{
          filter: level > 0
            ? `drop-shadow(0 0 ${glow}px ${color}) drop-shadow(0 0 ${glow * 0.4}px ${color}80)`
            : 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))',
        }}
      />

      {/* Ground reflection */}
      {level > 0 && (
        <div
          className="absolute bottom-0 w-16 h-3 rounded-full blur-lg"
          style={{ backgroundColor: `${color}25` }}
        />
      )}
    </div>
  )
})
