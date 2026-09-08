#!/usr/bin/env node
// OG 이미지(public/og/home.png) + 아이콘(apple-touch-icon.png, logo.png) 생성
//   npm run og
import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const cfg = readFileSync(resolve(root, "src/site.config.ts"), "utf8");
const pick = (re, fb) => (cfg.match(re)?.[1] ?? fb);
const NAME = pick(/name:\s*"([^"]*)"/, "롯데시네마 상영시간표");
const URL = pick(/url:\s*"([^"]*)"/, "");
const HOST = URL.replace(/^https?:\/\//, "").replace(/\/+$/, "");
const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

const FONT = "'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#e4002b"/><stop offset="1" stop-color="#9b0020"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g transform="translate(90,116)">
    <rect x="0" y="0" width="96" height="96" rx="20" fill="#ffffff"/>
    <path d="M34 22 h15 v40 h26 v15 h-41 z" fill="#e4002b"/>
  </g>
  <text x="94" y="330" font-family="${FONT}" font-size="66" font-weight="800" fill="#ffffff" letter-spacing="-2">전국 롯데시네마</text>
  <text x="94" y="410" font-family="${FONT}" font-size="66" font-weight="800" fill="#ffffff" letter-spacing="-2">상영시간표 안내</text>
  <text x="96" y="470" font-family="${FONT}" font-size="28" font-weight="500" fill="#ffd0d7">지점별 위치 · 주차 · 예매 · 관람료 한눈에</text>
  <text x="96" y="556" font-family="${FONT}" font-size="26" font-weight="700" fill="#ffb3bf">${esc(HOST)}</text>
</svg>`;

const icon = readFileSync(resolve(root, "public/favicon.svg"));

mkdirSync(resolve(root, "public/og"), { recursive: true });
const a = await sharp(Buffer.from(og), { density: 150 }).png().toFile(resolve(root, "public/og/home.png"));
await sharp(icon, { density: 400 }).resize(180, 180).png().toFile(resolve(root, "public/apple-touch-icon.png"));
await sharp(icon, { density: 400 }).resize(512, 512).png().toFile(resolve(root, "public/logo.png"));
console.log(`  ✓ og/home.png (${a.width}x${a.height}) · apple-touch-icon.png · logo.png`);
