// The bedroom workshop: a static background plus small animated layers
// (lamp glow, monitor screen, cat, steam, rain) that the React scene stacks on top.
import { Canvas, sheet } from "./canvas.mts";
import { P } from "./palette.mts";
import { ALCOVE_LEDGES, FAIRY_LIGHTS, SCENE_H, SCENE_W, SPOTS } from "../src/lib/scene.ts";

/** Deterministic pseudo-random numbers, so the art is identical on every build. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const FLOOR_Y = 130;

function wall(c: Canvas) {
  c.rect(0, 0, SCENE_W, FLOOR_Y, P.wall1);
  // wallpaper: thin stripes with small diamonds
  for (let x = 4; x < SCENE_W; x += 12) {
    c.vline(x, 0, FLOOR_Y, P.wall2);
    for (let y = 8; y < FLOOR_Y; y += 16) c.grid(x - 1, y, [".w.", "w.w", ".w."], { w: P.wall2 });
  }
  // darker near the ceiling and the corners
  c.rect(0, 0, SCENE_W, 4, P.wall0);
  c.dither(0, 4, SCENE_W, 6, P.wall0, P.wall1);
  c.dither(0, 0, 4, FLOOR_Y, P.wall0, P.wall1);
  // baseboard
  c.rect(0, 124, SCENE_W, 6, P.wood1);
  c.hline(0, 124, SCENE_W, P.wood2);
  c.hline(0, 129, SCENE_W, P.wood0);
}

function floor(c: Canvas) {
  const rand = rng(7);
  const rows = [130, 136, 143, 151, 160, 170, 180];
  for (let r = 0; r < rows.length - 1; r++) {
    const y0 = rows[r];
    const h = rows[r + 1] - y0;
    c.rect(0, y0, SCENE_W, h, r % 2 ? P.wood2 : P.wood3);
    c.hline(0, y0, SCENE_W, P.wood0);
    c.hline(0, y0 + 1, SCENE_W, r % 2 ? P.wood3 : P.wood4);
    for (let x = Math.floor(rand() * 40); x < SCENE_W; x += 48 + Math.floor(rand() * 30)) c.vline(x, y0 + 1, h - 1, P.wood1);
    // wood grain specks
    for (let k = 0; k < 18; k++) c.hline(Math.floor(rand() * SCENE_W), y0 + 2 + Math.floor(rand() * (h - 3)), 3, r % 2 ? P.wood1 : P.wood2);
  }
  c.dither(0, 130, SCENE_W, 3, P.wood0, null);
  // cold window light falling on the floor
  for (let y = 134; y < 172; y++) {
    const shift = Math.floor((y - 134) * 0.9);
    for (let x = 244 - shift; x < 300 - shift; x++) if ((x + y) % 2) c.px(x, y, "#a9a3ec22");
  }
}

function fairyLights(c: Canvas) {
  const pts = [{ x: 72, y: 6 }, ...FAIRY_LIGHTS, { x: 232, y: 6 }];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const mid = { x: Math.round((a.x + b.x) / 2), y: Math.max(a.y, b.y) + 2 };
    c.line(a.x, a.y, mid.x, mid.y, P.grey0);
    c.line(mid.x, mid.y, b.x, b.y, P.grey0);
  }
  for (const l of FAIRY_LIGHTS) {
    c.px(l.x, l.y - 1, P.grey1);
    c.rect(l.x, l.y, 2, 2, l.color);
  }
}

function bookcase(c: Canvas) {
  const x = 8;
  const y = 26;
  const w = 56;
  const h = 108;
  // plant and robot on top
  c.box(12, 18, 11, 9, { fill: P.red1, light: P.red2, shade: P.red0 });
  c.grid(9, 6, [
    "....g.....g...",
    "...ggg...gG...",
    "..gGg.g.gGg.g.",
    ".gGg..gGgg..gg",
    "gGg.g.gGg.gGg.",
    ".g..gGgGg.gg..",
    "...gGGgGGg....",
    "....gGgGg.....",
    ".....ggg......",
    "......g.......",
    "......g.......",
    "......g.......",
  ], { g: P.green1, G: P.green2 });
  c.vline(52, 15, 3, P.grey3);
  c.box(47, 17, 11, 6, { fill: P.grey3, light: P.grey4, shade: P.grey2 });
  c.px(50, 19, P.cyan);
  c.px(54, 19, P.cyan);
  c.box(48, 22, 9, 5, { fill: P.grey2, light: P.grey3, shade: P.grey1 });

  c.box(x, y, w, h, { fill: P.wood2, light: P.wood3, shade: P.wood1, round: false });
  c.dither(x + 3, y + 3, w - 6, h - 6, P.wood0, P.wood1);
  for (const sy of [50, 76, 102, 128]) {
    c.rect(x + 2, sy, w - 4, 3, P.wood3);
    c.hline(x + 2, sy, w - 4, P.wood4);
    c.hline(x + 2, sy + 3, w - 4, P.wood0);
  }

  // shelf 1: books + router
  const colors = [P.red1, P.blue1, P.green1, P.yellow0, P.purple1, P.pink0, P.amber1, P.blue0];
  const rand = rng(3);
  let bx = 11;
  for (let i = 0; bx < 42; i++) {
    const bw = 3 + Math.floor(rand() * 3);
    const bh = 14 + Math.floor(rand() * 6);
    const col = colors[i % colors.length];
    c.box(bx, 50 - bh, bw, bh, { fill: col, light: P.paper1, shade: P.ink, round: false });
    c.hline(bx + 1, 50 - bh + 4, bw - 2, P.paper2);
    bx += bw;
  }
  c.vline(46, 34, 10, P.grey1);
  c.vline(59, 34, 10, P.grey1);
  c.box(44, 43, 18, 7, { fill: P.grey1, light: P.grey2, shade: P.grey0 });

  // shelf 2: leaning books + trophy
  bx = 11;
  for (let i = 0; bx < 36; i++) {
    const bw = 4 + Math.floor(rand() * 2);
    const bh = 12 + Math.floor(rand() * 8);
    c.box(bx, 76 - bh, bw, bh, { fill: colors[(i + 3) % colors.length], light: P.paper1, shade: P.ink, round: false });
    bx += bw;
  }
  const t = SPOTS.trophy;
  c.grid(t.x, t.y, [
    "kkkkkkkkkkkk",
    "kyYYYYYYYYyk",
    "ykyYYYYYYyky",
    "y.kYYYYYYk.y",
    "yy.kYYYYk.yy",
    "....kYYk....",
    ".....kk.....",
    ".....yy.....",
    "....kyyk....",
    "...kkkkkk...",
    "...kwwwwk...",
    "...kwwwwk...",
    "..kkkkkkkk..",
    "............",
  ], { k: P.ink, y: P.yellow1, Y: P.yellow2, w: P.wood1 });

  // shelf 3: boxes + wire spools
  c.box(11, 88, 18, 14, { fill: P.paper1, light: P.paper2, shade: P.paper0, round: false });
  c.rect(15, 92, 10, 4, P.paper3);
  c.box(30, 91, 15, 11, { fill: P.paper1, light: P.paper2, shade: P.paper0, round: false });
  for (const [cx, col, dark] of [[51, P.red1, P.red0], [59, P.blue1, P.blue0]] as const) {
    c.circle(cx, 97, 4, P.ink);
    c.circle(cx, 97, 3, col);
    c.circle(cx, 97, 1, dark);
  }

  // shelf 4: stacked books + toolbox
  for (const [i, col] of [P.blue1, P.amber1, P.green1, P.purple1].entries()) {
    c.box(11 + (i % 2), 123 - i * 5, 24, 5, { fill: col, light: P.paper1, shade: P.ink, round: false });
  }
  c.box(40, 116, 21, 12, { fill: P.red1, light: P.red2, shade: P.red0 });
  c.rect(46, 113, 9, 1, P.ink);
  c.vline(46, 113, 3, P.ink);
  c.vline(54, 113, 3, P.ink);
  c.hline(41, 120, 19, P.red0);
  c.rect(49, 119, 3, 2, P.grey4);
}

function corkboard(c: Canvas) {
  const { x, y, w, h } = SPOTS.corkboard;
  c.box(x, y, w, h, { fill: P.wood3, light: P.wood4, shade: P.wood1, round: false });
  c.rect(x + 3, y + 3, w - 6, h - 6, P.wood4);
  c.dither(x + 3, y + 3, w - 6, h - 6, P.wood3, null);
  const rand = rng(11);
  for (let k = 0; k < 30; k++) c.px(x + 3 + Math.floor(rand() * (w - 6)), y + 3 + Math.floor(rand() * (h - 6)), P.wood5);

  const note = (nx: number, ny: number, nw: number, nh: number, col: string, pin: string, lines = true) => {
    c.rect(nx + 1, ny + 1, nw, nh, "#00000040");
    c.rect(nx, ny, nw, nh, col);
    if (lines) for (let ly = ny + 4; ly < ny + nh - 1; ly += 2) c.hline(nx + 2, ly, nw - 4 - (ly % 3), P.paper0);
    c.rect(nx + Math.floor(nw / 2), ny - 1, 2, 2, pin);
  };
  note(81, 33, 14, 12, P.paper3, P.red2);
  note(99, 35, 12, 11, P.yellow2, P.cyan);
  // photo of a mountain
  c.rect(116, 32, 13, 14, "#00000040");
  c.rect(115, 31, 13, 14, P.white);
  c.rect(116, 32, 11, 9, P.blue1);
  c.grid(116, 35, ["....w......", "...ggg.....", "..ggggg.g..", ".gggggggggg", "ggggggggggg", "ggggggggggg"], { g: P.green1, w: P.white });
  c.rect(121, 30, 2, 2, P.red2);
  note(84, 50, 14, 13, P.pink1, P.yellow2);
  note(103, 51, 24, 14, P.paper2, P.red2, false);
  // a little network diagram on the big note
  c.box(106, 54, 5, 4, { fill: P.cyan, round: false });
  c.box(119, 54, 5, 4, { fill: P.green3, round: false });
  c.box(112, 60, 5, 4, { fill: P.amber3, round: false });
  c.line(110, 57, 113, 60, P.ink);
  c.line(119, 57, 116, 60, P.ink);
  // red string between the pins
  c.line(88, 33, 105, 35, P.red1);
  c.line(105, 35, 121, 31, P.red1);
  c.line(88, 33, 91, 50, P.red1);
}

function poster(c: Canvas) {
  c.box(182, 22, 40, 30, { fill: P.blue0, light: P.blue1, shade: P.ink, round: false });
  c.rect(184, 24, 36, 26, P.wall0);
  const rand = rng(5);
  for (let k = 0; k < 14; k++) c.px(185 + Math.floor(rand() * 34), 25 + Math.floor(rand() * 24), k % 3 ? P.purple2 : P.amber4);
  c.grid(195, 28, [
    ".kkkkkkkkk.",
    "kaaaaaaaaak",
    "kaAAAkAAAak",
    "kaAAkkkAAak",
    "kaAAAkAAAak",
    "kaAAAkAAAak",
    ".kaAAAAAak.",
    "..kaAAAak..",
    "...kaaak...",
    "....kkk....",
  ], { k: P.ink, a: P.amber1, A: P.amber2 });
  c.hline(190, 44, 24, P.grey3);
  c.hline(193, 46, 18, P.grey2);
}

function desk(c: Canvas) {
  // under the desk: cables, power strip, PC tower
  c.line(172, 104, 168, 130, P.grey0);
  c.line(168, 130, 172, 152, P.grey0);
  c.line(200, 104, 196, 118, P.grey0);
  c.line(186, 104, 182, 140, P.grey0);
  c.line(182, 140, 186, 152, P.grey0);
  c.box(160, 152, 32, 6, { fill: P.grey3, light: P.grey4, shade: P.grey2 });
  for (let x = 163; x < 172; x += 4) c.rect(x, 154, 2, 2, P.ink);
  c.box(196, 118, 22, 40, { fill: P.grey1, light: P.grey2, shade: P.grey0, round: 2 });
  for (let y = 131; y < 147; y += 2) c.hline(199, y, 10, P.grey0);
  c.rect(211, 135, 4, 3, P.pink1);
  c.rect(210, 140, 5, 4, P.cyan);
  c.rect(211, 146, 4, 4, P.yellow2);
  c.px(212, 147, P.ink);

  // desk
  for (const lx of [151, 234]) c.box(lx, 104, 5, 54, { fill: P.wood2, light: P.wood3, shade: P.wood1, round: false });
  c.rect(156, 140, 78, 3, P.wood1);
  c.box(148, 98, 94, 6, { fill: P.wood3, light: P.wood4, shade: P.wood2, round: false });
  c.box(150, 103, 90, 5, { fill: P.wood2, light: P.wood3, shade: P.wood1, round: false });

  // lamp
  c.box(154, 95, 12, 4, { fill: P.grey1, light: P.grey2, shade: P.grey0 });
  c.rect(158, 72, 2, 23, P.grey2);
  c.vline(158, 72, 23, P.grey3);
  c.rect(158, 70, 9, 2, P.grey2);
  c.grid(162, 70, [
    "..kkkkk..",
    ".kaaaaak.",
    "kaAAAAAak",
    "kaAAAAAak",
    "kkkkkkkkk",
    "...bBb...",
    "....b....",
  ], { k: P.amber0, a: P.amber1, A: P.amber2, b: P.amber4, B: P.amber5 });

  // monitor
  const m = SPOTS.monitor;
  c.box(193, 90, 6, 8, { fill: P.grey1, light: P.grey2, shade: P.grey0, round: false });
  c.box(186, 96, 20, 3, { fill: P.grey2, light: P.grey3, shade: P.grey1 });
  c.box(m.x, m.y, m.w, 30, { fill: P.grey1, light: P.grey2, shade: P.grey0, round: 2 });
  const s = SPOTS.screen;
  c.rect(s.x, s.y, s.w, s.h, "#0f1830");
  c.box(m.x + m.w - 5, m.y - 1, 7, 7, { fill: P.yellow2, light: P.amber5, shade: P.yellow1, round: false });

  // keyboard, mouse, mug, breadboard
  c.box(180, 99, 32, 4, { fill: P.grey2, light: P.grey3, shade: P.grey1 });
  for (let x = 182; x < 210; x += 2) c.px(x, 100, P.grey4);
  c.box(214, 99, 5, 4, { fill: P.grey3, light: P.grey4, shade: P.grey2 });
  c.box(219, 90, 8, 9, { fill: P.white, light: P.white, shade: P.grey4 });
  c.rect(227, 92, 2, 1, P.ink);
  c.rect(228, 92, 1, 4, P.ink);
  c.rect(227, 95, 2, 1, P.ink);
  c.hline(220, 91, 6, P.wood1);
  c.box(228, 95, 13, 4, { fill: P.grey5, light: P.white, shade: P.grey4, round: false });
  for (let x = 229; x < 240; x += 2) c.px(x, 97, P.grey3);
  c.px(233, 95, P.grey2);
  c.line(236, 95, 239, 93, P.blue2);
  c.line(239, 93, 240, 95, P.blue2);
  c.px(230, 94, P.red1);
  c.px(231, 94, P.red1);
}

function windowAndCurtains(c: Canvas) {
  const wnd = SPOTS.window;
  c.box(wnd.x - 4, wnd.y - 4, wnd.w + 8, wnd.h + 8, { fill: P.grey3, light: P.grey4, shade: P.grey2, round: false });
  // night sky gradient
  for (let y = wnd.y; y < wnd.y + wnd.h; y++) {
    const t = (y - wnd.y) / wnd.h;
    const [a, b] = t < 0.33 ? [P.purple0, P.purple0] : t < 0.45 ? [P.purple0, P.purple1] : t < 0.7 ? [P.purple1, P.purple1] : [P.purple1, P.purple2];
    for (let x = wnd.x; x < wnd.x + wnd.w; x++) c.px(x, y, (x + y) % 2 ? a : b);
  }
  // soft clouds
  const rand = rng(21);
  for (let k = 0; k < 6; k++) {
    const cx = wnd.x + Math.floor(rand() * wnd.w);
    const cy = wnd.y + 4 + Math.floor(rand() * 18);
    c.ellipse(cx, cy, 6 + Math.floor(rand() * 5), 2, P.purple1);
    c.hline(cx - 3, cy - 1, 6, P.purple2);
  }
  // pine trees on the hill
  for (let k = 0; k < 9; k++) {
    const tx = wnd.x + 2 + k * 7 + Math.floor(rand() * 4);
    const th = 10 + Math.floor(rand() * 12);
    for (let j = 0; j < th; j++) {
      const half = Math.floor(j / 3) + 1;
      c.hline(tx - half, wnd.y + wnd.h - th + j, half * 2 + 1, P.purple0);
    }
  }
  c.rect(wnd.x, wnd.y + wnd.h - 4, wnd.w, 4, P.blue0);
  // mullions and a glint on the glass
  c.rect(wnd.x + 29, wnd.y, 2, wnd.h, P.grey3);
  c.vline(wnd.x + 29, wnd.y, wnd.h, P.grey4);
  c.rect(wnd.x, wnd.y + 33, wnd.w, 2, P.grey3);
  c.hline(wnd.x, wnd.y + 33, wnd.w, P.grey4);
  for (let k = 0; k < 5; k++) c.px(wnd.x + 4 + k, wnd.y + 12 - k, P.purple3);
  // sill and a plant
  c.box(240, 96, 76, 5, { fill: P.grey3, light: P.grey4, shade: P.grey2, round: false });
  c.box(296, 88, 10, 8, { fill: P.amber1, light: P.amber2, shade: P.amber0 });
  c.grid(293, 78, ["..g...g...g.", ".gGg.gGg.gG.", "..gGgGgGgg..", "...gGgGg....", "....ggg....."], { g: P.green1, G: P.green2 });

  // curtain rod and curtains
  c.rect(232, 14, 88, 2, P.grey2);
  c.hline(232, 14, 88, P.grey3);
  c.rect(231, 13, 3, 4, P.grey3);
  for (const [x0, w] of [[234, 13], [309, 11]] as const) {
    for (let x = x0; x < x0 + w; x++) {
      const band = (x - x0) % 4;
      const col = band === 0 ? P.purple0 : band === 3 ? P.purple2 : P.purple1;
      c.vline(x, 16, 96, col);
    }
    c.dither(x0, 100, w, 12, P.purple0, null);
    c.rect(x0, 66, w, 3, P.amber1);
    c.hline(x0, 66, w, P.amber2);
  }
}

function floorProps(c: Canvas) {
  // rug under the backpack
  const b = SPOTS.backpack;
  const cx = b.x + 24;
  c.ellipse(cx, 160, 36, 7, P.ink);
  c.ellipse(cx, 160, 35, 6, P.red0);
  c.ellipse(cx, 160, 31, 4, P.red1);
  c.ellipse(cx, 160, 26, 3, P.red0);
  for (let x = cx - 30; x < cx + 30; x += 4) c.px(x, 160, P.amber3);
  // the backpack's own shadow
  c.ellipse(cx, 157, 22, 2, "#00000066");

  // books on the floor
  c.box(66, 150, 20, 5, { fill: P.green1, light: P.paper1, shade: P.ink, round: false });
  c.box(68, 146, 17, 5, { fill: P.amber1, light: P.paper1, shade: P.ink, round: false });
  c.box(67, 142, 15, 5, { fill: P.blue1, light: P.paper1, shade: P.ink, round: false });

  // parts box under the window
  c.box(250, 138, 34, 22, { fill: P.wood4, light: P.wood5, shade: P.wood3, round: false });
  c.rect(264, 138, 6, 22, P.paper1);
  c.box(254, 146, 8, 5, { fill: P.paper3, round: false });
  c.line(256, 138, 254, 130, P.red1);
  c.line(254, 130, 258, 128, P.red1);
  c.line(276, 138, 279, 131, P.green2);
  c.line(279, 131, 276, 127, P.green2);
  c.px(276, 127, P.yellow2);
}

/** The secret trophy room behind the bookcase: old stone, cobwebs and a faint magic glow. */
function alcove(c: Canvas) {
  const { x, y, w, h } = SPOTS.alcove;
  c.rect(x, y, w, h, P.ink);
  c.rect(x + 2, y + 2, w - 4, h - 4, P.plum1);
  // staggered stone bricks
  for (let row = 0, by = y + 2; by < y + h - 2; row++, by += 6) {
    c.hline(x + 2, by, w - 4, P.plum0);
    for (let bx = x + 2 + (row % 2 ? 0 : 5); bx < x + w - 2; bx += 10) c.vline(bx, by, 6, P.plum0);
  }
  // rounded arch at the top
  c.grid(x + 2, y + 2, ["kkkk", "kk..", "k...", "k..."], { k: P.ink });
  c.grid(x + w - 6, y + 2, ["kkkk", "..kk", "...k", "...k"], { k: P.ink });
  // magic glow from above, Bayer-dithered like the lamp
  const cx = x + w / 2;
  for (let j = y + 2; j < y + h - 2; j++)
    for (let i = x + 2; i < x + w - 2; i++) {
      const d = Math.hypot(i - cx, (j - (y + 8)) * 0.7) / 14;
      const band = Math.floor(d);
      const pick = (d - band) * 16 > BAYER[j % 4][i % 4] ? band + 1 : band;
      const col = ["#6fe3f040", "#7f73cf38", "#7f73cf20"][pick];
      if (col) c.px(i, j, col);
    }
  // stone ledges
  for (const ly of ALCOVE_LEDGES) {
    c.box(x + 3, ly, w - 6, 4, { fill: P.grey2, light: P.grey3, shade: P.grey1, round: false });
    c.rect(x + 3, ly + 4, w - 6, 2, "#00000060");
  }
  // cobwebs in the corners
  c.grid(x + 2, y + 6, ["w.w.w", ".w.w.", "w.w..", ".w...", "w...."], { w: "#d8d9e366" });
  c.grid(x + w - 7, y + 6, ["w.w.w", ".w.w.", "..w.w", "...w.", "....w"], { w: "#d8d9e366" });
  // floor of the alcove
  c.rect(x + 2, y + h - 6, w - 4, 4, P.plum0);
}

