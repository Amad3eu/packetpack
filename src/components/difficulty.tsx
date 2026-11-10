import { DIFFICULTY_LABEL, type Difficulty as Level } from "@/data/equipment";
import { Icon } from "./sprite";

export function Difficulty({ level }: { level: Level }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className="flex gap-0.5">
        {[1, 2, 3].map((n) => (
          <Icon key={n} name={n <= level ? "star" : "star-off"} />
        ))}
      </span>
      {DIFFICULTY_LABEL[level]}
    </span>
  );
}
