import { execSync } from "node:child_process";

const FORCE = process.argv.includes("--force");
const suffix = FORCE ? " -- --force" : "";

function run(cmd: string) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

try {
  run(`pnpm run prep:cutouts${suffix}`);
  run(`pnpm run prep:bg${suffix}`);
  run(`pnpm run comp:scenes${suffix}`);
  console.log("\n✅ gen:images complete.");
} catch (err) {
  console.error("gen-all failed:", err);
  process.exit(1);
}
