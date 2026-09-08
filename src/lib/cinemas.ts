import cinemasData from "../data/cinemas.json";

export interface Cinema {
  id: number;
  slug: string;
  url: string;
  name: string;
  nameEn: string;
  region: string;
  address: string;
  lat: number | null;
  lng: number | null;
  screenCount: number | null;
  seatCount: number | null;
  title: string;
  description: string;
  bodyHtml: string;
}

export const CINEMAS = cinemasData as Cinema[];

/** 인덱스 등장 순서를 유지한 지역 목록 */
export const REGIONS: string[] = [...new Set(CINEMAS.map((c) => c.region))];

/** 지역 → 지점 배열 */
export function byRegion(): { region: string; cinemas: Cinema[] }[] {
  return REGIONS.map((region) => ({
    region,
    cinemas: CINEMAS.filter((c) => c.region === region),
  }));
}

export function getCinema(slug: string): Cinema | undefined {
  return CINEMAS.find((c) => c.slug === slug);
}

/** 하버사인 거리(km) */
function distanceKm(a: Cinema, b: Cinema): number {
  if (a.lat == null || a.lng == null || b.lat == null || b.lng == null) return Infinity;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** 가까운 지점 N개 (좌표 기준, 같은 지점 제외) */
export function nearby(target: Cinema, n = 6): Cinema[] {
  return CINEMAS.filter((c) => c.id !== target.id)
    .map((c) => ({ c, d: distanceKm(target, c) }))
    .sort((x, y) => x.d - y.d)
    .slice(0, n)
    .map((x) => x.c);
}
