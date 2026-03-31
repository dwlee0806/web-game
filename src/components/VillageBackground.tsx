'use client'

import { memo, useMemo } from 'react'
import { NpcSprite } from './NpcSprites'

const NPC_TYPES = ['knight', 'mage', 'archer', 'healer', 'merchant', 'blacksmith', 'child', 'cat']

interface NpcData {
  id: number; type: string; y: number; speed: number; delay: number; direction: 'left' | 'right'; size: number
}

// Time-based sky colors
function getSkyColors(): { top: string; mid: string; bottom: string; sunMoonY: number; isSun: boolean; stars: boolean } {
  const hour = new Date().getHours()
  const min = new Date().getMinutes()
  const t = hour + min / 60

  if (t >= 6 && t < 8) { // Dawn
    const p = (t - 6) / 2
    return { top: lerpColor('#0a1628', '#6AB4D6', p), mid: lerpColor('#1a2840', '#F5C098', p), bottom: lerpColor('#1a1a30', '#F0E6D3', p), sunMoonY: 40 - p * 30, isSun: true, stars: p < 0.3 }
  }
  if (t >= 8 && t < 17) { // Day
    return { top: '#6AB4D6', mid: '#9DD4ED', bottom: '#F0E6D3', sunMoonY: 8 + Math.sin((t - 8) / 9 * Math.PI) * -5, isSun: true, stars: false }
  }
  if (t >= 17 && t < 19.5) { // Sunset
    const p = (t - 17) / 2.5
    return { top: lerpColor('#6AB4D6', '#1a1030', p), mid: lerpColor('#9DD4ED', '#D4546A', p), bottom: lerpColor('#F0E6D3', '#FF8040', p), sunMoonY: 10 + p * 35, isSun: true, stars: p > 0.7 }
  }
  // Night (19.5 - 6)
  return { top: '#0a0e1a', mid: '#101828', bottom: '#1a1a30', sunMoonY: 15, isSun: false, stars: true }
}

