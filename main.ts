// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry is the X post itself: POST.json at the repository root names
// the post's address, and the house reads the post (its first picture and
// its text) from X. All this program has to do is hand the gate that file:
// copy POST.json from the repository root into /output.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Read and sanity-check POST.json before handing it over: it must be a
// JSON object whose "url" is a string. The gate refuses anything else, so
// failing here with a clear message beats copying a broken file.
const postPath = join(botDir, 'POST.json');
let post: unknown;
try {
  post = JSON.parse(readFileSync(postPath, 'utf8'));
} catch (err) {
  console.error(`POST.json at ${postPath} is not readable JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post !== 'object' || post === null ||
    typeof (post as { url?: unknown }).url !== 'string') {
  console.error('POST.json must be a JSON object of the form {"url": "https://x.com/<handle>/status/<id>"}');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(postPath, join(outputDir, 'POST.json'));
console.log(`copied POST.json from ${botDir} to ${outputDir}`);
