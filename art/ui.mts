// Game-menu art: 9-slice frames for CSS border-image, tiles and a 9x9 icon set.
import { Canvas } from "./canvas.mts";
import { P } from "./palette.mts";

/** Frames and tiles are saved pre-scaled, so CSS never has to scale them (crisp in every browser). */
export const UI_SCALE = 3;

/** Slice sizes in native pixels; globals.css multiplies them by UI_SCALE. */
export const SLICES = { panel: 6, slot: 4, button: 4, tooltip: 4, paper: 5, field: 3 };

function panel(): Canvas {
  const c = new Canvas(16, 16);
  c.box(0, 0, 16, 16, { fill: P.wood3, light: P.wood4, shade: P.wood1, round: 2 });
  c.box(1, 1, 14, 14, { fill: null, light: P.wood4, round: false, outline: null });
  c.rect(4, 4, 8, 8, P.ink);
  c.rect(5, 5, 6, 6, P.plum1);
  c.hline(5, 5, 6, P.plum2);
  for (const [x, y] of [[2, 2], [13, 2], [2, 13], [13, 13]]) c.px(x, y, P.yellow1);
  return c;
}

function slot(border: string): Canvas {
  const c = new Canvas(12, 12);
  c.box(0, 0, 12, 12, { fill: P.plum2, outline: border, round: true });
  c.hline(1, 1, 10, P.plum0);
  c.vline(1, 1, 10, P.plum0);
  c.hline(2, 10, 9, P.plum3);
  c.vline(10, 2, 9, P.plum3);
  return c;
}

function button(fill: string, light: string, shade: string): Canvas {
  const c = new Canvas(12, 12);
  c.box(0, 0, 12, 12, { fill, light, shade, round: 2 });
  c.hline(2, 9, 8, shade);
  return c;
}

function tooltip(): Canvas {
  const c = new Canvas(10, 10);
  c.box(0, 0, 10, 10, { fill: P.paper3, light: P.white, shade: P.paper1, round: 2 });
  return c;
}

function paper(): Canvas {
  const c = new Canvas(12, 12);
  c.box(0, 0, 12, 12, { fill: P.paper3, light: P.paper2, shade: P.paper1, round: 2 });
  c.rect(2, 2, 8, 8, P.paper3);
  c.px(2, 2, P.paper1);
  c.px(9, 9, P.paper0);
  return c;
}

function field(): Canvas {
  const c = new Canvas(8, 8);
  c.box(0, 0, 8, 8, { fill: P.plum0, outline: P.ink, round: true });
  c.hline(1, 1, 6, P.ink);
  c.hline(1, 6, 6, P.plum2);
  return c;
}

function wallTile(): Canvas {
  const c = new Canvas(24, 24);
  c.rect(0, 0, 24, 24, P.wall1);
  c.vline(4, 0, 24, P.wall2);
  c.vline(16, 0, 24, P.wall2);
  c.grid(3, 6, [".w.", "w.w", ".w."], { w: P.wall2 });
  c.grid(15, 18, [".w.", "w.w", ".w."], { w: P.wall2 });
  return c;
}

function plank(): Canvas {
  const c = new Canvas(16, 10);
  c.rect(0, 0, 16, 4, P.wood3);
  c.hline(0, 0, 16, P.wood4);
  c.rect(0, 4, 16, 4, P.wood2);
  c.hline(0, 4, 16, P.wood1);
  c.hline(0, 7, 16, P.wood1);
  c.px(6, 5, P.wood1);
  c.rect(0, 8, 16, 2, "#00000055");
  return c;
}

function shadow(): Canvas {
  const c = new Canvas(16, 4);
  c.ellipse(8, 2, 7, 1, "#00000070");
  return c;
}

const ICON_COLORS: Record<string, string> = {
  k: P.ink, w: P.paper3, W: P.white, y: P.yellow1, Y: P.yellow2, g: P.green1, G: P.green2,
  b: P.blue1, B: P.blue2, c: P.cyan, r: P.red2, p: P.paper1, P: P.paper3, d: P.plum3, n: P.wood3, e: P.pink1, o: P.amber2,
};

