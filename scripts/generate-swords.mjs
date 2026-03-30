/**
 * Sword SVG Generator
 * 등급별(+0~+16) 검 SVG를 public/swords/에 생성
 * 실행: node scripts/generate-swords.mjs
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'swords')
mkdirSync(OUT_DIR, { recursive: true })

// ─── 등급 정의 ───
const TIERS = [
  { id: 'normal',    name: '일반', levels: [0, 1, 2],    color: '#9EAFC0', accent: '#B0BEC5', glow: 0,  blade: 'straight',  guard: 'simple',  pommelGem: '#B0BEC5', runeCount: 0, auraRings: 0, particles: false, serrations: false, wingGuard: false, crown: false },
  { id: 'advanced',  name: '고급', levels: [3, 4],       color: '#4FC3F7', accent: '#81D4FA', glow: 8,  blade: 'straight',  guard: 'simple',  pommelGem: '#4FC3F7', runeCount: 1, auraRings: 0, particles: false, serrations: false, wingGuard: false, crown: false },
  { id: 'rare',      name: '희귀', levels: [5, 6],       color: '#AB47BC', accent: '#CE93D8', glow: 14, blade: 'broad',     guard: 'ornate',  pommelGem: '#AB47BC', runeCount: 2, auraRings: 1, particles: false, serrations: false, wingGuard: false, crown: false },
  { id: 'heroic',    name: '영웅', levels: [7, 8],       color: '#FFB300', accent: '#FFD54F', glow: 22, blade: 'broad',     guard: 'ornate',  pommelGem: '#FFB300', runeCount: 3, auraRings: 1, particles: true,  serrations: true,  wingGuard: false, crown: false },
  { id: 'legendary', name: '전설', levels: [9, 10],      color: '#FF7043', accent: '#FFAB91', glow: 30, blade: 'great',     guard: 'wing',    pommelGem: '#FF7043', runeCount: 3, auraRings: 2, particles: true,  serrations: true,  wingGuard: true,  crown: false },
  { id: 'mythic',    name: '신화', levels: [11, 12],     color: '#EF5350', accent: '#EF9A9A', glow: 40, blade: 'great',     guard: 'wing',    pommelGem: '#EF5350', runeCount: 4, auraRings: 2, particles: true,  serrations: true,  wingGuard: true,  crown: false },
  { id: 'transcend', name: '초월', levels: [13, 14],     color: '#EC407A', accent: '#F48FB1', glow: 50, blade: 'divine',    guard: 'wing',    pommelGem: '#EC407A', runeCount: 5, auraRings: 3, particles: true,  serrations: true,  wingGuard: true,  crown: false },
  { id: 'genesis',   name: '태초', levels: [15, 16],     color: '#FFD700', accent: '#FFF9C4', glow: 60, blade: 'divine',    guard: 'wing',    pommelGem: '#FFD700', runeCount: 5, auraRings: 3, particles: true,  serrations: true,  wingGuard: true,  crown: true  },
]

// ─── Blade geometry by type ───
function getBladePoints(type) {
  switch (type) {
    case 'straight': return { tipX: 60, w: 12, len: 120 }
    case 'broad':    return { tipX: 60, w: 15, len: 125 }
    case 'great':    return { tipX: 60, w: 18, len: 135 }
    case 'divine':   return { tipX: 60, w: 20, len: 140 }
    default:         return { tipX: 60, w: 12, len: 120 }
  }
}

// ─── SVG generation ───
function generateSwordSVG(tier, level) {
  const { color, accent, glow, runeCount, auraRings, particles, serrations, wingGuard, crown, pommelGem } = tier
  const { tipX, w, len } = getBladePoints(tier.blade)
  const cx = 60 // center x

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="220" viewBox="0 0 120 220">\n`
  svg += `  <defs>\n`

  // Metallic blade gradient
  svg += `    <linearGradient id="blade-${tier.id}" x1="0%" y1="0%" x2="100%" y2="0%">\n`
  svg += `      <stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>\n`
  svg += `      <stop offset="20%" stop-color="#E8ECF0" stop-opacity="0.95"/>\n`
  svg += `      <stop offset="40%" stop-color="#FFFFFF" stop-opacity="1"/>\n`
  svg += `      <stop offset="55%" stop-color="#F0F4F8" stop-opacity="0.9"/>\n`
  svg += `      <stop offset="75%" stop-color="#D0D8E0" stop-opacity="0.8"/>\n`
  svg += `      <stop offset="100%" stop-color="${color}" stop-opacity="0.35"/>\n`
  svg += `    </linearGradient>\n`

  // Guard gradient
  svg += `    <linearGradient id="guard-${tier.id}" x1="0%" y1="0%" x2="0%" y2="100%">\n`
  svg += `      <stop offset="0%" stop-color="${color}"/>\n`
  svg += `      <stop offset="30%" stop-color="#FFFBE6" stop-opacity="0.5"/>\n`
  svg += `      <stop offset="70%" stop-color="${color}"/>\n`
  svg += `      <stop offset="100%" stop-color="${accent}" stop-opacity="0.7"/>\n`
  svg += `    </linearGradient>\n`

  // Gem radial
  svg += `    <radialGradient id="gem-${tier.id}" cx="35%" cy="30%">\n`
  svg += `      <stop offset="0%" stop-color="#FFF" stop-opacity="1"/>\n`
  svg += `      <stop offset="30%" stop-color="#FFF" stop-opacity="0.5"/>\n`
  svg += `      <stop offset="60%" stop-color="${pommelGem}"/>\n`
  svg += `      <stop offset="100%" stop-color="${pommelGem}" stop-opacity="0.4"/>\n`
  svg += `    </radialGradient>\n`

  // Glow filter
  if (glow > 0) {
    svg += `    <filter id="glow-${tier.id}" x="-50%" y="-50%" width="200%" height="200%">\n`
    svg += `      <feGaussianBlur stdDeviation="${glow * 0.15}" result="blur"/>\n`
    svg += `      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>\n`
    svg += `    </filter>\n`
  }

  // Rune glow filter
  if (runeCount > 0) {
    svg += `    <filter id="rune-${tier.id}"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>\n`
  }

  // Leather pattern
  svg += `    <pattern id="leather-${tier.id}" width="8" height="8" patternUnits="userSpaceOnUse">\n`
  svg += `      <rect width="8" height="8" fill="#3D2415"/>\n`
  svg += `      <line x1="0" y1="4" x2="8" y2="4" stroke="#5A3A20" stroke-width="1.5"/>\n`
  svg += `    </pattern>\n`

  svg += `  </defs>\n`

  // ═══ AURA RINGS ═══
  for (let i = 0; i < auraRings; i++) {
    const r = 70 + i * 18
    const dash = i % 2 === 0 ? '' : ' stroke-dasharray="6 3"'
    svg += `  <circle cx="${cx}" cy="100" r="${r}" fill="none" stroke="${color}" stroke-width="0.6" opacity="${0.15 - i * 0.03}"${dash}>\n`
    svg += `    <animateTransform attributeName="transform" type="rotate" from="${i % 2 === 0 ? '0' : '360'} ${cx} 100" to="${i % 2 === 0 ? '360' : '0'} ${cx} 100" dur="${18 + i * 5}s" repeatCount="indefinite"/>\n`
    svg += `  </circle>\n`
  }

  // ═══ BLADE ═══
  const bladeGroup = glow > 0 ? `filter="url(#glow-${tier.id})"` : ''
  svg += `  <g ${bladeGroup}>\n`

  // Main blade polygon
  svg += `    <polygon points="${tipX},4 ${cx + w},${len} ${cx},${len + 15} ${cx - w},${len}" fill="url(#blade-${tier.id})" stroke="${color}" stroke-width="0.5" stroke-linejoin="round"/>\n`

  // Center fuller
  svg += `    <line x1="${cx}" y1="16" x2="${cx}" y2="${len - 4}" stroke="${color}" stroke-width="1.2" opacity="0.3"/>\n`

  // Tip reflection
  svg += `    <polygon points="${tipX},4 ${cx + w * 0.35},${len * 0.35} ${cx},${len * 0.45} ${cx - w * 0.12},${len * 0.25}" fill="rgba(255,255,255,0.12)"/>\n`

  // Edge highlights
  svg += `    <line x1="${cx - w + 2}" y1="25" x2="${cx - w}" y2="${len - 2}" stroke="rgba(255,255,255,0.18)" stroke-width="0.5"/>\n`
  svg += `    <line x1="${cx + w - 2}" y1="25" x2="${cx + w}" y2="${len - 2}" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>\n`

  // Serrations
  if (serrations) {
    for (let i = 0; i < 3; i++) {
      const y = 35 + i * 28
      svg += `    <polygon points="${cx - w},${y} ${cx - w - 4},${y + 5} ${cx - w},${y + 10}" fill="${color}" opacity="0.3"/>\n`
      svg += `    <polygon points="${cx + w},${y} ${cx + w + 4},${y + 5} ${cx + w},${y + 10}" fill="${color}" opacity="0.3"/>\n`
    }
  }

  // Runes
  const runeSymbols = ['✦', '◈', '✦', '⚜', '✧']
  for (let i = 0; i < runeCount; i++) {
    const y = 35 + i * 22
    svg += `    <text x="${cx}" y="${y}" text-anchor="middle" font-size="8" fill="${accent}" font-family="serif" filter="url(#rune-${tier.id})" opacity="0.7">${runeSymbols[i]}</text>\n`
  }

  svg += `  </g>\n`

  // ═══ CROSSGUARD ═══
  const gy = len + 12
  if (wingGuard) {
    svg += `  <path d="M8,${gy + 3} C8,${gy - 2} 20,${gy - 2} 28,${gy} L92,${gy} C100,${gy - 2} 112,${gy - 2} 112,${gy + 3} L112,${gy + 8} C112,${gy + 13} 100,${gy + 14} 92,${gy + 12} L28,${gy + 12} C20,${gy + 14} 8,${gy + 13} 8,${gy + 8} Z" fill="url(#guard-${tier.id})" stroke="${color}" stroke-width="0.4"/>\n`
  } else if (tier.guard === 'ornate') {
    svg += `  <rect x="15" y="${gy}" width="90" height="12" rx="4" fill="url(#guard-${tier.id})" stroke="${color}" stroke-width="0.4"/>\n`
    svg += `  <circle cx="22" cy="${gy + 6}" r="2.5" fill="${pommelGem}" opacity="0.8"><animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.5s" repeatCount="indefinite"/></circle>\n`
    svg += `  <circle cx="98" cy="${gy + 6}" r="2.5" fill="${pommelGem}" opacity="0.8"><animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.5s" repeatCount="indefinite" begin="1.2s"/></circle>\n`
  } else {
    svg += `  <rect x="20" y="${gy}" width="80" height="10" rx="3" fill="url(#guard-${tier.id})" stroke="#DAA520" stroke-width="0.4"/>\n`
  }

  // Guard gems for wing/ornate
  if (wingGuard) {
    svg += `  <circle cx="18" cy="${gy + 6}" r="3" fill="${pommelGem}" opacity="0.8"><animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/></circle>\n`
    svg += `  <circle cx="102" cy="${gy + 6}" r="3" fill="${pommelGem}" opacity="0.8"><animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" begin="1s"/></circle>\n`
  }

  // ═══ GRIP ═══
  const gripY = wingGuard ? gy + 14 : gy + (tier.guard === 'ornate' ? 14 : 12)
  svg += `  <rect x="48" y="${gripY}" width="24" height="38" rx="2" fill="url(#leather-${tier.id})"/>\n`
  for (let i = 0; i < 5; i++) {
    svg += `  <line x1="50" y1="${gripY + 5 + i * 7}" x2="70" y2="${gripY + 5 + i * 7}" stroke="#8B6914" stroke-width="1" opacity="0.4"/>\n`
  }

  // ═══ POMMEL ═══
  const pomY = gripY + 42
  svg += `  <ellipse cx="${cx}" cy="${pomY}" rx="12" ry="10" fill="url(#guard-${tier.id})" stroke="${color}" stroke-width="0.4"/>\n`
  svg += `  <circle cx="${cx}" cy="${pomY - 1}" r="5" fill="url(#gem-${tier.id})"><animate attributeName="r" values="5;5.5;5" dur="3s" repeatCount="indefinite"/></circle>\n`
  svg += `  <circle cx="${cx - 2}" cy="${pomY - 3}" r="1.2" fill="white" opacity="0.8"><animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.8s" repeatCount="indefinite"/></circle>\n`

  // ═══ GENESIS CROWN ═══
  if (crown) {
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = deg * Math.PI / 180
      const x2 = cx + Math.cos(rad) * 22
      const y2 = 4 + Math.sin(rad) * 22
      svg += `  <line x1="${cx}" y1="4" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="0.7" opacity="0.3"><animate attributeName="opacity" values="0.3;0.08;0.3" dur="${(1.8 + deg * 0.002).toFixed(1)}s" repeatCount="indefinite"/></line>\n`
    }
  }

  // ═══ PARTICLES ═══
  if (particles) {
    for (let i = 0; i < 4; i++) {
      const px = 30 + i * 20
      const py = 20 + i * 25
      svg += `  <circle cx="${px}" cy="${py}" r="1.5" fill="${accent}" opacity="0"><animate attributeName="opacity" values="0;0.6;0" dur="${2 + i * 0.5}s" repeatCount="indefinite" begin="${i * 0.7}s"/><animate attributeName="cy" values="${py};${py - 15}" dur="${2 + i * 0.5}s" repeatCount="indefinite" begin="${i * 0.7}s"/></circle>\n`
    }
  }

  svg += `</svg>`
  return svg
}

// ─── Generate all ───
console.log('🗡️ Generating sword SVGs...\n')

for (const tier of TIERS) {
  // Generate one SVG per tier (using middle level as representative)
  const repLevel = tier.levels[Math.floor(tier.levels.length / 2)]
  const svg = generateSwordSVG(tier, repLevel)
  const filename = `sword_${tier.id}.svg`
  const filepath = join(OUT_DIR, filename)
  writeFileSync(filepath, svg, 'utf-8')
  console.log(`  ✅ ${filename} (${tier.name} +${tier.levels.join('~+')}) - ${color(tier.color)}`)

  // Also generate per-level variants for levels within tier
  for (const lv of tier.levels) {
    const lvSvg = generateSwordSVG(tier, lv)
    const lvFilename = `sword_lv${lv}.svg`
    writeFileSync(join(OUT_DIR, lvFilename), lvSvg, 'utf-8')
  }
}

function color(hex) { return hex }

// Generate a manifest
const manifest = TIERS.map(t => ({
  id: t.id,
  name: t.name,
  levels: t.levels,
  color: t.color,
  accent: t.accent,
  file: `sword_${t.id}.svg`,
}))

writeFileSync(join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8')
console.log(`\n  📄 manifest.json`)
console.log(`\n✨ Done! ${TIERS.length} tiers + ${TIERS.reduce((s, t) => s + t.levels.length, 0)} level variants generated.`)
