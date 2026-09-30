import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Colores del theme (src/app/globals.css): --primary y --primary-foreground.
const VIOLET = "#7f22fe";
const INK = "#fcfbfe";

/**
 * Geometria del logo, compartida con src/components/layout/brand.tsx a traves de
 * handshake-mark.json. Es fija a proposito: el handshake es parte de la
 * identidad, no se regenera desde lucide-react, para que una actualizacion de la
 * libreria no cambie el logo sin que se pida explicitamente.
 */
const MARK = JSON.parse(
  await readFile(path.join(ROOT, "src/components/layout/handshake-mark.json"), "utf8"),
);

const GLYPH = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK.viewBox}">
  <g fill="${MARK.fill}" stroke="${INK}" stroke-width="${MARK.strokeWidth}" stroke-linecap="${MARK.strokeLinecap}" stroke-linejoin="${MARK.strokeLinejoin}">
${MARK.paths.map((d) => `    <path d="${d}"/>`).join("\n")}
  </g>
</svg>`;

const SVG_DENSITY = 1536;

/**
 * Glifo recortado a su bbox real y escalado a la dimension objetivo. Se dibuja
 * con los mismos parametros de trazo que usa lucide en la interfaz, para que la
 * forma sea identica; el color se aplica al componer.
 */
async function glyphLayer(targetPx) {
  const traced = await sharp(Buffer.from(GLYPH), { density: SVG_DENSITY })
    .trim({ background: "#000000", threshold: 1 })
    .png()
    .toBuffer();
  const { width, height } = await sharp(traced).metadata();
  const scale = targetPx / Math.max(width, height);
  return sharp(traced)
    .resize(
      Math.max(1, Math.round(width * scale)),
      Math.max(1, Math.round(height * scale)),
      { kernel: "lanczos3" },
    )
    .ensureAlpha()
    .png()
    .toBuffer();
}

/** Compone glifo centrado sobre el fondo, con esquinas redondeadas o a sangre completa. */
async function icon(size, { glyph, corner }) {
  const rx = corner === null ? 0 : Math.round(size * corner);
  const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}"${rx ? ` rx="${rx}"` : ""} fill="${VIOLET}"/>
  </svg>`;
  const layer = await glyphLayer(Math.round(size * glyph));
  return sharp(Buffer.from(background)).composite([{ input: layer, gravity: "center" }]).png().toBuffer();
}

/**
 * Empaqueta PNGs en un .ico. Las entradas de 32bpp se escriben como DIB real
 * (BGRA, filas de abajo hacia arriba, mas mascara AND), que es lo que un
 * decodificador estricto espera; 256 queda como PNG embebido.
 */
async function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);

  const entries = [];
  const images = [];
  let offset = 6 + pngs.length * 16;

  for (const { size, data } of pngs) {
    let payload = data;

    if (size !== 256) {
      const { data: rgba } = await sharp(data).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

      const info = Buffer.alloc(40);
      info.writeUInt32LE(40, 0);
      info.writeInt32LE(size, 4);
      info.writeInt32LE(size * 2, 8);
      info.writeUInt16LE(1, 12);
      info.writeUInt16LE(32, 14);
      info.writeUInt32LE(rgba.length, 20);

      const pixels = Buffer.alloc(rgba.length);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const from = ((size - 1 - y) * size + x) * 4;
          const to = (y * size + x) * 4;
          pixels[to] = rgba[from + 2];
          pixels[to + 1] = rgba[from + 1];
          pixels[to + 2] = rgba[from];
          pixels[to + 3] = rgba[from + 3];
        }
      }

      const stride = Math.ceil(size / 32) * 4;
      const mask = Buffer.alloc(stride * size);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (rgba[((size - 1 - y) * size + x) * 4 + 3] === 0) {
            mask[y * stride + (x >> 3)] |= 0x80 >> (x & 7);
          }
        }
      }

      payload = Buffer.concat([info, pixels, mask]);
    }

    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(payload.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    images.push(payload);
    offset += payload.length;
  }

  return Buffer.concat([header, ...entries, ...images]);
}

const ICO_SIZES = [16, 32, 48, 256];

/**
 * El glifo se mide y se centra por su bbox real, asi que "glyph" es la fraccion
 * del lienzo que ocupa la dimension mayor. El trazo se mantiene en el del theme
 * (2 sobre viewBox 24); en 16px eso da lineas de ~0.7px, que es el limite de
 * legibilidad sin engrosar el logo.
 */
const CORNER = 0.14;

const ICO_VARIANTS = {
  16: { glyph: 0.88, corner: CORNER },
  32: { glyph: 0.82, corner: CORNER },
  48: { glyph: 0.8, corner: CORNER },
  256: { glyph: 0.78, corner: CORNER },
};

// iOS y Android aplican su propio recorte de esquinas: van a sangre completa.
const APPLE = { glyph: 0.72, corner: null };
const ANY = { glyph: 0.78, corner: CORNER };
// Android recorta al 80% central; el glifo tiene que caber con margen.
const MASKABLE = { glyph: 0.6, corner: null };

const icoPngs = await Promise.all(
  ICO_SIZES.map(async (size) => ({ size, data: await icon(size, ICO_VARIANTS[size]) })),
);

await writeFile(path.join(ROOT, "src/app/favicon.ico"), await buildIco(icoPngs));
await writeFile(path.join(ROOT, "src/app/apple-icon.png"), await icon(180, APPLE));
await mkdir(path.join(ROOT, "public"), { recursive: true });
await writeFile(path.join(ROOT, "public/icon-v2-192.png"), await icon(192, ANY));
await writeFile(path.join(ROOT, "public/icon-v2-512.png"), await icon(512, ANY));
await writeFile(path.join(ROOT, "public/icon-v2-maskable-512.png"), await icon(512, MASKABLE));

console.log("iconos generados");
console.log("  src/app/favicon.ico               " + ICO_SIZES.join(", "));
console.log("  src/app/apple-icon.png            180 (a sangre completa)");
console.log("  public/icon-v2-192.png            192");
console.log("  public/icon-v2-512.png            512");
console.log("  public/icon-v2-maskable-512.png   512 (maskable)");