const ICONS: Record<string, string[]> = {
  bag: ["...kkk...", "..k...k..", ".kkkkkkk.", "kGGGGGGGk", "kGkkkkkGk", "kGkYYYkGk", "kGkkkkkGk", "kgGGGGGgk", ".kkkkkkk."],
  trophy: [".kkkkkkk.", "kkyYYYykk", "kykYYYkyk", "kkyYYYykk", "..kyyyk..", "...kyk...", "...kyk...", "..kkkkk..", "..knnnk.."],
  lock: ["..kkkkk..", ".k.....k.", ".k.....k.", "kkkkkkkkk", "kyYYYYYyk", "kyyykyyyk", "kyyykyyyk", "kyyyyyyyk", "kkkkkkkkk"],
  check: [".........", "........k", ".......kG", "k.....kGk", "Gk...kGk.", "kGk.kGk..", ".kGkGk...", "..kGk....", "...k....."],
  close: ["kk.....kk", "kwk...kwk", ".kwk.kwk.", "..kwkwk..", "...kwk...", "..kwkwk..", ".kwk.kwk.", "kwk...kwk", "kk.....kk"],
  plus: ["...kkk...", "...kwk...", "...kwk...", "kkkkwkkkk", "kwwwwwwwk", "kkkkwkkkk", "...kwk...", "...kwk...", "...kkk..."],
  minus: [".........", ".........", ".........", "kkkkkkkkk", "kwwwwwwwk", "kkkkkkkkk", ".........", ".........", "........."],
  star: ["....k....", "...kYk...", "kkkkYkkkk", "kYYYYYYyk", ".kYYYYyk.", "..kYYyk..", ".kYYkYyk.", ".kyk.kyk.", ".kk...kk."],
  "star-off": ["....k....", "...kdk...", "kkkkdkkkk", "kdddddddk", ".kdddddk.", "..kdddk..", ".kddkddk.", ".kdk.kdk.", ".kk...kk."],
  coin: ["..kkkkk..", ".kyyyyyk.", "kyYYyyyyk", "kyYkkkyyk", "kyYkyyyyk", "kyYkkkyyk", "kyyyyyyyk", ".kyyyyyk.", "..kkkkk.."],
  book: [".kkkkkkk.", "kbbbbbbbk", "kbBBBBBbk", "kbBwwwBbk", "kbBBBBBbk", "kbbbbbbbk", "kbbbbbbbk", "kwwwwwwwk", ".kkkkkkk."],
  scroll: [".kkkkkkk.", "kpPPPPPpk", ".kPkkkPk.", ".kPPPPPk.", ".kPkkPPk.", ".kPPPPPk.", ".kPkkkPk.", "kpPPPPPpk", ".kkkkkkk."],
  search: [".kkkk....", "kcWcck...", "kWccck...", "kcccck...", ".kkkkk...", "....knk..", ".....knk.", "......knk", ".......kk"],
  compare: ["....k....", ".kkkkkkk.", ".k..k..k.", "kyk.k.kyk", "kkk.k.kkk", "....k....", "....k....", "..kkkkk..", "..kyyyk.."],
  "arrow-right": ["....k....", "....kk...", "kkkkkYk..", "kYYYYYYk.", "kYYYYYYYk", "kyyyyyyk.", "kkkkkyk..", "....kk...", "....k...."],
  "arrow-left": ["....k....", "...kk....", "..kYkkkkk", ".kYYYYYYk", "kYYYYYYYk", ".kyyyyyyk", "..kykkkkk", "...kk....", "....k...."],
  link: ["...kkkkkk", "....kwwwk", ".....kwwk", "....kwkwk", "...kwk.kk", "..kwk....", ".kwk.....", "kwk......", "kk......."],
  code: [".........", "..k...k..", ".kGk.kGk.", "kGk...kGk", "Gk.....kG", "kGk...kGk", ".kGk.kGk.", "..k...k..", "........."],
  people: ["..kkk....", ".keeek...", ".keeekkk.", "..kkkeeek", ".kbbbkeek", "kbbbbbkk.", "kbbbbkBBk", "kbbbkBBBk", "kkkkkkkkk"],
  docs: [".kkkkk...", ".kwwwkk..", ".kwwwwwk.", ".kwkkkwk.", ".kwwwwwk.", ".kwkkkwk.", ".kwwwwwk.", ".kwkkwwk.", ".kkkkkkk."],
  shield: ["kkkkkkkkk", "kgggggggk", "kgGGkGGgk", "kgGkkkGgk", "kgGGkGGgk", ".kgGGGgk.", ".kggGggk.", "..kgggk..", "...kkk..."],
  flask: ["..kkkkk..", "...kwk...", "...kwk...", "..kwwwk..", ".kwwwwwk.", ".kGGGGGk.", "kGgGGGGGk", "kGGGGgGGk", ".kkkkkkk."],
  palette: ["..kkkkk..", ".kpppppk.", "kprppyppk", "kpppppbpk", "kpGpkkppk", "kpppkppk.", ".kppppk..", "..kkkk...", "........."],
  sparkle: ["....k....", "....Y....", "...kYk...", "kYYYWYYYk", "...kYk...", "....Y....", "....k....", ".........", "........."],
  pin: ["..kkk..", ".krrrk.", "krWrrrk", "krrrrrk", ".krrrk.", "..kkk..", "...k..."],
};

export function uiArt(): { scaled: Record<string, Canvas>; native: Record<string, Canvas> } {
  const icons: Record<string, Canvas> = {};
  for (const [name, rows] of Object.entries(ICONS)) {
    if (rows.some((r) => r.length !== rows[0].length)) throw new Error(`icon ${name} has uneven rows`);
    const c = new Canvas(rows[0].length, rows.length);
    c.grid(0, 0, rows, ICON_COLORS);
    icons[`icons/${name}`] = c;
  }
  return {
    scaled: {
      "ui/panel": panel(),
      "ui/slot": slot(P.ink),
      "ui/slot-on": slot(P.yellow1),
      "ui/button": button(P.yellow1, P.yellow2, P.yellow0),
      "ui/button-ghost": button(P.plum3, "#5c4780", P.plum1),
      "ui/tooltip": tooltip(),
      "ui/paper": paper(),
      "ui/field": field(),
      "ui/wall": wallTile(),
      "ui/plank": plank(),
    },
    native: { ...icons, "ui/shadow": shadow() },
  };
}
