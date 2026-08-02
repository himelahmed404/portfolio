// Run once per new batch of photos: node scripts/blur.mjs
// Reads every jpg/png in public/frame, prints a `photos` array with
// dimensions + an inline base64 blur placeholder for each — paste the
// result into src/content/frame.json's "photos" field, then replace every
// "alt" with a real description of what's in the shot, and add row entries
// to "rows" to sequence them.
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = "./public/frame";
const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();

if (files.length === 0) {
  console.log(`No .jpg/.png files found in ${dir}. Add photos there first.`);
  process.exit(0);
}

const photos = [];
for (const file of files) {
  const img = sharp(path.join(dir, file));
  const { width, height } = await img.metadata();
  const buf = await img.resize(16).jpeg({ quality: 40 }).toBuffer();
  photos.push({
    src: `/frame/${file}`,
    w: width,
    h: height,
    alt: "TODO: describe what is shown",
    blur: `data:image/jpeg;base64,${buf.toString("base64")}`,
  });
}

console.log(JSON.stringify(photos, null, 2));
