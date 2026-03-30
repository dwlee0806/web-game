'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  angle: number
  speed: number
  life: number
}

type ParticleType = 'success' | 'destroy' | null

export default function Particles({ type }: { type: ParticleType }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!type) {
      setParticles([])
      return
    }

    const count = type === 'success' ? 16 : 12
    const colors =
      type === 'success'
        ? ['#FFD700', '#FBBF24', '#F59E0B', '#FDE68A', '#FFFFFF']
        : ['#EF4444', '#DC2626', '#F87171', '#991B1B', '#FCA5A5']

    const spawned: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 40 + (Math.random() - 0.5) * 10,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
      speed: 40 + Math.random() * 80,
      life: 600 + Math.random() * 600,
    }))

    setParticles(spawned)
    const t = setTimeout(() => setParticles([]), 1400)
    return () => clearTimeout(t)
  }, [type])

  if (particles.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map(p => {
        const rad = (p.angle * Math.PI) / 180
        const tx = Math.cos(rad) * p.speed
        const ty = Math.sin(rad) * p.speed
        return (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              animation: `particle-fly ${p.life}ms ease-out forwards`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
            } as React.CSSProperties}
          />
        )
      })}
    </div>
  )
}
