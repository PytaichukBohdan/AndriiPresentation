import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import manifest from "@/data/manifest.json";

interface DestPhotoProps {
  heroSceneId: string;
  activitySceneIds: string[];
  alt: string;
}

function resolve(sceneId: string): string {
  const url = (manifest as Record<string, string>)[sceneId];
  if (!url) {
    throw new Error(`Missing scene in manifest: ${sceneId}`);
  }
  return url;
}

export default function DestPhoto({ heroSceneId, activitySceneIds, alt }: DestPhotoProps) {
  const [activeId, setActiveId] = useState(heroSceneId);

  const all = [heroSceneId, ...activitySceneIds];

  return (
    <div className="w-full">
      <div className="relative border-hard-lg border-void shadow-[8px_8px_0_0_#000] aspect-[4/3] bg-carbon overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeId}
            src={resolve(activeId)}
            alt={alt}
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0 0 0)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {all.slice(1).map((sid) => {
          const active = sid === activeId;
          return (
            <button
              key={sid}
              onClick={() => setActiveId(sid)}
              className={[
                "aspect-[4/3] border-hard-sm",
                active ? "border-volt shadow-[6px_6px_0_0_#CCFF00]" : "border-void shadow-[6px_6px_0_0_#000]",
                "hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-[transform,box-shadow]",
              ].join(" ")}
            >
              <img
                src={resolve(sid)}
                alt={alt}
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
