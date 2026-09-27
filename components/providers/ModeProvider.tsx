"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Mode } from "@/lib/types";

interface ModeContextType {
  mode: Mode;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType>({
  mode: "normal",
  toggleMode: () => {},
});

export function useMode() {
  return useContext(ModeContext);
}

function getInitialMode(): Mode {
  if (typeof window === "undefined") return "normal";
  const saved = localStorage.getItem("mode");
  if (saved === "normal" || saved === "breach") return saved;
  return "normal";
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(getInitialMode);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  const toggleMode = () => {
    const next: Mode = mode === "normal" ? "breach" : "normal";
    setMode(next);
    localStorage.setItem("mode", next);
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}
