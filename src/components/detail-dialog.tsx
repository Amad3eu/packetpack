import Link from "next/link";
import { useEffect, useRef } from "react";
import { bySlug } from "@/data/equipment";
import { Difficulty } from "./difficulty";
import { PackButton } from "./pack-button";
import { usePack } from "./pack-provider";
import { Icon, ItemSprite } from "./sprite";

/** Item card. Native <dialog> gives us the focus trap, Esc and backdrop for free. */
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
      className="detail-dialog panel m-auto max-h-[calc(100dvh-2rem)] w-[min(42rem,calc(100vw-1.5rem))] overflow-y-auto p-0"
    >
      {item && (
        <div className="p-1 sm:p-2">
          <div className="flex items-start gap-4">
            <div className="slot shrink-0">
              <ItemSprite slug={item.slug} scale={3} alt={item.name} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm tracking-widest text-gold uppercase">{item.category}</p>
              <h2 id="detail-title" className="font-pixel text-3xl leading-tight">
                {item.name}
              </h2>
              <p className="text-parchment/75">{item.manufacturer}</p>
            </div>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close">
              <Icon name="close" />
            </button>
          </div>

          {item.status && <p className="mt-3 text-ember">Status: {item.status}</p>}
          <p className="mt-3">{item.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Difficulty level={item.difficulty} />
            <span className="inline-flex items-center gap-2 text-sm text-parchment/85">
              <Icon name="coin" /> {item.price}
            </span>
          </div>

          <dl className="slot mt-4 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
            {item.specs.slice(0, 4).map((s) => (
              <div key={s.label} className="contents">
                <dt className="text-gold">{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-4 flex items-center gap-2 font-pixel text-xl text-leaf">
            <Icon name="flask" /> Try this
          </h3>
          <ul className="mt-1 space-y-1 text-sm">
            {item.projects.slice(0, 2).map((p) => (
              <li key={p.title} className="flex gap-2">
                <Icon name="sparkle" className="mt-1" />
                <span>
                  <strong>{p.title}.</strong> {p.summary}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            <PackButton slug={item.slug} />
            <Link href={`/gear/${item.slug}`} className="btn btn-ghost">
              Full profile <Icon name="arrow-right" />
            </Link>
          </div>
        </div>
      )}
    </dialog>
  );
}
