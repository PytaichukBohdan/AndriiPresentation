import { motion } from "framer-motion";
import StickerBadge from "./StickerBadge";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex flex-col justify-center px-6 md:px-12 lg:pr-[240px] pt-24 pb-16"
    >
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6"
        >
          <StickerBadge rotation={-2} variant="chalk" size="lg">
            ЛЕТО 2026 • ВОССОЕДИНЕНИЕ БАНДЫ
          </StickerBadge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display text-hero-md sm:text-hero-lg md:text-hero-xl text-chalk text-shadow-brutal leading-[0.85]"
        >
          КУДА ВАЛИМ,
          <br />
          <span className="text-volt">ПАЦАНЫ?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-6 max-w-3xl font-body italic text-display-sm text-chalk/90"
        >
          9 пацанов. 4 дня. Море, вилла, яхта, истории — которые потом нельзя рассказывать вслух.
        </motion.p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "ТОЧЕК", value: "13" },
            { label: "ПАЦАНОВ", value: "9" },
            { label: "ДНЕЙ КАЙФА", value: "4" },
            { label: "ИСТОРИЙ", value: "∞" },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 + i * 0.07, duration: 0.3 }}
              className="brutal-card-chalk p-4"
            >
              <div className="font-mono text-mono-xs text-void/70">{m.label}</div>
              <div className="font-display text-display-md text-void leading-none mt-1">
                {m.value}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <div className="inline-block bg-volt text-void px-4 py-2 font-mono text-mono-md font-bold uppercase tracking-wider border-hard-sm border-void shadow-[6px_6px_0_0_#000]">
            ↓ ПОГНАЛИ · 13 НАПРАВЛЕНИЙ НИЖЕ
          </div>
        </div>
      </div>
    </section>
  );
}
