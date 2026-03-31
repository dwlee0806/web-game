'use client'

import { memo, useMemo } from 'react'

interface SwordEffectsProps {
  level: number
  color: string
  result: string | null
  weaponType?: string
}

export default memo(function SwordEffects({ level, color, result, weaponType = 'sword' }: SwordEffectsProps) {
  const isMelee = weaponType === 'sword' || weaponType === 'axe'
  const isBow = weaponType === 'bow'
  const isStaff = weaponType === 'staff'

  // Energy intensity scales with level
  const intensity = Math.min(Math.floor(level / 2), 8) // 0-8 based on tier

  // ═══ MELEE: Lightning sparks (검/도끼) ═══
  const sparks = useMemo(() => {
    if (!isMelee || level < 3) return []
    const count = Math.min(intensity, 6)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 35 + Math.random() * 50,
      y: 20 + Math.random() * 60,
      size: 1 + Math.random() * 1.5,
      duration: 0.3 + Math.random() * 0.5,
      delay: Math.random() * 2,
    }))
  }, [isMelee, level, intensity])

  // ═══ BOW: Wind swirls (활) ═══
  const windLines = useMemo(() => {
    if (!isBow || level < 3) return []
    const count = Math.min(intensity + 2, 8)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      startX: 20 + Math.random() * 80,
      y: 25 + Math.random() * 55,
      length: 15 + Math.random() * 25,
      duration: 1.5 + Math.random() * 1.5,
      delay: Math.random() * 2,
      opacity: 0.15 + Math.random() * 0.2,
    }))
  }, [isBow, level, intensity])

  // ═══ STAFF: Aura particles (지팡이) ═══
  const auraOrbs = useMemo(() => {
    if (!isStaff || level < 3) return []
    const count = Math.min(intensity + 3, 10)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      angle: (i / count) * 360,
      radius: 30 + Math.random() * 20,
      size: 2 + Math.random() * 2,
      speed: 8 + Math.random() * 6,
      delay: i * 0.3,
    }))
  }, [isStaff, level, intensity])

  if (level < 3 && !result) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* ═══ LIGHTNING SPARKS (melee) ═══ */}
      {isMelee && sparks.map(s => (
        <div key={`spark-${s.id}`} className="absolute animate-lightning-spark" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`,
        }}>
          {/* Spark body: small zigzag line */}
          <svg width="12" height="16" viewBox="0 0 12 16" style={{ filter: `drop-shadow(0 0 3px ${color})` }}>
            <polyline points="6,0 3,5 8,7 4,11 9,13 5,16" fill="none" stroke={color} strokeWidth={s.size} strokeLinecap="round" opacity="0.8" />
          </svg>
        </div>
      ))}

      {/* ═══ WIND SWIRLS (bow) ═══ */}
      {isBow && windLines.map(w => (
        <div key={`wind-${w.id}`} className="absolute animate-wind-sweep" style={{
          left: `${w.startX}%`, top: `${w.y}%`,
          animationDuration: `${w.duration}s`, animationDelay: `${w.delay}s`,
        }}>
          <svg width={w.length + 10} height="8" viewBox={`0 0 ${w.length + 10} 8`}>
            <path d={`M0,4 Q${w.length * 0.3},1 ${w.length * 0.6},4 Q${w.length * 0.8},7 ${w.length},4`}
              fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity={w.opacity} />
          </svg>
        </div>
      ))}

      {/* ═══ AURA ORBS (staff) ═══ */}
      {isStaff && auraOrbs.map(o => (
        <div key={`aura-${o.id}`} className="absolute animate-energy-orbit" style={{
          width: o.size * 2, height: o.size * 2,
          backgroundColor: color,
          borderRadius: '50%',
          boxShadow: `0 0 ${o.size * 4}px ${color}80`,
          top: '40%', left: '50%',
          animationDuration: `${o.speed}s`, animationDelay: `${o.delay}s`,
          '--orbit-r': `${o.radius}px`,
        } as React.CSSProperties} />
      ))}

      {/* Tier transition flash */}
      {result === 'success' && level > 0 && level % 2 === 1 && (
        <div className="absolute inset-0 animate-tier-flash" style={{ background: `radial-gradient(circle, ${color}40 0%, transparent 70%)` }} />
      )}
    </div>
  )
})
