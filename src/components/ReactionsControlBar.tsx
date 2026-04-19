import { useRef, useState } from "react";
import { useReactionsContext } from "@/context/ReactionsContext";
import NicknamePicker from "./NicknamePicker";
import BrutalistButton from "./BrutalistButton";

export default function ReactionsControlBar() {
  const { reactions, exportJson, importJson } = useReactionsContext();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const onFileChosen = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0];
    if (!f) return;
    try {
      const res = await importJson(f);
      setToast(
        `ДОБАВЛЕНО: +${res.added} РЕАКЦИЙ ОТ ${res.authors} ПАЦАНОВ · ДУБЛЕЙ ${res.duplicates}`,
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "UNKNOWN";
      setToast(`ОШИБКА ИМПОРТА: ${msg.toUpperCase().slice(0, 80)}`);
    }
    if (fileRef.current) fileRef.current.value = "";
    window.setTimeout(() => setToast(null), 5000);
  };

  return (
    <section
      id="reactions"
      className="relative px-6 md:px-12 lg:pr-[240px] py-8 border-t-hard-lg border-void bg-carbon"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-6 flex-wrap">
        <div className="font-display text-display-sm text-chalk text-shadow-brutal">
          ЧТО ПАЦАНЫ ПИШУТ <span className="text-volt">({reactions.length})</span>
        </div>
        <div className="flex-1" />
        <NicknamePicker />
        <BrutalistButton variant="chalk" size="md" onClick={exportJson}>
          ⬇ СКАЧАТЬ РЕАКЦИИ ({reactions.length})
        </BrutalistButton>
        <BrutalistButton variant="volt" size="md" onClick={() => fileRef.current?.click()}>
          ⬆ ЗАЛИТЬ РЕАКЦИИ
        </BrutalistButton>
        <input
          type="file"
          accept="application/json,.json"
          ref={fileRef}
          className="hidden"
          onChange={onFileChosen}
        />
      </div>
      {toast !== null && (
        <div className="max-w-6xl mx-auto mt-4 font-mono text-mono-sm text-void bg-volt px-4 py-2 border-hard-sm border-void inline-block shadow-[6px_6px_0_0_#000]">
          {toast}
        </div>
      )}
    </section>
  );
}
