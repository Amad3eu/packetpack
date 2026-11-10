"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Search, X } from "lucide-react";
import { CATEGORIES, DIFFICULTY_LABEL, equipment, type Difficulty as Level } from "@/data/equipment";
import { SPRITES } from "@/data/sprites";
import { Difficulty } from "./difficulty";
import { PackButton } from "./pack-button";
import { PixelSprite } from "./pixel-sprite";

const MAX_COMPARE = 3;

export function Catalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  const q = query.trim().toLowerCase();
  const results = equipment.filter(
    (e) =>
      (!category || e.category === category) &&
      (!level || e.difficulty === level) &&
      (!q ||
        [e.name, e.manufacturer, e.tagline, ...e.protocols].some((text) => text.toLowerCase().includes(q))),
  );
  const compared = compare.map((slug) => equipment.find((e) => e.slug === slug)!);

  const toggleCompare = (slug: string) =>
    setCompare((c) => (c.includes(slug) ? c.filter((s) => s !== slug) : c.length < MAX_COMPARE ? [...c, slug] : c));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <h1 className="font-pixel text-3xl sm:text-4xl">Equipment catalog</h1>
      <p className="mt-2 max-w-2xl text-parchment/75">
        Search by name, maker or protocol. Tick up to {MAX_COMPARE} items to compare them side by side.
      </p>

      <div className="panel mt-6 space-y-4 p-4">
        <label className="relative block">
          <span className="sr-only">Search equipment</span>
          <Search size={18} aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 opacity-60" />
          <input
            type="search"
            className="field w-full pl-10"
            placeholder="Try “NFC”, “Hak5” or “SDR”"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
          <button type="button" className="chip" aria-pressed={!category} onClick={() => setCategory(null)}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={category === c} onClick={() => setCategory(category === c ? null : c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Difficulty">
          {([1, 2, 3] as Level[]).map((l) => (
            <button key={l} type="button" className="chip" aria-pressed={level === l} onClick={() => setLevel(level === l ? null : l)}>
              {DIFFICULTY_LABEL[l]}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-parchment/70" aria-live="polite">
        {results.length} {results.length === 1 ? "item" : "items"}
      </p>

      <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((e) => (
          <motion.li key={e.slug} layout className="panel flex flex-col p-4">
            <div className="flex gap-4">
              <motion.div className="slot h-20 w-20 shrink-0 p-2" whileHover={{ y: -4, rotate: -5 }}>
                <PixelSprite rows={SPRITES[e.slug]} label={e.name} className="h-full w-full" />
              </motion.div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-gold">{e.category}</p>
                <h2 className="font-pixel text-xl leading-tight">
                  <Link href={`/gear/${e.slug}`} className="hover:underline">
                    {e.name}
                  </Link>
                </h2>
                <p className="text-xs text-parchment/65">{e.manufacturer}</p>
              </div>
            </div>
            <p className="mt-3 flex-1 text-sm text-parchment/85">{e.tagline}</p>
            {e.status && <p className="mt-2 text-xs font-semibold text-ember">{e.status}</p>}
            <div className="mt-3 text-parchment/80">
              <Difficulty level={e.difficulty} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <PackButton slug={e.slug} />
              <Link href={`/gear/${e.slug}`} className="btn btn-ghost">
                Profile
              </Link>
              <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[var(--color-gold)]"
                  checked={compare.includes(e.slug)}
                  disabled={!compare.includes(e.slug) && compare.length >= MAX_COMPARE}
                  onChange={() => toggleCompare(e.slug)}
                />
                Compare
              </label>
            </div>
          </motion.li>
        ))}
      </ul>

      {compared.length > 0 && (
        <section id="compare" className="panel mt-10 p-4 sm:p-6" aria-labelledby="compare-title">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="compare-title" className="flex items-center gap-2 font-pixel text-2xl">
              <Scale size={20} aria-hidden className="text-gold" /> Compare
            </h2>
            <button type="button" className="btn btn-ghost" onClick={() => setCompare([])}>
              <X size={16} aria-hidden /> Clear
            </button>
          </div>
          {compared.length < 2 ? (
            <p className="mt-3 text-sm text-parchment/70">Pick at least one more item to compare.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="w-32 p-2 text-parchment/60">
                      <span className="sr-only">Attribute</span>
                    </th>
                    {compared.map((e) => (
                      <th key={e.slug} scope="col" className="p-2 align-bottom">
                        <PixelSprite rows={SPRITES[e.slug]} className="mb-1 h-10 w-10" />
                        <span className="font-pixel text-lg">{e.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["Category", (e) => e.category],
                      ["Maker", (e) => e.manufacturer],
                      ["Difficulty", (e) => <Difficulty level={e.difficulty} />],
                      ["Price", (e) => e.price],
                      ["Protocols", (e) => e.protocols.join(", ")],
                      [
                        "Key specs",
                        (e) => (
                          <ul className="space-y-1">
                            {e.specs.map((s) => (
                              <li key={s.label}>
                                <span className="text-parchment/60">{s.label}:</span> {s.value}
                              </li>
                            ))}
                          </ul>
                        ),
                      ],
                    ] as [string, (e: (typeof equipment)[number]) => React.ReactNode][]
                  ).map(([label, render]) => (
                    <tr key={label} className="border-t-2 border-ink align-top">
                      <th scope="row" className="p-2 font-semibold text-parchment/70">
                        {label}
                      </th>
                      {compared.map((e) => (
                        <td key={e.slug} className="p-2">
                          {render(e)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {compare.length > 0 && (
        <a href="#compare" className="btn btn-primary fixed right-4 bottom-4 z-20 shadow-lg">
          <Scale size={16} aria-hidden /> Compare ({compare.length})
        </a>
      )}
    </div>
  );
}
