# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"어디갈까?" — 현재 위치 기반 주변 놀거리/먹거리/관광지 추천 서비스.
카카오맵 API를 사용한 싱글 페이지 앱 (Next.js App Router + Tailwind CSS).

## Commands

```bash
npm run dev          # 로컬 개발 서버 (Turbopack)
npm run build        # Next.js 빌드
npm run build:cf     # Cloudflare 빌드 (opennextjs-cloudflare)
npm run preview      # Cloudflare 로컬 프리뷰
npm run deploy       # Cloudflare Pages 배포
npm run lint         # ESLint
```

## Architecture

- **배포**: Cloudflare Pages via `@opennextjs/cloudflare` (wrangler.jsonc)
- **지도**: 카카오맵 JavaScript SDK (클라이언트) + REST API (서버 프록시)
- **API 프록시**: `src/app/api/kakao/route.ts` — REST API 키를 서버에서만 사용하여 노출 방지
- **환경변수**:
  - `NEXT_PUBLIC_KAKAO_JS_KEY` — 카카오맵 렌더링용 (도메인 제한으로 보호)
  - `KAKAO_REST_KEY` — 장소 검색용 (서버 전용, 절대 클라이언트에 노출 금지)

## Key Patterns

- 카카오맵 SDK는 `next/script`로 로드 후 `window.kakao.maps` 사용
- 장소 검색은 반드시 API Route를 통해 서버에서 호출 (REST API 키 보호)
- 모바일: 하단 시트(BottomSheet)로 장소 목록 표시 / 데스크톱: 사이드 패널
- 카테고리 코드: FD6(맛집), CE7(카페), CT1(놀거리), AT4(관광)
