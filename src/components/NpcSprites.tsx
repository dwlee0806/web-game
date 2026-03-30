'use client'

// SD RPG style NPC sprites (big head, small body)
// Each NPC is a self-contained SVG with walk animation via CSS

interface NpcSpriteProps {
  type: string
  size?: number
}

export function NpcSprite({ type, size = 28 }: NpcSpriteProps) {
  const s = size
  const h = s * 1.4

  switch (type) {
    case 'knight': return <KnightSvg w={s} h={h} />
    case 'mage': return <MageSvg w={s} h={h} />
    case 'archer': return <ArcherSvg w={s} h={h} />
    case 'healer': return <HealerSvg w={s} h={h} />
    case 'merchant': return <MerchantSvg w={s} h={h} />
    case 'blacksmith': return <BlacksmithSvg w={s} h={h} />
    case 'child': return <ChildSvg w={s} h={h} />
    case 'cat': return <CatSvg w={s} h={h} />
    default: return <KnightSvg w={s} h={h} />
  }
}

function KnightSvg({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 28 40">
      {/* Helmet */}
      <rect x="6" y="0" width="16" height="16" rx="4" fill="#A0A0B0" />
      <rect x="8" y="2" width="12" height="4" rx="1" fill="#C0C0D0" />
      {/* Visor */}
      <rect x="9" y="8" width="10" height="3" rx="1" fill="#333" />
      {/* Eyes through visor */}
      <circle cx="11" cy="9.5" r="1" fill="#4AE" />
      <circle cx="17" cy="9.5" r="1" fill="#4AE" />
      {/* Plume */}
      <ellipse cx="14" cy="1" rx="3" ry="2" fill="#E44" />
      {/* Body armor */}
      <rect x="7" y="16" width="14" height="12" rx="2" fill="#8090A0" />
      <rect x="10" y="17" width="8" height="4" rx="1" fill="#A0B0C0" />
      {/* Belt */}
      <rect x="8" y="24" width="12" height="2" fill="#8B6914" />
      {/* Shield (left arm) */}
      <ellipse cx="4" cy="22" rx="4" ry="5" fill="#3060A0" stroke="#FFD700" strokeWidth="0.5" />
      <line x1="4" y1="18" x2="4" y2="26" stroke="#FFD700" strokeWidth="0.5" />
      <line x1="1" y1="22" x2="7" y2="22" stroke="#FFD700" strokeWidth="0.5" />
      {/* Sword (right arm) */}
      <rect x="24" y="12" width="2" height="14" fill="#C0C0C0" />
      <rect x="22" y="25" width="6" height="2" rx="1" fill="#DAA520" />
      {/* Legs */}
      <rect x="9" y="28" width="4" height="10" rx="1" fill="#606878" />
      <rect x="15" y="28" width="4" height="10" rx="1" fill="#606878" />
      {/* Boots */}
      <rect x="8" y="36" width="6" height="4" rx="1" fill="#5A4030" />
      <rect x="14" y="36" width="6" height="4" rx="1" fill="#5A4030" />
    </svg>
  )
}

function MageSvg({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 28 40">
      {/* Hat */}
      <polygon points="14,0 6,12 22,12" fill="#4040A0" />
      <ellipse cx="14" cy="12" rx="9" ry="3" fill="#3030A0" />
      <circle cx="14" cy="3" r="2" fill="#FFD700" />
      {/* Face */}
      <circle cx="14" cy="14" r="7" fill="#FDEBD0" />
      {/* Eyes */}
      <circle cx="11" cy="13" r="1.2" fill="#333" />
      <circle cx="17" cy="13" r="1.2" fill="#333" />
      <circle cx="11.5" cy="12.5" r="0.4" fill="#FFF" />
      <circle cx="17.5" cy="12.5" r="0.4" fill="#FFF" />
      {/* Smile */}
      <path d="M11,16 Q14,18 17,16" fill="none" stroke="#A0522D" strokeWidth="0.6" />
      {/* Robe */}
      <path d="M7,20 L5,38 H23 L21,20 Z" fill="#5050B0" />
      <path d="M9,20 L8,38 H20 L19,20 Z" fill="#6060C0" />
      {/* Belt */}
      <rect x="8" y="25" width="12" height="2" rx="1" fill="#DAA520" />
      {/* Staff */}
      <rect x="24" y="8" width="2" height="28" rx="1" fill="#8B6914" />
      <circle cx="25" cy="7" r="3" fill="#A060E0" />
      <circle cx="25" cy="7" r="1.5" fill="#D0A0FF">
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Shoes */}
      <rect x="7" y="36" width="6" height="4" rx="2" fill="#3030A0" />
      <rect x="15" y="36" width="6" height="4" rx="2" fill="#3030A0" />
    </svg>
  )
}

