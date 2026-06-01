// Run: node scripts/gen-icons.mjs
// Generates all required iOS App Store icon sizes from public/icon-512.png
import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '../public/icon-512.png');
const outDir = join(__dirname, '../ios-assets/AppIcon.appiconset');
mkdirSync(outDir, { recursive: true });

const sizes = [
  // iPhone
  { size: 40,   scale: 2, idiom: 'iphone' },  // 20pt @2x
  { size: 60,   scale: 2, idiom: 'iphone' },  // 20pt @3x (notification)
  { size: 58,   scale: 2, idiom: 'iphone' },  // 29pt @2x (settings)
  { size: 87,   scale: 3, idiom: 'iphone' },  // 29pt @3x (settings)
  { size: 80,   scale: 2, idiom: 'iphone' },  // 40pt @2x (spotlight)
  { size: 120,  scale: 3, idiom: 'iphone' },  // 40pt @3x (spotlight)
  { size: 120,  scale: 2, idiom: 'iphone' },  // 60pt @2x (home)
  { size: 180,  scale: 3, idiom: 'iphone' },  // 60pt @3x (home)
  // iPad
  { size: 20,   scale: 1, idiom: 'ipad' },
  { size: 40,   scale: 2, idiom: 'ipad' },
  { size: 29,   scale: 1, idiom: 'ipad' },
  { size: 58,   scale: 2, idiom: 'ipad' },
  { size: 40,   scale: 1, idiom: 'ipad' },
  { size: 80,   scale: 2, idiom: 'ipad' },
  { size: 76,   scale: 1, idiom: 'ipad' },
  { size: 152,  scale: 2, idiom: 'ipad' },
  { size: 167,  scale: 2, idiom: 'ipad' },  // iPad Pro
  // App Store
  { size: 1024, scale: 1, idiom: 'ios-marketing' },
];

// deduplicate by pixel size
const seen = new Set();
const tasks = [];
for (const { size, scale, idiom } of sizes) {
  const px = size;
  const filename = `icon-${px}@${scale}x-${idiom}.png`;
  if (seen.has(filename)) continue;
  seen.add(filename);
  tasks.push({ px, filename });
}

for (const { px, filename } of tasks) {
  const dest = join(outDir, filename);
  await sharp(src).resize(px, px).toFile(dest);
  console.log(`  ✓ ${filename} (${px}px)`);
}

// Contents.json for Xcode
import { writeFileSync } from 'fs';
const images = sizes.map(({ size, scale, idiom }) => {
  const px = size;
  const filename = `icon-${px}@${scale}x-${idiom}.png`;
  return { size: `${Math.round(px/scale)}x${Math.round(px/scale)}`, idiom, filename, scale: `${scale}x` };
});
writeFileSync(join(outDir, 'Contents.json'), JSON.stringify({
  images,
  info: { author: 'xcode', version: 1 },
}, null, 2));
console.log('\nDone → ios-assets/AppIcon.appiconset/');
