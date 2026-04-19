import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "dist-artifact");
const INDEX = path.join(OUT, "index.html");
const BUNDLE = path.join(OUT, "bundle.html");

if (!fs.existsSync(INDEX)) {
  throw new Error(`Missing ${INDEX} — did vite build --mode bundle succeed?`);
}

fs.renameSync(INDEX, BUNDLE);

// Copy generated scene images + boys + cutouts + backgrounds so the bundle works offline
const copyDir = (src, dst) => {
  if (!fs.existsSync(src)) throw new Error(`Missing source dir: ${src}`);
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
};

copyDir(path.join(ROOT, "public", "generated"), path.join(OUT, "generated"));
copyDir(path.join(ROOT, "public", "boys"), path.join(OUT, "boys"));

const size = fs.statSync(BUNDLE).size;
const kb = Math.round(size / 1024);
console.log(`✅ bundle.html: ${kb} KB`);
console.log(`✅ images copied: generated/ boys/`);
console.log(`\nOpen: open ${path.relative(ROOT, BUNDLE)}`);
