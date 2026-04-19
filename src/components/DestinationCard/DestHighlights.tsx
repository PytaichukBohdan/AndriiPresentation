import type { Highlight } from "@/types/destination";
import StickerBadge from "../StickerBadge";

interface DestHighlightsProps {
  items: Highlight[];
}

const ROTATIONS = [2, -3, 4, -2, 3, -4];

export default function DestHighlights({ items }: DestHighlightsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((h, idx) => (
        <StickerBadge
          key={`${h.emoji}-${idx}`}
          rotation={ROTATIONS[idx % ROTATIONS.length]}
          variant={idx % 2 === 0 ? "chalk" : "volt"}
          size="md"
        >
          <span className="mr-1">{h.emoji}</span>
          {h.text}
        </StickerBadge>
      ))}
    </div>
  );
}
