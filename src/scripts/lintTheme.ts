import fs from "fs";
import path from "path";
const required = JSON.parse(fs.readFileSync("./design-tokens.json", "utf8"));

const themePath = process.argv[2];
const css = fs.readFileSync(themePath, "utf8");
const defined = [...css.matchAll(/--(color-[\\w-]+):/g)].map(m => m[1]);

const missing = required.filter((t: string) => !defined.includes(t));
if (missing.length) {
  console.error(`⛔  ${path.basename(themePath)} missing ${missing.length} tokens`);
  missing.forEach((t: string) => console.error("   ", t));
  process.exit(1);
} else {
  console.log(`✅  ${path.basename(themePath)} complete`);
}
