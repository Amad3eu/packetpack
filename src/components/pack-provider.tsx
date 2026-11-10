"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { PACK_CAPACITY } from "@/lib/achievements";

export const PACK_COLORS = [
  { id: "moss", label: "Moss", main: "#5f8f4e", shade: "#3f6634" },
  { id: "ember", label: "Ember", main: "#c4572e", shade: "#8a3a1c" },
  { id: "ocean", label: "Ocean", main: "#3b6fb0", shade: "#264a78" },
  { id: "plum", label: "Plum", main: "#7a4b9c", shade: "#523168" },
  { id: "sand", label: "Sand", main: "#c9a25e", shade: "#93733c" },
] as const;

export const STRAP_COLORS = [
  { id: "leather", label: "Leather", color: "#5c3a1a" },
  { id: "charcoal", label: "Charcoal", color: "#2a2a32" },
  { id: "rope", label: "Rope", color: "#c9b48a" },
] as const;

export const PATCHES = [
  { id: "shield", label: "Shield", color: "#f4f1e8" },
  { id: "radio", label: "Radio", color: "#f2d34b" },
  { id: "chip", label: "Chip", color: "#5fd3e6" },
  { id: "key", label: "Key", color: "#e58fb0" },
] as const;

export type Look = {
  name: string;
  color: (typeof PACK_COLORS)[number]["id"];
  strap: (typeof STRAP_COLORS)[number]["id"];
  patch: (typeof PATCHES)[number]["id"];
};

type State = { items: string[]; viewed: string[]; look: Look };

const DEFAULT_STATE: State = {
  items: [],
  viewed: [],
  look: { name: "My Packetpack", color: "moss", strap: "leather", patch: "shield" },
};

const STORAGE_KEY = "packetpack:v1";

type PackContextValue = State & {
  has: (slug: string) => boolean;
  isFull: boolean;
  toggle: (slug: string) => void;
  markViewed: (slug: string) => void;
  setLook: (look: Partial<Look>) => void;
  clear: () => void;
};

const PackContext = createContext<PackContextValue | null>(null);

export function PackProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  // Load after mount so the server render and first client render match.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from storage
      if (saved) setState({ ...DEFAULT_STATE, ...JSON.parse(saved) });
    } catch {
      // Private mode or corrupted JSON: start with an empty pack.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable: the pack still works for this visit.
    }
  }, [state, loaded]);

  const value: PackContextValue = {
    ...state,
    has: (slug) => state.items.includes(slug),
    isFull: state.items.length >= PACK_CAPACITY,
    toggle: (slug) =>
      setState((s) => {
        if (s.items.includes(slug)) return { ...s, items: s.items.filter((i) => i !== slug) };
        if (s.items.length >= PACK_CAPACITY) return s;
        return { ...s, items: [...s.items, slug] };
      }),
    markViewed: (slug) =>
      setState((s) => (s.viewed.includes(slug) ? s : { ...s, viewed: [...s.viewed, slug] })),
    setLook: (look) => setState((s) => ({ ...s, look: { ...s.look, ...look } })),
    clear: () => setState((s) => ({ ...s, items: [] })),
  };

  return <PackContext.Provider value={value}>{children}</PackContext.Provider>;
}

export function usePack() {
  const ctx = useContext(PackContext);
  if (!ctx) throw new Error("usePack must be used inside <PackProvider>");
  return ctx;
}
