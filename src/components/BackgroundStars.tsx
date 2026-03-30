'use client'

import { memo, useMemo } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

export default memo(function BackgroundStars({ level, color }: { level: number; color: string }) {
  const count = Math.min(5 + level * 2, 40)

  const stars = useMemo(() => {
    const result: Star[] = []
    for (let i = 0; i < count; i++) {
      result.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * (level > 15 ? 4 : 2),
        opacity: 0.1 + Math.random() * 0.4,
        duration: 3 + Math.random() * 6,
        delay: Math.random() * 5,
      })
    }
    return result
  }, [count, level])

  if (level === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full animate-star-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            backgroundColor: color,
            opacity: s.opacity,
            boxShadow: level >= 20 ? `0 0 ${s.size * 3}px ${color}40` : undefined,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
})
