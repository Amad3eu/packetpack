"use client";

import { Minus, Plus } from "lucide-react";
import { usePack } from "./pack-provider";

export function PackButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const pack = usePack();
  const inPack = pack.has(slug);
  const blocked = !inPack && pack.isFull;
  const label = inPack ? "Remove from pack" : blocked ? "Pack is full" : "Add to pack";
  return (
    <button
      type="button"
      onClick={() => pack.toggle(slug)}
      disabled={blocked}
      aria-pressed={inPack}
      aria-label={compact ? label : undefined}
      title={compact ? label : undefined}
      className={`btn ${inPack ? "btn-ghost" : "btn-primary"} ${compact ? "px-2" : ""}`}
    >
      {inPack ? <Minus size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
      {!compact && label}
    </button>
  );
}
