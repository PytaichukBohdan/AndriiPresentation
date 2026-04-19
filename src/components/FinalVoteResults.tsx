import { motion } from "framer-motion";
import { useVoteContext } from "@/context/VoteContext";
import { DESTINATIONS } from "@/data/destinations";

export default function FinalVoteResults() {
  const { votes, totalVotes } = useVoteContext();

  const sorted = [...DESTINATIONS].sort(
    (a, b) => (votes[b.id] ?? 0) - (votes[a.id] ?? 0),
  );
  const topCount = votes[sorted[0]?.id ?? ""] ?? 0;
  const winner = sorted[0] && topCount > 0 ? sorted[0] : null;
  const maxScale = Math.max(topCount, 1);

  return (
    <section
      id="final"
      className="relative px-6 md:px-12 lg:pr-[240px] py-16 md:py-24 border-t-hard-lg border-void bg-void"
    >
      <div className="max-w-6xl mx-auto">
        <div className="font-mono text-mono-sm uppercase tracking-widest text-volt">
          ИТОГО · {totalVotes} ГОЛОСОВ
        </div>
        <h2 className="font-display text-hero-sm md:text-hero-md text-chalk text-shadow-brutal leading-[0.85] mt-3">
          {winner ? "ВОТ ЭТО ПОБЕДИТЕЛЬ" : "НИКТО ЕЩЁ НЕ ПРОГОЛОСОВАЛ"}
        </h2>
        {winner && (
          <div className="mt-6 brutal-card-volt p-6 inline-block">
            <div className="font-mono text-mono-sm text-void uppercase">НАШ ВЫБОР</div>
            <div className="font-display text-hero-sm text-void leading-none mt-1">
              {winner.flag} {winner.name}
            </div>
          </div>
        )}

        <div className="mt-12 space-y-3">
          {sorted.map((d) => {
            const v = votes[d.id] ?? 0;
            const pct = v / maxScale;
            return (
              <div key={d.id} className="flex items-center gap-4">
                <div className="w-48 shrink-0 font-mono text-mono-sm text-chalk uppercase tracking-widest">
                  {d.flag} {d.name}
                </div>
                <div className="flex-1 h-10 bg-carbon border-hard-sm border-chalk relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct * 100}%` }}
                    transition={{ type: "spring", stiffness: 180, damping: 24 }}
                    className="h-full bg-volt"
                  />
                </div>
                <div className="w-12 text-right font-display text-display-sm text-volt">
                  {v}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
