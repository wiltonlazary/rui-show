// Small pictures for the demos' pictures (Image, Avatar, Cover, Card,
// Carousel, Compare, Skeleton and the $move page), each made
// here as PNG data: URIs so no demo reaches the network. PNG, not SVG:
// CanvasKit decodes PNG. Each is drawn in code at load (a few kilobytes of
// palette pixels, stored uncompressed), so the source stays small.

/** @typedef {[number, number, number]} RGB */

/** The CRC-32 table (PNG chunks). */
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

/** @param {Uint8Array} bytes @param {number} from @param {number} to */
function crc32(bytes, from, to) {
  let c = 0xffffffff;
  for (let i = from; i < to; i++) c = CRC[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Writes a big-endian 32-bit number. @param {number[]} out @param {number} n */
const u32 = (out, n) => out.push((n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff);

/** Appends a chunk. @param {number[]} out @param {string} type @param {number[]} data */
function chunk(out, type, data) {
  u32(out, data.length);
  const start = out.length;
  for (let i = 0; i < 4; i++) out.push(type.charCodeAt(i));
  for (const b of data) out.push(b);
  u32(out, crc32(Uint8Array.from(out), start, out.length));
}

/** A zlib stream of stored (uncompressed) deflate blocks. @param {number[]} raw */
function zlib(raw) {
  /** @type {number[]} */
  const out = [0x78, 0x01];
  for (let at = 0; at < raw.length || at === 0; at += 65535) {
    const n = Math.min(65535, raw.length - at);
    const last = at + n >= raw.length ? 1 : 0;
    out.push(last, n & 0xff, n >> 8, ~n & 0xff, (~n >> 8) & 0xff);
    for (let i = 0; i < n; i++) out.push(raw[at + i]);
    if (n === 0) break;
  }
  let a = 1;
  let b = 0;
  for (const v of raw) {
    a = (a + v) % 65521;
    b = (b + a) % 65521;
  }
  u32(out, ((b << 16) | a) >>> 0);
  return out;
}

/**
 * A palette PNG as a data: URI from a pixel function (at most 256 colors;
 * channels are rounded to steps of 4 to keep the palette small).
 * @param {number} width @param {number} height @param {(x: number, y: number) => RGB} pixel
 * @returns {string}
 */
export function png(width, height, pixel) {
  /** @type {Map<number, number>} */
  const index = new Map();
  /** @type {number[]} */
  const palette = [];
  /** @type {number[]} */
  const raw = [];
  for (let y = 0; y < height; y++) {
    raw.push(0);
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixel(x, y).map(v => Math.max(0, Math.min(252, Math.round(v / 4) * 4)));
      const key = (r << 16) | (g << 8) | b;
      let i = index.get(key);
      if (i === undefined) {
        i = palette.length / 3;
        if (i === 256) throw new Error('pictures: more than 256 colors');
        index.set(key, i);
        palette.push(r, g, b);
      }
      raw.push(i);
    }
  }
  /** @type {number[]} */
  const out = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  /** @type {number[]} */
  const header = [];
  u32(header, width);
  u32(header, height);
  header.push(8, 3, 0, 0, 0);
  chunk(out, 'IHDR', header);
  chunk(out, 'PLTE', palette);
  chunk(out, 'IDAT', zlib(raw));
  chunk(out, 'IEND', []);
  let text = '';
  for (const b of out) text += String.fromCharCode(b);
  return `data:image/png;base64,${btoa(text)}`;
}

/** Mixes two colors, in 16 steps (bands keep the palette under 256 colors). @param {RGB} a @param {RGB} b @param {number} t @returns {RGB} */
const mix = (a, b, t) => {
  const k = Math.round(Math.max(0, Math.min(1, t)) * 16) / 16;
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
};

/**
 * A landscape: a sky, a sun and two rows of hills.
 * @param {RGB} top @param {RGB} horizon @param {RGB} sun @param {RGB} far @param {RGB} near
 */
function scene(top, horizon, sun, far, near) {
  const W = 96;
  const H = 60;
  return png(W, H, (x, y) => {
    const hill1 = H * 0.55 + Math.sin(x / 11) * 5 + Math.sin(x / 5 + 1) * 1.5;
    const hill2 = H * 0.72 + Math.sin(x / 14 + 2) * 6;
    if (y > hill2) return mix(near, mix(near, [0, 0, 0], 0.4), (y - hill2) / (H - hill2));
    if (y > hill1) return mix(far, near, (y - hill1) / (H * 0.4));
    const d = Math.hypot(x - W * 0.7, y - H * 0.3);
    if (d < 7) return sun;
    const sky = mix(top, horizon, y / hill1);
    return d < 11 ? mix(sun, sky, (d - 7) / 4) : sky;
  });
}

/** A green valley under a blue sky, 96 by 60. */
export const landscape = scene([60, 120, 216], [200, 228, 248], [255, 236, 150], [100, 170, 110], [40, 110, 70]);

/** Hills at dusk under an orange sky, 96 by 60. */
export const sunset = scene([80, 60, 140], [252, 170, 100], [255, 240, 200], [120, 70, 110], [50, 30, 70]);

/**
 * A head and shoulders on a colored ground, 40 by 40.
 * @param {RGB} ground @param {RGB} shirt @param {RGB} hair
 */
function person(ground, shirt, hair) {
  const S = 40;
  const skin = /** @type {RGB} */ ([236, 190, 160]);
  return png(S, S, (x, y) => {
    const head = Math.hypot((x - 20) / 8, (y - 16) / 9.5);
    if (head < 1) return y < 11 || (y < 16 && Math.abs(x - 20) > 6) ? hair : skin;
    if (Math.hypot((x - 20) / 16, (y - 44) / 14) < 1) return shirt;
    return mix(ground, [255, 255, 255], y / S / 3);
  });
}

/** Three people, for avatars. */
export const portraits = [
  person([120, 170, 230], [40, 80, 160], [70, 40, 20]),
  person([240, 180, 120], [180, 60, 60], [30, 30, 30]),
  person([150, 210, 170], [60, 120, 90], [200, 150, 60]),
];
