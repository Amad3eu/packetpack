import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import { bySlug } from "@/data/equipment";
import { SPRITES } from "@/data/sprites";
import { Difficulty } from "./difficulty";
import { PackButton } from "./pack-button";
import { usePack } from "./pack-provider";
import { PixelSprite } from "./pixel-sprite";

/** Quick-look panel. Native <dialog> gives us the focus trap, Esc and backdrop for free. */
export function DetailDialog({ slug, onClose }: { slug: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { markViewed } = usePack();
  const item = slug ? bySlug(slug) : undefined;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (item && !dialog.open) dialog.showModal();
    if (!item && dialog.open) dialog.close();
    if (item) markViewed(item.slug);
  }, [item, markViewed]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="detail-title"
      className="detail-dialog panel m-auto w-[min(40rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto p-0 text-parchment"
    >
      {item && (
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="slot h-20 w-20 shrink-0 p-2">
              <PixelSprite rows={SPRITES[item.slug]} label={item.name} className="h-full w-full" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-widest text-gold">{item.category}</p>
              <h2 id="detail-title" className="font-pixel text-2xl">{item.name}</h2>
              <p className="text-sm text-parchment/70">{item.manufacturer}</p>
            </div>
            <button type="button" onClick={onClose} className="btn btn-ghost px-2" aria-label="Close">
              <X size={18} aria-hidden />
            </button>
          </div>

          <p className="mt-4 text-parchment/90">{item.description}</p>
          {item.status && <p className="mt-2 text-sm font-semibold text-ember">Status: {item.status}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Difficulty level={item.difficulty} />
            <span className="text-parchment/70">{item.price}</span>
          </div>

          <dl className="mt-4 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
            {item.specs.slice(0, 4).map((s) => (
              <div key={s.label} className="contents">
                <dt className="text-parchment/60">{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-5 font-pixel text-lg text-leaf">Try this</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
            {item.projects.slice(0, 2).map((p) => (
              <li key={p.title}>
                <strong>{p.title}.</strong> {p.summary}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            <PackButton slug={item.slug} />
            <Link href={`/gear/${item.slug}`} className="btn btn-ghost">
              Full profile <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      )}
    </dialog>
  );
}
