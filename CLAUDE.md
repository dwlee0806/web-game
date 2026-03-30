# CLAUDE.md

## Project Overview

검 강화 시뮬레이터 — 매일 출석체크 + 검 강화 웹 게임.
Next.js (Static Export) + Tailwind CSS. Cloudflare Pages 배포.

## Commands

```bash
npm run dev          # 로컬 개발 서버 (Turbopack)
npm run build        # Next.js 정적 빌드 (out/ 폴더)
npm run lint         # ESLint
```

## Architecture

- **배포**: Cloudflare Pages (정적 빌드, output: 'export')
- **데이터**: localStorage (서버 없음, 클라이언트 전용)
- **게임 로직**: `src/lib/gameLogic.ts` — 강화 확률, 비용, 출석 보상
- **UI**: `src/components/Game.tsx` — 메인 게임 컴포넌트, `src/components/Sword.tsx` — 검 SVG

## Key Patterns

- 완전 클라이언트 사이드 (API Route 없음, 서버 로직 없음)
- localStorage로 게임 상태 저장
- CSS 애니메이션으로 강화 결과 표현 (성공/유지/파괴)
- `output: 'export'`로 정적 사이트 생성 → Cloudflare Pages에 out/ 디렉토리 배포
