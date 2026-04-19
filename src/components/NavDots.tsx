import { useUiContext } from "@/context/UiContext";
import { DESTINATIONS } from "@/data/destinations";

export default function NavDots() {
  const { activeSection } = useUiContext();
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3">
      {DESTINATIONS.map((d) => {
        const active = activeSection === `dest-${d.id}`;
        return (
          <button
            key={d.id}
            onClick={() => {
              const el = document.getElementById(`dest-${d.id}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            title={d.name}
            aria-label={d.name}
            className={[
              "w-3 h-3 border-2 border-chalk",
              active ? "bg-volt" : "bg-void",
              "transition-colors",
            ].join(" ")}
          />
        );
      })}
    </div>
  );
}
