// Run with `npm run check`. Fails on dangling references, missing or stale art,
// and a regression in the achievement rules.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { equipment } from "../src/data/equipment.ts";
import { achievements, PACK_CAPACITY } from "../src/lib/achievements.ts";
import { ART_DIR, renderArt } from "../art/build.mts";

const slugs = new Set<string>();
for (const e of equipment) {
  assert.ok(!slugs.has(e.slug), `duplicate slug ${e.slug}`);
  slugs.add(e.slug);
  assert.ok(e.projects.length > 0, `${e.slug} has no projects`);
  for (const url of [e.website, e.docs, ...e.github.map((l) => l.url), ...e.community.map((l) => l.url)]) {
    assert.ok(url.startsWith("https://"), `${e.slug}: non-https link ${url}`);
  }
}
for (const e of equipment) {
  for (const r of e.related) assert.ok(slugs.has(r), `${e.slug} relates to unknown ${r}`);
}

// Every device needs a sprite, and the committed PNGs must match the art source.
const art = renderArt();
for (const slug of slugs) assert.ok(art[`items/${slug}.png`], `no sprite painted for ${slug} in art/items.mts`);
for (const [path, png] of Object.entries(art)) {
  const file = join(ART_DIR, path);
  assert.ok(existsSync(file) && readFileSync(file).equals(png), `public/art/${path} is missing or stale: run npm run art`);
}

const unlocked = (pack: typeof equipment, viewed = 0) =>
  achievements(pack, viewed).filter((a) => a.unlocked).map((a) => a.id);
assert.deepEqual(unlocked([]), []);
assert.deepEqual(unlocked([equipment.find((e) => e.slug === "yubikey")!]), ["first-pick", "key-keeper"]);
assert.ok(unlocked(equipment.slice(0, PACK_CAPACITY), 5).includes("full-pack"));
assert.ok(unlocked([], 5).includes("scholar"));

console.log(`ok: ${equipment.length} items, ${Object.keys(art).length} art files up to date`);
