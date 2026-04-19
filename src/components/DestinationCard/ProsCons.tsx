interface ProsConsProps {
  pros: string[];
  cons: string[];
}

export default function ProsCons({ pros, cons }: ProsConsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="brutal-card-chalk">
        <div className="bg-volt text-void font-mono text-mono-sm uppercase tracking-widest px-4 py-2 border-b-hard-sm border-void font-bold">
          ЗАЧЕМ ЕДЕМ
        </div>
        <ul className="p-4 space-y-2 text-void">
          {pros.map((p, i) => (
            <li key={i} className="flex gap-2 font-body">
              <span className="font-mono text-volt-foreground text-void">+</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="brutal-card-void">
        <div className="bg-chalk text-void font-mono text-mono-sm uppercase tracking-widest px-4 py-2 border-b-hard-sm border-chalk font-bold">
          ЗА ЧТО ПОТОМ СЛОЖНО
        </div>
        <ul className="p-4 space-y-2 text-chalk">
          {cons.map((c, i) => (
            <li key={i} className="flex gap-2 font-body">
              <span className="font-mono text-chalk">–</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
