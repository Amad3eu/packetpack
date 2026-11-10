"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bySlug, type Equipment } from "@/data/equipment";
import { achievements, PACK_CAPACITY } from "@/lib/achievements";
import { usePack } from "./pack-provider";
import { Icon } from "./sprite";

const NAV = [
  { href: "/", label: "Workshop" },
  { href: "/catalog", label: "Catalog" },
  { href: "/projects", label: "Quests" },
];

/** The game HUD: title, menu tabs and the two counters players care about. */
export function SiteHeader() {
  const pathname = usePathname();
  const { items: slugs, viewed } = usePack();
  const items = slugs.map(bySlug).filter((e): e is Equipment => Boolean(e));
  const quests = achievements(items, viewed.length);
  const done = quests.filter((q) => q.unlocked).length;

  return (
    <header className="border-b-[6px] border-ink bg-[#1a1226]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2">
        <Link href="/" className="title flex items-center gap-2 font-pixel text-2xl tracking-wide">
          <Icon name="bag" scale={3} /> PACKETPACK
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <nav aria-label="Main">
            <ul className="flex items-center gap-1">
              {NAV.map((n) => {
                const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
                return (
                  <li key={n.href}>
                    <Link href={n.href} aria-current={active ? "page" : undefined} className="chip">
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-3 text-sm" aria-label="Progress">
            <span className="inline-flex items-center gap-1" title="Items in your backpack">
              <Icon name="bag" /> {slugs.length}/{PACK_CAPACITY}
              <span className="sr-only">items packed</span>
            </span>
            <span className="inline-flex items-center gap-1" title="Quests complete">
              <Icon name="trophy" /> {done}/{quests.length}
              <span className="sr-only">quests complete</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
