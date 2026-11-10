"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { bySlug, equipment, type Equipment } from "@/data/equipment";
import { achievements } from "@/lib/achievements";
import { BackpackSprite, usePackFrame } from "./backpack";
import { DetailDialog } from "./detail-dialog";
import { Difficulty } from "./difficulty";
import { InventoryWindow } from "./inventory-window";
import { ItemButton } from "./item-button";
import { PackButton } from "./pack-button";
import { PACK_COLORS, PATCHES, STRAP_COLORS, usePack } from "./pack-provider";
import { RoomScene } from "./room-scene";
import { Icon, ItemSprite } from "./sprite";

export function PackScreen() {
  const pack = usePack();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const frame = usePackFrame(open);

  const items = pack.items.map(bySlug).filter((e): e is Equipment => Boolean(e));
  const quests = achievements(items, pack.viewed.length);
  const done = quests.filter((q) => q.unlocked).length;
  // First project of every item before anyone's second, so one device doesn't fill the board.
  const notes = items
    .flatMap((e) => e.projects.map((p, rank) => ({ ...p, item: e, rank })))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 4);

  return (
    <div className="pb-14">
      <h1 className="sr-only">PACKETPACK: explore cybersecurity hardware and build your own inventory</h1>

      <div className="relative mx-auto" style={{ width: "min(100%, calc(var(--s) * 320px))" }}>
        <RoomScene look={pack.look} frame={frame} open={open} onToggle={() => setOpen((o) => !o)} />
        <AnimatePresence>
          {open && <InventoryWindow items={items} onSelect={setSelected} onClose={() => setOpen(false)} />}
        </AnimatePresence>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-[1280px] gap-6 px-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="panel self-start" aria-labelledby="workbench-title">
          <h2 id="workbench-title" className="font-pixel text-3xl">Workbench</h2>
          <p className="mt-1 text-parchment/80">
            Explore the tools. Understand the technology. Build your own inventory. Point at an item to inspect it; click or tap for its full card.
          </p>
          <ul className="mt-4 grid grid-cols-4 gap-y-3 sm:grid-cols-6 lg:grid-cols-8">
            {equipment.map((e, i) => (
              <li key={e.slug} className="flex flex-col items-center">
                <div className="shelf-cell flex w-full justify-center">
                  <ItemButton item={e} onSelect={() => setSelected(e.slug)} delay={(i % 5) * 0.3} packed={pack.has(e.slug)} />
                </div>
                <PackButton slug={e.slug} compact />
              </li>
            ))}
          </ul>
          <Link href="/catalog" className="mt-4 inline-flex items-center gap-2 text-gold underline-offset-4 hover:underline">
            Search and compare everything in the catalog <Icon name="arrow-right" />
          </Link>
        </section>

        <div className="flex flex-col gap-6">
          <section id="quests" className="paper scroll-mt-6" aria-labelledby="quests-title">
            <div className="flex items-center justify-between gap-2">
              <h2 id="quests-title" className="flex items-center gap-2 font-pixel text-2xl">
                <Icon name="scroll" scale={3} /> Quest log
              </h2>
              <span>
                {done}/{quests.length}
              </span>
            </div>
            <div className="mt-2 flex gap-1" aria-hidden>
              {quests.map((q, i) => (
                <span key={q.id} className={`h-3 flex-1 border-2 border-ink ${i < done ? "bg-[#e8b931]" : "bg-[#cdb084]"}`} />
              ))}
            </div>
            <ul className="mt-3 space-y-2">
              {quests.map((q) => (
                <li key={q.id} className={`flex items-start gap-3 ${q.unlocked ? "" : "opacity-70"}`}>
                  <Icon name={q.unlocked ? "check" : "lock"} scale={3} className="mt-0.5" />
                  <span>
                    <strong className="block leading-tight">{q.title}</strong>
                    <span className="text-sm">{q.hint}</span>
                    <span className="sr-only">{q.unlocked ? " (complete)" : " (not complete yet)"}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <BackpackStyle />
        </div>
      </div>

      <section className="mx-auto mt-10 w-full max-w-[1280px] px-4" aria-labelledby="notes-title">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="notes-title" className="font-pixel text-3xl">Pinned notes</h2>
          <Link href="/projects" className="inline-flex items-center gap-2 text-gold hover:underline">
            Every project on the quest board <Icon name="arrow-right" />
          </Link>
        </div>
        {notes.length === 0 ? (
          <p className="paper mt-4 max-w-xl">Pack some gear and project ideas for it will be pinned here.</p>
        ) : (
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {notes.map((p) => (
              <li key={`${p.item.slug}-${p.title}`} className="paper relative pt-3">
                <Icon name="pin" scale={3} className="absolute -top-5 left-1/2 -translate-x-1/2" />
                <div className="flex items-center gap-2">
                  <ItemSprite slug={p.item.slug} scale={1} />
                  <Link href={`/gear/${p.item.slug}`} className="text-sm underline">
                    {p.item.name}
                  </Link>
                </div>
                <h3 className="mt-2 font-pixel text-lg leading-tight">{p.title}</h3>
                <p className="mt-1 text-sm">{p.summary}</p>
                <div className="mt-2">
                  <Difficulty level={p.difficulty} />
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

function BackpackStyle() {
  const { look, setLook, items, clear } = usePack();
  return (
    <section className="panel" aria-labelledby="style-title">
      <div className="flex items-center gap-4">
        <span className="relative block h-24 w-24 shrink-0" style={{ ["--px" as string]: "2px" }}>
          <BackpackSprite look={look} frame={0} />
        </span>
        <div className="min-w-0">
          <h2 id="style-title" className="flex items-center gap-2 font-pixel text-2xl">
            <Icon name="palette" scale={3} /> Backpack style
          </h2>
          <label className="mt-2 block">
            <span className="sr-only">Backpack name</span>
            <input className="field w-full" value={look.name} maxLength={28} onChange={(e) => setLook({ name: e.target.value })} />
          </label>
        </div>
      </div>
      <Swatches legend="Colour" options={PACK_COLORS.map((c) => ({ id: c.id, label: c.label, color: c.main }))} value={look.color} onChange={(id) => setLook({ color: id as typeof look.color })} />
      <Swatches legend="Straps" options={STRAP_COLORS.map((c) => ({ id: c.id, label: c.label, color: c.color }))} value={look.strap} onChange={(id) => setLook({ strap: id as typeof look.strap })} />
      <Swatches legend="Patch" options={PATCHES.map((p) => ({ id: p.id, label: p.label, color: p.color }))} value={look.patch} onChange={(id) => setLook({ patch: id as typeof look.patch })} />
      {items.length > 0 && (
        <button type="button" className="btn btn-ghost btn-sm mt-4" onClick={clear}>
          Empty the backpack
        </button>
      )}
    </section>
  );
}

function Swatches(props: { legend: string; options: { id: string; label: string; color: string }[]; value: string; onChange: (id: string) => void }) {
  return (
    <fieldset className="mt-3">
      <legend className="mb-1 text-parchment/80">{props.legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {props.options.map((o) => (
          <label key={o.id} className="swatch" title={o.label}>
            <input type="radio" name={props.legend} value={o.id} checked={props.value === o.id} onChange={() => props.onChange(o.id)} className="sr-only" />
            <span className="h-3 w-3 border-2 border-ink" style={{ background: o.color }} aria-hidden />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
