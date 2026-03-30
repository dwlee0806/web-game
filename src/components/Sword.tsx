'use client'

import { memo } from 'react'

interface SwordProps {
  level: number
  color: string
  weaponType?: string
  specialSkin?: string | null
}

// Blade shape evolves every 5 levels
function getBladeWidth(level: number) {
  if (level < 5) return { tip: 50, mid: 62, base: 58 }       // Slim starter
  if (level < 10) return { tip: 50, mid: 66, base: 60 }      // Slightly wider
  if (level < 15) return { tip: 50, mid: 70, base: 62 }      // Broad sword
  if (level < 20) return { tip: 48, mid: 74, base: 64 }      // Great sword
  if (level < 25) return { tip: 46, mid: 78, base: 66 }      // Legendary blade
  return { tip: 44, mid: 82, base: 68 }                       // Transcendent
}

function getBladeLength(level: number) {
  if (level < 10) return 160
  if (level < 20) return 170
  return 180
}

// Special skins for easter egg
const SPECIAL_SKINS: Record<string, { name: string; bladeColor: string; runeColor: string; gemColor: string }> = {
  rainbow: { name: '무지개검', bladeColor: '#FF6B6B', runeColor: '#FFD93D', gemColor: '#6BCB77' },
  void: { name: '공허의 검', bladeColor: '#1a1a2e', runeColor: '#e94560', gemColor: '#0f3460' },
  crystal: { name: '수정검', bladeColor: '#89CFF0', runeColor: '#FFFFFF', gemColor: '#00BFFF' },
  flame: { name: '화염검', bladeColor: '#FF4500', runeColor: '#FFD700', gemColor: '#FF6347' },
  shadow: { name: '그림자검', bladeColor: '#2C2C2C', runeColor: '#8B5CF6', gemColor: '#4C1D95' },
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default memo(function Sword({ level, color, weaponType = 'sword', specialSkin = null }: SwordProps) {
  const glow = Math.min(level * 3, 60)
  const skin = specialSkin ? SPECIAL_SKINS[specialSkin] : null
  const bladeColor = skin?.bladeColor ?? (level > 0 ? color : '#8B9DAF')
  const runeColor = skin?.runeColor ?? color
  const isLegendary = level >= 20
  const isTranscend = level >= 25
  const isGenesis = level >= 30
  const blade = getBladeWidth(level)
  const bladeLen = getBladeLength(level)

  // Double edge serrations for level 15+
  const hasSerrations = level >= 15
  // Wing guards for level 20+
  const hasWingGuard = level >= 20
  // Floating gems for level 25+
  const hasFloatingGems = level >= 25

  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 300 }}>
      {/* Rotating aura rings */}
      {level >= 10 && (
        <>
          <div className="absolute rounded-full animate-aura-spin" style={{ width: 200 + level * 2, height: 200 + level * 2, border: `1px solid ${bladeColor}20`, boxShadow: `0 0 ${level}px ${bladeColor}15` }} />
          {isLegendary && <div className="absolute rounded-full animate-aura-spin-reverse" style={{ width: 170 + level * 2, height: 170 + level * 2, border: `1px dashed ${bladeColor}30` }} />}
          {isGenesis && <div className="absolute rounded-full animate-aura-spin" style={{ width: 230, height: 230, border: `1px solid ${bladeColor}15`, animationDuration: '30s' }} />}
        </>
      )}

      {/* Floating gems (25+) */}
      {hasFloatingGems && [0, 120, 240].map(deg => (
        <div
          key={deg}
          className="absolute w-2 h-2 rounded-full animate-orbit"
          style={{
            backgroundColor: skin?.gemColor ?? color,
            boxShadow: `0 0 8px ${skin?.gemColor ?? color}`,
            animationDelay: `${deg / 360 * 3}s`,
            top: '45%',
            left: '50%',
            transformOrigin: '0 -60px',
          }}
        />
      ))}

      {/* Ground reflection */}
      {level > 0 && (
        <div className="absolute bottom-4 w-20 h-4 rounded-full blur-xl animate-pulse" style={{ backgroundColor: `${bladeColor}30` }} />
      )}

      <svg
        width="140"
        height="280"
        viewBox="0 0 140 280"
        className="relative z-10 transition-all duration-700"
        style={{
          filter: level > 0
            ? `drop-shadow(0 0 ${glow}px ${bladeColor}) drop-shadow(0 0 ${glow * 0.6}px ${bladeColor}80)`
            : 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',
        }}
      >
        <defs>
          <linearGradient id="blade-main" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={bladeColor} stopOpacity="0.5" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor={bladeColor} stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="guard-main" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isLegendary ? bladeColor : '#FFD700'} />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor={isLegendary ? bladeColor : '#B8860B'} />
          </linearGradient>
          <radialGradient id="gem-main" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="40%" stopColor={skin?.gemColor ?? (level > 0 ? color : '#DAA520')} />
            <stop offset="100%" stopColor={skin?.gemColor ?? (level > 0 ? color : '#8B6914')} stopOpacity="0.6" />
          </radialGradient>
          {level >= 5 && (
            <filter id="rune-g">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          )}
          {/* Rainbow gradient for special skin */}
          {specialSkin === 'rainbow' && (
            <linearGradient id="rainbow-blade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" /><stop offset="20%" stopColor="#FFD93D" />
              <stop offset="40%" stopColor="#6BCB77" /><stop offset="60%" stopColor="#4D96FF" />
              <stop offset="80%" stopColor="#9B59B6" /><stop offset="100%" stopColor="#FF6B6B" />
            </linearGradient>
          )}
        </defs>

        {/* BLADE - shape evolves with level */}
        <polygon
          points={`70,4 ${blade.mid + 10},${bladeLen} 70,${bladeLen + 20} ${140 - blade.mid - 10},${bladeLen}`}
          fill={specialSkin === 'rainbow' ? 'url(#rainbow-blade)' : 'url(#blade-main)'}
          stroke={bladeColor}
          strokeWidth="0.6"
        />

        {/* Center fuller */}
        <line x1="70" y1="16" x2="70" y2={bladeLen - 2} stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />

        {/* Serrations (15+) */}
        {hasSerrations && [0, 1, 2].map(i => {
          const y = 40 + i * 35
          return (
            <g key={i} opacity="0.4">
              <line x1={140 - blade.mid - 8} y1={y} x2={140 - blade.mid - 14} y2={y + 8} stroke={bladeColor} strokeWidth="1" />
              <line x1={blade.mid + 8} y1={y} x2={blade.mid + 14} y2={y + 8} stroke={bladeColor} strokeWidth="1" />
            </g>
          )
        })}

        {/* Runes (5+) */}
        {level >= 5 && (
          <g filter="url(#rune-g)" opacity={Math.min(0.3 + level * 0.02, 0.8)}>
            <text x="70" y="55" textAnchor="middle" fontSize="10" fill={runeColor} fontFamily="serif">✦</text>
            <text x="70" y="85" textAnchor="middle" fontSize="10" fill={runeColor} fontFamily="serif">◆</text>
            <text x="70" y="115" textAnchor="middle" fontSize="10" fill={runeColor} fontFamily="serif">✦</text>
            {level >= 15 && <text x="70" y="40" textAnchor="middle" fontSize="8" fill={runeColor} fontFamily="serif">⚜</text>}
            {isTranscend && <text x="70" y="140" textAnchor="middle" fontSize="9" fill={runeColor} fontFamily="serif">✧</text>}
          </g>
        )}

        {/* CROSSGUARD */}
        {hasWingGuard ? (
          // Wing-shaped guard for 20+
          <path
            d={`M8,${bladeLen + 18} Q8,${bladeLen + 12} 20,${bladeLen + 12} L120,${bladeLen + 12} Q132,${bladeLen + 12} 132,${bladeLen + 18} L132,${bladeLen + 24} Q132,${bladeLen + 30} 120,${bladeLen + 28} L20,${bladeLen + 28} Q8,${bladeLen + 30} 8,${bladeLen + 24} Z`}
            fill="url(#guard-main)"
            stroke={bladeColor}
            strokeWidth="0.5"
          />
        ) : (
          <path
            d={`M14,${bladeLen + 18} Q14,${bladeLen + 12} 22,${bladeLen + 12} L118,${bladeLen + 12} Q126,${bladeLen + 12} 126,${bladeLen + 18} L126,${bladeLen + 22} Q126,${bladeLen + 28} 118,${bladeLen + 28} L22,${bladeLen + 28} Q14,${bladeLen + 28} 14,${bladeLen + 22} Z`}
            fill="url(#guard-main)"
            stroke={isLegendary ? bladeColor : '#DAA520'}
            strokeWidth="0.5"
          />
        )}

        {/* Guard ornaments */}
        <circle cx="24" cy={bladeLen + 20} r="3" fill={level > 0 ? bladeColor : '#DAA520'} opacity="0.7" />
        <circle cx="116" cy={bladeLen + 20} r="3" fill={level > 0 ? bladeColor : '#DAA520'} opacity="0.7" />

        {/* GRIP */}
        <rect x="56" y={bladeLen + 28} width="28" height="44" rx="3" fill="#2A1810" />
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1="58" y1={bladeLen + 34 + i * 8} x2="82" y2={bladeLen + 34 + i * 8} stroke="#8B6914" strokeWidth="1.5" opacity="0.5" />
        ))}

        {/* POMMEL */}
        <ellipse cx="70" cy={bladeLen + 78} rx="13" ry="11" fill="url(#guard-main)" stroke={isLegendary ? bladeColor : '#DAA520'} strokeWidth="0.5" />
        <circle cx="70" cy={bladeLen + 77} r="5.5" fill="url(#gem-main)" />
        {level > 0 && (
          <circle cx="68" cy={bladeLen + 75} r="1.5" fill="white" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Genesis crown rays */}
        {isGenesis && (
          <g opacity="0.6">
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
              <line key={deg} x1="70" y1="4" x2={70 + Math.cos((deg * Math.PI) / 180) * 24} y2={4 + Math.sin((deg * Math.PI) / 180) * 24} stroke={bladeColor} strokeWidth="0.8" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.1;0.4" dur={`${1.5 + deg * 0.003}s`} repeatCount="indefinite" />
              </line>
            ))}
          </g>
        )}

        {/* Special skin flame effect */}
        {specialSkin === 'flame' && (
          <g opacity="0.6">
            {[0, 1, 2, 3].map(i => (
              <ellipse key={i} cx={55 + i * 10} cy={20 + i * 5} rx="4" ry="8" fill="#FF4500" opacity="0.3">
                <animate attributeName="ry" values="8;12;8" dur={`${0.8 + i * 0.2}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur={`${0.8 + i * 0.2}s`} repeatCount="indefinite" />
              </ellipse>
            ))}
          </g>
        )}

        {/* Void skin dark aura */}
        {specialSkin === 'void' && (
          <circle cx="70" cy="90" r="50" fill="none" stroke="#e94560" strokeWidth="0.5" opacity="0.3">
            <animate attributeName="r" values="50;55;50" dur="3s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </div>
  )
})
