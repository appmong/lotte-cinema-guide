// ─────────────────────────────────────────────────────────────
// 사이트 중앙 설정 — 롯데시네마 전국 지점 안내(비공식)
// ─────────────────────────────────────────────────────────────

export const SITE = {
  /** 승인된 배포 도메인(한글 서브도메인 punycode) */
  url: "https://xn----cy5et9kgvcyujh7bb8td7dea361fcv6b.anywhereifyoucan.com",
  /** 브랜드(기존 WP 사이트명 유지 → SEO 연속성) */
  name: "롯데시네마 상영시간표",
  /** 한 줄 슬로건 */
  tagline: "전국 롯데시네마 지점 정보를 한곳에서",
  /** 메타 description 기본값 */
  description:
    "전국 롯데시네마 지점별 위치, 오시는 길, 주차, 예매, 관람료 정보를 정리하고 실시간 상영시간표는 공식 홈페이지로 바로 연결해 드립니다.",
  lang: "ko-KR",
  email: "help@lottecinemaguide.example",
} as const;

// 검색엔진 인증 (발급 후 값만 채우면 <head>에 자동 삽입)
export const VERIFICATION = {
  google: "",
  naver: "",
} as const;

// 애드센스 — ca-pub-XXXX (승인 도메인이면 기존 값 입력)
export const ADSENSE = {
  clientId: "",
} as const;

// 애널리틱스 (선택)
export const ANALYTICS = {
  naver: "",
  google: "",
} as const;

// 롯데시네마 공식 링크 (실시간 정보는 전부 공식으로 링크아웃)
export const OFFICIAL = {
  schedule: "https://www.lottecinema.co.kr/NLCHS/Ticketing/Schedule",
  ticketing: "https://www.lottecinema.co.kr/NLCHS/Ticketing",
  event: "https://www.lottecinema.co.kr/NLCHS/Event/DetailList?code=50",
  home: "https://www.lottecinema.co.kr/NLCHS",
} as const;

// 비공식 안내 면책 문구 (AdSense/상표 리스크 대비 — 모든 페이지 하단 노출)
export const DISCLAIMER =
  "본 사이트는 롯데시네마(롯데컬처웍스 주식회사) 및 공식 서비스와 무관한 비공식 정보 안내 사이트입니다. 상영시간표·예매·요금 등 실시간 정보와 최종 확인은 반드시 롯데시네마 공식 홈페이지·앱을 이용해 주세요. 지점 정보는 변경될 수 있습니다.";
