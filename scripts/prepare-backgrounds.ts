import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";
import { BACKGROUNDS } from "../src/data/backgroundSpecs";
import type { ProceduralBackground } from "../src/data/backgroundSpecs";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "backgrounds");

const FORCE = process.argv.includes("--force");

function canvas(aspect: "4:3" | "16:9"): { w: number; h: number } {
  if (aspect === "4:3") return { w: 1600, h: 1200 };
  return { w: 1600, h: 900 };
}

function toneHex(tone: "carbon" | "void"): string {
  return tone === "carbon" ? "#121212" : "#000000";
}

function stripeHex(color: "volt" | "chalk"): string {
  return color === "volt" ? "#CCFF00" : "#FFFFFF";
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSvg(spec: ProceduralBackground, w: number, h: number): string {
  const base = toneHex(spec.baseTone);
  const stripe = stripeHex(spec.stripeColor);
  const counterStripe = spec.stripeColor === "volt" ? "#FFFFFF" : "#CCFF00";
  const angle = spec.angleDeg;

  const stripeY = Math.floor(h * 0.58);
  const stripeH = Math.floor(h * 0.18);
  const counterStripeY = Math.floor(h * 0.84);
  const counterStripeH = Math.floor(h * 0.06);

  const headlineSize = Math.floor(h * 0.22);
  const sublineSize = Math.floor(h * 0.04);
  const countrySize = Math.floor(h * 0.06);

  const headline = escapeXml(spec.headline.toUpperCase());
  const subline = escapeXml(spec.subline.toUpperCase());
  const country = escapeXml(spec.country.toUpperCase());
  const flag = escapeXml(spec.flag);

  const watermark = escapeXml(spec.country.charAt(0).toUpperCase());
  const watermarkSize = Math.floor(h * 1.1);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <style>
      .display { font-family: 'Ranchers', 'Impact', sans-serif; font-weight: 400; letter-spacing: -0.01em; }
      .mono { font-family: 'Space Mono', ui-monospace, Menlo, monospace; font-weight: 700; letter-spacing: 0.15em; }
    </style>
  </defs>
  <rect width="${w}" height="${h}" fill="${base}" />
  <g transform="rotate(${angle} ${w / 2} ${h / 2})">
    <rect x="-200" y="${stripeY}" width="${w + 400}" height="${stripeH}" fill="${stripe}" />
    <rect x="-200" y="${counterStripeY}" width="${w + 400}" height="${counterStripeH}" fill="${counterStripe}" />
  </g>
  <text x="${w - 50}" y="${Math.floor(h * 0.9)}" text-anchor="end"
        font-family="Ranchers, Impact, sans-serif" font-size="${watermarkSize}"
        fill="#FFFFFF" fill-opacity="0.04">${watermark}</text>
  <g>
    <rect x="40" y="40" width="${Math.floor(w * 0.55)}" height="${Math.floor(h * 0.14)}"
          fill="${stripe}" stroke="#000000" stroke-width="8" />
    <text x="70" y="${Math.floor(h * 0.11)}" class="mono"
          font-size="${countrySize}" fill="#000000">${flag}   ${country}</text>
  </g>
  <text x="70" y="${Math.floor(h * 0.35)}" class="display"
        font-size="${headlineSize}" fill="#FFFFFF"
        stroke="#000000" stroke-width="4" paint-order="stroke">${headline}</text>
  <g transform="translate(70 ${Math.floor(h * 0.42)})">
    <rect x="0" y="0" width="${Math.floor(w * 0.7)}" height="${Math.floor(sublineSize * 2.2)}"
          fill="#000000" stroke="#FFFFFF" stroke-width="4" />
    <text x="20" y="${Math.floor(sublineSize * 1.5)}" class="mono"
          font-size="${sublineSize}" fill="#FFFFFF">${subline}</text>
  </g>
  <g>
    <rect x="0" y="${h - 8}" width="${w}" height="8" fill="#000000" />
    <rect x="0" y="0" width="8" height="${h}" fill="#000000" />
    <rect x="${w - 8}" y="0" width="8" height="${h}" fill="#000000" />
    <rect x="0" y="0" width="${w}" height="8" fill="#000000" />
  </g>
</svg>`;
}

async function renderBackground(spec: ProceduralBackground) {
  const { w, h } = canvas(spec.aspectRatio);
  const svg = buildSvg(spec, w, h);
  const outPath = path.join(OUT_DIR, `${spec.id}.jpg`);
  await sharp(Buffer.from(svg), { density: 72 })
    .resize(w, h, { fit: "cover" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outPath);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let generated = 0;
  let skipped = 0;
  for (const spec of BACKGROUNDS) {
    const outPath = path.join(OUT_DIR, `${spec.id}.jpg`);
    if (fs.existsSync(outPath) && !FORCE) {
      console.log(`SKIP ${spec.id}.jpg (exists)`);
      skipped += 1;
      continue;
    }
    console.log(`BG   ${spec.id} (${spec.aspectRatio})`);
    await renderBackground(spec);
    generated += 1;
  }

  console.log(`\nbackgrounds: ${generated} generated, ${skipped} skipped, total ${BACKGROUNDS.length}`);
}

main().catch((err) => {
  console.error("prepare-backgrounds failed:", err);
  process.exit(1);
});
