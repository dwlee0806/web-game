'use client'

import { memo, useMemo } from 'react'

interface SwordEffectsProps {
  level: number
  color: string
  result: string | null
}

// Procedural energy particles around the sword
export default memo(function SwordEffects({ level, color, result }: SwordEffectsProps) {
  // Energy orbs that orbit/float around the sword based on level
  const energyOrbs = useMemo(() => {
    if (level < 3) return []
    const count = Math.min(Math.floor(level / 3), 8)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      angle: (i / count) * 360,
      radius: 35 + (i % 3) * 12,
      size: 1.5 + Math.random() * 2,
      speed: 15 + Math.random() * 10,
      delay: i * 0.4,
    }))
  }, [level])

  // Ascending sparks for high levels
  const sparks = useMemo(() => {
    if (level < 10) return []
    const count = Math.min(Math.floor((level - 10) / 2), 6)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * 60,
      delay: i * 0.8 + Math.random() * 2,
      duration: 2 + Math.random() * 2,
      size: 1 + Math.random() * 1.5,
    }))
  }, [level])

  if (level === 0 && !result) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Energy orbs */}
      {energyOrbs.map(orb => (
        <div
          key={orb.id}
          className="absolute rounded-full animate-energy-orbit"
          style={{
            width: orb.size * 2,
            height: orb.size * 2,
            backgroundColor: color,
            boxShadow: `0 0 ${orb.size * 4}px ${color}80`,
            top: '45%',
            left: '50%',
            animationDuration: `${orb.speed}s`,
            animationDelay: `${orb.delay}s`,
            '--orbit-r': `${orb.radius}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Ascending sparks */}
      {sparks.map(spark => (
        <div
          key={`s${spark.id}`}
          className="absolute animate-spark-rise"
          style={{
            width: spark.size * 2,
            height: spark.size * 2,
            backgroundColor: color,
            borderRadius: '50%',
            boxShadow: `0 0 ${spark.size * 3}px ${color}`,
            left: `${spark.x}%`,
            bottom: '20%',
            animationDuration: `${spark.duration}s`,
            animationDelay: `${spark.delay}s`,
          }}
        />
      ))}

      {/* Tier transition flash */}
      {result === 'success' && level > 0 && level % 5 === 0 && (
        <div className="absolute inset-0 animate-tier-flash" style={{ background: `radial-gradient(circle, ${color}40 0%, transparent 70%)` }} />
      )}
    </div>
  )
})
