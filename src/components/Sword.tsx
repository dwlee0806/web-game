'use client'

import { memo } from 'react'

interface SwordProps {
  level: number
  color: string
  weaponType?: string
  specialSkin?: string | null
}

const SKINS: Record<string, { blade: string; accent: string; gem: string }> = {
  rainbow: { blade: '#FF6B6B', accent: '#FFD93D', gem: '#6BCB77' },
  void: { blade: '#16132B', accent: '#e94560', gem: '#0f3460' },
  crystal: { blade: '#B8E4FF', accent: '#FFFFFF', gem: '#00BFFF' },
  flame: { blade: '#FF4500', accent: '#FFD700', gem: '#FF6347' },
  shadow: { blade: '#1C1C2E', accent: '#8B5CF6', gem: '#4C1D95' },
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default memo(function Sword({ level, color, weaponType = 'sword', specialSkin = null }: SwordProps) {
  const skin = specialSkin ? SKINS[specialSkin] : null
  const bc = skin?.blade ?? (level > 0 ? color : '#9EAFC0')
  const ac = skin?.accent ?? color
  const gc = skin?.gem ?? (level > 0 ? color : '#DAA520')
  const glow = Math.min(level * 3, 55)
  const isHigh = level >= 15
  const isLeg = level >= 20
  const isMax = level >= 25
  const isGen = level >= 30

  // Blade geometry evolves
  const bw = level < 5 ? 12 : level < 10 ? 14 : level < 20 ? 16 : 18
  const bl = level < 10 ? 120 : level < 20 ? 130 : 140

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 220 }}>
      {/* Ambient aura rings */}
      {level >= 10 && (
        <div className="absolute rounded-full animate-aura-spin" style={{ width: 160 + level, height: 160 + level, border: `1px solid ${bc}18`, boxShadow: `0 0 ${level * 0.5}px ${bc}10` }} />
      )}
      {isLeg && (
        <div className="absolute rounded-full animate-aura-spin-reverse" style={{ width: 140 + level, height: 140 + level, border: `1px dashed ${bc}20` }} />
      )}

      {/* Floating gems orbit */}
      {isMax && [0, 120, 240].map(deg => (
        <div key={deg} className="absolute w-1.5 h-1.5 rounded-full animate-orbit" style={{ backgroundColor: gc, boxShadow: `0 0 6px ${gc}`, animationDelay: `${deg / 120}s`, top: '45%', left: '50%', transformOrigin: '0 -50px' }} />
      ))}

      {/* Ground glow */}
      {level > 0 && <div className="absolute bottom-1 w-16 h-3 rounded-full blur-lg" style={{ backgroundColor: `${bc}25` }} />}

      <svg
        width="100"
        height="210"
        viewBox="0 0 100 210"
        className="relative z-10"
        style={{ filter: level > 0 ? `drop-shadow(0 0 ${glow}px ${bc}) drop-shadow(0 0 ${glow * 0.4}px ${bc}80)` : 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))' }}
      >
        <defs>
          {/* Metallic blade gradient */}
          <linearGradient id="bld" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={bc} stopOpacity="0.4" />
            <stop offset="20%" stopColor="#E8ECF0" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="55%" stopColor="#F0F4F8" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#D0D8E0" stopOpacity="0.8" />
            <stop offset="100%" stopColor={bc} stopOpacity="0.4" />
          </linearGradient>

          {/* Blade edge highlight */}
          <linearGradient id="edg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={bc} stopOpacity="0.8" />
            <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor={bc} stopOpacity="0.3" />
          </linearGradient>

          {/* Guard metallic */}
          <linearGradient id="grd" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isLeg ? bc : '#FFD700'} />
            <stop offset="30%" stopColor="#FFFBE6" stopOpacity="0.6" />
            <stop offset="70%" stopColor={isLeg ? bc : '#DAA520'} />
            <stop offset="100%" stopColor={isLeg ? ac : '#8B6914'} />
          </linearGradient>

          {/* Gem radial */}
          <radialGradient id="gem" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="50%" stopColor={gc} />
            <stop offset="100%" stopColor={gc} stopOpacity="0.5" />
          </radialGradient>

          {/* Grip leather */}
          <pattern id="lth" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#3D2415" />
            <line x1="0" y1="4" x2="8" y2="4" stroke="#5A3A20" strokeWidth="1.5" />
          </pattern>

          {/* Rune glow */}
          <filter id="rg">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Rainbow for special */}
          {specialSkin === 'rainbow' && (
            <linearGradient id="rbw" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" /><stop offset="25%" stopColor="#FFD93D" />
              <stop offset="50%" stopColor="#6BCB77" /><stop offset="75%" stopColor="#4D96FF" /><stop offset="100%" stopColor="#9B59B6" />
            </linearGradient>
          )}
        </defs>

        {/* ═══ BLADE ═══ */}
        <polygon
          points={`50,3 ${50 + bw},${bl} 50,${bl + 15} ${50 - bw},${bl}`}
          fill={specialSkin === 'rainbow' ? 'url(#rbw)' : 'url(#bld)'}
          stroke={bc}
          strokeWidth="0.5"
          strokeLinejoin="round"
        />

        {/* Blade center fuller (groove) */}
        <line x1="50" y1="14" x2="50" y2={bl - 5} stroke="url(#edg)" strokeWidth="1.5" opacity="0.4" />

        {/* Edge highlight left */}
        <line x1={50 - bw + 2} y1={25} x2={50 - bw} y2={bl - 2} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        {/* Edge highlight right */}
        <line x1={50 + bw - 2} y1={25} x2={50 + bw} y2={bl - 2} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />

        {/* Blade tip highlight (reflection) */}
        <polygon points={`50,3 ${50 + bw * 0.4},${bl * 0.4} 50,${bl * 0.5} ${50 - bw * 0.15},${bl * 0.3}`} fill="rgba(255,255,255,0.15)" />

        {/* Serrations (level 15+) */}
        {isHigh && [0, 1, 2].map(i => {
          const y = 35 + i * 30
          return (
            <g key={`s${i}`} opacity="0.3">
              <polygon points={`${50 - bw},${y} ${50 - bw - 4},${y + 5} ${50 - bw},${y + 10}`} fill={bc} />
              <polygon points={`${50 + bw},${y} ${50 + bw + 4},${y + 5} ${50 + bw},${y + 10}`} fill={bc} />
            </g>
          )
        })}

        {/* Runes (level 5+) */}
        {level >= 5 && (
          <g filter="url(#rg)" opacity={Math.min(0.3 + level * 0.025, 0.85)}>
            <text x="50" y="45" textAnchor="middle" fontSize="8" fill={ac} fontFamily="serif">✦</text>
            <text x="50" y="70" textAnchor="middle" fontSize="8" fill={ac} fontFamily="serif">◈</text>
            <text x="50" y="95" textAnchor="middle" fontSize="8" fill={ac} fontFamily="serif">✦</text>
            {isHigh && <text x="50" y="32" textAnchor="middle" fontSize="7" fill={ac} fontFamily="serif">⚜</text>}
            {isMax && <text x="50" y="110" textAnchor="middle" fontSize="7" fill={ac} fontFamily="serif">✧</text>}
          </g>
        )}

        {/* ═══ CROSSGUARD ═══ */}
        {isLeg ? (
          // Wing guard (level 20+)
          <path
            d={`M8,${bl + 13} C8,${bl + 8} 18,${bl + 8} 25,${bl + 10} L75,${bl + 10} C82,${bl + 8} 92,${bl + 8} 92,${bl + 13} L92,${bl + 18} C92,${bl + 23} 82,${bl + 24} 75,${bl + 22} L25,${bl + 22} C18,${bl + 24} 8,${bl + 23} 8,${bl + 18} Z`}
            fill="url(#grd)" stroke={bc} strokeWidth="0.4"
          />
        ) : (
          <rect x="18" y={bl + 10} width="64" height="10" rx="3" fill="url(#grd)" stroke={isHigh ? bc : '#DAA520'} strokeWidth="0.4" />
        )}

        {/* Guard gems */}
        <circle cx="24" cy={bl + 16} r="2.5" fill={gc} opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="76" cy={bl + 16} r="2.5" fill={gc} opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.5s" repeatCount="indefinite" begin="1.2s" />
        </circle>

        {/* ═══ GRIP ═══ */}
        <rect x="40" y={bl + 22} width="20" height="36" rx="2" fill="url(#lth)" />
        {/* Grip wire wrapping */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={`w${i}`} x1="42" y1={bl + 27 + i * 7} x2="58" y2={bl + 27 + i * 7} stroke="#8B6914" strokeWidth="1" opacity="0.5" />
        ))}

        {/* ═══ POMMEL ═══ */}
        <ellipse cx="50" cy={bl + 62} rx="11" ry="9" fill="url(#grd)" stroke={isLeg ? bc : '#B8860B'} strokeWidth="0.4" />
        {/* Pommel gem with sparkle */}
        <circle cx="50" cy={bl + 61} r="5" fill="url(#gem)">
          <animate attributeName="r" values="5;5.5;5" dur="3s" repeatCount="indefinite" />
        </circle>
        {/* Gem sparkle highlight */}
        <circle cx="48" cy={bl + 59} r="1.2" fill="white" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.8s" repeatCount="indefinite" />
        </circle>

        {/* ═══ GENESIS CROWN (30) ═══ */}
        {isGen && (
          <g>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
              <line key={`r${deg}`} x1="50" y1="3"
                x2={50 + Math.cos((deg * Math.PI) / 180) * 18}
                y2={3 + Math.sin((deg * Math.PI) / 180) * 18}
                stroke={bc} strokeWidth="0.6" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.08;0.3" dur={`${1.8 + deg * 0.002}s`} repeatCount="indefinite" />
              </line>
            ))}
          </g>
        )}

        {/* ═══ SPECIAL SKIN EFFECTS ═══ */}
        {specialSkin === 'flame' && (
          <g>
            {[0, 1, 2, 3, 4].map(i => (
              <ellipse key={`f${i}`} cx={42 + i * 5} cy={12 + i * 8} rx="3" ry="7" fill="#FF4500" opacity="0.25">
                <animate attributeName="ry" values="7;11;7" dur={`${0.7 + i * 0.15}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0.5;0.25" dur={`${0.7 + i * 0.15}s`} repeatCount="indefinite" />
              </ellipse>
            ))}
          </g>
        )}

        {specialSkin === 'void' && (
          <g>
            <circle cx="50" cy={bl * 0.5} r="30" fill="none" stroke="#e94560" strokeWidth="0.3" opacity="0.2">
              <animate attributeName="r" values="30;35;30" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy={bl * 0.5} r="20" fill="none" stroke="#e94560" strokeWidth="0.4" opacity="0.15">
              <animate attributeName="r" values="20;24;20" dur="2.2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {specialSkin === 'crystal' && (
          <g>
            {[25, 50, 75, 100].map(y => (
              <polygon key={y} points={`50,${y - 3} ${50 + 3},${y} 50,${y + 3} ${50 - 3},${y}`} fill="#FFFFFF" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur={`${1 + y * 0.01}s`} repeatCount="indefinite" />
              </polygon>
            ))}
          </g>
        )}
      </svg>
    </div>
  )
})
