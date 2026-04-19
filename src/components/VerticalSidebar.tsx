import { useUiContext } from "@/context/UiContext";

const STRIPS = [
  { id: "hero", label: "СТАРТ" },
  { id: "destinations", label: "ВИЛЛЫ · ЯХТЫ" },
  { id: "reactions", label: "ПАЦАНЫ" },
  { id: "comparison", label: "ИТОГ" },
  { id: "final", label: "ВОТ ЭТО" },
];

export default function VerticalSidebar() {
  const { activeSection } = useUiContext();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <aside className="hidden lg:flex fixed top-0 right-0 h-screen w-[200px] z-40 flex-col border-l-hard-lg border-void bg-chalk">
      {STRIPS.map((s, idx) => {
        const isActive = activeSection === s.id;
        const bg = isActive ? "bg-volt" : "bg-chalk";
        const border = idx > 0 ? "border-t-hard-sm border-void" : "";
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`flex-1 flex items-center justify-center ${bg} ${border} transition-colors`}
          >
            <span className="vertical-rl font-mono text-mono-md text-void uppercase font-bold tracking-[0.2em]">
              {s.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
