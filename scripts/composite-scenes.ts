import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";
import { SCENES } from "../src/data/sceneSpecs";
import { BACKGROUNDS_BY_ID } from "../src/data/backgroundSpecs";
import { BOYS_BY_ID } from "../src/data/boys";

const ROOT = process.cwd();
const BG_DIR = path.join(ROOT, "public", "backgrounds");
const CUT_DIR = path.join(ROOT, "public", "cutouts");
const OUT_DIR = path.join(ROOT, "public", "generated");

const FORCE = process.argv.includes("--force");

function canvas(aspect: "4:3" | "16:9"): { w: number; h: number } {
  if (aspect === "4:3") return { w: 1600, h: 1200 };
  return { w: 1600, h: 900 };
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function captionBubbleSvg(caption: string, w: number, h: number): string {
  const text = escapeXml(caption.toUpperCase());
  const fontSize = Math.floor(h * 0.045);
  const padding = Math.floor(fontSize * 0.5);
  const approxWidth = Math.min(Math.floor(text.length * fontSize * 0.58) + padding * 2, Math.floor(w * 0.8));
  const boxHeight = fontSize + padding * 2;
  const boxX = Math.floor(w - approxWidth - 40);
  const boxY = Math.floor(h - boxHeight - 40);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <g transform="rotate(-3 ${boxX + approxWidth / 2} ${boxY + boxHeight / 2})">
    <rect x="${boxX + 8}" y="${boxY + 8}" width="${approxWidth}" height="${boxHeight}" fill="#000000" />
    <rect x="${boxX}" y="${boxY}" width="${approxWidth}" height="${boxHeight}" fill="#CCFF00" stroke="#000000" stroke-width="6" />
    <text x="${boxX + padding}" y="${boxY + fontSize + padding - 4}"
          font-family="'Ranchers', Impact, sans-serif" font-size="${fontSize}"
          fill="#000000">${text}</text>
  </g>
</svg>`;
}

async function boyLayer(
  cutPath: string,
  placement: { x: number; y: number; scaleW: number; rotate?: number; flipH?: boolean },
  canvasW: number,
  canvasH: number,
): Promise<Buffer> {
  const maxW = canvasW;
  const maxH = Math.floor(canvasH * 0.9);
  const targetW = Math.floor(placement.scaleW * canvasW);
  let img = sharp(cutPath).resize({ width: targetW, withoutEnlargement: false });
  if (placement.flipH) img = img.flop();
  if (placement.rotate) {
    img = img.rotate(placement.rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
  }
  let buf = await img.png().toBuffer();
  let meta = await sharp(buf).metadata();
  let imgW = meta.width ?? targetW;
  let imgH = meta.height ?? targetW;

  if (imgW > maxW || imgH > maxH) {
    const scale = Math.min(maxW / imgW, maxH / imgH);
    const newW = Math.max(1, Math.floor(imgW * scale));
    const newH = Math.max(1, Math.floor(imgH * scale));
    buf = await sharp(buf).resize(newW, newH, { fit: "inside" }).png().toBuffer();
    meta = await sharp(buf).metadata();
    imgW = meta.width ?? newW;
    imgH = meta.height ?? newH;
  }

  const absLeft = Math.floor(placement.x * canvasW);
  const absTop = Math.floor(placement.y * canvasH);
  const left = Math.max(0, Math.min(absLeft, canvasW - imgW));
  const top = Math.max(0, Math.min(absTop, canvasH - imgH));

  return sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: buf, left, top }])
    .png()
    .toBuffer();
}

async function renderScene(sceneId: string) {
  const scene = SCENES.find((s) => s.id === sceneId);
  if (!scene) throw new Error(`Unknown scene: ${sceneId}`);
  const bg = BACKGROUNDS_BY_ID[scene.bgId];
  if (!bg) throw new Error(`Unknown bg ${scene.bgId} for scene ${scene.id}`);

  const { w, h } = canvas(scene.aspectRatio);
  const bgPath = path.join(BG_DIR, `${scene.bgId}.jpg`);
  if (!fs.existsSync(bgPath)) throw new Error(`Missing background file: ${bgPath}`);

  const layers: sharp.OverlayOptions[] = [];
  const sortedBoys = [...scene.boys].sort((a, b) => a.zIndex - b.zIndex);
  for (const placement of sortedBoys) {
    const boy = BOYS_BY_ID[placement.boyId];
    if (!boy) throw new Error(`Unknown boy ${placement.boyId} in scene ${scene.id}`);
    const cutPath = path.join(CUT_DIR, boy.cutoutFilename);
    if (!fs.existsSync(cutPath)) throw new Error(`Missing cutout: ${cutPath}`);
    const layerBuf = await boyLayer(cutPath, placement, w, h);
    layers.push({ input: layerBuf, left: 0, top: 0 });
  }

  const bubbleSvg = captionBubbleSvg(scene.caption, w, h);
  const bubbleBuf = await sharp(Buffer.from(bubbleSvg), { density: 72 })
    .resize(w, h, { fit: "cover" })
    .png()
    .toBuffer();
  layers.push({ input: bubbleBuf, left: 0, top: 0 });

  const frameSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#000000" stroke-width="16" />
</svg>`;
  const frameBuf = await sharp(Buffer.from(frameSvg), { density: 72 })
    .resize(w, h, { fit: "cover" })
    .png()
    .toBuffer();
  layers.push({ input: frameBuf, left: 0, top: 0 });

  const baseBuf = await sharp(bgPath).resize(w, h, { fit: "cover" }).toBuffer();
  const outPath = path.join(OUT_DIR, `${scene.id}.jpg`);
  await sharp(baseBuf)
    .composite(layers)
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(outPath);
  return outPath;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0;
  let skipped = 0;
  const manifest: Record<string, string> = {};
  for (const scene of SCENES) {
    const outPath = path.join(OUT_DIR, `${scene.id}.jpg`);
    if (fs.existsSync(outPath) && !FORCE) {
      console.log(`SKIP ${scene.id}.jpg (exists)`);
      skipped += 1;
      manifest[scene.id] = `/generated/${scene.id}.jpg`;
      continue;
    }
    console.log(`CMP  ${scene.id}`);
    await renderScene(scene.id);
    manifest[scene.id] = `/generated/${scene.id}.jpg`;
    ok += 1;
  }

  const manifestJson = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), manifestJson);
  const srcManifestPath = path.join(ROOT, "src", "data", "manifest.json");
  fs.writeFileSync(srcManifestPath, manifestJson);
  console.log(`\nscenes: ${ok} composed, ${skipped} skipped, total ${SCENES.length}`);
}

main().catch((err) => {
  console.error("composite-scenes failed:", err);
  process.exit(1);
});
