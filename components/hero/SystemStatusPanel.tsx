"use client";

import { useState } from "react";
import { useMode } from "@/components/providers/ModeProvider";

const BREACH_STATUS = {
  systemStatus: "DEGRADED",
  authentication: "ANOMALOUS",
  apiActivity: "SUSPICIOUS",
  securityEvents: "ELEVATED",
  riskState: "INCIDENT",
};

const NORMAL_STATUS = {
  systemStatus: "ONLINE",
  authentication: "NORMAL",
  apiActivity: "STABLE",
  securityEvents: "LOW",
  riskState: "NORMAL",
};

export default function SystemStatusPanel() {
  const { mode } = useMode();
  const [isHovered, setIsHovered] = useState(false);
  const isBreach = mode === "breach";
  const status = isBreach ? BREACH_STATUS : NORMAL_STATUS;

  const statusItems = [
    { label: "System Status", value: status.systemStatus, color: isBreach ? "text-cyber-red" : "text-cyber-green" },
    { label: "Authentication", value: status.authentication, color: isBreach ? "text-cyber-amber" : "text-cyber-green" },
    { label: "API Activity", value: status.apiActivity, color: isBreach ? "text-cyber-amber" : "text-cyber-cyan" },
    { label: "Security Events", value: status.securityEvents, color: isBreach ? "text-cyber-red" : "text-cyber-green" },
    { label: "Risk State", value: status.riskState, color: isBreach ? "text-cyber-red" : "text-cyber-cyan" },
  ];

  return (
    <div
      className={`terminal-panel border rounded-lg bg-panel/80 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
        isHovered ? "border-cyber-cyan/40 shadow-[0_0_20px_rgba(0,240,255,0.06)]" : "border-border-dim"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="px-4 py-2 border-b border-border-dim bg-void/50 flex items-center justify-between">
        <span className="text-xs font-mono text-text-secondary">Security Environment</span>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              isBreach ? "bg-cyber-red animate-pulse" : "bg-cyber-green"
            } ${isHovered ? "scale-150" : ""}`}
            style={{ boxShadow: isHovered ? `0 0 8px ${isBreach ? "var(--color-cyber-red)" : "var(--color-cyber-green)"}` : "none" }}
          />
          <span className={`text-xs font-mono ${isBreach ? "text-cyber-red" : "text-cyber-green"}`}>
            {isBreach ? "BREACH" : "NORMAL"}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {statusItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between transition-all duration-200"
          >
            <span className="text-xs font-mono text-text-dim">{item.label}</span>
            <span
              className={`text-xs font-mono ${item.color} transition-all duration-200 ${
                isHovered ? "brightness-150 tracking-wider" : ""
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}

        {isBreach && (
          <div className="mt-3 p-2 border border-cyber-red/30 rounded bg-cyber-red/5">
            <p className="text-xs font-mono text-cyber-red">
              SIMULATED INCIDENT — No real systems affected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
