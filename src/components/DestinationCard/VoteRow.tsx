import { motion, AnimatePresence } from "framer-motion";
import { useVoteContext } from "@/context/VoteContext";
import BrutalistButton from "../BrutalistButton";

interface VoteRowProps {
  destId: string;
  label: string;
}

export default function VoteRow({ destId, label }: VoteRowProps) {
  const { votes, toggleVote } = useVoteContext();
  const count = votes[destId] ?? 0;
  const voted = count > 0;

  return (
    <div className="flex items-stretch flex-col sm:flex-row gap-4">
      <BrutalistButton
        onClick={() => toggleVote(destId)}
        variant="chalk"
        active={voted}
        size="lg"
        className="flex-1"
      >
        {label}
      </BrutalistButton>
      <div className="flex items-center justify-between min-w-[160px] border-hard-sm border-void bg-void text-chalk px-5 shadow-[8px_8px_0_0_#CCFF00]">
        <div className="font-mono text-mono-xs uppercase tracking-widest">ГОЛОСА</div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={count}
            initial={{ scale: 1.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 18 }}
            className="font-display text-hero-sm text-volt leading-none"
          >
            {count}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
