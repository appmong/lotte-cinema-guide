#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// _source/ 원본(지역 인덱스 · 지점 상세 JSON · 완성 포스트 HTML · WP 사이트맵)을
// 하나의 src/data/cinemas.json 으로 통합합니다.
//   - URL 슬러그는 기존 WP page-sitemap.xml 에서 그대로 가져와 100% 보존
//   - 본문(bodyHtml)은 기존 posts_html 을 그대로 사용
//
//   node scripts/build-data.mjs   또는   npm run data
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const SRC = resolve(root, "_source");

// 1) WP 사이트맵 → 슬러그 목록
const xml = readFileSync(resolve(SRC, "page-sitemap.xml"), "utf8");
const slugSet = new Set();
for (const m of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
  const path = decodeURIComponent(new URL(m[1]).pathname);
  if (path && path !== "/") slugSet.add(path.replace(/^\/+|\/+$/g, ""));
}

// 2) 지역 인덱스
const index = JSON.parse(readFileSync(resolve(SRC, "index_by_region.json"), "utf8"));

// 지점명 → 슬러그 후보 (WP 규칙: 괄호 제거·공백 제거 + '롯데시네마-상영시간표')
const norm = (name) =>
  name.replace(/[（）()]/g, "").replace(/\s+/g, "") + "롯데시네마-상영시간표";

const detailDir = resolve(SRC, "lotte_cinema_details");
const detailFiles = new Set(readdirSync(detailDir).filter((f) => f.endsWith(".json")));

const strip = (s) =>
  (s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const cinemas = [];
const problems = [];

for (const region of index.regions) {
  for (const c of region.cinemas) {
    const slug = norm(c.name);
    if (!slugSet.has(slug)) problems.push(`슬러그 미매칭: ${c.name} -> ${slug}`);

    // 상세 JSON (파일명 = {id}_{name}.json)
    const detailFile = c.file && detailFiles.has(c.file) ? c.file : `${c.cinemaId}_${c.name}.json`;
    let detail = {};
    try {
      detail = JSON.parse(readFileSync(resolve(detailDir, detailFile), "utf8")).CinemaDetail || {};
    } catch {
      problems.push(`상세 없음: ${detailFile}`);
    }

    // 본문 HTML (파일명 = {id}_{name}.html)
    const htmlName = detailFile.replace(/\.json$/, ".html");
    let bodyHtml = "";
    try {
      bodyHtml = readFileSync(resolve(SRC, "posts_html", htmlName), "utf8")
        .replace(/<!--[\s\S]*?-->/g, "") // 붙여넣기용 주석 제거
        .trim();
    } catch {
      problems.push(`본문 없음: ${htmlName}`);
    }

    // 본문에서 H1(제목) / 첫 문단(설명) 추출 → SEO 메타
    const h1 = strip((bodyHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1]);
    const firstP = strip((bodyHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i) || [])[1]);

    cinemas.push({
      id: c.cinemaId,
      slug,
      url: `/${slug}/`,
      name: c.name,
      nameEn: c.nameEn || detail.CinemaNameUS || "",
      region: region.region,
      address: c.address || detail.Address || "",
      lat: parseFloat(c.lat ?? detail.Latitude) || null,
      lng: parseFloat(c.lng ?? detail.Longitude) || null,
      screenCount: c.screenCount ?? detail.TotalScreenCount ?? null,
      seatCount: c.seatCount ?? detail.TotalSeatCount ?? null,
      title: h1 || `${c.name} 롯데시네마 상영시간표`,
      description:
        (firstP || `${c.name} 롯데시네마 상영시간표, 위치, 주차, 예매, 가격 정보를 한 번에 정리했습니다.`).slice(0, 155),
      bodyHtml,
    });
  }
}

// 지역별 그룹(홈/지역 페이지용) — 지역은 인덱스 등장 순서 유지
const regionOrder = index.regions.map((r) => r.region);
cinemas.sort(
  (a, b) => regionOrder.indexOf(a.region) - regionOrder.indexOf(b.region) || a.id - b.id,
);

mkdirSync(resolve(root, "src/data"), { recursive: true });
writeFileSync(
  resolve(root, "src/data/cinemas.json"),
  JSON.stringify(cinemas, null, 0),
  "utf8",
);

console.log(`  ✓ src/data/cinemas.json — ${cinemas.length}개 지점 / ${regionOrder.length}개 지역`);
if (problems.length) {
  console.log(`  ⚠ 확인 필요 ${problems.length}건:`);
  for (const p of problems) console.log("     -", p);
} else {
  console.log("  ✓ URL 슬러그 100% 매칭, 상세·본문 누락 없음");
}
