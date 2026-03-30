'use client'

interface SwordProps {
  level: number
  color: string
}

export default function Sword({ level, color }: SwordProps) {
  const glow = Math.min(level * 3, 60)
  const bladeColor = level > 0 ? color : '#8B9DAF'
  const isLegendary = level >= 20
  const isTranscend = level >= 25
  const isGenesis = level >= 30

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 280 }}>
      {/* Aura rings for high levels */}
      {level >= 10 && (
        <div
          className="absolute rounded-full animate-aura-spin"
          style={{
            width: 200 + level * 2,
            height: 200 + level * 2,
            border: `1px solid ${color}20`,
            boxShadow: `0 0 ${level}px ${color}15`,
          }}
        />
      )}
      {isLegendary && (
        <div
          className="absolute rounded-full animate-aura-spin-reverse"
          style={{
            width: 170 + level * 2,
            height: 170 + level * 2,
            border: `1px dashed ${color}30`,
          }}
        />
      )}

      {/* Ground glow */}
      {level > 0 && (
        <div
          className="absolute bottom-2 w-24 h-6 rounded-full blur-xl animate-pulse"
          style={{ backgroundColor: `${color}40` }}
        />
      )}

      <svg
        width="120"
        height="260"
        viewBox="0 0 120 260"
        className="relative z-10 transition-all duration-700"
        style={{
          filter: level > 0
            ? `drop-shadow(0 0 ${glow}px ${color}) drop-shadow(0 0 ${glow * 0.6}px ${color}80)`
            : 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',
        }}
      >
        <defs>
          {/* Blade gradient */}
          <linearGradient id="blade-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={bladeColor} stopOpacity="0.6" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor={bladeColor} stopOpacity="0.6" />
          </linearGradient>

          {/* Blade edge shimmer */}
          <linearGradient id="blade-edge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={bladeColor} />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="100%" stopColor={bladeColor} />
          </linearGradient>

          {/* Guard gradient */}
          <linearGradient id="guard-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isLegendary ? color : '#FFD700'} />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor={isLegendary ? color : '#B8860B'} />
          </linearGradient>

          {/* Pommel gem */}
          <radialGradient id="gem-glow" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="40%" stopColor={level > 0 ? color : '#DAA520'} />
            <stop offset="100%" stopColor={level > 0 ? color : '#8B6914'} stopOpacity="0.6" />
          </radialGradient>

          {/* Rune glow filter */}
          {level >= 5 && (
            <filter id="rune-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* === BLADE === */}
        <polygon
          points="60,4 76,160 60,180 44,160"
          fill="url(#blade-fill)"
          stroke={bladeColor}
          strokeWidth="0.6"
        />

        {/* Blade center fuller (groove) */}
        <line x1="60" y1="16" x2="60" y2="158" stroke="url(#blade-edge)" strokeWidth="1.2" opacity="0.5" />

        {/* Blade edge highlights */}
        <line x1="48" y1="30" x2="44" y2="158" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <line x1="72" y1="30" x2="76" y2="158" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

        {/* Blade runes (level >= 5) */}
        {level >= 5 && (
          <g filter="url(#rune-glow)" opacity={Math.min(0.3 + level * 0.02, 0.8)}>
            <text x="60" y="60" textAnchor="middle" fontSize="9" fill={color} fontFamily="serif">✦</text>
            <text x="60" y="90" textAnchor="middle" fontSize="9" fill={color} fontFamily="serif">◆</text>
            <text x="60" y="120" textAnchor="middle" fontSize="9" fill={color} fontFamily="serif">✦</text>
            {level >= 15 && <text x="60" y="45" textAnchor="middle" fontSize="7" fill={color} fontFamily="serif">⚜</text>}
            {isTranscend && <text x="60" y="140" textAnchor="middle" fontSize="8" fill={color} fontFamily="serif">✧</text>}
          </g>
        )}

        {/* === CROSSGUARD === */}
        <path
          d="M14,178 Q14,172 20,172 L100,172 Q106,172 106,178 L106,182 Q106,188 100,188 L20,188 Q14,188 14,182 Z"
          fill="url(#guard-fill)"
          stroke={isLegendary ? color : '#DAA520'}
          strokeWidth="0.5"
        />

        {/* Guard ornaments */}
        <circle cx="22" cy="180" r="3" fill={level > 0 ? color : '#DAA520'} opacity="0.7" />
        <circle cx="98" cy="180" r="3" fill={level > 0 ? color : '#DAA520'} opacity="0.7" />
        {isLegendary && (
          <>
            <circle cx="38" cy="180" r="2" fill={color} opacity="0.5" />
            <circle cx="82" cy="180" r="2" fill={color} opacity="0.5" />
          </>
        )}

        {/* === GRIP === */}
        <rect x="46" y="188" width="28" height="44" rx="3" fill="#2A1810" />
        <rect x="46" y="188" width="28" height="44" rx="3" fill="url(#guard-fill)" opacity="0.08" />

        {/* Leather wrapping */}
        {[0, 1, 2, 3, 4].map(i => (
          <g key={i}>
            <line x1="48" y1={194 + i * 8} x2="72" y2={194 + i * 8} stroke="#5A3A20" strokeWidth="2.5" />
            <line x1="48" y1={194 + i * 8} x2="72" y2={194 + i * 8} stroke="#8B6914" strokeWidth="1" opacity="0.4" />
          </g>
        ))}

        {/* === POMMEL === */}
        <ellipse cx="60" cy="238" rx="12" ry="10" fill="url(#guard-fill)" stroke={isLegendary ? color : '#DAA520'} strokeWidth="0.5" />
        <circle cx="60" cy="237" r="5" fill="url(#gem-glow)" />

        {/* Gem sparkle */}
        {level > 0 && (
          <circle cx="58" cy="235" r="1.5" fill="white" opacity="0.7">
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Genesis crown rays */}
        {isGenesis && (
          <g opacity="0.6">
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
              <line
                key={deg}
                x1="60"
                y1="4"
                x2={60 + Math.cos((deg * Math.PI) / 180) * 20}
                y2={4 + Math.sin((deg * Math.PI) / 180) * 20}
                stroke={color}
                strokeWidth="0.8"
                opacity="0.4"
              >
                <animate attributeName="opacity" values="0.4;0.1;0.4" dur={`${1.5 + deg * 0.003}s`} repeatCount="indefinite" />
              </line>
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}