function ArcherSvg({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 28 40">
      {/* Hair */}
      <ellipse cx="14" cy="8" rx="8" ry="8" fill="#2E8B57" />
      {/* Face */}
      <circle cx="14" cy="10" r="6" fill="#FDEBD0" />
      {/* Eyes */}
      <circle cx="12" cy="9" r="1" fill="#333" />
      <circle cx="16" cy="9" r="1" fill="#333" />
      {/* Headband */}
      <rect x="6" y="6" width="16" height="2" fill="#2E8B57" />
      {/* Hood */}
      <path d="M6,7 Q14,2 22,7" fill="none" stroke="#2E8B57" strokeWidth="2" />
      {/* Tunic */}
      <rect x="8" y="16" width="12" height="14" rx="2" fill="#228B22" />
      <rect x="10" y="17" width="8" height="6" rx="1" fill="#2E9B32" />
      {/* Belt + quiver */}
      <rect x="8" y="24" width="12" height="2" fill="#8B6914" />
      <rect x="20" y="14" width="4" height="16" rx="1" fill="#8B6914" />
      <line x1="21" y1="14" x2="21" y2="10" stroke="#8B6914" strokeWidth="1" />
      <line x1="23" y1="14" x2="23" y2="11" stroke="#8B6914" strokeWidth="1" />
      {/* Bow */}
      <path d="M3,10 Q0,22 3,34" fill="none" stroke="#8B6914" strokeWidth="1.5" />
      <line x1="3" y1="10" x2="3" y2="34" stroke="#A0A0A0" strokeWidth="0.5" />
      {/* Legs */}
      <rect x="9" y="30" width="4" height="8" rx="1" fill="#1B6B1B" />
      <rect x="15" y="30" width="4" height="8" rx="1" fill="#1B6B1B" />
      {/* Boots */}
      <rect x="8" y="36" width="6" height="4" rx="1" fill="#654321" />
      <rect x="14" y="36" width="6" height="4" rx="1" fill="#654321" />
    </svg>
  )
}

function HealerSvg({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 28 40">
      {/* Hair */}
      <ellipse cx="14" cy="7" rx="8" ry="7" fill="#FFD700" />
      {/* Face */}
      <circle cx="14" cy="10" r="6" fill="#FFF0E0" />
      {/* Eyes */}
      <ellipse cx="12" cy="9" rx="1" ry="1.3" fill="#5090C0" />
      <ellipse cx="16" cy="9" rx="1" ry="1.3" fill="#5090C0" />
      <circle cx="12.3" cy="8.7" r="0.4" fill="#FFF" />
      <circle cx="16.3" cy="8.7" r="0.4" fill="#FFF" />
      {/* Blush */}
      <ellipse cx="10" cy="12" rx="1.5" ry="0.8" fill="#FFB6B6" opacity="0.5" />
      <ellipse cx="18" cy="12" rx="1.5" ry="0.8" fill="#FFB6B6" opacity="0.5" />
      {/* Smile */}
      <path d="M12,13 Q14,15 16,13" fill="none" stroke="#D0A080" strokeWidth="0.5" />
      {/* Robe */}
      <path d="M7,16 L5,38 H23 L21,16 Z" fill="#F0F0FF" />
      <path d="M9,16 L8,38 H20 L19,16 Z" fill="#FFFFFF" />
      {/* Cross */}
      <rect x="12" y="20" width="4" height="8" fill="#E04040" />
      <rect x="10" y="22" width="8" height="4" fill="#E04040" />
      {/* Staff with orb */}
      <rect x="24" y="10" width="1.5" height="26" fill="#DAA520" />
      <circle cx="24.75" cy="9" r="2.5" fill="#80FF80" opacity="0.8">
        <animate attributeName="r" values="2.5;3;2.5" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Shoes */}
      <rect x="7" y="36" width="6" height="4" rx="2" fill="#D0D0E0" />
      <rect x="15" y="36" width="6" height="4" rx="2" fill="#D0D0E0" />
    </svg>
  )
}

