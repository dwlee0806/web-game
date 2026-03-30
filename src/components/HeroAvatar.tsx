'use client'

import { memo } from 'react'

interface HeroAvatarProps {
  size?: number
  expression?: 'normal' | 'happy' | 'excited' | 'sad' | 'wink'
  className?: string
}

/**
 * 용사 — 젤다 링크 스타일 2등신 캐릭터
 * 노란 머리, 귀여운 얼굴, 빨간 스카프, 아머 플레이트, 멋진 검
 */
export default memo(function HeroAvatar({ size = 40, expression = 'normal', className = '' }: HeroAvatarProps) {
  const isWink = expression === 'wink'
  const isHappy = expression === 'happy' || expression === 'excited'
  const isSad = expression === 'sad'

  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 48 60" className={className}>
      {/* ═══ HAIR (golden blonde, messy) ═══ */}
      <ellipse cx="24" cy="12" rx="14" ry="12" fill="#F5C518" />
      {/* Hair tufts */}
      <ellipse cx="12" cy="8" rx="5" ry="4" fill="#F5C518" />
      <ellipse cx="36" cy="8" rx="5" ry="4" fill="#F5C518" />
      <ellipse cx="24" cy="3" rx="6" ry="4" fill="#E8B410" />
      {/* Hair bangs */}
      <path d="M14,14 Q18,8 24,10 Q30,8 34,14" fill="#E8B410" />
      <ellipse cx="16" cy="11" rx="3" ry="5" fill="#F5C518" />
      <ellipse cx="32" cy="11" rx="3" ry="5" fill="#F5C518" />
      {/* Side hair flowing */}
      <path d="M10,12 Q8,18 9,24" fill="none" stroke="#E8B410" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38,12 Q40,18 39,24" fill="none" stroke="#E8B410" strokeWidth="2.5" strokeLinecap="round" />

      {/* ═══ FACE (round, cute) ═══ */}
      <circle cx="24" cy="17" r="10" fill="#FFE4C4" />
      {/* Blush */}
      <ellipse cx="17" cy="20" rx="2.5" ry="1.2" fill="#FFADAD" opacity="0.45" />
      <ellipse cx="31" cy="20" rx="2.5" ry="1.2" fill="#FFADAD" opacity="0.45" />

      {/* Eyes — big and cute */}
      {isWink ? (
        <>
          {/* Left eye winking */}
          <path d="M18,17 Q20,19 22,17" fill="none" stroke="#2C1810" strokeWidth="1.2" strokeLinecap="round" />
          {/* Right eye open */}
          <ellipse cx="29" cy="17" rx="2.5" ry="3" fill="#2C1810" />
          <ellipse cx="29" cy="16.5" rx="2" ry="2.5" fill="#3D7A35" />
          <circle cx="29.5" cy="15.5" r="1" fill="#FFF" />
          <circle cx="28" cy="17" r="0.5" fill="#FFF" opacity="0.5" />
        </>
      ) : (
        <>
          {/* Left eye */}
          <ellipse cx="19" cy={isSad ? 18 : 17} rx="2.5" ry="3" fill="#2C1810" />
          <ellipse cx="19" cy={isSad ? 17.5 : 16.5} rx="2" ry="2.5" fill="#3D7A35" />
          <circle cx="19.5" cy={isSad ? 15.5 : 15} r="1" fill="#FFF" />
          <circle cx="18" cy={isSad ? 17.5 : 17} r="0.5" fill="#FFF" opacity="0.5" />
          {expression === 'excited' && <circle cx="19" cy="17" r="3.5" fill="none" stroke="#FFF" strokeWidth="0.3" opacity="0.4" />}

          {/* Right eye */}
          <ellipse cx="29" cy={isSad ? 18 : 17} rx="2.5" ry="3" fill="#2C1810" />
          <ellipse cx="29" cy={isSad ? 17.5 : 16.5} rx="2" ry="2.5" fill="#3D7A35" />
          <circle cx="29.5" cy={isSad ? 15.5 : 15} r="1" fill="#FFF" />
          <circle cx="28" cy={isSad ? 17.5 : 17} r="0.5" fill="#FFF" opacity="0.5" />
          {expression === 'excited' && <circle cx="29" cy="17" r="3.5" fill="none" stroke="#FFF" strokeWidth="0.3" opacity="0.4" />}
        </>
      )}

      {/* Eyebrows */}
      <line x1="16" y1={isSad ? 14 : 13} x2="22" y2={isSad ? 13 : 12.5} stroke="#C8960E" strokeWidth="1" strokeLinecap="round" />
      <line x1="26" y1={isSad ? 13 : 12.5} x2="32" y2={isSad ? 14 : 13} stroke="#C8960E" strokeWidth="1" strokeLinecap="round" />

      {/* Mouth */}
      {isHappy ? (
        <path d="M20,21 Q24,24 28,21" fill="none" stroke="#C8705A" strokeWidth="1" strokeLinecap="round" />
      ) : isSad ? (
        <path d="M20,23 Q24,21 28,23" fill="none" stroke="#C8705A" strokeWidth="0.8" strokeLinecap="round" />
      ) : (
        <ellipse cx="24" cy="22" rx="1.5" ry="1" fill="#D4836A" />
      )}

      {/* Nose */}
      <circle cx="24" cy="19.5" r="0.6" fill="#F0C8A8" />

      {/* ═══ POINTY EARS (elf-like) ═══ */}
      <path d="M10,16 L4,12 L11,18" fill="#FFE4C4" stroke="#F0C8A8" strokeWidth="0.5" />
      <path d="M38,16 L44,12 L37,18" fill="#FFE4C4" stroke="#F0C8A8" strokeWidth="0.5" />

      {/* ═══ RED SCARF ═══ */}
      <path d="M14,26 Q24,30 34,26 L32,28 Q24,33 16,28 Z" fill="#DC2626" />
      <path d="M16,28 Q18,34 20,38" fill="none" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
      <path d="M16,28 Q17,35 18,40" fill="none" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" />
      {/* Scarf wave */}
      <path d="M20,38 Q22,36 20,40" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round">
        <animate attributeName="d" values="M20,38 Q22,36 20,40;M20,38 Q23,37 21,41;M20,38 Q22,36 20,40" dur="2s" repeatCount="indefinite" />
      </path>

      {/* ═══ ARMOR PLATE (chest) ═══ */}
      <rect x="16" y="28" width="16" height="14" rx="3" fill="#5A6B7A" />
      <rect x="18" y="29" width="12" height="12" rx="2" fill="#6A7B8A" />
      {/* Armor details */}
      <rect x="20" y="31" width="8" height="3" rx="1" fill="#7A8B9A" />
      <line x1="24" y1="29" x2="24" y2="40" stroke="#5A6B7A" strokeWidth="0.8" />
      {/* Shoulder plates */}
      <ellipse cx="14" cy="30" rx="4" ry="3" fill="#5A6B7A" />
      <ellipse cx="34" cy="30" rx="4" ry="3" fill="#5A6B7A" />
      <ellipse cx="14" cy="30" rx="3" ry="2" fill="#6A7B8A" />
      <ellipse cx="34" cy="30" rx="3" ry="2" fill="#6A7B8A" />
      {/* Belt */}
      <rect x="15" y="39" width="18" height="3" rx="1" fill="#8B6914" />
      <circle cx="24" cy="40.5" r="1.8" fill="#DAA520" />

      {/* ═══ SWORD (right hand — fancy) ═══ */}
      <g>
        {/* Blade */}
        <polygon points="40,10 42,28 40,30 38,28" fill="url(#hero-blade)" stroke="#A0B0C0" strokeWidth="0.3" />
        <line x1="40" y1="13" x2="40" y2="27" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
        {/* Guard */}
        <rect x="36" y="29" width="8" height="3" rx="1.5" fill="#DAA520" />
        <circle cx="36.5" cy="30.5" r="1" fill="#4FC3F7" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="43.5" cy="30.5" r="1" fill="#4FC3F7" opacity="0.8">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Grip */}
        <rect x="39" y="32" width="2" height="6" fill="#5A3A20" />
        {/* Pommel */}
        <circle cx="40" cy="39" r="2" fill="#DAA520" />
        <circle cx="40" cy="39" r="1" fill="#4FC3F7" opacity="0.6" />
        {/* Sword glow */}
        <polygon points="40,10 42,28 40,30 38,28" fill="#FFF" opacity="0.08">
          <animate attributeName="opacity" values="0.08;0.2;0.08" dur="3s" repeatCount="indefinite" />
        </polygon>
      </g>

      {/* ═══ SHIELD (left hand — small round) ═══ */}
      <ellipse cx="7" cy="34" rx="5" ry="6" fill="#2563EB" stroke="#DAA520" strokeWidth="0.8" />
      <path d="M4,31 L7,28 L10,31 L7,40 Z" fill="none" stroke="#DAA520" strokeWidth="0.6" />
      <circle cx="7" cy="34" r="1.5" fill="#DAA520" opacity="0.6" />

      {/* ═══ LEGS ═══ */}
      <rect x="17" y="42" width="5" height="10" rx="2" fill="#F5C518" opacity="0.3" />
      <rect x="26" y="42" width="5" height="10" rx="2" fill="#F5C518" opacity="0.3" />
      {/* Boots */}
      <rect x="16" y="49" width="7" height="5" rx="2" fill="#6B4226" />
      <rect x="25" y="49" width="7" height="5" rx="2" fill="#6B4226" />
      <rect x="16" y="49" width="7" height="2" rx="1" fill="#7B5236" />
      <rect x="25" y="49" width="7" height="2" rx="1" fill="#7B5236" />

      {/* Blade gradient */}
      <defs>
        <linearGradient id="hero-blade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A0B8D0" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#A0B8D0" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  )
})
