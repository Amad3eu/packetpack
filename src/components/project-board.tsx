"use client";

import Link from "next/link";
import { useState } from "react";
import { DIFFICULTY_LABEL, equipment, type Difficulty as Level } from "@/data/equipment";
import { Difficulty } from "./difficulty";
import { usePack } from "./pack-provider";
import { Icon, ItemSprite } from "./sprite";

const ALL = equipment.flatMap((item) => item.projects.map((p) => ({ ...p, item })));

export function ProjectBoard() {
  const pack = usePack();
  const [level, setLevel] = useState<Level | null>(null);
  const [onlyMine, setOnlyMine] = useState(false);

  const shown = ALL.filter((p) => (!level || p.difficulty === level) && (!onlyMine || pack.has(p.item.slug)));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <h1 className="font-pixel text-3xl sm:text-4xl">Quest board</h1>
      <p className="mt-2 max-w-2xl text-parchment/75">
        Hands-on ideas for every item in the catalog, from first steps to advanced labs.
      </p>
      <p className="slot mt-4 flex max-w-3xl gap-2 text-sm">
        <Icon name="shield" />
        Every project assumes your own equipment, an isolated lab or explicit written authorization.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filters">
        {([1, 2, 3] as Level[]).map((l) => (
          <button key={l} type="button" className="chip" aria-pressed={level === l} onClick={() => setLevel(level === l ? null : l)}>
            {DIFFICULTY_LABEL[l]}
          </button>
        ))}
        <button type="button" className="chip" aria-pressed={onlyMine} onClick={() => setOnlyMine((v) => !v)}>
          Only gear in my pack
        </button>
      </div>

      <p className="mt-4 text-sm text-parchment/70" aria-live="polite">
        {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>

      {shown.length === 0 ? (
        <p className="panel mt-3 text-parchment/80">
          No projects match. {onlyMine && <Link href="/" className="text-gold underline">Add gear to your pack</Link>}
        </p>
      ) : (
        <ul className="mt-6 grid gap-x-4 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={`${p.item.slug}-${p.title}`} className="paper relative flex flex-col pt-3">
              <Icon name="pin" scale={3} className="absolute -top-5 left-1/2 -translate-x-1/2" />
              <div className="flex items-center gap-3">
                <ItemSprite slug={p.item.slug} scale={1} />
                <Link href={`/gear/${p.item.slug}`} className="text-sm underline">
                  {p.item.name}
                </Link>
              </div>
              <h2 className="mt-2 font-pixel text-lg leading-tight">{p.title}</h2>
              <p className="mt-1 flex-1 text-sm">{p.summary}</p>
              <div className="mt-3">
                <Difficulty level={p.difficulty} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
