import type { Destination } from "@/types/destination";

interface CostBreakdownProps {
  cost: Destination["cost"];
}

export default function CostBreakdown({ cost }: CostBreakdownProps) {
  return (
    <div className="brutal-card-chalk overflow-hidden">
      <div className="bg-void text-chalk font-mono text-mono-sm uppercase tracking-widest px-4 py-2 border-b-hard-sm border-void">
        СКОЛЬКО СТОИТ ЛЕГЕНДА
      </div>
      <div className="divide-y-4 divide-void">
        {cost.items.map((it) => (
          <div key={it.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
            <div>
              <div className="font-mono text-mono-sm text-void uppercase tracking-widest font-bold">
                {it.label}
              </div>
              <div className="font-body text-sm text-void/70">{it.detail}</div>
            </div>
            <div className="font-mono text-mono-md text-void font-bold whitespace-nowrap">
              {it.amount}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-volt text-void px-4 py-3 flex items-baseline justify-between border-t-hard-sm border-void">
        <div className="font-mono text-mono-sm uppercase tracking-widest font-bold">
          {cost.totalLabel}
        </div>
        <div className="font-display text-display-md leading-none">{cost.totalAmount}</div>
      </div>
    </div>
  );
}
