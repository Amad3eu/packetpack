import { PALETTE } from "@/data/sprites";

type Props = {
  rows: string[];
  /** Extra colour keys on top of the shared palette (e.g. the backpack's M/m/S/P). */
  colors?: Record<string, string>;
  label?: string;
  className?: string;
};

export function PixelSprite({ rows, colors, label, className }: Props) {
  const palette = colors ? { ...PALETTE, ...colors } : PALETTE;
  const rects: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    // Merge horizontal runs of the same colour: ~5x fewer DOM nodes than one rect per pixel.
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      if (ch !== ".") {
        rects.push(<rect key={`${y}-${x}`} x={x} y={y} width={end - x} height={1} fill={palette[ch]} />);
      }
      x = end;
    }
  });
  return (
    <svg
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      shapeRendering="crispEdges"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {rects}
    </svg>
  );
}
