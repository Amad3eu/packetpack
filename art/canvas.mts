// A tiny RGBA pixel canvas and PNG encoder, so the art pipeline needs no dependency.
import { deflateSync } from "node:zlib";

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** Colour as "#rrggbb" or "#rrggbbaa"; null/undefined means "leave the pixel alone". */
export type Color = string | null | undefined;

function parse(c: string): [number, number, number, number] {
  const n = c.slice(1);
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
    n.length === 8 ? parseInt(n.slice(6, 8), 16) : 255,
  ];
}

export class Canvas {
  w: number;
  h: number;
  data: Uint8Array;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.data = new Uint8Array(w * h * 4);
  }

  px(x: number, y: number, c: Color) {
    if (!c || x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const [r, g, b, a] = parse(c);
    const i = (Math.floor(y) * this.w + Math.floor(x)) * 4;
    if (a === 255) {
      this.data.set([r, g, b, 255], i);
      return;
    }
    // Alpha-blend translucent colours (used for glows and shadows).
    const da = this.data[i + 3] / 255;
    const sa = a / 255;
    const oa = sa + da * (1 - sa);
    const mix = (s: number, d: number) => Math.round((s * sa + d * da * (1 - sa)) / (oa || 1));
    this.data.set([mix(r, this.data[i]), mix(g, this.data[i + 1]), mix(b, this.data[i + 2]), Math.round(oa * 255)], i);
  }

  clear(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.data.fill(0, (y * this.w + x) * 4, (y * this.w + x) * 4 + 4);
  }

  rect(x: number, y: number, w: number, h: number, c: Color) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.px(i, j, c);
  }

  hline(x: number, y: number, w: number, c: Color) {
    this.rect(x, y, w, 1, c);
  }

  vline(x: number, y: number, h: number, c: Color) {
    this.rect(x, y, 1, h, c);
  }

  line(x0: number, y0: number, x1: number, y1: number, c: Color) {
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.px(x0, y0, c);
      if (x0 === x1 && y0 === y1) return;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  /** Checkerboard of two colours: the classic pixel-art gradient trick. */
  dither(x: number, y: number, w: number, h: number, a: Color, b: Color) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.px(i, j, (i + j) % 2 ? a : b);
  }

  circle(cx: number, cy: number, r: number, c: Color) {
    for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) if (i * i + j * j <= r * r + r * 0.8) this.px(cx + i, cy + j, c);
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, c: Color) {
    for (let j = -ry; j <= ry; j++)
      for (let i = -rx; i <= rx; i++) if ((i * i) / (rx * rx + 0.5) + (j * j) / (ry * ry + 0.5) <= 1) this.px(cx + i, cy + j, c);
  }

  /**
   * An outlined, shaded box with pixel-rounded corners: light on the top-left
   * edge, shade on the bottom-right. Every object in the art set is built from this.
   */
  box(x: number, y: number, w: number, h: number, o: { fill: Color; light?: Color; shade?: Color; outline?: Color; round?: boolean | 2 }) {
    const { fill, light, shade, outline = "#140c1c", round = true } = o;
    // Paint on a scratch canvas and composite it, so cut corners show what is underneath.
    const t = new Canvas(w, h);
    t.rect(0, 0, w, h, outline);
    t.rect(1, 1, w - 2, h - 2, fill);
    if (light) {
      t.hline(1, 1, w - 2, light);
      t.vline(1, 1, h - 2, light);
    }
    if (shade) {
      t.hline(1, h - 2, w - 2, shade);
      t.vline(w - 2, 1, h - 2, shade);
    }
    if (round) {
      for (const [cx, cy, dx, dy] of [[0, 0, 1, 1], [w - 1, 0, -1, 1], [0, h - 1, 1, -1], [w - 1, h - 1, -1, -1]]) {
        t.clear(cx, cy);
        if (round === 2) {
          // Bigger radius: cut an L of three pixels and re-draw the outline one step in.
          t.clear(cx + dx, cy);
          t.clear(cx, cy + dy);
          t.px(cx + dx, cy + dy, outline);
        }
      }
    }
    this.draw(t, x, y);
  }

  /** Stamp a text grid: one character per pixel, looked up in `map`, "." skipped. */
  grid(x: number, y: number, rows: string[], map: Record<string, string>) {
    rows.forEach((row, j) => [...row].forEach((ch, i) => ch !== "." && this.px(x + i, y + j, map[ch])));
  }

  /** Copy another canvas onto this one (transparent pixels skipped). */
  draw(src: Canvas, x: number, y: number) {
    for (let j = 0; j < src.h; j++)
      for (let i = 0; i < src.w; i++) {
        const k = (j * src.w + i) * 4;
        if (src.data[k + 3] === 0) continue;
        const hex = "#" + [...src.data.slice(k, k + 4)].map((v) => v.toString(16).padStart(2, "0")).join("");
        this.px(x + i, y + j, hex);
      }
  }

  /** Encode as PNG, optionally upscaled with nearest-neighbour (for CSS border-image frames). */
  png(scale = 1): Buffer {
    const w = this.w * scale;
    const h = this.h * scale;
    const raw = Buffer.alloc((w * 4 + 1) * h);
    for (let y = 0; y < h; y++) {
      raw[y * (w * 4 + 1)] = 0;
      for (let x = 0; x < w; x++) {
        const s = (Math.floor(y / scale) * this.w + Math.floor(x / scale)) * 4;
        raw.set(this.data.subarray(s, s + 4), y * (w * 4 + 1) + 1 + x * 4);
      }
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(w, 0);
    ihdr.writeUInt32BE(h, 4);
    ihdr.set([8, 6, 0, 0, 0], 8);
    return Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk("IHDR", ihdr),
      chunk("IDAT", deflateSync(raw, { level: 9 })),
      chunk("IEND", Buffer.alloc(0)),
    ]);
  }
}

/** Lay canvases side by side as one horizontal sprite sheet. */
export function sheet(frames: Canvas[]): Canvas {
  const out = new Canvas(frames[0].w * frames.length, frames[0].h);
  frames.forEach((f, i) => out.draw(f, i * f.w, 0));
  return out;
}
