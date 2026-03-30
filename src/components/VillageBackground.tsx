'use client'

import { memo, useMemo } from 'react'
import { NpcSprite } from './NpcSprites'

const NPC_TYPES = ['knight', 'mage', 'archer', 'healer', 'merchant', 'blacksmith', 'child', 'cat']

interface NpcData {
  id: number
  type: string
  y: number
  speed: number
  delay: number
  direction: 'left' | 'right'
  size: number
}

export default memo(function VillageBackground() {
  const npcs = useMemo<NpcData[]>(() =>
    NPC_TYPES.map((type, i) => ({
      id: i,
      type,
      y: 58 + (i % 4) * 8 + Math.random() * 4,
      speed: 28 + i * 5 + Math.random() * 15,
      delay: -(i * 4 + Math.random() * 10),
      direction: i % 2 === 0 ? 'right' as const : 'left' as const,
      size: type === 'cat' ? 22 : type === 'child' ? 24 : 28,
    })),
  [])

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Sky */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #7EC8E3 0%, #B8E4FF 35%, #F5E6C8 70%, #D4B896 100%)' }} />

      {/* Sun */}
      <div className="absolute top-10 right-[14%] w-20 h-20 rounded-full" style={{ background: 'radial-gradient(circle, #FFF9C4 0%, #FFD54F 40%, #FFB30020 70%, transparent 100%)', boxShadow: '0 0 60px #FFD54F60' }} />

      {/* Clouds */}
      {[10, 30, 55, 72, 88].map((left, i) => (
        <div key={`c${i}`} className="absolute animate-cloud" style={{ top: `${5 + i * 3}%`, left: `${left}%`, animationDuration: `${70 + i * 12}s`, animationDelay: `${i * -10}s` }}>
          <div className="relative opacity-70">
            <div className="w-20 h-7 bg-white rounded-full" />
            <div className="absolute -top-3 left-4 w-12 h-9 bg-white rounded-full" />
            <div className="absolute -top-1 left-9 w-10 h-7 bg-white rounded-full" />
          </div>
        </div>
      ))}

      {/* Distant mountains */}
      <svg className="absolute bottom-[28%] left-0 w-full" viewBox="0 0 1400 200" preserveAspectRatio="none" style={{ height: '22%' }}>
        <polygon points="0,200 80,90 180,140 300,60 450,130 600,40 780,110 920,55 1080,95 1250,70 1400,200" fill="#8AAE82" opacity="0.45" />
        <polygon points="0,200 120,130 280,80 420,150 580,70 720,120 880,50 1040,110 1200,80 1400,200" fill="#7A9E72" opacity="0.35" />
      </svg>

      {/* Forest treeline */}
      <svg className="absolute bottom-[22%] left-0 w-full" viewBox="0 0 1400 120" preserveAspectRatio="none" style={{ height: '14%' }}>
        {Array.from({ length: 16 }, (_, i) => {
          const x = 40 + i * 88
          const h = 35 + (i * 7) % 20
          return (
            <g key={`tree${i}`}>
              <rect x={x - 2} y={120 - h * 0.3} width="5" height={h * 0.4} fill="#6B5014" />
              <ellipse cx={x} cy={120 - h * 0.5} rx={h * 0.45} ry={h * 0.4} fill={i % 3 === 0 ? '#3D8B30' : i % 3 === 1 ? '#4A9B3F' : '#358028'} />
              <ellipse cx={x - h * 0.2} cy={120 - h * 0.35} rx={h * 0.3} ry={h * 0.25} fill={i % 2 === 0 ? '#4A9B3F' : '#3D8B30'} />
            </g>
          )
        })}
      </svg>

      {/* Grass ground */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '26%', background: 'linear-gradient(180deg, #7CB342 0%, #6B9B37 40%, #5A8A2E 100%)' }} />

      {/* Dirt road */}
      <div className="absolute bottom-[8%] left-0 right-0" style={{ height: '5%', background: 'linear-gradient(180deg, #C9A96E 0%, #B8946A 50%, #A88558 100%)', borderTop: '1.5px solid #D0B880', borderBottom: '1.5px solid #A07848' }} />
      {/* Road pebbles */}
      {[8, 18, 30, 42, 55, 68, 78, 90].map(x => (
        <div key={`p${x}`} className="absolute rounded-full" style={{ bottom: `${9 + Math.random() * 2}%`, left: `${x}%`, width: 3 + Math.random() * 3, height: 2 + Math.random() * 2, backgroundColor: '#B8A070', opacity: 0.4 }} />
      ))}

      {/* === BUILDINGS LEFT === */}
      {/* Blacksmith */}
      <div className="absolute bottom-[13%] left-[4%]">
        <svg width="90" height="80" viewBox="0 0 90 80">
          {/* Walls */}
          <rect x="5" y="30" width="80" height="50" rx="2" fill="#8B5E3C" />
          <rect x="8" y="33" width="74" height="44" rx="1" fill="#A07050" />
          {/* Roof */}
          <polygon points="0,32 45,5 90,32" fill="#6B3020" />
          <polygon points="3,32 45,8 87,32" fill="#7B4030" />
          {/* Door */}
          <rect x="33" y="50" width="24" height="30" rx="2" fill="#4A2810" />
          <circle cx="52" cy="65" r="1.5" fill="#DAA520" />
          {/* Window */}
          <rect x="12" y="42" width="14" height="12" rx="1" fill="#40200A" />
          <line x1="19" y1="42" x2="19" y2="54" stroke="#6B4020" strokeWidth="1" />
          <line x1="12" y1="48" x2="26" y2="48" stroke="#6B4020" strokeWidth="1" />
          {/* Chimney smoke */}
          <rect x="62" y="8" width="8" height="22" fill="#7B4030" />
          <circle cx="66" cy="5" r="3" fill="#99999940">
            <animate attributeName="cy" values="5;-5;-15" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.15;0" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* Forge fire glow */}
          <rect x="68" y="45" width="10" height="10" rx="1" fill="#FF6B00" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1s" repeatCount="indefinite" />
          </rect>
          {/* Anvil */}
          <rect x="15" y="72" width="10" height="4" fill="#606060" />
          <rect x="13" y="68" width="14" height="4" rx="1" fill="#808080" />
          {/* Sign */}
          <text x="45" y="25" textAnchor="middle" fontSize="10" fill="#FFD700" fontWeight="bold">⚒</text>
        </svg>
      </div>

      {/* Potion shop */}
      <div className="absolute bottom-[13%] left-[14%]">
        <svg width="65" height="65" viewBox="0 0 65 65">
          <rect x="5" y="25" width="55" height="40" rx="2" fill="#E8D5B5" />
          <polygon points="0,27 32,5 65,27" fill="#B05030" />
          <polygon points="3,27 32,8 62,27" fill="#C06040" />
          <rect x="22" y="42" width="20" height="23" rx="2" fill="#5A3A20" />
          <circle cx="38" cy="53" r="1.2" fill="#DAA520" />
          <rect x="8" y="32" width="10" height="8" rx="1" fill="#40200A" />
          <text x="32" y="20" textAnchor="middle" fontSize="8" fill="#FFF">🧪</text>
        </svg>
      </div>

      {/* === BUILDINGS RIGHT === */}
      {/* Castle */}
      <div className="absolute bottom-[13%] right-[3%]">
        <svg width="70" height="100" viewBox="0 0 70 100">
          {/* Main tower */}
          <rect x="10" y="20" width="50" height="80" fill="#B0B8C0" />
          <rect x="13" y="23" width="44" height="74" fill="#C0C8D0" />
          {/* Battlements */}
          {[10, 22, 34, 46, 58].map(x => (
            <rect key={x} x={x} y="15" width="8" height="8" fill="#B0B8C0" />
          ))}
          {/* Windows */}
          <rect x="20" y="40" width="8" height="12" rx="4" fill="#2A3040" />
          <rect x="42" y="40" width="8" height="12" rx="4" fill="#2A3040" />
          <rect x="31" y="30" width="8" height="10" rx="4" fill="#2A3040" />
          {/* Door */}
          <rect x="24" y="70" width="22" height="30" rx="11" fill="#4A3020" />
          {/* Flag */}
          <rect x="33" y="5" width="2" height="15" fill="#808080" />
          <polygon points="35,5 50,10 35,15" fill="#E04040">
            <animate attributeName="points" values="35,5 50,10 35,15;35,5 48,11 35,15;35,5 50,10 35,15" dur="2s" repeatCount="indefinite" />
          </polygon>
        </svg>
      </div>

      {/* Inn */}
      <div className="absolute bottom-[13%] right-[14%]">
        <svg width="70" height="65" viewBox="0 0 70 65">
          <rect x="5" y="25" width="60" height="40" rx="2" fill="#DEB887" />
          <rect x="8" y="28" width="54" height="34" fill="#E8C8A0" />
          <polygon points="0,27 35,5 70,27" fill="#8B6914" />
          <polygon points="3,27 35,8 67,27" fill="#9B7924" />
          <rect x="26" y="42" width="18" height="23" rx="2" fill="#4A2810" />
          <rect x="8" y="33" width="12" height="10" rx="1" fill="#40200A" opacity="0.8" />
          <rect x="50" y="33" width="12" height="10" rx="1" fill="#40200A" opacity="0.8" />
          {/* Lamp glow */}
          <circle cx="35" cy="38" r="4" fill="#FFD700" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="35" y="20" textAnchor="middle" fontSize="8" fill="#FFF">🍺</text>
        </svg>
      </div>

      {/* Fence segments */}
      <svg className="absolute bottom-[12%] left-[25%]" width="120" height="20" viewBox="0 0 120 20">
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i}>
            <rect x={i * 15 + 2} y="4" width="3" height="16" rx="0.5" fill="#A07030" />
            <rect x={i * 15} y="8" width="14" height="2" fill="#8B6020" />
            <rect x={i * 15} y="14" width="14" height="2" fill="#8B6020" />
          </g>
        ))}
      </svg>

      {/* Flowers */}
      {[6, 12, 22, 35, 65, 75, 85, 92].map((x, i) => (
        <div key={`f${i}`} className="absolute" style={{ bottom: `${12 + (i % 3)}%`, left: `${x}%` }}>
          <svg width="8" height="10" viewBox="0 0 8 10">
            <line x1="4" y1="10" x2="4" y2="4" stroke="#2E7D32" strokeWidth="1" />
            <circle cx="4" cy="3" r="2.5" fill={['#FF6B6B', '#FFD93D', '#FF8ED4', '#9C27B0', '#FF6B6B', '#FFD93D', '#FF8ED4', '#4CAF50'][i]} />
            <circle cx="4" cy="3" r="1" fill="#FFF9C4" />
          </svg>
        </div>
      ))}

      {/* Walking SVG NPCs */}
      {npcs.map(npc => (
        <div
          key={npc.id}
          className={npc.direction === 'right' ? 'animate-npc-walk-right' : 'animate-npc-walk-left'}
          style={{
            position: 'absolute',
            top: `${npc.y}%`,
            animationDuration: `${npc.speed}s`,
            animationDelay: `${npc.delay}s`,
            zIndex: Math.floor(npc.y),
          }}
        >
          <div className="animate-npc-bounce" style={{ animationDuration: '0.5s', transform: npc.direction === 'left' ? 'scaleX(-1)' : undefined }}>
            <NpcSprite type={npc.type} size={npc.size} />
          </div>
        </div>
      ))}
    </div>
  )
})