/** The bookcase alone, cut out of a full-size canvas so its pixel positions match the room. */
function bookcaseLayer(): Canvas {
  const full = new Canvas(SCENE_W, SCENE_H);
  bookcase(full);
  const b = SPOTS.bookcase;
  return full.crop(b.x, b.y, b.w, b.h);
}

function room(): Canvas {
  const c = new Canvas(SCENE_W, SCENE_H);
  wall(c);
  floor(c);
  fairyLights(c);
  alcove(c);
  corkboard(c);
  poster(c);
  windowAndCurtains(c);
  desk(c);
  floorProps(c);
  return c;
}

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** Lamp light: warm bands, Bayer-dithered between them so the falloff stays pixel art. */
function glow(): Canvas {
  const g = SPOTS.glow;
  const c = new Canvas(g.w, g.h);
  const bx = 166 - g.x;
  const by = 78 - g.y;
  const bands = ["#ffc96a70", "#ffa8404c", "#f28c2834", "#e8782018"];
  for (let y = 0; y < g.h; y++)
    for (let x = 0; x < g.w; x++) {
      const d = Math.hypot(x - bx, (y - by) * 1.2) / 16;
      const band = Math.floor(d);
      if (band >= bands.length) continue;
      const frac = d - band;
      const pick = frac * 16 > BAYER[y % 4][x % 4] ? band + 1 : band;
      if (pick < bands.length) c.px(x, y, bands[pick]);
    }
  return c;
}

