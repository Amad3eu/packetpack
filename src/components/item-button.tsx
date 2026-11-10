import type { Equipment } from "@/data/equipment";
import { Difficulty } from "./difficulty";
import { Icon, ItemSprite } from "./sprite";

/* eslint-disable @next/next/no-img-element -- pixel art must skip next/image's smoothing resize */

/**
 * An item you can hover and click, game-inventory style: it idles with a
 * one-pixel bob, lifts with a shadow on hover and shows a pixel tooltip.
 */
export function ItemButton({ item, onSelect, delay = 0, packed = false }: { item: Equipment; onSelect: () => void; delay?: number; packed?: boolean }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="hover-lift has-tip flex h-[72px] w-[72px] cursor-pointer items-center justify-center"
      aria-label={`${item.name}${packed ? " (in your pack)" : ""}: details`}
    >
      <img src="/art/ui/shadow.png" alt="" aria-hidden width={48} height={12} className="drop-shadow pixelated absolute bottom-0 left-1/2 -translate-x-1/2" />
      <span className="lift block">
        <span className="bob block" style={{ ["--delay" as string]: `${delay}s` }}>
          <ItemSprite slug={item.slug} />
        </span>
      </span>
      {packed && <Icon name="check" className="absolute top-0 right-0" />}
      <span className="tip tooltip text-left">
        <strong className="block">{item.name}</strong>
        <span className="block text-sm opacity-80">{item.category}</span>
        <Difficulty level={item.difficulty} />
      </span>
    </button>
  );
}
