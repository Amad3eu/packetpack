// Run with `npm run check`. Fails on broken sprites, dangling references and
// a regression in the achievement rules.
import assert from "node:assert/strict";
import { equipment } from "../src/data/equipment.ts";
import { PALETTE, SPRITES, BACKPACK_BODY, BACKPACK_FLAP } from "../src/data/sprites.ts";
import { achievements, PACK_CAPACITY } from "../src/lib/achievements.ts";

const layerKeys = new Set(["M", "m", "S", "P"]);

function checkSprite(name: string, rows: string[], allowed: (ch: string) => boolean) {
  const width = rows[0].length;
  rows.forEach((row, i) => {
    assert.equal(row.length, width, `${name} row ${i} is ${row.length} wide, expected ${width}`);
    for (const ch of row) assert.ok(ch === "." || allowed(ch), `${name} row ${i}: unknown colour "${ch}"`);
  });
}

const slugs = new Set<string>();
for (const e of equipment) {
  assert.ok(!slugs.has(e.slug), `duplicate slug ${e.slug}`);
  slugs.add(e.slug);
  assert.ok(SPRITES[e.slug], `missing sprite for ${e.slug}`);
  assert.ok(e.projects.length > 0, `${e.slug} has no projects`);
  for (const url of [e.website, e.docs, ...e.github.map((l) => l.url), ...e.community.map((l) => l.url)]) {
    assert.ok(url.startsWith("https://"), `${e.slug}: non-https link ${url}`);
  }
}
for (const e of equipment) {
  for (const r of e.related) assert.ok(slugs.has(r), `${e.slug} relates to unknown ${r}`);
}
for (const [name, rows] of Object.entries(SPRITES)) {
  assert.equal(rows.length, 16, `${name} must have 16 rows`);
  checkSprite(name, rows, (ch) => ch in PALETTE);
}
checkSprite("backpack body", BACKPACK_BODY, (ch) => ch in PALETTE || layerKeys.has(ch));
checkSprite("backpack flap", BACKPACK_FLAP, (ch) => ch in PALETTE || layerKeys.has(ch));
assert.equal(BACKPACK_FLAP[0].length, BACKPACK_BODY[0].length, "flap and body widths differ");

const unlocked = (pack: typeof equipment, viewed = 0) =>
  achievements(pack, viewed).filter((a) => a.unlocked).map((a) => a.id);
assert.deepEqual(unlocked([]), []);
assert.deepEqual(unlocked([equipment.find((e) => e.slug === "yubikey")!]), ["first-pick", "key-keeper"]);
assert.ok(unlocked(equipment.slice(0, PACK_CAPACITY), 5).includes("full-pack"));
assert.ok(unlocked([], 5).includes("scholar"));

console.log(`ok: ${equipment.length} items, ${Object.keys(SPRITES).length} sprites`);
