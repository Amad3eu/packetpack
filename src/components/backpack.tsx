"use client";

/* eslint-disable @next/next/no-img-element -- pixel art must skip next/image's smoothing resize */
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Look } from "./pack-provider";

const FRAMES = 4;
const FRAME_MS = 90;

/** Plays the zipper frames forwards when opening and backwards when closing. */
export function usePackFrame(open: boolean) {
  const [frame, setFrame] = useState(open ? FRAMES - 1 : 0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const target = open ? FRAMES - 1 : 0;
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- no animation: jump straight to the end frame
      setFrame(target);
      return;
    }
    const id = setInterval(() => {
      setFrame((f) => {
        if (f === target) {
          clearInterval(id);
          return f;
        }
        return f + (target > f ? 1 : -1);
      });
    }, FRAME_MS);
    return () => clearInterval(id);
  }, [open, reduced]);
  return frame;
}

/**
 * The layered backpack sprite. It fills its parent, which must have the
 * 48x48 aspect and a `--px` CSS variable with the size of one sprite pixel.
 */
export function BackpackSprite({ look, frame }: { look: Look; frame: number }) {
  return (
    <span className="absolute inset-0 block" aria-hidden>
      <span
        className="pixelated absolute inset-0 block bg-no-repeat"
        style={{
          backgroundImage: `url(/art/pack/body-${look.color}.png)`,
          // --px is a length, so multiply it by plain numbers (px * px is invalid CSS).
          backgroundSize: `calc(var(--px) * ${48 * FRAMES}) calc(var(--px) * 48)`,
          backgroundPositionX: `calc(var(--px) * ${-48 * frame})`,
        }}
      />
      <img src={`/art/pack/straps-${look.strap}.png`} alt="" className="pixelated absolute inset-0 h-full w-full" />
      <img src={`/art/pack/patch-${look.patch}.png`} alt="" className="pixelated absolute inset-0 h-full w-full" />
    </span>
  );
}
