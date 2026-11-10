"use client";

import { motion } from "framer-motion";
import { Cpu, KeyRound, Radio, ShieldCheck } from "lucide-react";
import { BACKPACK_BODY, BACKPACK_FLAP, FLAP_TOP_ROW } from "@/data/sprites";
import { PACK_COLORS, PATCHES, STRAP_COLORS, type Look } from "./pack-provider";
import { PixelSprite } from "./pixel-sprite";

const PATCH_ICONS = { shield: ShieldCheck, radio: Radio, chip: Cpu, key: KeyRound };

const W = BACKPACK_BODY[0].length;
const H = BACKPACK_BODY.length;

export function Backpack({ look, open }: { look: Look; open: boolean }) {
  const color = PACK_COLORS.find((c) => c.id === look.color) ?? PACK_COLORS[0];
  const strap = STRAP_COLORS.find((c) => c.id === look.strap) ?? STRAP_COLORS[0];
  const patch = PATCHES.find((p) => p.id === look.patch) ?? PATCHES[0];
  const Icon = PATCH_ICONS[patch.id];
  const colors = { M: color.main, m: color.shade, S: strap.color, P: patch.color };

  return (
    <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      <PixelSprite rows={BACKPACK_BODY} colors={colors} className="absolute inset-0 h-full w-full" />
      {/* The flap lifts and tilts away; the dark row under it is the pack's opening. */}
      <motion.div
        className="absolute left-0 w-full origin-top"
        style={{ top: `${(FLAP_TOP_ROW / H) * 100}%`, height: `${(BACKPACK_FLAP.length / H) * 100}%` }}
        animate={open ? { y: "-62%", rotate: -10, x: "-6%" } : { y: 0, rotate: 0, x: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
      >
        <PixelSprite rows={BACKPACK_FLAP} colors={colors} className="h-full w-full" />
        <Icon
          aria-hidden
          strokeWidth={2.5}
          className="absolute text-[#1b1420]"
          style={{ left: "41%", top: "36%", width: "18%", height: "34%" }}
        />
      </motion.div>
    </div>
  );
}
