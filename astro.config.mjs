// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// 승인된 도메인(한글 서브도메인의 punycode). SEO·색인 유지를 위해 기존 URL 그대로 사용.
const SITE_URL = "https://xn----cy5et9kgvcyujh7bb8td7dea361fcv6b.anywhereifyoucan.com";

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
  ],
});
