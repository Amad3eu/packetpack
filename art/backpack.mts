// The backpack: a 4-frame sheet per colour (zipper closed -> half -> open -> flap up),
// plus static strap and patch layers stacked on top, so customization needs no recolouring at runtime.
import { Canvas, sheet } from "./canvas.mts";
import { P } from "./palette.mts";

export const PACK_SIZE = 48;
export const PACK_FRAMES = 4;

type Ramp = [dark: string, mid: string, light: string, highlight: string];

export const PACK_COLOR_RAMPS: Record<string, Ramp> = {
  moss: ["#2d4a2a", "#4a7a3a", "#6fa04f", "#9cc56a"],
  ember: ["#5a1f14", "#9a3a1e", "#c95a2a", "#e8884a"],
  ocean: ["#1b2e5a", "#2f4f8f", "#4874c0", "#78a4e0"],
  plum: ["#3a1f4a", "#5e3478", "#8250a0", "#a878c4"],
  sand: ["#6a4a26", "#9a7040", "#c49a5e", "#e0c088"],
};

export const STRAP_RAMPS: Record<string, [string, string, string]> = {
  leather: ["#3a2416", "#5c3a1a", "#8a5a30"],
  charcoal: ["#14141c", "#2a2a32", "#4a4a58"],
  rope: ["#8a7650", "#c9b48a", "#e6d6ae"],
};

const PATCH_ICONS: Record<string, { color: string; rows: string[] }> = {
  shield: { color: P.white, rows: ["kkkkkkk", "k.....k", "k..k..k", "k.kkk.k", "k..k..k", ".k...k.", "..kkk.."] },
  radio: { color: P.yellow2, rows: ["k.....k", ".k.k.k.", "k.k.k.k", "...k...", "...k...", "..kkk..", ".kkkkk."] },
  chip: { color: P.cyan, rows: [".k.k.k.", "kkkkkkk", ".k...k.", "kk.k.kk", ".k...k.", "kkkkkkk", ".k.k.k."] },
  key: { color: P.pink1, rows: ["..kkk..", ".k...k.", "..kkk..", "...k...", "...kk..", "...k...", "...kk.."] },
};

function zipperTeeth(c: Canvas, x0: number, x1: number, y: number) {
  for (let x = x0; x <= x1; x++) c.px(x, y, x % 2 ? P.grey4 : P.grey2);
}

function pull(c: Canvas, x: number, y: number) {
  c.grid(x - 1, y, [".k.", "kwk", "kgk", "kwk", ".k."], { k: P.ink, w: P.grey5, g: P.grey3 });
}

function body(ramp: Ramp, frame: number): Canvas {
  const [dark, mid, light, hi] = ramp;
  const c = new Canvas(PACK_SIZE, PACK_SIZE);
  const open = frame === 3;

  // top handle
  if (!open) {
    c.rect(19, 2, 10, 2, P.ink);
    c.rect(18, 3, 2, 5, P.ink);
    c.rect(28, 3, 2, 5, P.ink);
    c.hline(20, 3, 8, dark);
  }

  c.box(8, 8, 32, 38, { fill: mid, light, shade: dark, round: 2 });
  // stitched seam down the sides
  for (let y = 12; y < 42; y += 3) {
    c.px(11, y, dark);
    c.px(36, y, dark);
  }

  // front pocket
  c.box(12, 29, 24, 14, { fill: mid, light: hi, shade: dark, round: 2 });
  c.hline(14, 31, 20, light);
  zipperTeeth(c, 14, 33, 30);

  if (!open) {
    // flap, a bit wider than the body
    c.box(6, 6, 36, 19, { fill: mid, light: hi, shade: dark, round: 2 });
    c.hline(8, 8, 32, light);
    // zipper along the flap seam: closed teeth, then an opening gap as the pull travels
    const pullX = [9, 24, 38][frame];
    zipperTeeth(c, 8, 39, 23);
    if (frame > 0) {
      c.rect(8, 23, pullX - 8, 2, P.ink);
      c.hline(8, 22, pullX - 8, P.grey3);
      c.hline(8, 25, pullX - 8, P.grey3);
      c.hline(9, 24, pullX - 10, P.amber1);
    }
    pull(c, pullX, 23);
  } else {
    // flap thrown back behind the bag, showing its darker underside
    c.box(9, 0, 30, 9, { fill: dark, light: mid, shade: P.ink, round: 2 });
    c.hline(11, 2, 26, mid);
    // the open mouth, glowing with the gear inside
    c.box(10, 7, 28, 9, { fill: P.plum0, outline: P.ink, round: 2 });
    c.dither(13, 9, 22, 4, P.amber1, P.plum0);
    c.rect(18, 9, 12, 3, P.amber2);
    c.hline(21, 10, 6, P.amber4);
    zipperTeeth(c, 10, 37, 6);
    zipperTeeth(c, 10, 37, 16);
    pull(c, 39, 12);
  }
  return c;
}

function straps([dark, mid, light]: [string, string, string]): Canvas {
  const c = new Canvas(PACK_SIZE, PACK_SIZE);
  for (const x of [3, 41]) {
    c.box(x, 12, 5, 33, { fill: mid, light, shade: dark, round: false });
    c.box(x - 1, 34, 7, 5, { fill: P.grey3, light: P.grey5, shade: P.grey2, round: false });
    c.rect(x + 1, 36, 3, 1, P.ink);
  }
  return c;
}

function patch(id: string): Canvas {
  const c = new Canvas(PACK_SIZE, PACK_SIZE);
  const { color, rows } = PATCH_ICONS[id];
  c.box(19, 32, 11, 10, { fill: color, light: P.white, outline: P.ink, round: 2 });
  c.grid(21, 33, rows, { k: P.ink });
  return c;
}

export function backpackArt(): Record<string, Canvas> {
  const out: Record<string, Canvas> = {};
  for (const [id, ramp] of Object.entries(PACK_COLOR_RAMPS)) {
    out[`pack/body-${id}`] = sheet(Array.from({ length: PACK_FRAMES }, (_, f) => body(ramp, f)));
  }
  for (const [id, ramp] of Object.entries(STRAP_RAMPS)) out[`pack/straps-${id}`] = straps(ramp);
  for (const id of Object.keys(PATCH_ICONS)) out[`pack/patch-${id}`] = patch(id);
  return out;
}
