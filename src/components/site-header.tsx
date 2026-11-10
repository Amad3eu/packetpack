"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Backpack } from "lucide-react";
import { PACK_CAPACITY } from "@/lib/achievements";
import { usePack } from "./pack-provider";

const NAV = [
  { href: "/", label: "Pack" },
  { href: "/catalog", label: "Catalog" },
  { href: "/projects", label: "Projects" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { items } = usePack();
  return (
    <header className="border-b-4 border-ink bg-panel">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-pixel text-xl tracking-wide">
          <Backpack size={22} aria-hidden className="text-gold" /> PACKETPACK
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-1 text-sm">
            {NAV.map((n) => {
              const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`block px-3 py-2 font-semibold ${active ? "bg-gold text-ink" : "hover:bg-panel-2"}`}
                  >
                    {n.label}
                    {n.href === "/" && (
                      <span className="ml-1.5 text-xs opacity-80">
                        {items.length}/{PACK_CAPACITY}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
