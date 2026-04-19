import { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "boysTrip2026Votes";

type VoteState = Record<string, number>;

type VoteAction =
  | { type: "TOGGLE"; destId: string }
  | { type: "RESET" };

function reducer(state: VoteState, action: VoteAction): VoteState {
  switch (action.type) {
    case "TOGGLE": {
      const current = state[action.destId] ?? 0;
      return { ...state, [action.destId]: current > 0 ? 0 : 1 };
    }
    case "RESET":
      return {};
  }
}

function loadInitial(): VoteState {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return {};
  const parsed = JSON.parse(raw) as unknown;
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(
      `Corrupted ${STORAGE_KEY} in localStorage — expected object, got ${typeof parsed}`,
    );
  }
  const out: VoteState = {};
  for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof v !== "number") {
      throw new Error(`Corrupted ${STORAGE_KEY}: value for ${k} is not a number`);
    }
    out[k] = v;
  }
  return out;
}

interface VoteContextValue {
  votes: VoteState;
  totalVotes: number;
  toggleVote: (destId: string) => void;
  resetVotes: () => void;
}

const VoteContext = createContext<VoteContextValue | null>(null);

export function VoteProvider({ children }: { children: ReactNode }) {
  const [votes, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  }, [votes]);

  const total = Object.values(votes).reduce((sum, v) => sum + v, 0);

  const value: VoteContextValue = {
    votes,
    totalVotes: total,
    toggleVote: (destId) => dispatch({ type: "TOGGLE", destId }),
    resetVotes: () => dispatch({ type: "RESET" }),
  };

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
}

export function useVoteContext(): VoteContextValue {
  const ctx = useContext(VoteContext);
  if (!ctx) throw new Error("useVoteContext must be used inside VoteProvider");
  return ctx;
}

export default VoteProvider;