function screenFrames(): Canvas {
  const { w, h } = SPOTS.screen;
  const rand = rng(42);
  const colors = [P.cyan, P.green3, P.amber3, P.purple3, P.grey4, P.green3];
  const lines = Array.from({ length: 16 }, (_, i) => ({ indent: (i % 4) * 2, len: 6 + Math.floor(rand() * 18), color: colors[i % colors.length] }));
  return sheet(
    Array.from({ length: 4 }, (_, f) => {
      const c = new Canvas(w, h);
      c.rect(0, 0, w, h, "#0f1830");
      c.rect(0, 0, w, 3, P.grey1);
      c.px(2, 1, P.red2);
      c.px(4, 1, P.yellow2);
      c.px(6, 1, P.green2);
      for (let k = 0; k < 9; k++) {
        const l = lines[(k + f * 2) % lines.length];
        c.hline(2 + l.indent, 5 + k * 2, Math.min(l.len, w - 4 - l.indent), l.color);
      }
      if (f % 2 === 0) c.rect(3, h - 3, 3, 2, P.white);
      return c;
    }),
  );
}

function catFrames(): Canvas {
  const { w, h } = SPOTS.cat;
  return sheet(
    [0, 1].map((breath) => {
      const c = new Canvas(w, h);
      c.ellipse(15, 8 - breath * 0.5, 10, 4 + breath, P.ink);
      c.ellipse(15, 8 - breath * 0.5, 9, 3 + breath, P.amber2);
      c.hline(9, 10, 13, P.amber3);
      for (const x of [12, 15, 18, 21]) c.vline(x, 5 - breath, 2, P.amber1);
      // head and ears
      c.circle(5, 8, 4, P.ink);
      c.circle(5, 8, 3, P.amber2);
      c.grid(1, 2, ["k...k..", "kk.kk..", "kAkAk.."], { k: P.ink, A: P.amber2 });
      c.hline(3, 8, 2, P.ink);
      c.px(5, 10, P.pink1);
      // tail wrapped in front
      c.hline(6, 11, 17, P.ink);
      c.hline(8, 10, 14, P.amber1);
      c.px(23, 10, P.ink);
      return c;
    }),
  );
}

