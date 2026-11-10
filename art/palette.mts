// One limited palette for the whole game, so every sprite reads as the same world.
// Ramps go dark -> light. Change a colour here and run `npm run art`.
export const P = {
  ink: "#140c1c",
  // night wall
  wall0: "#141a2e", wall1: "#1b2440", wall2: "#233052", wall3: "#2e3d66",
  // wood
  wood0: "#2e1a16", wood1: "#4a2a20", wood2: "#6b3f2c", wood3: "#8f5a3a", wood4: "#b37a4c", wood5: "#d6a26a",
  // metal / plastic greys
  grey0: "#22202e", grey1: "#34324a", grey2: "#4f4e68", grey3: "#7a7a94", grey4: "#a9aabd", grey5: "#d8d9e3", white: "#f4f2ea",
  // warm light
  amber0: "#7a3412", amber1: "#c45a1a", amber2: "#f28c28", amber3: "#ffb347", amber4: "#ffd27a", amber5: "#fff1c4",
  // accents
  red0: "#6e1f2e", red1: "#b83a3a", red2: "#e8615a",
  green0: "#1d4a2c", green1: "#2e7d4a", green2: "#4fb069", green3: "#9ae08a",
  blue0: "#1d2f66", blue1: "#2f5fb3", blue2: "#4f9ae8", cyan: "#6fe3f0",
  yellow0: "#a9781e", yellow1: "#e8b931", yellow2: "#ffe266",
  pink0: "#a8466e", pink1: "#e58fb0",
  purple0: "#3a2a66", purple1: "#5a4a9e", purple2: "#7f73cf", purple3: "#a9a3ec", rain: "#c9cdff",
  // parchment / paper
  paper0: "#9c7f58", paper1: "#cdb084", paper2: "#ead6a8", paper3: "#f8ecc8",
  // UI plum
  plum0: "#1a1226", plum1: "#251a36", plum2: "#33264a", plum3: "#463463",
} as const;
