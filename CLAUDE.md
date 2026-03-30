# CLAUDE.md

## Project Overview

검 강화 시뮬레이터 — 매일 출석체크 + 검 강화 + 상점/업적/미션 웹 게임.
Next.js (Static Export) + Tailwind CSS. Cloudflare Pages 배포.

## Commands

```bash
npm run dev          # 로컬 개발 서버 (Turbopack)
npm run build        # Next.js 정적 빌드 (out/ 폴더)
npm run lint         # ESLint
```

## Deploy

```bash
npm run build && npx wrangler pages deploy out --project-name=web-game --commit-dirty=true
```

Live: https://web-game-6cy.pages.dev

## Architecture

- **배포**: Cloudflare Pages (정적 빌드, output: 'export')
- **데이터**: localStorage (서버 없음, 클라이언트 전용)
- **PWA**: manifest.json + SVG 아이콘 (홈 화면 추가 지원)

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/gameLogic.ts` | 강화 확률, 비용, 등급, 상점 아이템 |
| `src/lib/achievements.ts` | 15개 업적 정의 + 조건 체크 |
| `src/lib/missions.ts` | 일일 미션 풀 + 날짜별 시드 랜덤 |
| `src/components/Game.tsx` | 메인 게임 + 탭 오케스트레이터 |
| `src/components/Sword.tsx` | 검 SVG (레벨별 글로우) |
| `src/components/Particles.tsx` | 성공/파괴 파티클 효과 |
| `src/components/ShopTab.tsx` | 상점 UI |
| `src/components/AchievementsTab.tsx` | 업적 UI |
| `src/components/MissionsTab.tsx` | 일일 미션 UI |
| `src/components/ShareButton.tsx` | SNS 공유 |

## Key Patterns

- 완전 클라이언트 사이드 (API Route 없음)
- localStorage 키: `sword-enhance-v2` (게임), `sword-missions-v1` (미션)
- v1→v2 마이그레이션 자동 처리
- 일일 미션: 날짜 기반 시드 랜덤으로 매일 같은 미션 보장
- CSS 애니메이션: float-up, enhance, shake, pop, particle-fly, flash-red/gold
