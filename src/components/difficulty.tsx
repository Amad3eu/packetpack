import { DIFFICULTY_LABEL, type Difficulty as Level } from "@/data/equipment";

export function Difficulty({ level }: { level: Level }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs" title={DIFFICULTY_LABEL[level]}>
      <span aria-hidden className="flex gap-0.5">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`h-2.5 w-2.5 ${n <= level ? "bg-gold" : "bg-white/15"}`} />
        ))}
      </span>
      {DIFFICULTY_LABEL[level]}
    </span>
  );
}
