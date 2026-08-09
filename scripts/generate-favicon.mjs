import sharp from "sharp";
import fs from "fs";

const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#0F766E"/>
  <path d="M32 14L14 28v22a3 3 0 0 0 3 3h10V39a5 5 0 0 1 10 0v14h10a3 3 0 0 0 3-3V28L32 14z" fill="#F8FAFC"/>
  <path d="M12 29.5L32 13.5l20 16" stroke="#FBBF24" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

function pngToIco(pngBuffers, dims) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let offset = headerSize;
  let o = 6;
  const parts = [header];

  for (let i = 0; i < count; i++) {
    const w = dims[i];
    header.writeUInt8(w >= 256 ? 0 : w, o);
    header.writeUInt8(w >= 256 ? 0 : w, o + 1);
    header.writeUInt8(0, o + 2);
    header.writeUInt8(0, o + 3);
    header.writeUInt16LE(1, o + 4);
    header.writeUInt16LE(32, o + 6);
    header.writeUInt32LE(pngBuffers[i].length, o + 8);
    header.writeUInt32LE(offset, o + 12);
    offset += pngBuffers[i].length;
    o += 16;
    parts.push(pngBuffers[i]);
  }

  return Buffer.concat(parts);
}

const png16 = await sharp(svg).resize(16, 16).png().toBuffer();
const png32 = await sharp(svg).resize(32, 32).png().toBuffer();

await sharp(svg).resize(32, 32).png().toFile("app/icon.png");
await sharp(svg).resize(180, 180).png().toFile("app/apple-icon.png");
await sharp(svg).resize(32, 32).png().toFile("public/favicon-32x32.png");
await sharp(svg).resize(16, 16).png().toFile("public/favicon-16x16.png");

const ico = pngToIco([png16, png32], [16, 32]);
fs.writeFileSync("app/favicon.ico", ico);
fs.writeFileSync("public/favicon.ico", ico);

console.log("Favicon assets generated");
