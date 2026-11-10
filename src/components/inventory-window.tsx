import { motion } from "framer-motion";
import type { Equipment } from "@/data/equipment";
import { PACK_CAPACITY } from "@/lib/achievements";
import { ItemButton } from "./item-button";
import { Icon } from "./sprite";

type Props = { items: Equipment[]; onSelect: (slug: string) => void; onClose: () => void };

/** The inventory that pops out of the open backpack. */
export function InventoryWindow({ items, onSelect, onClose }: Props) {
  return (
    <div id="inventory" className="inventory-float mx-auto mt-4 w-fit max-w-full px-4 lg:mt-0 lg:px-0">
      <motion.div
        className="panel"
        initial={{ opacity: 0, y: 40, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.85 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
      >
        <div className="flex items-center justify-between gap-4 pb-2">
          <h2 className="flex items-center gap-2 font-pixel text-2xl">
            <Icon name="bag" scale={3} /> Backpack
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-parchment/80" aria-live="polite">
              {items.length}/{PACK_CAPACITY}
            </span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close the backpack">
              <Icon name="close" />
            </button>
          </div>
        </div>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6" aria-label="Backpack slots">
          {Array.from({ length: PACK_CAPACITY }, (_, i) => {
            const item = items[i];
            return (
              <li key={i} className="slot flex h-24 w-24 items-center justify-center">
                {item && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.12 + i * 0.04, type: "spring", stiffness: 380, damping: 18 }}
                  >
                    <ItemButton item={item} onSelect={() => onSelect(item.slug)} delay={(i % 4) * 0.35} />
                  </motion.div>
                )}
              </li>
            );
          })}
        </ul>
        {items.length === 0 && <p className="pt-3 text-center text-parchment/80">Empty! Pack gear from the workbench below.</p>}
      </motion.div>
    </div>
  );
}
