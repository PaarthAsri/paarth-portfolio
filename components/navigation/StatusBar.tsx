"use client";

import { useMode } from "@/components/providers/ModeProvider";
import { SYSTEM_STATUS } from "@/lib/data";

export default function StatusBar() {
  const { mode } = useMode();
  const status = SYSTEM_STATUS[mode];
  const isBreach = mode === "breach";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-dim bg-void/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-text-dim">SYS:</span>
          <span className={isBreach ? "text-cyber-red" : "text-cyber-green"}>
            {status.systemStatus}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-text-dim">THREAT:</span>
          <span className={isBreach ? "text-cyber-red" : "text-cyber-green"}>
            {status.threatLevel}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-text-dim">NET:</span>
          <span className={isBreach ? "text-cyber-amber" : "text-cyber-green"}>
            {status.network}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-text-dim">SESSION:</span>
          <span className="text-text-secondary">ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isBreach ? "bg-cyber-red animate-pulse" : "bg-cyber-green"
            }`}
          />
          <span className="text-text-secondary">{status.mode}</span>
        </div>
      </div>
    </div>
  );
}
