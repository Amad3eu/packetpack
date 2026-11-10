import Link from "next/link";
import type { Box } from "@/lib/scene";

/** Position a layer in native scene pixels; `--s` (the world scale) turns them into CSS px. */
export const at = (b: Box): React.CSSProperties => ({
  left: `calc(var(--s) * ${b.x}px)`,
  top: `calc(var(--s) * ${b.y}px)`,
  width: `calc(var(--s) * ${b.w}px)`,
  height: `calc(var(--s) * ${b.h}px)`,
});

/** A box relative to a parent layer (for things that move with it). */
export const within = (b: Box, parent: Box): Box => ({ ...b, x: b.x - parent.x, y: b.y - parent.y });

export function Hotspot(props: { box: Box; label: string; tip: string; href: string; tipInside?: boolean }) {
  return (
    <Link href={props.href} className="hotspot has-tip absolute" style={at(props.box)} aria-label={props.label}>
      <span className="tip tooltip" style={props.tipInside ? { top: 4, bottom: "auto" } : undefined}>
        {props.tip}
      </span>
    </Link>
  );
}

/** A blinking light; `glow` is the blur radius in native pixels. */
export function Led(props: { box: Box; color: string; period: number; delay: number; glow: number }) {
  return (
    <span
      aria-hidden
      className="blink absolute"
      style={{
        ...at(props.box),
        background: props.color,
        boxShadow: `0 0 calc(var(--s) * ${props.glow}px) ${props.color}`,
        ["--period" as string]: `${props.period}s`,
        ["--delay" as string]: `${props.delay}s`,
      }}
    />
  );
}
