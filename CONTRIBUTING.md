# Contributing to PACKETPACK

Thanks for helping! Contributions of every size are welcome: a typo, a corrected spec, a new project idea or a whole new device.

## Ground rules for content

PACKETPACK is an educational catalog. Content should help people **understand** hardware and **defend** systems.

- **Welcome:** what a device is, how it works, its specs and protocols, learning projects, and defensive and authorized-testing uses.
- **Not accepted:** payloads, exploit code, step-by-step instructions for attacking systems you don't own, credential theft, stealth or persistence techniques, or content targeting third-party infrastructure.
- **Projects must assume** your own equipment, an isolated lab, or explicit written authorization.

## Sourcing specs and prices

1. Take specs from the **manufacturer's documentation** and link it in `docs`.
2. If you're not sure about a value, leave it out. A missing spec is better than a wrong one.
3. Write prices as approximate ranges (`≈ US$30–40`) and say where they come from when it isn't obvious.
4. If a product is retired or replaced, set `status` with a short note and, if there is one, the successor.
5. Mention your sources in the pull request description.

## Adding a device

1. Add an object to `src/data/equipment.ts` and fill in every field. Use an existing entry as a template.
2. Paint a 32×32 sprite: add a function under the same `slug` to `ITEMS` in `art/items.mts`.
   - Build it from the canvas helpers (`box`, `rect`, `grid`, `circle`) like the existing items: 1 px ink outline, light from the top-left.
   - Use colours from `art/palette.mts` only. Give the device a silhouette and colours that make it recognizable at a glance.
   - Run `npm run art` to write `public/art/items/<slug>.png`, and commit the PNG.
3. List 2–3 `related` slugs, and add your device to the `related` list of at least one existing device.
4. Run the checks:

   ```bash
   npm run check   # data, quest rules, and that public/art matches the art source
   npm run lint
   npm run build
   ```

5. Open `npm run dev` and look at your device on the workbench, in the backpack, in the catalog, on its profile and in the compare table.

## Code changes

- Keep the indie-game look. Draw art in `art/` with the shared palette and show it at whole-number scales with `image-rendering: pixelated`; use the game-menu classes (`panel`, `paper`, `slot`, `btn`, `tooltip`) instead of plain cards. Avoid generic dashboard styling.
- Never edit `public/art/` by hand: change the source in `art/` and run `npm run art`.
- Animate in pixel steps (CSS `steps()`), and keep it calm: the room should feel alive, not busy.
- Keep it accessible. Interactive elements need a visible focus state and a text label, and new animations must respect reduced motion (Framer Motion already does through `MotionConfig`).
- Check the layout at 375 px wide; the page must not scroll horizontally.
- Comment the *why* in one line when the code can't show it.

## Pull requests

- One topic per pull request.
- Describe what changed and how you tested it, and add a screenshot for visual changes.
- Make sure `npm run check`, `npm run lint` and `npm run build` pass.

By contributing, you agree that your work is released under the [MIT License](LICENSE).
