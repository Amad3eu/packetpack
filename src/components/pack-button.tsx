"use client";

import { usePack } from "./pack-provider";
import { Icon } from "./sprite";

export function PackButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const pack = usePack();
  const inPack = pack.has(slug);
  const blocked = !inPack && pack.isFull;
  const label = inPack ? "Unpack" : blocked ? "Pack is full" : "Pack it";
  return (
    <button
      type="button"
      onClick={() => pack.toggle(slug)}
      disabled={blocked}
      aria-pressed={inPack}
      aria-label={compact ? `${label}` : undefined}
      title={compact ? label : undefined}
      className={`btn ${inPack ? "btn-ghost" : ""} ${compact ? "btn-sm" : ""}`}
    >
      <Icon name={inPack ? "minus" : "plus"} />
      {!compact && label}
    </button>
  );
}
