# lotte-cinema-guide

전국 롯데시네마 지점 안내(비공식) — Astro 정적 사이트.

지점별 위치·오시는 길·주차·예매·관람료·FAQ를 정리하고, 실시간 상영시간표·예매는 롯데시네마 공식 홈페이지로 링크아웃합니다. 기존 WordPress 사이트를 URL 그대로 보존해 정적으로 이전한 버전입니다.

## 개발

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # data 생성 + 정적 빌드 → dist/
```

## 구조

- `_source/` — 원본 데이터(지점 상세 JSON · 완성 포스트 HTML · 지역 인덱스 · WP 사이트맵)
- `scripts/build-data.mjs` — 원본을 `src/data/cinemas.json`(134지점)으로 통합. `npm run data`
- `scripts/gen-og.mjs` — OG 이미지·아이콘 생성. `npm run og`
- `src/pages/[slug].astro` — 지점 상세(기존 WP URL 슬러그 100% 보존)
- `src/pages/지역/` — 지역별 목록
- `src/site.config.ts` — 브랜드·인증·애드센스·공식 링크·면책 문구

## 배포

Cloudflare Pages: 빌드 `npm run build`, 출력 `dist`, Node 22+. 승인 도메인 서브도메인에 CNAME 연결.

---

본 사이트는 롯데시네마(롯데컬처웍스 주식회사) 및 공식 서비스와 무관한 비공식 정보 안내 사이트입니다.
