import { readdir, writeFile } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";
import { createHash } from "node:crypto";

const root = resolve("dist/client");
async function collect(directory) {
  const assets = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) assets.push(...await collect(path));
    else {
      const url = "/" + relative(root, path).split(sep).join("/");
      if (/^(\/assets\/|\/_next\/static\/).+\.(js|css|woff2?|ttf)$/.test(url) || /^\/chess\/[\w.-]+\.(js|wasm|txt)$/.test(url)) assets.push(url);
    }
  }
  return assets;
}
const assets = (await collect(root)).sort();
if (!assets.includes("/chess/stockfish.js") || !assets.some((path) => path.endsWith(".wasm")) || assets.length > 400) throw new Error("Invalid chess offline manifest");
const version = createHash("sha256").update(assets.join("\n")).digest("hex").slice(0, 16);
await writeFile(resolve(root, "chess-offline-assets.json"), JSON.stringify({ version, assets }));
console.log(`Prepared Chess Lab offline manifest: ${assets.length} assets.`);
