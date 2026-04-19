import { useUiContext } from "@/context/UiContext";
import { BOYS } from "@/data/boys";

export default function NicknamePicker() {
  const { currentNickname, setCurrentNickname } = useUiContext();
  return (
    <label className="inline-flex items-center gap-3">
      <span className="font-mono text-mono-xs uppercase tracking-widest text-chalk">Я —</span>
      <select
        value={currentNickname ?? ""}
        onChange={(e) => setCurrentNickname(e.target.value === "" ? null : e.target.value)}
        className="bg-chalk text-void font-mono text-mono-sm font-bold uppercase px-3 py-2 border-hard-sm border-void shadow-[6px_6px_0_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-[transform,box-shadow] cursor-pointer"
      >
        <option value="">ВЫБЕРИ СЕБЯ</option>
        {BOYS.map((b) => (
          <option key={b.id} value={b.nickname}>
            {b.nickname}
          </option>
        ))}
      </select>
    </label>
  );
}
