'use client'

interface SwordProps {
  level: number
  color: string
}

export default function Sword({ level, color }: SwordProps) {
  const glowIntensity = Math.min(level * 2, 50)
  const bladeColor = level > 0 ? color : '#B0B0B0'

  return (
    <svg
      width="100"
      height="220"
      viewBox="0 0 100 220"
      className="transition-all duration-500"
      style={{
        filter: level > 0
          ? `drop-shadow(0 0 ${glowIntensity}px ${color}) drop-shadow(0 0 ${glowIntensity / 2}px ${color})`
          : 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
      }}
    >
      <defs>
        <linearGradient id="blade-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={bladeColor} stopOpacity="0.7" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor={bladeColor} stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="guard-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>

      {/* Blade */}
      <polygon
        points="50,5 64,140 50,158 36,140"
        fill="url(#blade-grad)"
        stroke={bladeColor}
        strokeWidth="0.8"
      />
      <line x1="50" y1="18" x2="50" y2="140" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />

      {/* Guard */}
      <rect x="18" y="155" width="64" height="9" rx="3" fill="url(#guard-grad)" />

      {/* Grip */}
      <rect x="40" y="164" width="20" height="36" rx="2" fill="#4A2810" />
      {[0, 1, 2, 3].map(i => (
        <line
          key={i}
          x1="42"
          y1={171 + i * 8}
          x2="58"
          y2={171 + i * 8}
          stroke="#8B6914"
          strokeWidth="1.5"
        />
      ))}

      {/* Pommel */}
      <circle cx="50" cy="207" r="8" fill="url(#guard-grad)" />
      <circle cx="50" cy="207" r="3.5" fill={level > 0 ? color : '#DAA520'} opacity="0.8" />
    </svg>
  )
}
