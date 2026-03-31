'use client'

import { memo } from 'react'
import { getLevelTier } from '@/lib/gameLogic'

interface SwordProps {
  level: number
  color: string
  weaponType?: string
  specialSkin?: string | null
}

export default memo(function Sword({ level, color, weaponType = 'sword' }: SwordProps) {
  const tier = getLevelTier(level)
  const glow = Math.min(level * 4, 55)
  const filterStyle = level > 0
    ? `drop-shadow(0 0 ${glow}px ${color}) drop-shadow(0 0 ${glow * 0.4}px ${color}80)`
    : 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 220 }}>
      {level > 0 && (
        <div className="absolute rounded-full blur-2xl animate-pulse" style={{ width: 80 + level * 4, height: 80 + level * 4, backgroundColor: `${color}15` }} />
      )}

      <div className="relative z-10 transition-all duration-500" style={{ filter: filterStyle }}>
        {weaponType === 'sword' && <SwordSVG level={level} color={color} />}
        {weaponType === 'bow' && <BowSVG level={level} color={color} />}
        {weaponType === 'staff' && <StaffSVG level={level} color={color} />}
        {weaponType === 'axe' && <AxeSVG level={level} color={color} />}
      </div>

      {level > 0 && (
        <div className="absolute bottom-0 w-16 h-3 rounded-full blur-lg" style={{ backgroundColor: `${color}25` }} />
      )}
    </div>
  )
})

// ═══ 검 (기존 이미지 사용) ═══
function SwordSVG({ level, color }: { level: number; color: string }) {
  return <img src={`/swords/sword_lv${level}.svg`} alt="sword" width={120} height={220} />
}

// ═══ 활 (Bow) — 대형 ═══
function BowSVG({ level, color }: { level: number; color: string }) {
  const bc = level > 0 ? color : '#8B6914'
  return (
    <svg width={120} height={220} viewBox="0 0 120 220">
      <defs>
        <linearGradient id="bow-wood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5A3A20" />
          <stop offset="50%" stopColor="#8B6914" />
          <stop offset="100%" stopColor="#5A3A20" />
        </linearGradient>
      </defs>
      {/* Bow body (large curved limb) */}
      <path d="M45,20 Q15,110 45,200" fill="none" stroke="url(#bow-wood)" strokeWidth="6" strokeLinecap="round" />
      <path d="M45,20 Q20,110 45,200" fill="none" stroke={bc} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* String */}
      <line x1="45" y1="20" x2="45" y2="200" stroke="#E0D0B0" strokeWidth="1" />
      {/* Arrow */}
      <line x1="45" y1="110" x2="105" y2="110" stroke="#8B6914" strokeWidth="2.5" />
      {/* Arrow head */}
      <polygon points="105,110 95,104 95,116" fill={bc} />
      {/* Fletching */}
      <polygon points="50,110 56,105 56,115" fill="#E04040" opacity="0.8" />
      {/* Grip */}
      <rect x="40" y="95" width="10" height="30" rx="3" fill="#3D2415" />
      {[0, 1, 2, 3].map(i => (
        <line key={i} x1="41" y1={98 + i * 7} x2="49" y2={98 + i * 7} stroke="#8B6914" strokeWidth="1" opacity="0.5" />
      ))}
      {/* Nock gems */}
      <circle cx="45" cy="20" r="3" fill={bc} opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="45" cy="200" r="3" fill={bc} opacity="0.6">
        <animate attributeName="opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Level runes */}
      {level >= 5 && (
        <g opacity="0.5">
          <text x="45" y="70" textAnchor="middle" fontSize="10" fill={bc} fontFamily="serif">✦</text>
          <text x="45" y="150" textAnchor="middle" fontSize="10" fill={bc} fontFamily="serif">✦</text>
        </g>
      )}
    </svg>
  )
}

