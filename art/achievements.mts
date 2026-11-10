// Trophies for the secret room behind the bookcase, 16x16, one per quest id in
// src/lib/achievements.ts. Each also gets a "-locked" silhouette.
import { Canvas } from "./canvas.mts";
import { P } from "./palette.mts";

const C: Record<string, string> = {
  k: P.ink, y: P.yellow1, Y: P.yellow2, o: P.yellow0, a: P.amber1, A: P.amber2, h: P.amber4,
  r: P.red1, R: P.red2, b: P.blue1, B: P.blue2, c: P.cyan, w: P.white, g: P.grey3, G: P.grey4,
  n: P.green1, N: P.green2, p: P.purple2, P: P.purple3, e: P.pink1, s: P.paper3,
};

const TROPHIES: Record<string, string[]> = {
  // a bronze medal on a ribbon
  "first-pick": [
    "..kkk....kkk....",
    "..krRk..kbBk....",
    "...krRkkbBk.....",
    "....krRbBk......",
    ".....krbk.......",
    "....kkkkkk......",
    "...kaAAAAak.....",
    "..kaAhhAAAak....",
    "..kaAhkkAAak....",
    "..kaAAkkAAak....",
    "..kaAAkkAAak....",
    "..kaAkkkkAak....",
    "...kaAAAAak.....",
    "....kkkkkk......",
    "................",
    "................",
  ],
  // a little radio tower sending waves
  "radio-head": [
    "........R.......",
    ".c.....kRk.....c",
    "c.c....kgk....c.",
    "c.c...kgGgk...c.",
    "c.c...kgkgk...c.",
    ".c...kgGkGgk...c",
    ".....kgk.kgk....",
    "....kgGkkkGgk...",
    "....kgk...kgk...",
    "...kgGk...kGgk..",
    "...kgk.....kgk..",
    "..kgGkkkkkkkGgk.",
    "..kkkkkkkkkkkkk.",
    "..koooooooooook.",
    "..kkkkkkkkkkkkk.",
    "................",
  ],
  // a golden key
  "key-keeper": [
    "................",
    "...kkkk.........",
    "..kyYYyk........",
    ".kyYkkYyk.......",
    ".kYk..kYk.......",
    ".kYk..kYk.......",
    ".kyYkkYyk.......",
    "..kyYYykkkkkkk..",
    "...kkkkyYYYYYyk.",
    ".......kkkkyykk.",
    "..........kyk...",
    "..........kyykk.",
    "..........kyk...",
    "..........kkk...",
    "................",
    "................",
  ],
  // a cut gem: many facets, many categories
  polymath: [
    "................",
    "................",
    "....kkkkkkkk....",
    "...kcPcwcPcck...",
    "..kcPcwwcPcPck..",
    ".kkkkkkkkkkkkkk.",
    ".kBcBcBcBcBcBck.",
    "..kBcBcBcBcBck..",
    "...kBcBcBcBck...",
    "....kBcBcBck....",
    ".....kBcBck.....",
    "......kBck......",
    ".......kk.......",
    "................",
    "................",
    "................",
  ],
  // an open book with a sparkle
  scholar: [
    "............Y...",
    "...........YwY..",
    "............Y...",
    "..kkkkk.kkkkk...",
    ".kssssskssssskk.",
    ".ksgggsksggsgk..",
    ".ksssssksssssk..",
    ".ksgggskssgggk..",
    ".ksssssksssssk..",
    ".ksggsskssgggk..",
    ".ksssssksssssk..",
    ".kbbbbbkbbbbbk..",
    "..kkkkkkkkkkk...",
    "................",
    "................",
    "................",
  ],
  // a golden backpack
  "full-pack": [
    "......kkkk......",
    ".....k....k.....",
    "...kkkkkkkkkk...",
    "..kyYYYYYYYYyk..",
    "..kYYYYYYYYYYk..",
    "..kyYYYkkYYYyk..",
    "..kkkkkkkkkkkk..",
    "..kyYYYYYYYYyk..",
    "..kyYkkkkkkYyk..",
    "..kyYkhhhhkYyk..",
    "..kyYkhYYhkYyk..",
    "..kyYkkkkkkYyk..",
    "..koyyyyyyyyok..",
    "...kkkkkkkkkk...",
    "................",
    "................",
  ],
};

/** Same shape, filled with one dark tone: "there's something here, but not yet". */
function silhouette(src: Canvas): Canvas {
  const out = new Canvas(src.w, src.h);
  for (let i = 0; i < src.w * src.h; i++) {
    if (src.data[i * 4 + 3] === 0) continue;
    const isInk = src.data[i * 4] === 0x14 && src.data[i * 4 + 1] === 0x0c;
    out.px(i % src.w, Math.floor(i / src.w), isInk ? P.ink : P.purple0);
  }
  return out;
}

export function achievementArt(): Record<string, Canvas> {
  const out: Record<string, Canvas> = {};
  for (const [id, rows] of Object.entries(TROPHIES)) {
    if (rows.length !== 16 || rows.some((r) => r.length !== 16)) throw new Error(`trophy ${id} must be 16x16`);
    const c = new Canvas(16, 16);
    c.grid(0, 0, rows, C);
    out[`achievements/${id}`] = c;
    out[`achievements/${id}-locked`] = silhouette(c);
  }
  return out;
}
