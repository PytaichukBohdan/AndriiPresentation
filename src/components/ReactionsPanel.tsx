import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactionsContext } from "@/context/ReactionsContext";
import { useUiContext } from "@/context/UiContext";
import BrutalistButton from "./BrutalistButton";

function relative(ts: number): string {
  const diffMs = Date.now() - ts;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "ТОЛЬКО ЧТО";
  if (minutes < 60) return `${minutes} МИН НАЗАД`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} Ч НАЗАД`;
  const days = Math.floor(hours / 24);
  return `${days} Д НАЗАД`;
}

interface ReactionsPanelProps {
  destId: string;
}

export default function ReactionsPanel({ destId }: ReactionsPanelProps) {
  const { currentNickname } = useUiContext();
  const { byDest, addReaction, removeReaction } = useReactionsContext();
  const [text, setText] = useState("");
  const list = byDest(destId);

  const disabled = currentNickname === null || text.trim().length === 0;

  const submit = () => {
    if (currentNickname === null) return;
    addReaction(destId, currentNickname, text);
    setText("");
  };

  return (
    <div className="brutal-card-chalk p-5 mt-6">
      <div className="font-mono text-mono-xs text-void uppercase tracking-widest mb-3">
        РЕАКЦИЯ ПАЦАНОВ ({list.length})
      </div>
      <div className="flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 140))}
          placeholder={
            currentNickname === null
              ? "Выбери себя в шапке — и кидай мысль"
              : "Пиши что думаешь — до 140 символов"
          }
          rows={3}
          className="w-full resize-none bg-chalk text-void font-body text-base border-hard-sm border-void px-3 py-2 focus:outline-none focus:bg-volt/10 placeholder:text-void/40"
        />
        <div className="flex items-center justify-between">
          <span className="font-mono text-mono-xs text-void/60">
            {text.length}/140
          </span>
          <BrutalistButton
            onClick={submit}
            disabled={disabled}
            variant="volt"
            size="sm"
          >
            ОСТАВИТЬ РЕАКЦИЮ
          </BrutalistButton>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {list.map((r, idx) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              style={{ transform: `rotate(${idx % 2 === 0 ? -1.5 : 2}deg)` }}
              className="bg-volt text-void border-hard-sm border-void p-3 shadow-[6px_6px_0_0_#000]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-mono text-mono-xs uppercase tracking-widest font-bold">
                  {r.authorNick}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-mono-xs uppercase opacity-70">
                    {relative(r.ts)}
                  </span>
                  <button
                    onClick={() => removeReaction(r.id)}
                    aria-label="Удалить"
                    className="font-mono text-mono-md font-bold hover:text-destructive leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="mt-2 font-body text-base leading-snug">{r.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
