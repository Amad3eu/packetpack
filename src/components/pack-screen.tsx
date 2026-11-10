"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Lock, Palette, Trophy } from "lucide-react";
import { bySlug, equipment, type Equipment } from "@/data/equipment";
import { SPRITES } from "@/data/sprites";
import { achievements, PACK_CAPACITY } from "@/lib/achievements";
import { Backpack } from "./backpack";
import { DetailDialog } from "./detail-dialog";
import { Difficulty } from "./difficulty";
import { PackButton } from "./pack-button";
import { PACK_COLORS, PATCHES, STRAP_COLORS, usePack } from "./pack-provider";
import { PixelSprite } from "./pixel-sprite";

const FLOATERS = [
  { slug: "flipper-zero", className: "left-[2%] top-[8%] w-14", delay: 0 },
  { slug: "usb-rubber-ducky", className: "right-[4%] top-[4%] w-12", delay: 0.6 },
  { slug: "yubikey", className: "left-[6%] bottom-[14%] w-12", delay: 1.1 },
  { slug: "hackrf-one", className: "right-[2%] bottom-[20%] w-14", delay: 0.3 },
];

export function PackScreen() {
  const pack = usePack();
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const items = pack.items.map(bySlug).filter((e): e is Equipment => Boolean(e));
  const badges = achievements(items, pack.viewed.length);
  // First project of every item before anyone's second, so one device doesn't fill the list.
  const projects = items
    .flatMap((e) => e.projects.map((p, rank) => ({ ...p, item: e, rank })))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Scene */}
        <div className="panel relative overflow-hidden p-5 sm:p-6">
          <h1 className="font-pixel text-3xl leading-tight sm:text-4xl">
            Explore the tools.
            <span className="block text-gold">Build your inventory.</span>
          </h1>
          <p className="mt-2 text-sm text-parchment/75">
            An illustrated, open-source catalog of cybersecurity hardware, made for learning in labs you own or are authorized to test.
          </p>

          <div className="relative mx-auto mt-4 max-w-[19rem]">
            {!open &&
              FLOATERS.map((f) => (
                <motion.div
                  key={f.slug}
                  aria-hidden
                  className={`absolute z-10 ${f.className}`}
                  animate={{ y: [0, -8, 0], rotate: [-4, 4, -4] }}
                  transition={{ duration: 3.2, repeat: Infinity, delay: f.delay, ease: "easeInOut" }}
                >
                  <PixelSprite rows={SPRITES[f.slug]} className="w-full drop-shadow-[0_3px_0_rgba(0,0,0,0.35)]" />
                </motion.div>
              ))}
            <motion.button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="relative block w-full cursor-pointer px-10 pt-10"
              aria-label={open ? "Close the backpack" : "Open the backpack"}
              aria-expanded={open}
              aria-controls="inventory"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              animate={open ? {} : { y: [0, -3, 0] }}
              transition={open ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Backpack look={pack.look} open={open} />
            </motion.button>
            <div aria-hidden className="mx-auto mt-1 h-3 w-2/3 bg-black/30" style={{ borderRadius: "50%" }} />
          </div>

          <p className="mt-3 text-center font-pixel text-lg">{pack.look.name}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button type="button" className="btn btn-primary" onClick={() => setOpen((o) => !o)} aria-controls="inventory">
              {open ? "Close pack" : "Open pack"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setCustomizing((c) => !c)}
              aria-expanded={customizing}
              aria-controls="customize"
            >
              <Palette size={16} aria-hidden /> Customize
            </button>
          </div>

          {customizing && <Customizer />}
        </div>

        {/* Inventory */}
        <div className="flex flex-col gap-6">
          <div id="inventory" className="panel p-5 sm:p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-pixel text-2xl">Inventory</h2>
              <span className="text-sm text-parchment/70" aria-live="polite">
                {items.length}/{PACK_CAPACITY} slots
              </span>
            </div>
            <div className="relative mt-4">
              <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6" aria-label="Pack slots">
                {Array.from({ length: PACK_CAPACITY }, (_, i) => {
                  const item = items[i];
                  return (
                    <li key={i} className="slot aspect-square">
                      <AnimatePresence>
                        {open && item && (
                          <motion.button
                            key={item.slug}
                            type="button"
                            onClick={() => setSelected(item.slug)}
                            className="item-btn h-full w-full p-1.5"
                            initial={{ opacity: 0, y: 24, scale: 0.4 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.4 }}
                            transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 18 }}
                            whileHover={{ y: -3, rotate: -4 }}
                            title={item.name}
                          >
                            <PixelSprite rows={SPRITES[item.slug]} label={item.name} className="h-full w-full" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
              {(!open || items.length === 0) && (
                <div className="absolute inset-0 grid place-items-center bg-night/70 p-4 text-center">
                  <p className="max-w-xs text-sm">
                    {!open ? (
                      <>
                        <Lock size={16} aria-hidden className="mr-1 inline" />
                        The pack is closed. Open it to see your gear.
                      </>
                    ) : (
                      "Your pack is empty. Pick gear from the shelf below."
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="panel p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-pixel text-2xl">
              <Trophy size={20} aria-hidden className="text-gold" /> Achievements
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {badges.map((a) => (
                <li
                  key={a.id}
                  className={`slot flex items-center gap-3 p-2.5 text-sm ${a.unlocked ? "" : "opacity-60"}`}
                >
                  {a.unlocked ? (
                    <Trophy size={18} aria-hidden className="shrink-0 text-gold" />
                  ) : (
                    <Lock size={18} aria-hidden className="shrink-0" />
                  )}
                  <span>
                    <strong className="block">{a.title}</strong>
                    <span className="text-parchment/70">{a.hint}</span>
                    <span className="sr-only">{a.unlocked ? " (unlocked)" : " (locked)"}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Shelf */}
      <section className="mt-10" aria-labelledby="shelf-title">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="shelf-title" className="font-pixel text-2xl">Gear shelf</h2>
          <Link href="/catalog" className="text-sm text-gold underline-offset-4 hover:underline">
            Search and compare in the catalog →
          </Link>
        </div>
        <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-8">
          {equipment.map((e) => (
            <li key={e.slug} className={`slot flex flex-col items-center gap-2 p-2 ${pack.has(e.slug) ? "slot-active" : ""}`}>
              <motion.button
                type="button"
                className="item-btn w-full p-1"
                onClick={() => setSelected(e.slug)}
                whileHover={{ y: -4 }}
                aria-label={`Details: ${e.name}`}
              >
                <PixelSprite rows={SPRITES[e.slug]} className="mx-auto aspect-square w-16" />
                <span className="mt-1 block text-xs leading-tight">{e.name}</span>
              </motion.button>
              <PackButton slug={e.slug} compact />
            </li>
          ))}
        </ul>
      </section>

      {/* Projects */}
      <section className="mt-10" aria-labelledby="projects-title">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="projects-title" className="font-pixel text-2xl">Projects for your pack</h2>
          <Link href="/projects" className="text-sm text-gold underline-offset-4 hover:underline">
            All projects →
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="mt-3 text-parchment/70">Add gear to your pack and project ideas will show up here.</p>
        ) : (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {projects.map((p) => (
              <li key={`${p.item.slug}-${p.title}`} className="panel flex gap-3 p-4">
                <PixelSprite rows={SPRITES[p.item.slug]} className="h-12 w-12 shrink-0" />
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-parchment/75">{p.summary}</p>
                  <div className="mt-2 flex items-center gap-4 text-parchment/80">
                    <Difficulty level={p.difficulty} />
                    <Link href={`/gear/${p.item.slug}`} className="inline-flex items-center gap-1 text-xs text-gold hover:underline">
                      {p.item.name} <ArrowRight size={12} aria-hidden />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <DetailDialog slug={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function Customizer() {
  const { look, setLook, items, clear } = usePack();
  return (
    <div id="customize" className="mt-5 space-y-4 border-t-4 border-ink pt-4 text-sm">
      <label className="block">
        <span className="mb-1 block text-parchment/70">Pack name</span>
        <input
          className="field w-full"
          value={look.name}
          maxLength={28}
          onChange={(e) => setLook({ name: e.target.value })}
        />
      </label>
      <Swatches
        legend="Colour"
        options={PACK_COLORS.map((c) => ({ id: c.id, label: c.label, color: c.main }))}
        value={look.color}
        onChange={(id) => setLook({ color: id as typeof look.color })}
      />
      <Swatches
        legend="Straps"
        options={STRAP_COLORS.map((c) => ({ id: c.id, label: c.label, color: c.color }))}
        value={look.strap}
        onChange={(id) => setLook({ strap: id as typeof look.strap })}
      />
      <Swatches
        legend="Patch"
        options={PATCHES.map((p) => ({ id: p.id, label: p.label, color: p.color }))}
        value={look.patch}
        onChange={(id) => setLook({ patch: id as typeof look.patch })}
      />
      {items.length > 0 && (
        <button type="button" className="btn btn-ghost" onClick={clear}>
          Empty the pack
        </button>
      )}
    </div>
  );
}

function Swatches(props: {
  legend: string;
  options: { id: string; label: string; color: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1 text-parchment/70">{props.legend}</legend>
      <div className="flex flex-wrap gap-2">
        {props.options.map((o) => (
          <label key={o.id} className="swatch" title={o.label}>
            <input
              type="radio"
              name={props.legend}
              value={o.id}
              checked={props.value === o.id}
              onChange={() => props.onChange(o.id)}
              className="sr-only"
            />
            <span className="h-4 w-4 border-2 border-ink" style={{ background: o.color }} aria-hidden />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
