import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "boysTrip2026CurrentNick";

interface UiContextValue {
  currentNickname: string | null;
  setCurrentNickname: (nick: string | null) => void;
  activeSection: string;
  setActiveSection: (id: string) => void;
}

const UiContext = createContext<UiContextValue | null>(null);

function loadNickname(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null || raw === "") return null;
  return raw;
}

export function UiProvider({ children }: { children: ReactNode }) {
  const [currentNickname, setNickState] = useState<string | null>(loadNickname);
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    if (currentNickname === null) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, currentNickname);
    }
  }, [currentNickname]);

  return (
    <UiContext.Provider
      value={{
        currentNickname,
        setCurrentNickname: setNickState,
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </UiContext.Provider>
  );
}

export function useUiContext(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUiContext must be used inside UiProvider");
  return ctx;
}

export default UiProvider;
