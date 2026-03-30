'use client'

import { memo } from 'react'

interface HeroAvatarProps {
  size?: number
  expression?: 'normal' | 'happy' | 'excited' | 'sad' | 'wink'
  className?: string
}

/**
 * 용사 NPC — 공식 사용자 대변 캐릭터
 * 모든 콘텐츠에서 유저 아이콘으로 사용
 */
export default memo(function HeroAvatar({ size = 40, expression = 'normal', className = '' }: HeroAvatarProps) {
  const s = size
  const h = s * 1.2

  // Eye variations by expression
  const eyeColor = '#4AE'
  const leftEyeR = expression === 'wink' ? 0.5 : 1.2
  const leftEyeY = expression === 'sad' ? 10 : 9.5

  return (
    <svg width={s} height={h} viewBox="0 0 32 38" className={className}>
      {/* Helmet */}
      <rect x="6" y="0" width="20" height="16" rx="5" fill="#708090" />
      <rect x="8" y="1" width="16" height="5" rx="2" fill="#8899AA">
        {/* Metallic shine */}
        <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
      </rect>

      {/* Visor */}
      <rect x="9" y="8" width="14" height="4" rx="1.5" fill="#1a1a2e" />

      {/* Eyes through visor */}
      <circle cx="13" cy={leftEyeY} r={leftEyeR} fill={eyeColor}>
        {expression === 'excited' && <animate attributeName="r" values="1.2;1.5;1.2" dur="0.5s" repeatCount="indefinite" />}
      </circle>
      <circle cx="19" cy="9.5" r="1.2" fill={eyeColor}>
        {expression === 'excited' && <animate attributeName="r" values="1.2;1.5;1.2" dur="0.5s" repeatCount="indefinite" />}
      </circle>

      {/* Smile (happy/excited only) */}
      {(expression === 'happy' || expression === 'excited') && (
        <path d="M12,12 Q16,14 20,12" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.6" />
      )}

      {/* Plume */}
      <ellipse cx="16" cy="1" rx="4" ry="2.5" fill="#E04040">
        <animate attributeName="rx" values="4;4.5;4" dur="2s" repeatCount="indefinite" />
      </ellipse>

      {/* Body armor */}
      <rect x="7" y="16" width="18" height="12" rx="3" fill="#607080" />
      <rect x="10" y="17" width="12" height="5" rx="1.5" fill="#7A8A9A" />
      {/* Chest emblem */}
      <circle cx="16" cy="20" r="2" fill="#FFD700" opacity="0.6" />

      {/* Belt */}
      <rect x="8" y="25" width="16" height="2.5" rx="1" fill="#8B6914" />
      <circle cx="16" cy="26.2" r="1.5" fill="#DAA520" />

      {/* Shield (left) */}
      <ellipse cx="4" cy="22" rx="4.5" ry="6" fill="#3060A0" stroke="#FFD700" strokeWidth="0.6" />
      <line x1="4" y1="17" x2="4" y2="27" stroke="#FFD700" strokeWidth="0.5" />
      <line x1="0.5" y1="22" x2="7.5" y2="22" stroke="#FFD700" strokeWidth="0.5" />

      {/* Sword (right) */}
      <rect x="28" y="12" width="2.5" height="14" rx="0.5" fill="#C0C8D0" />
      <rect x="26" y="25" width="7" height="2.5" rx="1" fill="#DAA520" />
      {/* Sword glow */}
      <rect x="28" y="12" width="2.5" height="14" rx="0.5" fill="#FFF" opacity="0.15">
        <animate attributeName="opacity" values="0.15;0.3;0.15" dur="2s" repeatCount="indefinite" />
      </rect>

      {/* Legs */}
      <rect x="10" y="28" width="5" height="8" rx="1.5" fill="#505868" />
      <rect x="17" y="28" width="5" height="8" rx="1.5" fill="#505868" />

      {/* Boots */}
      <rect x="9" y="34" width="7" height="4" rx="1.5" fill="#4A3020" />
      <rect x="16" y="34" width="7" height="4" rx="1.5" fill="#4A3020" />
    </svg>
  )
})
