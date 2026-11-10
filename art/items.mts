// Equipment sprites, 32x32. Light comes from the top-left; every item has a 1 px ink outline.
import { Canvas } from "./canvas.mts";
import { P } from "./palette.mts";

export const ITEM_SIZE = 32;

/** Metal USB-A plug pointing left. */
function usbPlug(c: Canvas, x: number, y: number, w: number, h: number) {
  c.box(x, y, w, h, { fill: P.grey4, light: P.grey5, shade: P.grey3, round: false });
  c.rect(x + 1, y + 2, w - 3, h - 4, P.grey1);
  c.hline(x + 1, y + 2, w - 3, P.yellow1);
}

function rj45(c: Canvas, x: number, y: number) {
  c.rect(x, y, 6, 5, P.ink);
  c.hline(x + 1, y + 1, 4, P.yellow1);
  c.rect(x + 2, y + 4, 2, 1, P.grey0);
}

function led(c: Canvas, x: number, y: number, color: string) {
  c.px(x, y, color);
  c.px(x + 1, y, color);
}

const ITEMS: Record<string, (c: Canvas) => void> = {
  "flipper-zero": (c) => {
    c.box(1, 8, 30, 17, { fill: P.white, light: P.white, shade: P.grey4, round: 2 });
    c.rect(2, 22, 28, 1, P.grey4);
    // orange LCD with the dolphin
    c.box(4, 11, 15, 10, { fill: P.amber2, light: P.amber3, shade: P.amber1, outline: P.grey1, round: false });
    c.grid(7, 13, ["..kkkk.", ".kkkkkk", "kk.kkk.", "....kk."], { k: P.ink });
    // d-pad
    c.circle(24, 15, 4, P.grey2);
    c.circle(24, 15, 3, P.grey4);
    c.circle(24, 15, 1, P.amber2);
    c.px(23, 13, P.white);
    c.rect(27, 20, 2, 2, P.grey2);
    led(c, 20, 10, P.amber2);
  },
  "m5stack-cardputer": (c) => {
    c.box(1, 6, 30, 21, { fill: P.grey1, light: P.grey2, shade: P.grey0, round: 2 });
    c.box(3, 8, 17, 8, { fill: P.blue0, outline: P.ink, round: false });
    c.hline(5, 10, 6, P.cyan);
    c.hline(5, 12, 9, P.blue2);
    c.hline(5, 14, 4, P.green3);
    // the orange Stamp module
    c.box(21, 8, 8, 8, { fill: P.amber2, light: P.amber3, shade: P.amber1 });
    c.rect(23, 10, 4, 4, P.amber1);
    for (let r = 0; r < 4; r++) for (let k = 0; k < 13; k++) c.px(3 + k * 2, 18 + r * 2, r === 3 && k > 3 && k < 9 ? P.amber3 : P.grey4);
  },
  "m5stickc-plus2": (c) => {
    c.box(10, 1, 13, 30, { fill: P.amber2, light: P.amber3, shade: P.amber1, round: 2 });
    c.box(12, 4, 9, 12, { fill: P.grey0, outline: P.ink, round: false });
    c.hline(14, 7, 4, P.cyan);
    c.hline(14, 9, 5, P.green3);
    c.hline(14, 11, 3, P.cyan);
    c.box(12, 18, 9, 7, { fill: P.white, light: P.white, shade: P.grey4 });
    c.grid(13, 20, ["k.k.kkk", "kkk.kk.", "k.k.kkk"], { k: P.ink });
    c.rect(23, 8, 1, 4, P.grey3);
    c.rect(14, 27, 5, 2, P.grey1);
    c.px(16, 2, P.red2);
  },
  "esp32-marauder": (c) => {
    c.vline(27, 0, 7, P.grey2);
    c.px(27, 0, P.grey4);
    c.rect(26, 6, 3, 2, P.yellow1);
    c.box(2, 7, 28, 20, { fill: P.grey0, light: P.grey1, shade: P.ink, round: 2 });
    c.box(4, 9, 19, 15, { fill: P.blue0, outline: P.grey2, round: false });
    // Wi-Fi arcs on the screen
    c.grid(8, 11, ["..ccccc..", ".c.....c.", "c..ccc..c", "..c...c..", "....c....", "....c...."], { c: P.cyan });
    c.hline(6, 21, 4, P.green3);
    c.hline(11, 21, 2, P.green3);
    c.hline(14, 21, 6, P.green3);
    for (const y of [10, 14, 18]) c.box(25, y, 3, 3, { fill: P.grey3, outline: P.ink, round: false });
    c.rect(24, 23, 4, 2, P.grey4);
  },
  "raspberry-pi": (c) => {
    c.box(1, 7, 30, 20, { fill: P.green1, light: P.green2, shade: P.green0, round: 2 });
    for (let k = 0; k < 10; k++) {
      c.px(4 + k * 2, 9, P.yellow1);
      c.px(4 + k * 2, 10, P.yellow0);
    }
    c.rect(3, 9, 1, 2, P.ink);
    c.box(7, 14, 9, 8, { fill: P.grey3, light: P.grey5, shade: P.grey2 });
    c.box(17, 15, 4, 5, { fill: P.grey0, outline: P.ink, round: false });
    c.box(23, 9, 8, 7, { fill: P.grey4, light: P.grey5, shade: P.grey3, round: false });
    c.box(23, 17, 8, 7, { fill: P.grey4, light: P.grey5, shade: P.grey3, round: false });
    c.hline(24, 12, 6, P.grey1);
    c.hline(24, 20, 6, P.grey1);
    // tiny raspberry
    c.grid(3, 21, [".g.", "rrr", ".r."], { g: P.green3, r: P.red2 });
    c.px(3, 25, P.yellow1);
  },
  "wifi-pineapple": (c) => {
    for (const x of [7, 15, 23]) {
      c.rect(x - 1, 1, 3, 12, P.ink);
      c.vline(x, 2, 10, P.grey1);
      c.px(x, 2, P.grey2);
    }
    c.grid(4, 10, ["..g.....g.....g.....g.", ".ggg...ggg...ggg...ggg"], { g: P.green2 });
    c.box(3, 12, 26, 16, { fill: P.yellow1, light: P.yellow2, shade: P.yellow0, round: 2 });
    // pineapple skin cross-hatch
    for (let y = 14; y < 26; y++) for (let x = 5; x < 27; x++) if ((x + y) % 4 === 0 || (x - y + 64) % 4 === 0) c.px(x, y, P.yellow0);
    c.box(12, 20, 8, 5, { fill: P.grey1, outline: P.ink, round: false });
    c.px(15, 22, P.white);
  },
  "bash-bunny": (c) => {
    c.box(18, 2, 4, 11, { fill: P.white, shade: P.grey4 });
    c.box(24, 2, 4, 11, { fill: P.white, shade: P.grey4 });
    c.vline(19, 4, 6, P.pink1);
    c.vline(25, 4, 6, P.pink1);
    usbPlug(c, 1, 14, 9, 8);
    c.box(9, 11, 21, 13, { fill: P.white, light: P.white, shade: P.grey4, round: 2 });
    c.px(20, 15, P.ink);
    c.px(25, 15, P.ink);
    c.rect(22, 17, 2, 1, P.pink0);
    c.box(12, 19, 6, 3, { fill: P.grey2, outline: P.ink, round: false });
    c.px(13, 20, P.grey5);
    led(c, 26, 20, P.green2);
  },
  "usb-rubber-ducky": (c) => {
    usbPlug(c, 1, 16, 9, 8);
    c.box(9, 14, 21, 12, { fill: P.grey1, light: P.grey2, shade: P.grey0, round: 2 });
    c.hline(12, 22, 14, P.grey2);
    // the duck sitting on top
    c.grid(12, 2, [
      "....kkkk.......",
      "...kyyyyk......",
      "..kyyykyyk.....",
      "..kyyyyyyoook..",
      "..kyyyyyyoook..",
      "...kyyyyyk.....",
      "kk..kyyyk......",
      "kyk.kyyyyk.....",
      "kyykkyyyyykkk..",
      "kyyyyyyyyyyyyk.",
      "kyyyyyyYYyyyyk.",
      ".kyyyyYYyyyyk..",
      "..kkkkkkkkkk...",
    ], { k: P.ink, y: P.yellow2, Y: P.yellow1, o: P.amber2 });
  },
  "omg-cable": (c) => {
    // coil
    c.circle(16, 18, 8, P.ink);
    c.circle(16, 18, 7, P.white);
    c.circle(16, 18, 5, P.grey4);
    c.circle(16, 18, 4, P.ink);
    for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (i * i + j * j <= 11) c.clear(16 + i, 18 + j);
    // plug -> coil
    c.rect(7, 12, 3, 5, P.ink);
    c.vline(8, 12, 5, P.white);
    c.box(4, 1, 9, 6, { fill: P.grey4, light: P.grey5, shade: P.grey3, round: false });
    c.rect(6, 3, 5, 2, P.grey1);
    c.box(4, 6, 9, 7, { fill: P.white, light: P.white, shade: P.grey4 });
    // coil -> USB-C
    c.rect(23, 21, 3, 5, P.ink);
    c.vline(24, 21, 5, P.white);
    c.box(21, 25, 7, 5, { fill: P.white, light: P.white, shade: P.grey4 });
    c.box(22, 29, 5, 3, { fill: P.grey4, shade: P.grey3, round: false });
  },
  "lan-turtle": (c) => {
    // turtle riding on top
    c.grid(8, 4, [
      "....kkkkkk.....",
      "..kkgGgGgGkk...",
      ".kgGgGgGgGgGk.kk",
      "kgGgGgGgGgGgGkhhk",
      "kkkkkkkkkkkkkkhhk",
      ".kh.k....kh.k.kk.",
    ], { k: P.ink, g: P.green1, G: P.green2, h: P.green3 });
    usbPlug(c, 0, 14, 8, 8);
    c.box(7, 10, 23, 15, { fill: P.grey2, light: P.grey3, shade: P.grey1, round: 2 });
    rj45(c, 20, 14);
    led(c, 11, 21, P.green2);
    led(c, 14, 21, P.amber2);
  },
  "packet-squirrel": (c) => {
    // fluffy tail behind the box
    c.circle(25, 9, 6, P.ink);
    c.circle(25, 9, 5, P.wood3);
    c.circle(24, 8, 3, P.wood4);
    c.circle(27, 17, 4, P.ink);
    c.circle(27, 17, 3, P.wood3);
    c.px(23, 6, P.wood5);
    c.box(3, 14, 23, 14, { fill: P.grey1, light: P.grey2, shade: P.grey0, round: 2 });
    rj45(c, 5, 18);
    rj45(c, 18, 18);
    led(c, 13, 17, P.amber2);
    c.hline(12, 25, 4, P.grey2);
  },
  "hackrf-one": (c) => {
    c.vline(21, 1, 11, P.grey4);
    c.vline(22, 1, 11, P.grey3);
    c.circle(21, 1, 1, P.grey5);
    c.box(19, 10, 5, 4, { fill: P.yellow1, light: P.yellow2, shade: P.yellow0, round: false });
    c.box(2, 13, 28, 15, { fill: P.grey1, light: P.grey2, shade: P.grey0, round: 2 });
    led(c, 5, 17, P.green2);
    led(c, 8, 17, P.yellow2);
    led(c, 11, 17, P.red2);
    led(c, 14, 17, P.blue2);
    c.hline(5, 22, 12, P.grey3);
    c.hline(5, 24, 7, P.grey2);
    c.rect(1, 19, 2, 4, P.grey3);
  },
  "rtl-sdr-v4": (c) => {
    c.vline(28, 2, 13, P.grey3);
    c.vline(29, 2, 13, P.grey2);
    c.circle(28, 2, 1, P.grey5);
    usbPlug(c, 1, 15, 8, 8);
    c.box(8, 13, 19, 12, { fill: P.grey4, light: P.grey5, shade: P.grey3, round: 2 });
    c.hline(10, 18, 14, P.blue1);
    c.hline(10, 19, 14, P.blue0);
    c.grid(11, 21, ["w.w.ww.w"], { w: P.grey2 });
    c.box(26, 15, 4, 6, { fill: P.yellow1, light: P.yellow2, shade: P.yellow0, round: false });
  },
  proxmark3: (c) => {
    c.box(3, 3, 26, 26, { fill: P.grey0, light: P.grey1, shade: P.ink, round: 2 });
    // copper antenna coil
    for (const [i, col] of [[5, P.amber2], [7, P.amber1]] as const) {
      c.hline(i, i, 32 - 2 * i, col);
      c.hline(i, 31 - i, 32 - 2 * i, col);
      c.vline(i, i, 32 - 2 * i, col);
      c.vline(31 - i, i, 32 - 2 * i, col);
    }
    c.box(11, 11, 10, 10, { fill: P.grey1, light: P.grey2, shade: P.grey0 });
    c.px(13, 13, P.grey4);
    c.grid(12, 23, ["g.r.a"], { g: P.green2, r: P.red2, a: P.amber3 });
    c.rect(14, 28, 4, 2, P.grey4);
  },
  yubikey: (c) => {
    // gold contact fingers
    c.box(1, 13, 9, 9, { fill: P.grey1, round: false });
    for (const y of [14, 16, 18, 20]) c.hline(2, y, 6, P.yellow1);
    c.box(8, 10, 22, 15, { fill: P.grey1, light: P.grey2, shade: P.grey0, round: 2 });
    c.circle(17, 17, 4, P.ink);
    c.circle(17, 17, 3, P.yellow1);
    c.circle(16, 16, 1, P.yellow2);
    c.grid(16, 16, ["k.k", ".k.", ".k."], { k: P.yellow0 });
    // key-ring hole
    c.circle(26, 17, 2, P.ink);
    c.clear(26, 17);
    c.clear(26, 16);
    c.clear(25, 17);
  },
  "ubertooth-one": (c) => {
    c.box(24, 1, 5, 16, { fill: P.grey1, light: P.grey2, shade: P.grey0, round: 2 });
    c.box(23, 15, 7, 4, { fill: P.yellow1, light: P.yellow2, shade: P.yellow0, round: false });
    usbPlug(c, 0, 18, 7, 7);
    c.box(6, 15, 24, 13, { fill: P.blue0, light: P.blue1, shade: P.ink, round: 2 });
    c.box(10, 18, 7, 7, { fill: P.grey1, light: P.grey2, shade: P.grey0 });
    led(c, 20, 18, P.red2);
    led(c, 23, 18, P.green2);
    led(c, 26, 18, P.yellow2);
    c.hline(20, 23, 7, P.blue2);
  },
};

export function itemSprites(): Record<string, Canvas> {
  return Object.fromEntries(
    Object.entries(ITEMS).map(([slug, paint]) => {
      const c = new Canvas(ITEM_SIZE, ITEM_SIZE);
      paint(c);
      return [slug, c];
    }),
  );
}
