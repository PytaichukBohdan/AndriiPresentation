import type { Activity } from "@/types/destination";

interface BoyActivityListProps {
  items: Activity[];
}

const ROTATIONS = [-1.5, 1.5, -1, 2, -2, 1];

export default function BoyActivityList({ items }: BoyActivityListProps) {
  return (
    <div className="space-y-3">
      <div className="font-mono text-mono-sm uppercase tracking-widest text-volt font-bold">
        ЧТО ДЕЛАЕМ ПО ПУНКТАМ
      </div>
      <ol className="space-y-3">
        {items.map((a, idx) => (
          <li
            key={a.index}
            style={{ transform: `rotate(${ROTATIONS[idx % ROTATIONS.length]}deg)` }}
            className="brutal-card-chalk p-4 flex gap-4 items-start"
          >
            <div className="font-display text-display-md text-volt text-shadow-brutal leading-none shrink-0 w-12 text-center">
              {a.index}
            </div>
            <div className="font-body text-base text-void leading-snug pt-1">{a.text}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