function steamFrames(): Canvas {
  const { w, h } = SPOTS.steam;
  const shapes = [
    ["....w...", "...w....", "...w....", "....w...", ".....w..", "....w...", "...w....", "....w...", "........", "........"],
    ["........", ".....w..", "....w...", "...w....", "...w....", "....w...", ".....w..", "....w...", "...w....", "........"],
    ["........", "........", "...w....", "....w...", ".....w..", ".....w..", "....w...", "...w....", "...w....", "....w..."],
  ];
  return sheet(shapes.map((rows) => {
    const c = new Canvas(w, h);
    c.grid(0, 0, rows, { w: "#f4f2ea60" });
    return c;
  }));
}

function rainTile(seed: number, drops: number, len: number, color: string): Canvas {
  const c = new Canvas(32, 32);
  const rand = rng(seed);
  for (let k = 0; k < drops; k++) {
    const x = Math.floor(rand() * 32);
    const y = Math.floor(rand() * 32);
    for (let j = 0; j < len; j++) c.px(x, (y + j) % 32, color);
  }
  return c;
}

export function sceneArt(): Record<string, Canvas> {
  return {
    "scene/room": room(),
    "scene/glow": glow(),
    "scene/bookcase": bookcaseLayer(),
    "scene/screen": screenFrames(),
    "scene/cat": catFrames(),
    "scene/steam": steamFrames(),
    "scene/rain-near": rainTile(9, 9, 4, "#c9cdffb0"),
    "scene/rain-far": rainTile(13, 14, 2, "#a9a3ec70"),
  };
}
