import { useState } from "react";
import { useVoteContext } from "@/context/VoteContext";
import { useReactionsContext } from "@/context/ReactionsContext";
import { DESTINATIONS, DESTINATIONS_BY_ID } from "@/data/destinations";
import BrutalistButton from "./BrutalistButton";

type Tab = "winners" | "costs" | "decision" | "reactions";

export default function ComparisonSection() {
  const [tab, setTab] = useState<Tab>("winners");
  const { votes } = useVoteContext();
  const { reactions } = useReactionsContext();

  const sortedByVotes = [...DESTINATIONS].sort(
    (a, b) => (votes[b.id] ?? 0) - (votes[a.id] ?? 0),
  );

  return (
    <section
      id="comparison"
      className="relative px-6 md:px-12 lg:pr-[240px] py-16 md:py-24 border-t-hard-lg border-void bg-carbon"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-hero-sm md:text-hero-md text-chalk text-shadow-brutal leading-[0.85]">
          ГОЛОСУЕМ КАК МУЖЧИНЫ
        </h2>
        <p className="mt-4 font-mono text-mono-md uppercase tracking-widest text-volt font-bold">
          ДЕЛИМ 13 ВАРИАНТОВ ПО КУЧКАМ
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {(
            [
              ["winners", "КТО ВЫИГРЫВАЕТ"],
              ["costs", "КТО СКОЛЬКО СТОИТ"],
              ["decision", "ФИНАЛЬНЫЙ ВЫБОР"],
              ["reactions", "ЧТО ПАЦАНЫ ПИШУТ"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <BrutalistButton
              key={key}
              onClick={() => setTab(key)}
              variant={tab === key ? "volt" : "chalk"}
              active={tab === key}
              size="md"
            >
              {label}
            </BrutalistButton>
          ))}
        </div>

        <div className="mt-10">
          {tab === "winners" && (
            <div className="space-y-3">
              {sortedByVotes.map((d, idx) => {
                const v = votes[d.id] ?? 0;
                return (
                  <div
                    key={d.id}
                    className="flex items-baseline gap-4 brutal-card-chalk p-4"
                  >
                    <div className="font-display text-display-md text-void leading-none w-16 text-center">
                      #{idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-display-sm text-void leading-none">
                        {d.flag} {d.name}
                      </div>
                      <div className="font-mono text-mono-xs text-void/70 uppercase mt-1">
                        {d.tagline}
                      </div>
                    </div>
                    <div className="font-display text-hero-sm text-void leading-none">{v}</div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "costs" && (
            <div className="overflow-x-auto brutal-card-chalk">
              <table className="w-full text-void">
                <thead className="bg-void text-chalk font-mono text-mono-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-4 py-3 text-left">НАПРАВЛЕНИЕ</th>
                    <th className="px-4 py-3 text-left">УРОВЕНЬ</th>
                    <th className="px-4 py-3 text-right">СТОИМОСТЬ</th>
                  </tr>
                </thead>
                <tbody className="divide-y-4 divide-void">
                  {[...DESTINATIONS]
                    .sort((a, b) => a.cost.totalAmount.length - b.cost.totalAmount.length)
                    .map((d) => {
                      const dollars =
                        d.metrics.find((m) => m.label === "ДОРОГО?")?.value ?? "€";
                      return (
                        <tr key={d.id}>
                          <td className="px-4 py-3 font-bold">
                            {d.flag} {d.name}
                          </td>
                          <td className="px-4 py-3 font-mono">{dollars}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold whitespace-nowrap">
                            {d.cost.totalAmount}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          {tab === "decision" && (
            <div className="brutal-card-void p-6">
              {sortedByVotes[0] && (votes[sortedByVotes[0].id] ?? 0) > 0 ? (
                <div>
                  <div className="font-mono text-mono-sm uppercase tracking-widest text-volt">
                    ПРОМЕЖУТОЧНЫЙ ЛИДЕР
                  </div>
                  <div className="font-display text-hero-sm md:text-hero-md text-chalk leading-[0.9] mt-2">
                    {sortedByVotes[0].flag} {sortedByVotes[0].name}
                  </div>
                  <p className="mt-3 font-body text-lg text-chalk/90 max-w-2xl">
                    {sortedByVotes[0].description}
                  </p>
                  <div className="mt-5 font-mono text-mono-md text-volt font-bold">
                    {votes[sortedByVotes[0].id]} ГОЛОСОВ · {sortedByVotes[0].cost.totalAmount}
                  </div>
                </div>
              ) : (
                <div className="font-mono text-mono-md text-chalk">
                  ЕЩЁ НИ ОДИН ПАЦАН НЕ ПРОГОЛОСОВАЛ. ТЫ ПЕРВЫЙ — ДАВАЙ.
                </div>
              )}
            </div>
          )}

          {tab === "reactions" && (
            <div className="space-y-6">
              {reactions.length === 0 && (
                <div className="font-mono text-mono-md text-chalk">
                  РЕАКЦИЙ ПОКА НЕТ. ВЫБЕРИ НИК, СКРОЛЛЬ ВЫШЕ И ОСТАВЬ ПЕРВУЮ.
                </div>
              )}
              {DESTINATIONS.map((d) => {
                const list = reactions
                  .filter((r) => r.destId === d.id)
                  .sort((a, b) => b.ts - a.ts);
                if (list.length === 0) return null;
                return (
                  <div key={d.id} className="brutal-card-chalk p-4">
                    <div className="font-display text-display-sm text-void leading-none">
                      {d.flag} {DESTINATIONS_BY_ID[d.id]?.name}
                    </div>
                    <div className="mt-3 space-y-2">
                      {list.map((r) => (
                        <div
                          key={r.id}
                          className="border-hard-sm border-void bg-volt text-void p-3 shadow-[4px_4px_0_0_#000]"
                        >
                          <div className="font-mono text-mono-xs uppercase font-bold">
                            {r.authorNick}
                          </div>
                          <div className="font-body text-base mt-1">{r.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
