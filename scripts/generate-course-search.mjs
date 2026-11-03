// Preserve the complete existing search generator, then add direct bilingual lesson destinations.
import './generate-public-search.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { searchEntries } from '../public/body-works/state.js';
const path = 'data/publicSearch.generated.json';
const pages = JSON.parse(await readFile(path,'utf8'));
const additions = searchEntries();
const newDestinations = new Set(additions.map(page => page.href));
await writeFile(path,JSON.stringify([...pages.filter(page => !newDestinations.has(page.href)),...additions],null,2) + '\n');
console.log(`Added ${additions.length} complete bilingual Body Works lessons to public search.`);
