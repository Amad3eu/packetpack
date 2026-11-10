// Layout of the bedroom scene in native pixels (320x180). The art pipeline paints
// from these numbers and the React scene places its hotspots and animated layers
// with them, so the two can't drift apart.

export const SCENE_W = 320;
export const SCENE_H = 180;

export type Box = { x: number; y: number; w: number; h: number };

export const SPOTS = {
  bookcase: { x: 6, y: 10, w: 60, h: 124 },
  trophy: { x: 47, y: 60, w: 12, h: 14 },
  corkboard: { x: 76, y: 28, w: 58, h: 42 },
  backpack: { x: 92, y: 110, w: 48, h: 48 },
  monitor: { x: 176, y: 62, w: 40, h: 36 },
  screen: { x: 180, y: 66, w: 32, h: 22 },
  steam: { x: 219, y: 79, w: 8, h: 10 },
  window: { x: 248, y: 24, w: 60, h: 68 },
  cat: { x: 258, y: 85, w: 26, h: 12 },
  glow: { x: 84, y: 20, w: 160, h: 140 },
} satisfies Record<string, Box>;

/** Blinking lights painted as tiny DOM squares on top of the scene. */
export const LEDS: { x: number; y: number; color: string; period: number; delay: number }[] = [
  { x: 233, y: 94, color: "#e8615a", period: 1.2, delay: 0 }, // breadboard
  { x: 205, y: 125, color: "#4fb069", period: 3, delay: 0.4 }, // PC power
  { x: 50, y: 45, color: "#4fb069", period: 0.7, delay: 0.1 }, // router
  { x: 53, y: 45, color: "#4fb069", period: 0.9, delay: 0.5 },
  { x: 56, y: 45, color: "#ffb347", period: 1.7, delay: 0.2 },
  { x: 52, y: 15, color: "#6fe3f0", period: 2.2, delay: 0.8 }, // robot antenna
  { x: 175, y: 155, color: "#e8615a", period: 4, delay: 1 }, // power strip
];

/** Fairy lights strung along the top of the wall. */
export const FAIRY_LIGHTS: { x: number; y: number; color: string }[] = [
  { x: 82, y: 9, color: "#ffd27a" },
  { x: 102, y: 13, color: "#e58fb0" },
  { x: 122, y: 14, color: "#6fe3f0" },
  { x: 142, y: 12, color: "#ffd27a" },
  { x: 162, y: 9, color: "#9ae08a" },
  { x: 182, y: 11, color: "#e58fb0" },
  { x: 202, y: 13, color: "#ffd27a" },
  { x: 222, y: 10, color: "#6fe3f0" },
];

/** Dust motes drifting in the lamp light. */
export const MOTES: { x: number; y: number; delay: number }[] = [
  { x: 150, y: 70, delay: 0 },
  { x: 166, y: 58, delay: 1.4 },
  { x: 140, y: 84, delay: 2.6 },
  { x: 176, y: 48, delay: 0.8 },
  { x: 130, y: 64, delay: 3.4 },
  { x: 158, y: 40, delay: 2 },
];
