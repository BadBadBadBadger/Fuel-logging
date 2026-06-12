// Regenerate the PWA / Play icons from logo-master.png.
// Requires jimp (pure-JS, no native build):  npm install jimp@0.22
//   node make-icons.js   →   icon-512.png + icon-192.png
const Jimp = require('jimp');

const SRC = 'logo-master.png';
const SCALE = 0.8;            // artwork fills 80% → safe for maskable circular crop
const BG = 0x000000ff;        // pure black, matches the logo's own background

// The source badge sits on a WHITE background. Flood-fill white inward from the
// border so the exterior becomes black; the black rounded-square ring isolates the
// interior white artwork, so the fill never touches the pump/arm/text.
function blackenBackground(img) {
  const { width: w, height: h, data } = img.bitmap;
  const isWhite = i => data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200;
  const stack = [];
  const push = (x, y) => { if (x >= 0 && x < w && y >= 0 && y < h) stack.push(x, y); };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  const seen = new Uint8Array(w * h);
  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    const p = y * w + x;
    if (seen[p]) continue;
    const i = p * 4;
    if (!isWhite(i)) continue;
    seen[p] = 1;
    data[i] = data[i + 1] = data[i + 2] = 0; data[i + 3] = 255;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }
  return img;
}

let masterPromise;
function master() {
  if (!masterPromise) masterPromise = Jimp.read(SRC).then(blackenBackground);
  return masterPromise;
}

async function make(size, out) {
  const src = (await master()).clone();
  const art = Math.round(size * SCALE);
  src.resize(art, art, Jimp.RESIZE_BICUBIC);
  const canvas = new Jimp(size, size, BG);
  const off = Math.round((size - art) / 2);
  canvas.composite(src, off, off);
  await canvas.writeAsync(out);
  console.log(`wrote ${out} — ${size}x${size}, artwork ${art}px, inset ${off}px`);
}

(async () => {
  await make(512, 'icon-512.png');
  await make(192, 'icon-192.png');
})().catch(e => { console.error(e); process.exit(1); });
