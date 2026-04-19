import type { Metric } from "@/types/destination";

interface DestMetricsProps {
  items: Metric[];
}

export default function DestMetrics({ items }: DestMetricsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((m) => (
        <div
          key={m.label}
          className="brutal-card-chalk p-3"
        >
          <div className="font-mono text-mono-xs text-void/70 uppercase">{m.label}</div>
          <div className="font-display text-display-sm text-void leading-none mt-1">
            {m.value}
          </div>
        </div>
      ))}
    </div>
  );
}
