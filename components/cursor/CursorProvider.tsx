"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface CursorContextType {
  x: number;
  y: number;
}

const CursorContext = createContext<CursorContextType>({ x: 0, y: 0 });

export function useCursorPosition() {
  return useContext(CursorContext);
}

export function CursorProvider({ children }: { children: ReactNode }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <CursorContext.Provider value={position}>
      {children}
    </CursorContext.Provider>
  );
}
