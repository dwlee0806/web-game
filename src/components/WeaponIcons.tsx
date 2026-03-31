'use client'

import { memo } from 'react'

interface WeaponIconProps {
  size?: number
  color?: string
  className?: string
}

// ═══ 검 (Sword) ═══
export const SwordIcon = memo(function SwordIcon({ size = 24, color = '#C0C8D0', className = '' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <defs>
        <linearGradient id="sw-blade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="40%" stopColor="#FFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Blade */}
      <polygon points="16,1 20,20 16,23 12,20" fill="url(#sw-blade)" stroke={color} strokeWidth="0.4" />
      <line x1="16" y1="4" x2="16" y2="19" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
      {/* Guard */}
      <rect x="9" y="22" width="14" height="3" rx="1.5" fill="#DAA520" />
      <circle cx="11" cy="23.5" r="1" fill={color} opacity="0.7" />
      <circle cx="21" cy="23.5" r="1" fill={color} opacity="0.7" />
      {/* Grip */}
      <rect x="14" y="25" width="4" height="5" rx="1" fill="#4A2810" />
      {/* Pommel */}
      <circle cx="16" cy="31" r="1.5" fill="#DAA520" />
    </svg>
  )
})

// ═══ 활 (Bow) ═══
export const BowIcon = memo(function BowIcon({ size = 24, color = '#8B6914', className = '' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      {/* Bow body */}
      <path d="M8,4 Q2,16 8,28" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Bow limb details */}
      <path d="M8,4 Q3,16 8,28" fill="none" stroke="#A08030" strokeWidth="1" strokeLinecap="round" />
      {/* String */}
      <line x1="8" y1="4" x2="8" y2="28" stroke="#E0D0B0" strokeWidth="0.6" />
      {/* Arrow */}
      <line x1="8" y1="16" x2="28" y2="16" stroke="#8B6914" strokeWidth="1.2" />
      {/* Arrow head */}
      <polygon points="28,16 24,13.5 24,18.5" fill="#A0A8B0" />
      {/* Arrow fletching */}
      <polygon points="10,16 12,14 12,18" fill="#E04040" opacity="0.8" />
      {/* Grip wrapping */}
      <rect x="6.5" y="13" width="3" height="6" rx="1" fill="#5A3A20" />
      {[0, 1, 2].map(i => (
        <line key={i} x1="7" y1={13.8 + i * 2} x2="9" y2={13.8 + i * 2} stroke="#8B6914" strokeWidth="0.6" opacity="0.5" />
      ))}
      {/* Nock */}
      <circle cx="8" cy="16" r="1" fill="#DAA520" opacity="0.6" />
    </svg>
  )
})

// ═══ 지팡이 (Staff) ═══
export const StaffIcon = memo(function StaffIcon({ size = 24, color = '#8B5CF6', className = '' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      {/* Orb glow */}
      <circle cx="16" cy="6" r="5" fill={color} opacity="0.15">
        <animate attributeName="r" values="5;6;5" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Orb */}
      <circle cx="16" cy="6" r="3.5" fill={color} opacity="0.8" />
      <circle cx="16" cy="6" r="2" fill="#E0D0FF" opacity="0.6" />
      <circle cx="15" cy="5" r="0.8" fill="#FFF" opacity="0.8" />
      {/* Orb cradle */}
      <path d="M12,9 Q16,12 20,9" fill="none" stroke="#DAA520" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="12" y1="9" x2="13" y2="7" stroke="#DAA520" strokeWidth="1" />
      <line x1="20" y1="9" x2="19" y2="7" stroke="#DAA520" strokeWidth="1" />
      {/* Shaft */}
      <rect x="15" y="10" width="2" height="18" rx="1" fill="#5A3A20" />
      <line x1="15.5" y1="11" x2="15.5" y2="27" stroke="#7A5A30" strokeWidth="0.5" opacity="0.4" />
      {/* Rings */}
      {[0, 1, 2].map(i => (
        <rect key={i} x="14" y={14 + i * 5} width="4" height="1.5" rx="0.5" fill="#DAA520" opacity="0.6" />
      ))}
      {/* Bottom */}
      <circle cx="16" cy="29" r="2" fill="#DAA520" />
      <circle cx="16" cy="29" r="1" fill={color} opacity="0.4" />
    </svg>
  )
})

// ═══ 도끼 (Axe) ═══
export const AxeIcon = memo(function AxeIcon({ size = 24, color = '#A0A8B0', className = '' }: WeaponIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      {/* Axe head */}
      <path d="M10,6 Q6,10 8,16 L16,12 L16,4 Q14,3 10,6Z" fill={color} stroke="#808890" strokeWidth="0.5" />
      {/* Axe head highlight */}
      <path d="M12,7 Q9,10 10,14 L14,11 L14,5 Q13,5 12,7Z" fill="rgba(255,255,255,0.15)" />
      {/* Axe edge */}
      <path d="M8,6 Q5,11 8,16" fill="none" stroke="#FFF" strokeWidth="0.4" opacity="0.3" />
      {/* Shaft */}
      <rect x="14.5" y="4" width="3" height="24" rx="1" fill="#5A3A20" />
      <line x1="15.2" y1="5" x2="15.2" y2="27" stroke="#7A5A30" strokeWidth="0.5" opacity="0.3" />
      {/* Grip wrapping */}
      {[0, 1, 2, 3].map(i => (
        <line key={i} x1="14.5" y1={18 + i * 2.5} x2="17.5" y2={18 + i * 2.5} stroke="#8B6914" strokeWidth="0.8" opacity="0.5" />
      ))}
      {/* Butt cap */}
      <rect x="14" y="28" width="4" height="2" rx="1" fill="#808890" />
      {/* Axe eye (socket) */}
      <ellipse cx="15.5" cy="8" rx="1.5" ry="2" fill="#3A2010" />
    </svg>
  )
})

// Lookup by weapon ID
export function getWeaponIcon(weaponId: string): React.ComponentType<WeaponIconProps> {
  switch (weaponId) {
    case 'bow': return BowIcon
    case 'staff': return StaffIcon
    case 'axe': return AxeIcon
    default: return SwordIcon
  }
}