function MerchantSvg({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 28 40">
      {/* Hat */}
      <ellipse cx="14" cy="6" rx="10" ry="4" fill="#8B4513" />
      <rect x="6" y="2" width="16" height="5" rx="2" fill="#A0522D" />
      {/* Face */}
      <circle cx="14" cy="11" r="6" fill="#FDEBD0" />
      {/* Eyes */}
      <line x1="10" y1="10" x2="13" y2="10" stroke="#333" strokeWidth="1.2" />
      <line x1="15" y1="10" x2="18" y2="10" stroke="#333" strokeWidth="1.2" />
      {/* Mustache */}
      <path d="M10,13 Q14,16 18,13" fill="none" stroke="#8B4513" strokeWidth="1" />
      {/* Body */}
      <rect x="6" y="17" width="16" height="14" rx="3" fill="#DAA520" />
      <rect x="8" y="18" width="12" height="12" rx="2" fill="#E8C840" />
      {/* Belt */}
      <rect x="7" y="26" width="14" height="2" fill="#654321" />
      {/* Backpack */}
      <rect x="20" y="16" width="6" height="12" rx="2" fill="#8B6914" />
      <rect x="21" y="17" width="4" height="3" rx="1" fill="#A08040" />
      {/* Legs */}
      <rect x="8" y="31" width="5" height="7" rx="1" fill="#B08030" />
      <rect x="15" y="31" width="5" height="7" rx="1" fill="#B08030" />
      {/* Boots */}
      <rect x="7" y="36" width="7" height="4" rx="1" fill="#654321" />
      <rect x="14" y="36" width="7" height="4" rx="1" fill="#654321" />
    </svg>
  )
}

function BlacksmithSvg({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 28 40">
      {/* Head */}
      <circle cx="14" cy="8" r="7" fill="#D2B48C" />
      {/* Bandana */}
      <path d="M7,5 Q14,2 21,5" fill="#E04040" />
      <rect x="7" y="4" width="14" height="3" fill="#E04040" />
      {/* Face */}
      <circle cx="11" cy="8" r="1.2" fill="#333" />
      <circle cx="17" cy="8" r="1.2" fill="#333" />
      {/* Beard */}
      <path d="M9,11 Q14,17 19,11" fill="#654321" />
      {/* Body (muscular) */}
      <rect x="5" y="15" width="18" height="14" rx="3" fill="#404040" />
      <rect x="7" y="16" width="14" height="6" rx="1" fill="#505050" />
      {/* Apron */}
      <rect x="8" y="22" width="12" height="8" rx="1" fill="#8B6914" />
      {/* Hammer */}
      <rect x="22" y="14" width="3" height="4" rx="1" fill="#808080" />
      <rect x="23" y="18" width="1.5" height="14" fill="#654321" />
      {/* Arms (big) */}
      <rect x="2" y="16" width="5" height="10" rx="2" fill="#D2B48C" />
      {/* Legs */}
      <rect x="8" y="30" width="5" height="8" rx="1" fill="#333" />
      <rect x="15" y="30" width="5" height="8" rx="1" fill="#333" />
      {/* Boots */}
      <rect x="7" y="36" width="7" height="4" rx="1" fill="#3A2010" />
      <rect x="14" y="36" width="7" height="4" rx="1" fill="#3A2010" />
    </svg>
  )
}