// ═══ 지팡이 (Staff) — 대형 ═══
function StaffSVG({ level, color }: { level: number; color: string }) {
  const bc = level > 0 ? color : '#8B5CF6'
  return (
    <svg width={120} height={220} viewBox="0 0 120 220">
      {/* Orb glow */}
      <circle cx="60" cy="30" r={15 + level} fill={bc} opacity="0.1">
        <animate attributeName="r" values={`${15 + level};${18 + level};${15 + level}`} dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Orb */}
      <circle cx="60" cy="30" r="12" fill={bc} opacity="0.7" />
      <circle cx="60" cy="30" r="7" fill="#E0D0FF" opacity="0.5" />
      <circle cx="57" cy="27" r="3" fill="#FFF" opacity="0.7" />
      {/* Cradle */}
      <path d="M48,42 Q60,52 72,42" fill="none" stroke="#DAA520" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="48" y1="42" x2="52" y2="34" stroke="#DAA520" strokeWidth="2" />
      <line x1="72" y1="42" x2="68" y2="34" stroke="#DAA520" strokeWidth="2" />
      {/* Shaft */}
      <rect x="56" y="48" width="8" height="150" rx="4" fill="#4A2810" />
      <line x1="58" y1="50" x2="58" y2="195" stroke="#6A4830" strokeWidth="1" opacity="0.3" />
      {/* Gold rings */}
      {[0, 1, 2, 3, 4].map(i => (
        <rect key={i} x="54" y={60 + i * 28} width="12" height="4" rx="2" fill="#DAA520" opacity="0.5" />
      ))}
      {/* Bottom orb */}
      <circle cx="60" cy="202" r="6" fill="#DAA520" />
      <circle cx="60" cy="202" r="3" fill={bc} opacity="0.5" />
      {/* Runes along shaft */}
      {level >= 5 && (
        <g opacity="0.5">
          {[80, 120, 160].map(y => (
            <text key={y} x="60" y={y} textAnchor="middle" fontSize="9" fill={bc} fontFamily="serif">◈</text>
          ))}
        </g>
      )}
    </svg>
  )
}

// ═══ 도끼 (Axe) — 대형 ═══
function AxeSVG({ level, color }: { level: number; color: string }) {
  const bc = level > 0 ? color : '#A0A8B0'
  return (
    <svg width={120} height={220} viewBox="0 0 120 220">
      <defs>
        <linearGradient id="axe-head" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={bc} stopOpacity="0.6" />
          <stop offset="40%" stopColor="#E8ECF0" stopOpacity="0.9" />
          <stop offset="100%" stopColor={bc} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Axe head (large crescent) */}
      <path d="M30,30 Q10,60 20,100 L55,80 L55,20 Q45,15 30,30Z" fill="url(#axe-head)" stroke={bc} strokeWidth="0.8" />
      {/* Head highlight */}
      <path d="M35,35 Q18,60 25,90 L48,75 L48,25 Q42,22 35,35Z" fill="rgba(255,255,255,0.1)" />
      {/* Cutting edge glow */}
      <path d="M20,35 Q8,65 20,100" fill="none" stroke="#FFF" strokeWidth="0.8" opacity="0.2" />
      {/* Axe eye */}
      <ellipse cx="52" cy="50" rx="4" ry="8" fill="#2A1810" />
      {/* Shaft */}
      <rect x="50" y="25" width="10" height="170" rx="3" fill="#4A2810" />
      <line x1="53" y1="30" x2="53" y2="190" stroke="#6A4830" strokeWidth="1" opacity="0.3" />
      {/* Grip wrapping */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <line key={i} x1="50" y1={130 + i * 10} x2="60" y2={130 + i * 10} stroke="#8B6914" strokeWidth="1.5" opacity="0.4" />
      ))}
      {/* Butt cap */}
      <rect x="48" y="195" width="14" height="6" rx="2" fill={bc} opacity="0.7" />
      {/* Runes on head */}
      {level >= 5 && (
        <g opacity="0.5">
          <text x="38" y="55" textAnchor="middle" fontSize="10" fill={bc} fontFamily="serif">✦</text>
          <text x="35" y="80" textAnchor="middle" fontSize="8" fill={bc} fontFamily="serif">◈</text>
        </g>
      )}
      {/* Level gem on eye */}
      {level >= 3 && (
        <circle cx="52" cy="50" r="2.5" fill={bc} opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  )
}
