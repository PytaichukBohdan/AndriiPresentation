import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroOverlay() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const start = Date.now();
    const tick = window.setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        window.clearInterval(tick);
        window.setTimeout(() => setVisible(false), 200);
      }
    }, 30);
    return () => window.clearInterval(tick);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ clipPath: "inset(0 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[9000] bg-void flex items-center justify-center"
        >
          <div className="w-full max-w-3xl px-8 text-center">
            <div className="mb-6 font-mono text-mono-sm text-volt uppercase">
              ▲ BOYS TRIP 2026 — BOOT SEQUENCE
            </div>
            <h1 className="font-display text-hero-md sm:text-hero-lg text-chalk text-shadow-brutal leading-[0.85]">
              ГРУЗИМ
              <br />
              ПАЦАНОВ…
            </h1>
            <div className="mt-10 relative h-6 border-hard-sm border-chalk bg-void overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-volt"
                style={{ width: `${progress}%`, transition: "width 30ms linear" }}
              />
            </div>
            <div className="mt-4 font-mono text-mono-xs text-chalk">
              LOADING {Math.floor(progress)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
