// scripts/collectTokens.ts
import fs from "node:fs/promises";

const tailwindConfig = await fs.readFile("./tailwind.config.ts", "utf8");
const tokens = [...tailwindConfig.matchAll(/var\\(--(color-[\\w-]+)\\)/g)]
  .map(m => m[1])
  .filter((v, i, a) => a.indexOf(v) === i);   // dedupe

await fs.writeFile(
  "./design-tokens.json",
  JSON.stringify(tokens, null, 2)
);

console.log(`✔ wrote ${tokens.length} tokens`);
