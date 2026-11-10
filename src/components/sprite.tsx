/* eslint-disable @next/next/no-img-element -- pixel art must skip next/image's smoothing resize */

const ITEM_PX = 32;

/** An equipment sprite at a whole-number scale (32 px x scale). */
export function ItemSprite({ slug, scale = 2, alt = "", className = "" }: { slug: string; scale?: number; alt?: string; className?: string }) {
  return (
    <img
      src={`/art/items/${slug}.png`}
      width={ITEM_PX * scale}
      height={ITEM_PX * scale}
      alt={alt}
      draggable={false}
      className={`pixelated ${className}`}
    />
  );
}

export type IconName =
  | "bag" | "trophy" | "lock" | "check" | "close" | "plus" | "minus" | "star" | "star-off" | "coin" | "book"
  | "scroll" | "search" | "compare" | "arrow-right" | "arrow-left" | "link" | "code" | "people" | "docs"
  | "shield" | "flask" | "palette" | "sparkle" | "pin";

/** A 9x9 pixel icon. Decorative by default; pass `label` when it carries meaning on its own. */
export function Icon({ name, scale = 2, label, className = "" }: { name: IconName; scale?: number; label?: string; className?: string }) {
  const px = name === "pin" ? 7 : 9;
  return (
    <img
      src={`/art/icons/${name}.png`}
      width={px * scale}
      height={px * scale}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      draggable={false}
      className={`pixelated inline-block shrink-0 ${className}`}
    />
  );
}
