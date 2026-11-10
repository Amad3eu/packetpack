/* eslint-disable @next/next/no-img-element -- pixel art must skip next/image's smoothing resize */
import { useEffect, useRef } from "react";
import type { Achievement } from "@/lib/achievements";
import { FAIRY_LIGHTS, LEDS, MOTES, SPOTS } from "@/lib/scene";
import { BackpackSprite } from "./backpack";
import type { Look } from "./pack-provider";
import { at, Hotspot, Led } from "./scene-parts";
import { SecretBookcase } from "./secret-bookcase";

function sheet(src: string, frameW: number, frameH: number, frames: number, dur: string) {
  return {
    backgroundImage: `url(${src})`,
    "--sheet-w": `${frameW * frames}px`,
    "--sheet-h": `${frameH}px`,
    "--frames": frames,
    "--dur": dur,
  } as React.CSSProperties;
}

type Props = {
  look: Look;
  frame: number;
  open: boolean;
  onToggle: () => void;
  quests: Achievement[];
};

/** The bedroom workshop. Everything is one 320x180 pixel world scaled by a whole number. */
export function RoomScene({ look, frame, open, onToggle, quests }: Props) {
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
        {LEDS.filter((l) => !l.door).map((l) => (
          <Led key={`${l.x}-${l.y}`} box={{ x: l.x, y: l.y, w: 1, h: 1 }} color={l.color} period={l.period} delay={l.delay} glow={3} />
        ))}
        {FAIRY_LIGHTS.map((l, i) => (
          <Led key={l.x} box={{ x: l.x, y: l.y, w: 2, h: 2 }} color={l.color} period={2.4 + (i % 3) * 0.7} delay={i * 0.35} glow={4} />
        ))}

        <SecretBookcase quests={quests} />
        <Hotspot box={SPOTS.corkboard} href="/projects" label="Quest board: browse project ideas" tip="Quest board" tipInside />

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
