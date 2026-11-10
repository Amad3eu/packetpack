// `npm run art` paints every sprite and writes PNGs to public/art.
// `npm run check` calls renderArt() too and fails if the committed PNGs are stale.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { achievementArt } from "./achievements.mts";
import { backpackArt } from "./backpack.mts";
import { itemSprites } from "./items.mts";
import { sceneArt } from "./scene.mts";
import { UI_SCALE, uiArt } from "./ui.mts";

export const ART_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "art");

/** Relative path ("items/yubikey.png") -> PNG bytes. */
export function renderArt(): Record<string, Buffer> {
  const out: Record<string, Buffer> = {};
  for (const [slug, c] of Object.entries(itemSprites())) out[`items/${slug}.png`] = c.png();
  for (const [name, c] of Object.entries({ ...backpackArt(), ...sceneArt(), ...achievementArt() })) out[`${name}.png`] = c.png();
  const ui = uiArt();
  for (const [name, c] of Object.entries(ui.scaled)) out[`${name}.png`] = c.png(UI_SCALE);
  for (const [name, c] of Object.entries(ui.native)) out[`${name}.png`] = c.png();
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = renderArt();
  for (const [path, png] of Object.entries(files)) {
    mkdirSync(dirname(join(ART_DIR, path)), { recursive: true });
    writeFileSync(join(ART_DIR, path), png);
  }
  console.log(`wrote ${Object.keys(files).length} files to public/art`);
}
