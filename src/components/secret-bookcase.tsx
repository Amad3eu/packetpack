/* eslint-disable @next/next/no-img-element -- pixel art must skip next/image's smoothing resize */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Achievement } from "@/lib/achievements";
import { LEDS, SPOTS, TROPHY_SLOTS } from "@/lib/scene";
import { at, Hotspot, Led, within } from "./scene-parts";

type DoorState = "closed" | "open" | "closing";

/**
 * The bookcase is a secret door: pull the trophy and it rumbles, swings on its
 * hinge and reveals the quest trophies hidden in the wall behind it.
 */
export function SecretBookcase({ quests }: { quests: Achievement[] }) {
  const [door, setDoor] = useState<DoorState>("closed");
  const trophyRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  const shelf = SPOTS.bookcase;

  // Esc closes the passage; focus follows so keyboard players don't get lost.
  useEffect(() => {
    // The trophy button only exists again once the door is shut, so focus it after that render.
    if (door === "closed" && returnFocus.current) {
      returnFocus.current = false;
      trophyRef.current?.focus();
    }
    if (door !== "open") return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDoor("closing");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [door]);

  const revealed = door !== "closed";

  return (
    <>
      {revealed && (
        <ul aria-label="Secret quest room" className="contents">
          {quests.map((q, i) => (
            <li
              key={q.id}
              tabIndex={0}
              aria-label={`${q.title}: ${q.unlocked ? "complete" : "locked"}. ${q.hint}`}
              className="has-tip absolute"
              style={at({ ...TROPHY_SLOTS[i], w: 16, h: 16 })}
            >
              <img
                src={`/art/achievements/${q.id}${q.unlocked ? "" : "-locked"}.png`}
                alt=""
                className={`pixelated h-full w-full ${q.unlocked ? "bob" : ""}`}
                style={{ ["--delay" as string]: `${i * 0.25}s` }}
                draggable={false}
              />
              <span className="tip tooltip text-left" style={{ left: 0, transform: "none" }}>
                <strong className="block">{q.title}</strong>
                <span className="block text-sm">{q.hint}</span>
                <span className="block text-sm">{q.unlocked ? "Complete!" : "Locked"}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
      {door === "open" && (
        <span className="absolute" style={{ left: `calc(var(--s) * ${SPOTS.alcove.x + 4}px)`, top: `calc(var(--s) * ${SPOTS.alcove.y + 2}px)` }}>
          <button ref={closeRef} type="button" className="tooltip pointer-events-auto cursor-pointer" onClick={() => setDoor("closing")}>
            Close <span className="sr-only">the secret passage</span>
          </button>
        </span>
      )}

      <div
        className="secret-door"
        data-state={door}
        style={at(shelf)}
        onAnimationEnd={() => {
          if (door === "closing") {
            returnFocus.current = true;
            setDoor("closed");
          }
        }}
      >
        <img src="/art/scene/bookcase.png" alt="" className="pixelated absolute inset-0 h-full w-full" draggable={false} />
        {LEDS.filter((l) => l.door).map((l) => (
          <Led key={`${l.x}-${l.y}`} box={within({ x: l.x, y: l.y, w: 1, h: 1 }, shelf)} color={l.color} period={l.period} delay={l.delay} glow={3} />
        ))}
        {door === "closed" && (
          <>
            <Hotspot box={within(shelf, shelf)} href="/catalog" label="Bookshelf: open the equipment catalog" tip="Catalog" tipInside />
            <button
              ref={trophyRef}
              type="button"
              className="hotspot has-tip absolute"
              style={at(within(SPOTS.trophy, shelf))}
              aria-label="Trophy: pull it to open the secret quest room"
              onClick={() => setDoor("open")}
            >
              <span className="tip tooltip">Pull the trophy…</span>
            </button>
          </>
        )}
      </div>
      {door === "closed" && (
        <Link href="#quests" className="sr-only">
          Skip to the quest log
        </Link>
      )}
    </>
  );
}
