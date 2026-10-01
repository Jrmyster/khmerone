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
      if (/^(\/assets\/|\/_next\/static\/).+\.(js|css|woff2?|ttf)$/.test(url)) assets.push(url);
    }
  }
  return assets;
}
const assets = (await collect(root)).sort();
if (!assets.length || assets.length > 300) throw new Error("Invalid toolkit offline asset count");
const version = createHash("sha256").update(assets.join("\n")).digest("hex").slice(0, 16);
await writeFile(resolve(root, "toolkit-offline-assets.json"), JSON.stringify({ version, assets }));
console.log(`Prepared Teacher Toolkit offline manifest: ${assets.length} assets.`);
