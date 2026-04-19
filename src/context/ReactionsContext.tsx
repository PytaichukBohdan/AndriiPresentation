import { createContext, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import type { Reaction } from "@/types/reaction";
import { reactionsExportSchema } from "@/data/reactionsSchema";

const STORAGE_KEY = "boysTrip2026Reactions";

type State = Reaction[];

type Action =
  | { type: "ADD"; reaction: Reaction }
  | { type: "REMOVE"; id: string }
  | { type: "MERGE"; reactions: Reaction[] }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return [...state, action.reaction];
    case "REMOVE":
      return state.filter((r) => r.id !== action.id);
    case "MERGE": {
      const existing = new Set(state.map((r) => r.id));
      const fresh = action.reactions.filter((r) => !existing.has(r.id));
      return [...state, ...fresh];
    }
    case "RESET":
      return [];
  }
}

function loadInitial(): State {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`Corrupted ${STORAGE_KEY}: expected array, got ${typeof parsed}`);
  }
  for (const item of parsed) {
    if (
      item === null ||
      typeof item !== "object" ||
      typeof (item as { id?: unknown }).id !== "string"
    ) {
      throw new Error(`Corrupted ${STORAGE_KEY}: malformed reaction record`);
    }
  }
  return parsed as Reaction[];
}

function makeId(): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `r_${Date.now().toString(36)}_${rand}`;
}

interface ImportResult {
  added: number;
  duplicates: number;
  authors: number;
}

interface ReactionsContextValue {
  reactions: Reaction[];
  byDest: (destId: string) => Reaction[];
  addReaction: (destId: string, authorNick: string, text: string) => void;
  removeReaction: (id: string) => void;
  exportJson: () => void;
  importJson: (file: File) => Promise<ImportResult>;
}

const ReactionsContext = createContext<ReactionsContextValue | null>(null);

export function ReactionsProvider({ children }: { children: ReactNode }) {
  const [reactions, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reactions));
  }, [reactions]);

  const value: ReactionsContextValue = {
    reactions,
    byDest: (destId) =>
      reactions.filter((r) => r.destId === destId).sort((a, b) => b.ts - a.ts),
    addReaction: (destId, authorNick, text) => {
      const trimmed = text.trim();
      if (trimmed.length === 0) {
        throw new Error("Cannot add empty reaction");
      }
      if (trimmed.length > 140) {
        throw new Error("Reaction text exceeds 140 characters");
      }
      if (!authorNick) {
        throw new Error("authorNick is required");
      }
      dispatch({
        type: "ADD",
        reaction: { id: makeId(), destId, authorNick, text: trimmed, ts: Date.now() },
      });
    },
    removeReaction: (id) => dispatch({ type: "REMOVE", id }),
    exportJson: () => {
      const payload = {
        version: 1 as const,
        exportedAt: new Date().toISOString(),
        reactions,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const now = new Date();
      const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate(),
      ).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(
        now.getMinutes(),
      ).padStart(2, "0")}`;
      const a = document.createElement("a");
      a.href = url;
      a.download = `reactions-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    importJson: async (file) => {
      const text = await file.text();
      const json = JSON.parse(text) as unknown;
      const parsed = reactionsExportSchema.parse(json);
      const existing = new Set(reactions.map((r) => r.id));
      const fresh = parsed.reactions.filter((r) => !existing.has(r.id));
      const duplicates = parsed.reactions.length - fresh.length;
      dispatch({ type: "MERGE", reactions: fresh });
      const uniqueAuthors = new Set(fresh.map((r) => r.authorNick));
      return { added: fresh.length, duplicates, authors: uniqueAuthors.size };
    },
  };

  return <ReactionsContext.Provider value={value}>{children}</ReactionsContext.Provider>;
}

export function useReactionsContext(): ReactionsContextValue {
  const ctx = useContext(ReactionsContext);
  if (!ctx) throw new Error("useReactionsContext must be used inside ReactionsProvider");
  return ctx;
}

export default ReactionsProvider;