function lerpColor(a: string, b: string, t: number): string {
  const parse = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]
  const [r1, g1, b1] = parse(a); const [r2, g2, b2] = parse(b)
  const r = Math.round(r1 + (r2 - r1) * t); const g = Math.round(g1 + (g2 - g1) * t); const bl = Math.round(b1 + (b2 - b1) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`
}

export default memo(function VillageBackground({ onNpcClick }: { onNpcClick?: () => void }) {
  const npcs = useMemo<NpcData[]>(() =>
    NPC_TYPES.map((type, i) => ({
      id: i, type,
      y: 72 + (i % 3) * 4, // Ground level only (72-80%)
      speed: 30 + i * 5 + (i * 7) % 10,
      delay: -(i * 4 + (i * 3) % 7),
      direction: i % 2 === 0 ? 'right' as const : 'left' as const,
      size: type === 'cat' ? 20 : type === 'child' ? 22 : 26,
    })),
  [])

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Dynamic sky based on real time */}
      {(() => {
        const sky = getSkyColors()
        return (
          <>
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${sky.top} 0%, ${sky.mid} 50%, ${sky.bottom} 100%)`, transition: 'background 60s linear' }} />

            {/* Sun or Moon */}
            <div className="absolute right-[15%]" style={{ top: `${sky.sunMoonY}%`, transition: 'top 60s linear' }}>
              {sky.isSun ? (
                <div className="w-20 h-20 rounded-full" style={{ background: 'radial-gradient(circle, #FFF9C4 0%, #FFD54F 30%, #FFB30015 60%, transparent 100%)', boxShadow: '0 0 60px #FFD54F40' }} />
              ) : (
                <div className="w-16 h-16 rounded-full relative" style={{ background: 'radial-gradient(circle, #E8E8F0 0%, #C0C0D0 40%, #A0A0B080 70%, transparent 100%)', boxShadow: '0 0 40px #C0C0D030' }}>
                  {/* Moon craters */}
                  <div className="absolute w-3 h-3 rounded-full bg-gray-400/20" style={{ top: '25%', left: '30%' }} />
                  <div className="absolute w-2 h-2 rounded-full bg-gray-400/15" style={{ top: '55%', left: '55%' }} />
                </div>
              )}
            </div>

            {/* Stars (night only) */}
            {sky.stars && Array.from({ length: 30 }, (_, i) => (
              <div key={`star-${i}`} className="absolute rounded-full bg-white" style={{
                width: 1 + (i % 3), height: 1 + (i % 3),
                top: `${(i * 7.3 + 3) % 45}%`, left: `${(i * 13.7 + 5) % 100}%`,
                opacity: 0.3 + (i % 4) * 0.15,
                animation: `star-twinkle ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${(i * 0.3) % 3}s`,
              }} />
            ))}
          </>
        )
      })()}

      {/* ═══ CLOUD LAYER 1: Far background (slow, small, faint) ═══ */}
      {[8, 35, 62, 85].map((left, i) => (
        <div key={`c1-${i}`} className="absolute animate-cloud" style={{ top: `${4 + i * 2}%`, left: `${left}%`, animationDuration: `${90 + i * 15}s`, animationDelay: `${i * -20}s`, opacity: 0.3 }}>
          <div className="relative">
            <div className="w-28 h-6 bg-white/50 rounded-full" />
            <div className="absolute -top-3 left-6 w-16 h-8 bg-white/40 rounded-full" />
          </div>
        </div>
      ))}

      {/* ═══ CLOUD LAYER 2: Mid-far (medium speed) ═══ */}
      {[15, 50, 78].map((left, i) => (
        <div key={`c2-${i}`} className="absolute animate-cloud" style={{ top: `${8 + i * 3}%`, left: `${left}%`, animationDuration: `${70 + i * 12}s`, animationDelay: `${i * -15}s`, opacity: 0.5 }}>
          <div className="relative">
            <div className="w-32 h-8 bg-white/60 rounded-full" />
            <div className="absolute -top-4 left-5 w-18 h-10 bg-white/50 rounded-full" />
            <div className="absolute -top-2 left-14 w-14 h-8 bg-white/45 rounded-full" />
          </div>
        </div>
      ))}

      {/* ═══ CLOUD LAYER 3: Mid-near (bigger, more defined) ═══ */}
      {[5, 40, 70].map((left, i) => (
        <div key={`c3-${i}`} className="absolute animate-cloud" style={{ top: `${12 + i * 4}%`, left: `${left}%`, animationDuration: `${55 + i * 10}s`, animationDelay: `${i * -12}s`, opacity: 0.65 }}>
          <div className="relative">
            <div className="w-36 h-9 bg-white/70 rounded-full" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }} />
            <div className="absolute -top-5 left-4 w-20 h-12 bg-white/65 rounded-full" />
            <div className="absolute -top-3 left-16 w-16 h-10 bg-white/55 rounded-full" />
            <div className="absolute -top-1 left-24 w-12 h-7 bg-white/45 rounded-full" />
          </div>
        </div>
      ))}

      {/* ═══ CLOUD LAYER 4: Foreground (largest, most detail) ═══ */}
      {[20, 60].map((left, i) => (
        <div key={`c4-${i}`} className="absolute animate-cloud" style={{ top: `${18 + i * 5}%`, left: `${left}%`, animationDuration: `${45 + i * 8}s`, animationDelay: `${i * -8}s`, opacity: 0.8 }}>
          <div className="relative">
            <div className="w-44 h-10 bg-white/80 rounded-full" style={{ boxShadow: '0 3px 12px rgba(0,0,0,0.04)' }} />
            <div className="absolute -top-6 left-6 w-24 h-14 bg-white/75 rounded-full" />
            <div className="absolute -top-4 left-18 w-20 h-12 bg-white/65 rounded-full" />
            <div className="absolute -top-2 left-28 w-16 h-9 bg-white/55 rounded-full" />
            <div className="absolute -top-7 left-14 w-14 h-10 bg-white/60 rounded-full" />
          </div>
        </div>
      ))}

      {/* Mountains */}
      <svg className="absolute bottom-[28%] left-0 w-full" viewBox="0 0 1400 200" preserveAspectRatio="none" style={{ height: '22%' }}>
        <polygon points="0,200 80,90 180,140 300,60 450,130 600,40 780,110 920,55 1080,95 1250,70 1400,200" fill="#8AAE82" opacity="0.45" />
        <polygon points="0,200 120,130 280,80 420,150 580,70 720,120 880,50 1040,110 1200,80 1400,200" fill="#7A9E72" opacity="0.35" />
      </svg>

      {/* Trees */}
      <svg className="absolute bottom-[22%] left-0 w-full" viewBox="0 0 1400 120" preserveAspectRatio="none" style={{ height: '14%' }}>
        {Array.from({ length: 16 }, (_, i) => {
          const x = 40 + i * 88; const h = 35 + (i * 7) % 20
          return (<g key={`tree${i}`}><rect x={x - 2} y={120 - h * 0.3} width="5" height={h * 0.4} fill="#6B5014" /><ellipse cx={x} cy={120 - h * 0.5} rx={h * 0.45} ry={h * 0.4} fill={i % 3 === 0 ? '#3D8B30' : '#4A9B3F'} /></g>)
        })}
      </svg>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '26%', background: 'linear-gradient(180deg, #7CB342 0%, #6B9B37 40%, #5A8A2E 100%)' }} />

      {/* Road */}
      <div className="absolute bottom-[8%] left-0 right-0" style={{ height: '5%', background: 'linear-gradient(180deg, #C9A96E 0%, #B8946A 50%, #A88558 100%)' }} />

      {/* Buildings LEFT */}
      <div className="absolute bottom-[13%] left-[4%]">
        <svg width="90" height="80" viewBox="0 0 90 80">
          <rect x="5" y="30" width="80" height="50" rx="2" fill="#8B5E3C" />
          <rect x="8" y="33" width="74" height="44" rx="1" fill="#A07050" />
          <polygon points="0,32 45,5 90,32" fill="#6B3020" />
          <polygon points="3,32 45,8 87,32" fill="#7B4030" />
          <rect x="33" y="50" width="24" height="30" rx="2" fill="#4A2810" />
          <circle cx="52" cy="65" r="1.5" fill="#DAA520" />
          <rect x="12" y="42" width="14" height="12" rx="1" fill="#40200A" />
          <rect x="62" y="8" width="8" height="22" fill="#7B4030" />
          <circle cx="66" cy="5" r="3" fill="#99999940"><animate attributeName="cy" values="5;-5;-15" dur="3s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.3;0.15;0" dur="3s" repeatCount="indefinite" /></circle>
          <rect x="68" y="45" width="10" height="10" rx="1" fill="#FF6B00" opacity="0.6"><animate attributeName="opacity" values="0.6;0.9;0.6" dur="1s" repeatCount="indefinite" /></rect>
        </svg>
      </div>

      {/* Buildings RIGHT */}
      <div className="absolute bottom-[13%] right-[3%]">
        <svg width="70" height="100" viewBox="0 0 70 100">
          <rect x="10" y="20" width="50" height="80" fill="#B0B8C0" />
          <rect x="13" y="23" width="44" height="74" fill="#C0C8D0" />
          {[10, 22, 34, 46, 58].map(x => (<rect key={x} x={x} y="15" width="8" height="8" fill="#B0B8C0" />))}
          <rect x="20" y="40" width="8" height="12" rx="4" fill="#2A3040" />
          <rect x="42" y="40" width="8" height="12" rx="4" fill="#2A3040" />
          <rect x="24" y="70" width="22" height="30" rx="11" fill="#4A3020" />
          <rect x="33" y="5" width="2" height="15" fill="#808080" />
          <polygon points="35,5 50,10 35,15" fill="#E04040"><animate attributeName="points" values="35,5 50,10 35,15;35,5 48,11 35,15;35,5 50,10 35,15" dur="2s" repeatCount="indefinite" /></polygon>
        </svg>
      </div>

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

      {/* Walking NPCs — fixed to ground level */}
      {npcs.map(npc => (
        <div
          key={npc.id}
          className={npc.direction === 'right' ? 'animate-npc-walk-right' : 'animate-npc-walk-left'}
          style={{ position: 'absolute', top: `${npc.y}%`, animationDuration: `${npc.speed}s`, animationDelay: `${npc.delay}s`, zIndex: Math.floor(npc.y) }}
        >
          <div className="animate-npc-bounce pointer-events-auto cursor-pointer" onClick={onNpcClick} style={{ animationDuration: '0.5s', transform: npc.direction === 'left' ? 'scaleX(-1)' : undefined }}>
            <NpcSprite type={npc.type} size={npc.size} />
          </div>
        </div>
      ))}
    </div>
  )
})
