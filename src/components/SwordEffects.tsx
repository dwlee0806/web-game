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
  const intensity = Math.min(Math.floor(level / 2), 8)

  // Lightning bolt paths (melee) — each is a unique zigzag SVG path
  const bolts = useMemo(() => {
    if (!isMelee || level < 3) return []
    const count = Math.min(1 + Math.floor(intensity / 2), 4)
    return Array.from({ length: count }, (_, i) => {
      // Generate random zigzag path
      const pts: string[] = []
      const startX = 10 + Math.random() * 20
      let x = startX, y = 0
      for (let j = 0; j < 5; j++) {
        pts.push(`${x.toFixed(0)},${y.toFixed(0)}`)
        x += (Math.random() - 0.5) * 18
        y += 6 + Math.random() * 4
      }
      return {
        id: i,
        path: pts.join(' '),
        left: 25 + i * 15 + Math.random() * 10,
        top: 15 + Math.random() * 40,
        duration: 0.15 + Math.random() * 0.2,
        delay: Math.random() * 1.5,
        repeatDelay: 1 + Math.random() * 2,
        thickness: 1.5 + intensity * 0.3,
      }
    })
  }, [isMelee, level, intensity])

  // Wind streams (bow) — curved flowing lines
  const winds = useMemo(() => {
    if (!isBow || level < 3) return []
    const count = Math.min(2 + Math.floor(intensity / 2), 5)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: 20 + i * 12 + Math.random() * 8,
      delay: i * 0.4,
      duration: 1.2 + Math.random() * 0.8,
      width: 30 + Math.random() * 20,
      curveY: 3 + Math.random() * 6,
    }))
  }, [isBow, level, intensity])

  // Aura waves (staff) — expanding concentric rings
  const auras = useMemo(() => {
    if (!isStaff || level < 3) return []
    const count = Math.min(2 + Math.floor(intensity / 2), 5)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: i * 0.6,
      maxR: 25 + intensity * 4,
      duration: 2 + Math.random(),
    }))
  }, [isStaff, level, intensity])

  if (level < 3 && !result) return null

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Center offset container — effects appear around the weapon */}
      <div className="relative" style={{ width: 80, height: 140 }}>

        {/* ═══ LIGHTNING (검/도끼) ═══ */}
        {isMelee && bolts.map(b => (
          <div key={`bolt-${b.id}`} className="absolute" style={{ left: `${b.left}%`, top: `${b.top}%` }}>
            <svg width="40" height="35" viewBox="0 0 40 35" className="animate-lightning-bolt" style={{
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              '--bolt-repeat': `${b.repeatDelay}s`,
              filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px ${color}60)`,
            } as React.CSSProperties}>
              {/* Main bolt */}
              <polyline points={b.path} fill="none" stroke={color} strokeWidth={b.thickness} strokeLinecap="round" strokeLinejoin="round" />
              {/* Core (white hot center) */}
              <polyline points={b.path} fill="none" stroke="#FFF" strokeWidth={b.thickness * 0.4} strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
              {/* Branch */}
              {intensity > 3 && (
                <polyline points={`${b.path.split(' ')[2]} ${Number(b.path.split(' ')[2]?.split(',')[0]) + 8},${Number(b.path.split(' ')[2]?.split(',')[1]) + 6}`}
                  fill="none" stroke={color} strokeWidth={b.thickness * 0.6} opacity="0.5" />
              )}
            </svg>
          </div>
        ))}

        {/* ═══ WIND STREAMS (활) ═══ */}
        {isBow && winds.map(w => (
          <div key={`wind-${w.id}`} className="absolute animate-wind-flow" style={{
            top: `${w.top}%`, left: '10%', width: `${w.width}%`,
            animationDuration: `${w.duration}s`, animationDelay: `${w.delay}s`,
          }}>
            <svg width="100%" height="16" viewBox="0 0 60 16" preserveAspectRatio="none">
              {/* Main wind curve */}
              <path d={`M0,8 C15,${8 - w.curveY} 30,${8 + w.curveY} 45,8 C50,${8 - w.curveY * 0.5} 55,8 60,8`}
                fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              {/* Inner bright line */}
              <path d={`M5,8 C18,${8 - w.curveY * 0.7} 32,${8 + w.curveY * 0.7} 48,8`}
                fill="none" stroke="#FFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
              {/* Wind particles */}
              <circle cx="20" cy={8 - w.curveY * 0.3} r="1" fill={color} opacity="0.4">
                <animate attributeName="cx" values="20;50;60" dur={`${w.duration * 0.7}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.6;0" dur={`${w.duration * 0.7}s`} repeatCount="indefinite" />
              </circle>
              <circle cx="10" cy={8 + w.curveY * 0.2} r="0.8" fill="#FFF" opacity="0.2">
                <animate attributeName="cx" values="10;40;55" dur={`${w.duration * 0.8}s`} repeatCount="indefinite" begin={`${w.delay * 0.3}s`} />
              </circle>
            </svg>
          </div>
        ))}

        {/* ═══ AURA RINGS (지팡이) ═══ */}
        {isStaff && auras.map(a => (
          <div key={`aura-${a.id}`} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 animate-aura-expand" style={{
            width: a.maxR * 2, height: a.maxR * 2,
            animationDuration: `${a.duration}s`, animationDelay: `${a.delay}s`,
          }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${a.maxR * 2} ${a.maxR * 2}`}>
              <circle cx={a.maxR} cy={a.maxR} r={a.maxR * 0.8} fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
              <circle cx={a.maxR} cy={a.maxR} r={a.maxR * 0.5} fill="none" stroke={color} strokeWidth="1" opacity="0.25" />
              {/* Sparkle dots on ring */}
              {[0, 90, 180, 270].map(deg => {
                const rad = (deg * Math.PI) / 180
                const r = a.maxR * 0.8
                return (
                  <circle key={deg} cx={a.maxR + Math.cos(rad) * r} cy={a.maxR + Math.sin(rad) * r} r="1.5" fill="#FFF" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" begin={`${deg / 360}s`} />
                  </circle>
                )
              })}
            </svg>
          </div>
        ))}

        {/* Tier flash */}
        {result === 'success' && level > 0 && level % 2 === 1 && (
          <div className="absolute inset-0 animate-tier-flash rounded-full" style={{ background: `radial-gradient(circle, ${color}50 0%, transparent 70%)` }} />
        )}
      </div>
    </div>
  )
})