function ChildSvg({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 24 34">
      {/* Hair */}
      <ellipse cx="12" cy="6" rx="7" ry="6" fill="#8B4513" />
      {/* Face */}
      <circle cx="12" cy="8" r="5.5" fill="#FFE4C4" />
      {/* Eyes (big cute) */}
      <circle cx="10" cy="7" r="1.5" fill="#333" />
      <circle cx="14" cy="7" r="1.5" fill="#333" />
      <circle cx="10.5" cy="6.5" r="0.5" fill="#FFF" />
      <circle cx="14.5" cy="6.5" r="0.5" fill="#FFF" />
      {/* Blush */}
      <circle cx="8" cy="9" r="1.2" fill="#FFB6B6" opacity="0.4" />
      <circle cx="16" cy="9" r="1.2" fill="#FFB6B6" opacity="0.4" />
      {/* Mouth */}
      <circle cx="12" cy="10" r="0.8" fill="#E08080" />
      {/* Body */}
      <rect x="7" y="13" width="10" height="10" rx="3" fill="#FF8C00" />
      <rect x="9" y="14" width="6" height="4" rx="1" fill="#FFA030" />
      {/* Shorts */}
      <rect x="7" y="23" width="10" height="4" rx="1" fill="#4169E1" />
      {/* Legs */}
      <rect x="8" y="27" width="3" height="5" rx="1" fill="#FFE4C4" />
      <rect x="13" y="27" width="3" height="5" rx="1" fill="#FFE4C4" />
      {/* Shoes */}
      <rect x="7" y="31" width="4" height="3" rx="1" fill="#8B0000" />
      <rect x="13" y="31" width="4" height="3" rx="1" fill="#8B0000" />
    </svg>
  )
}

function CatSvg({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 24 28">
      {/* Body */}
      <ellipse cx="12" cy="18" rx="7" ry="5" fill="#FF8C00" />
      {/* Head */}
      <circle cx="12" cy="10" r="6" fill="#FFA500" />
      {/* Ears */}
      <polygon points="7,5 5,1 9,4" fill="#FFA500" />
      <polygon points="17,5 19,1 15,4" fill="#FFA500" />
      <polygon points="7.5,5.5 6,2 8.5,4.5" fill="#FFB6B6" />
      <polygon points="16.5,5.5 18,2 15.5,4.5" fill="#FFB6B6" />
      {/* Eyes */}
      <ellipse cx="10" cy="9" rx="1.3" ry="1.8" fill="#333" />
      <ellipse cx="14" cy="9" rx="1.3" ry="1.8" fill="#333" />
      <circle cx="10.4" cy="8.5" r="0.5" fill="#FFF" />
      <circle cx="14.4" cy="8.5" r="0.5" fill="#FFF" />
      {/* Nose */}
      <polygon points="12,11 11,12 13,12" fill="#FF6B6B" />
      {/* Whiskers */}
      <line x1="4" y1="11" x2="9" y2="12" stroke="#333" strokeWidth="0.3" />
      <line x1="4" y1="13" x2="9" y2="13" stroke="#333" strokeWidth="0.3" />
      <line x1="20" y1="11" x2="15" y2="12" stroke="#333" strokeWidth="0.3" />
      <line x1="20" y1="13" x2="15" y2="13" stroke="#333" strokeWidth="0.3" />
      {/* Tail */}
      <path d="M19,18 Q24,14 22,10" fill="none" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" />
      {/* Legs */}
      <rect x="7" y="22" width="3" height="4" rx="1" fill="#FFA500" />
      <rect x="14" y="22" width="3" height="4" rx="1" fill="#FFA500" />
      {/* Paws */}
      <ellipse cx="8.5" cy="26" rx="2" ry="1.2" fill="#FDEBD0" />
      <ellipse cx="15.5" cy="26" rx="2" ry="1.2" fill="#FDEBD0" />
      {/* Stripes */}
      <line x1="10" y1="16" x2="10" y2="20" stroke="#CC7000" strokeWidth="0.8" />
      <line x1="14" y1="16" x2="14" y2="20" stroke="#CC7000" strokeWidth="0.8" />
    </svg>
  )
}
