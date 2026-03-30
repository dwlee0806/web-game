'use client'

export default function MagicCircle({ active, color }: { active: boolean; color: string }) {
  if (!active) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      {/* Outer circle */}
      <svg
        width="240"
        height="240"
        viewBox="0 0 240 240"
        className="absolute animate-magic-circle"
        style={{ top: '50%', left: '50%' }}
      >
        <defs>
          <filter id="mc-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle cx="120" cy="120" r="110" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" filter="url(#mc-glow)" />
        <circle cx="120" cy="120" r="95" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" strokeDasharray="8 4" />

        {/* Inner hexagram */}
        <polygon
          points="120,30 185,75 185,165 120,210 55,165 55,75"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
          filter="url(#mc-glow)"
        />

        {/* Cross lines */}
        <line x1="120" y1="20" x2="120" y2="220" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <line x1="20" y1="120" x2="220" y2="120" stroke={color} strokeWidth="0.5" opacity="0.3" />

        {/* Corner runes */}
        {[0, 60, 120, 180, 240, 300].map(deg => {
          const rad = (deg * Math.PI) / 180
          const x = 120 + Math.cos(rad) * 100
          const y = 120 + Math.sin(rad) * 100
          return (
            <text
              key={deg}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="12"
              fill={color}
              opacity="0.7"
              filter="url(#mc-glow)"
            >
              ✦
            </text>
          )
        })}
      </svg>

      {/* Floating runes */}
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className="absolute animate-rune-float text-lg"
          style={{
            color,
            left: `${30 + i * 15}%`,
            bottom: '30%',
            animationDelay: `${i * 0.15}s`,
            textShadow: `0 0 10px ${color}`,
          }}
        >
          {['✦', '◆', '⚜', '✧'][i]}
        </div>
      ))}
    </div>
  )
}
