'use client'

import { memo, useMemo } from 'react'

interface Npc {
  id: number
  emoji: string
  y: number
  speed: number
  delay: number
  direction: 'left' | 'right'
  size: number
}

const NPC_POOL = ['🧙', '⚔️', '🛡️', '🏹', '🧝', '🧚', '🐕', '🐈', '🐓', '👨‍🌾', '🧑‍🍳', '👸']

export default memo(function VillageBackground() {
  const npcs = useMemo<Npc[]>(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: NPC_POOL[i % NPC_POOL.length],
      y: 55 + Math.random() * 35,
      speed: 30 + Math.random() * 40,
      delay: Math.random() * -30,
      direction: i % 2 === 0 ? 'right' : 'left',
      size: 18 + Math.random() * 8,
    }))
  }, [])

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #87CEEB 0%, #B8E6FF 40%, #F0E6D3 75%, #D4B896 100%)' }} />

      {/* Sun */}
      <div className="absolute top-12 right-[15%] w-16 h-16 rounded-full" style={{ background: 'radial-gradient(circle, #FFF9C4 0%, #FFD54F 50%, transparent 70%)', boxShadow: '0 0 40px #FFD54F80' }} />

      {/* Clouds */}
      {[12, 28, 45, 65, 80].map((left, i) => (
        <div key={`c${i}`} className="absolute animate-cloud" style={{ top: `${6 + i * 4}%`, left: `${left}%`, animationDuration: `${60 + i * 15}s`, animationDelay: `${i * -8}s` }}>
          <div className="relative">
            <div className="w-16 h-6 bg-white/60 rounded-full" />
            <div className="absolute -top-2 left-3 w-10 h-8 bg-white/50 rounded-full" />
            <div className="absolute -top-1 left-8 w-8 h-6 bg-white/40 rounded-full" />
          </div>
        </div>
      ))}

      {/* Mountains (far background) */}
      <svg className="absolute bottom-[30%] left-0 w-full" viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ height: '25%' }}>
        <polygon points="0,200 100,80 200,150 350,50 500,120 650,30 800,100 950,60 1100,90 1200,200" fill="#8BA889" opacity="0.5" />
        <polygon points="0,200 150,120 300,80 450,140 600,60 750,110 900,50 1050,130 1200,200" fill="#7A9B78" opacity="0.4" />
      </svg>

      {/* Trees */}
      <svg className="absolute bottom-[22%] left-0 w-full" viewBox="0 0 1200 100" preserveAspectRatio="none" style={{ height: '12%' }}>
        {[50, 120, 200, 350, 450, 600, 750, 850, 950, 1050, 1150].map((x, i) => (
          <g key={`t${i}`}>
            <rect x={x - 3} y="60" width="6" height="40" fill="#8B6914" />
            <circle cx={x} cy="50" r={15 + (i % 3) * 5} fill={i % 2 === 0 ? '#4A8B3F' : '#3D7A35'} />
            <circle cx={x - 8} cy="55" r={10 + (i % 2) * 4} fill={i % 2 === 0 ? '#5A9B4F' : '#4D8A45'} />
          </g>
        ))}
      </svg>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '28%', background: 'linear-gradient(180deg, #8BC34A 0%, #7CB342 30%, #6B9B37 100%)' }} />

      {/* Path / road */}
      <div className="absolute bottom-[8%] left-0 right-0 h-[6%]" style={{ background: '#C9A96E', borderTop: '2px solid #B8956A', borderBottom: '2px solid #B8956A' }} />

      {/* Buildings - LEFT side */}
      <div className="absolute bottom-[14%] left-[5%]">
        {/* Blacksmith shop */}
        <div className="relative" style={{ width: 80, height: 70 }}>
          <div className="absolute bottom-0 w-full h-[50px] bg-[#A0522D] rounded-t-md" />
          <div className="absolute bottom-[50px] w-full" style={{ borderLeft: '40px solid transparent', borderRight: '40px solid transparent', borderBottom: '30px solid #8B4513' }} />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-8 bg-[#4A2810] rounded-t-md" />
          <div className="absolute bottom-[30px] right-2 w-4 h-4 bg-[#FFA500] rounded-sm opacity-80">
            <div className="w-full h-full animate-pulse bg-[#FFD700] rounded-sm" />
          </div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg">🔨</div>
        </div>
      </div>

      <div className="absolute bottom-[14%] left-[16%]">
        {/* Item shop */}
        <div className="relative" style={{ width: 60, height: 55 }}>
          <div className="absolute bottom-0 w-full h-[40px] bg-[#DEB887]" />
          <div className="absolute bottom-[40px] w-full" style={{ borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderBottom: '20px solid #CD853F' }} />
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-6 bg-[#654321] rounded-t-sm" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-sm">🏪</div>
        </div>
      </div>

      {/* Buildings - RIGHT side */}
      <div className="absolute bottom-[14%] right-[5%]">
        {/* Castle tower */}
        <div className="relative" style={{ width: 50, height: 85 }}>
          <div className="absolute bottom-0 w-full h-[65px] bg-[#B0B0B0]" />
          <div className="absolute bottom-[65px] w-full flex justify-between px-1">
            <div className="w-2 h-3 bg-[#999]" />
            <div className="w-2 h-3 bg-[#999]" />
            <div className="w-2 h-3 bg-[#999]" />
          </div>
          <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 text-sm">🏰</div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-6 bg-[#654321] rounded-t-sm" />
        </div>
      </div>

      <div className="absolute bottom-[14%] right-[16%]">
        {/* Inn */}
        <div className="relative" style={{ width: 65, height: 60 }}>
          <div className="absolute bottom-0 w-full h-[45px] bg-[#D2B48C]" />
          <div className="absolute bottom-[45px] w-full" style={{ borderLeft: '32px solid transparent', borderRight: '33px solid transparent', borderBottom: '22px solid #C19A6B' }} />
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-7 bg-[#5A3A20] rounded-t-sm" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-sm">🍺</div>
        </div>
      </div>

      {/* Walking NPCs */}
      {npcs.map(npc => (
        <div
          key={npc.id}
          className={npc.direction === 'right' ? 'animate-npc-walk-right' : 'animate-npc-walk-left'}
          style={{
            position: 'absolute',
            top: `${npc.y}%`,
            fontSize: npc.size,
            animationDuration: `${npc.speed}s`,
            animationDelay: `${npc.delay}s`,
            transform: npc.direction === 'left' ? 'scaleX(-1)' : undefined,
            zIndex: Math.floor(npc.y),
          }}
        >
          <span className="animate-npc-bounce inline-block" style={{ animationDuration: '0.6s' }}>{npc.emoji}</span>
        </div>
      ))}

      {/* Fence */}
      <div className="absolute bottom-[14%] left-[28%] flex gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="w-1 h-5 bg-[#8B6914] relative">
            <div className="absolute -top-1 -left-1 w-3 h-1 bg-[#A0781E]" />
          </div>
        ))}
      </div>
    </div>
  )
})
