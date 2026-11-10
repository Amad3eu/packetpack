import type { Equipment } from "../data/equipment";

export const PACK_CAPACITY = 12;

export type Achievement = { id: string; title: string; hint: string; unlocked: boolean };

export function achievements(pack: Equipment[], viewedCount: number): Achievement[] {
  const categories = new Set(pack.map((e) => e.category));
  return [
    { id: "first-pick", title: "First Pick", hint: "Put any item in your pack.", unlocked: pack.length >= 1 },
    { id: "radio-head", title: "Radio Head", hint: "Pack a software-defined radio.", unlocked: categories.has("Radio (SDR)") },
    { id: "key-keeper", title: "Key Keeper", hint: "Pack a hardware security key.", unlocked: categories.has("Authentication") },
    { id: "polymath", title: "Polymath", hint: "Carry gear from 4 different categories.", unlocked: categories.size >= 4 },
    { id: "scholar", title: "Scholar", hint: "Read 5 equipment profiles.", unlocked: viewedCount >= 5 },
    { id: "full-pack", title: "Full Pack", hint: `Fill all ${PACK_CAPACITY} slots.`, unlocked: pack.length >= PACK_CAPACITY },
  ];
}
