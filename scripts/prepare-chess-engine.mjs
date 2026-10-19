import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const root = dirname(require.resolve("stockfish/package.json"));
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
if (pkg.version !== "19.0.0") throw new Error("Review the engine paths and matching source notice when updating Stockfish.");
await mkdir("public/chess", { recursive: true });
// Keep the matching loader and WASM basenames: Stockfish resolves its WASM next to itself.
await copyFile(join(root, "bin/stockfish-19-lite-single.js"), "public/chess/stockfish.js");
await copyFile(join(root, "bin/stockfish-19-lite-single.wasm"), "public/chess/stockfish.wasm");
await copyFile(join(root, "Copying.txt"), "public/chess/COPYING.txt");
await writeFile("public/chess/NOTICE.txt", `Khmer One Chess Lab — engine notice\n\nStockfish.js ${pkg.version}, by Nathan Rugg and the Stockfish contributors.\nThe unmodified lite single-threaded engine is distributed under GPL-3.0.\nLicense: /chess/COPYING.txt\nExact distributed package:\nhttps://registry.npmjs.org/stockfish/-/stockfish-${pkg.version}.tgz\nCorresponding source and build instructions (release v19.0.0):\nhttps://github.com/nmrugg/stockfish.js/tree/9cb3e5066d48f1a35d792afeda36eff37ae60570\nSource archive:\nhttps://github.com/nmrugg/stockfish.js/archive/9cb3e5066d48f1a35d792afeda36eff37ae60570.tar.gz\nProject: https://github.com/nmrugg/stockfish.js\n\nThe board uses Three.js (MIT); rules use chess.js (BSD-2-Clause).\nTheir license texts are included in /chess/THIRD-PARTY.txt.\n`);
const notices = [];
for (const [name, filename] of [["chess.js", "LICENSE"], ["three", "LICENSE"]]) {
  const packageRoot = name === "three" ? join(dirname(require.resolve("three")), "..") : join(dirname(require.resolve("chess.js")), "../..");
  notices.push(`${name}\n\n${await readFile(join(packageRoot, filename), "utf8")}`);
}
await writeFile("public/chess/THIRD-PARTY.txt", notices.join("\n\n---\n\n"));
console.log("Prepared pinned Stockfish lite engine and license notices.");
