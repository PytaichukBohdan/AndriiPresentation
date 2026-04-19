import path from "node:path";
import fs from "node:fs";
import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";
import { BOYS } from "../src/data/boys";

const ROOT = process.cwd();
const IN_DIR = path.join(ROOT, "public", "boys");
const OUT_DIR = path.join(ROOT, "public", "cutouts");

const FORCE = process.argv.includes("--force");

async function main() {
  if (!fs.existsSync(IN_DIR)) {
    throw new Error(`Missing input directory: ${IN_DIR}`);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0;
  let skipped = 0;
  for (const boy of BOYS) {
    const inPath = path.join(IN_DIR, boy.filename);
    const outPath = path.join(OUT_DIR, boy.cutoutFilename);
    if (!fs.existsSync(inPath)) {
      throw new Error(`Missing input file for ${boy.id}: ${inPath}`);
    }
    if (fs.existsSync(outPath) && !FORCE) {
      console.log(`SKIP ${boy.cutoutFilename} (exists)`);
      skipped += 1;
      continue;
    }
    console.log(`CUT  ${boy.filename} -> ${boy.cutoutFilename}`);
    const blob = await removeBackground(inPath, { output: { format: "image/png" } });
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await sharp(buffer).png({ compressionLevel: 8 }).toFile(outPath);
    ok += 1;
  }

  console.log(`\ncutouts: ${ok} ok, ${skipped} skipped, total ${BOYS.length}`);
}

main().catch((err) => {
  console.error("prepare-cutouts failed:", err);
  process.exit(1);
});
