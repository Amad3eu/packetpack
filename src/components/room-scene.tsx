/* eslint-disable @next/next/no-img-element -- pixel art must skip next/image's smoothing resize */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FAIRY_LIGHTS, LEDS, MOTES, SPOTS, type Box } from "@/lib/scene";
import { BackpackSprite } from "./backpack";
import type { Look } from "./pack-provider";

/** Position a layer in native scene pixels; `--s` (the world scale) turns them into CSS px. */
const at = (b: Box): React.CSSProperties => ({
  left: `calc(var(--s) * ${b.x}px)`,
  top: `calc(var(--s) * ${b.y}px)`,
  width: `calc(var(--s) * ${b.w}px)`,
  height: `calc(var(--s) * ${b.h}px)`,
});

function sheet(src: string, frameW: number, frameH: number, frames: number, dur: string) {
  return {
    backgroundImage: `url(${src})`,
    "--sheet-w": `${frameW * frames}px`,
    "--sheet-h": `${frameH}px`,
    "--frames": frames,
    "--dur": dur,
  } as React.CSSProperties;
}

function Hotspot(props: { box: Box; label: string; tip: string; href: string; tipInside?: boolean }) {
  return (
    <Link href={props.href} className="hotspot has-tip absolute" style={at(props.box)} aria-label={props.label}>
      <span className="tip tooltip" style={props.tipInside ? { top: 4, bottom: "auto" } : undefined}>
        {props.tip}
      </span>
    </Link>
  );
}

type Props = {
  look: Look;
  frame: number;
  open: boolean;
  onToggle: () => void;
};

/** The bedroom workshop. Everything is one 320x180 pixel world scaled by a whole number. */
export function RoomScene({ look, frame, open, onToggle }: Props) {
  const viewport = useRef<HTMLDivElement>(null);

  // On narrow screens the room scrolls sideways; start with the backpack and desk in view.
  useEffect(() => {
    const v = viewport.current;
    if (!v || v.scrollWidth <= v.clientWidth) return;
    const scale = parseFloat(getComputedStyle(v).getPropertyValue("--s")) || 2;
    v.scrollLeft = 150 * scale - v.clientWidth / 2;
  }, []);

  const bp = SPOTS.backpack;

  return (
    <div ref={viewport} className="overflow-x-auto overflow-y-hidden [scrollbar-width:thin]">
      <div className="scene mx-auto" role="group" aria-label="Your workshop">
        <img src="/art/scene/room.png" alt="" className="pixelated inset-0 h-full w-full" draggable={false} />
        <div className="rain" style={at(SPOTS.window)} aria-hidden />
        <div className="sheet" style={{ ...at(SPOTS.screen), ...sheet("/art/scene/screen.png", 32, 22, 4, "2.4s") }} aria-hidden />
        <div className="sheet" style={{ ...at(SPOTS.cat), ...sheet("/art/scene/cat.png", 26, 12, 2, "3.2s") }} aria-hidden />
        <div className="sheet" style={{ ...at(SPOTS.steam), ...sheet("/art/scene/steam.png", 8, 10, 3, "1.5s") }} aria-hidden />
        {[0, 1.2].map((delay, i) => (
          <span
            key={delay}
            aria-hidden
            className="zzz font-pixel leading-none text-[#a9a3ec]"
            style={{ ...at({ x: 258 + i * 3, y: 78 - i * 2, w: 6, h: 6 }), fontSize: `calc(var(--s) * ${5 + i}px)`, ["--delay" as string]: `${delay}s` }}
          >
            z
          </span>
        ))}

        <img src="/art/scene/glow.png" alt="" className="flicker pixelated pointer-events-none" style={at(SPOTS.glow)} draggable={false} />
        {MOTES.map((m) => (
          <span key={`${m.x}-${m.y}`} aria-hidden className="mote bg-[#ffd27a]" style={{ ...at({ ...m, w: 1, h: 1 }), ["--delay" as string]: `${m.delay}s` }} />
        ))}
        {LEDS.map((l) => (
          <span
            key={`${l.x}-${l.y}`}
            aria-hidden
            className="blink"
            style={{
              ...at({ x: l.x, y: l.y, w: 1, h: 1 }),
              background: l.color,
              boxShadow: `0 0 calc(var(--s) * 3px) ${l.color}`,
              ["--period" as string]: `${l.period}s`,
              ["--delay" as string]: `${l.delay}s`,
            }}
          />
        ))}
        {FAIRY_LIGHTS.map((l, i) => (
          <span
            key={l.x}
            aria-hidden
            className="blink"
            style={{
              ...at({ x: l.x, y: l.y, w: 2, h: 2 }),
              background: l.color,
              boxShadow: `0 0 calc(var(--s) * 4px) ${l.color}`,
              ["--period" as string]: `${2.4 + (i % 3) * 0.7}s`,
              ["--delay" as string]: `${i * 0.35}s`,
            }}
          />
        ))}

        <Hotspot box={SPOTS.bookcase} href="/catalog" label="Bookshelf: open the equipment catalog" tip="Catalog" tipInside />
        <Hotspot box={SPOTS.corkboard} href="/projects" label="Quest board: browse project ideas" tip="Quest board" tipInside />
        <Hotspot box={SPOTS.trophy} href="#quests" label="Trophy: see your quest log" tip="Quest log" />

        {!open && (
          <span
            aria-hidden
            className="pointer-events-none"
            style={{ left: `calc(var(--s) * ${bp.x + bp.w / 2}px)`, top: `calc(var(--s) * ${bp.y - 22}px)`, transform: "translateX(-50%)" }}
          >
            <span className="bob tooltip block font-pixel">Click the backpack!</span>
          </span>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="inventory"
          aria-label={open ? "Close the backpack" : "Open the backpack"}
          className="hotspot hover-lift group"
          style={{ ...at(bp), ["--px" as string]: "calc(var(--s) * 1px)" }}
        >
          <span className="lift absolute inset-0 block">
            <BackpackSprite look={look} frame={frame} />
          </span>
        </button>
      </div>
    </div>
  );
}
