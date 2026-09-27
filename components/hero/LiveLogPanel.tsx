"use client";

import { useState, useEffect, useRef } from "react";
import { useMode } from "@/components/providers/ModeProvider";
import { LOG_TEMPLATES_NORMAL, LOG_TEMPLATES_BREACH } from "@/lib/data";
import { getTimestamp } from "@/lib/utils";
import { LogEntry } from "@/lib/types";

export default function LiveLogPanel() {
  const { mode } = useMode();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const templates = mode === "breach" ? LOG_TEMPLATES_BREACH : LOG_TEMPLATES_NORMAL;
    let index = 0;

    const interval = setInterval(() => {
      const template = templates[index % templates.length];
      const entry: LogEntry = {
        timestamp: getTimestamp(),
        level: template.level,
        message: template.message,
      };

      setLogs((prev) => [...prev.slice(-19), entry]);
      index++;
    }, 3000);

    return () => clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const levelColors: Record<LogEntry["level"], string> = {
    INFO: "text-cyber-green",
    WARN: "text-cyber-amber",
    ERROR: "text-cyber-red",
    DEBUG: "text-text-dim",
  };

  return (
    <div
      className={`terminal-panel border rounded-lg bg-panel/80 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
        isHovered ? "border-cyber-cyan/40 shadow-[0_0_20px_rgba(0,240,255,0.06)]" : "border-border-dim"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setSelectedIndex(null);
      }}
    >
      <div className="px-4 py-2 border-b border-border-dim bg-void/50 flex items-center justify-between">
        <span className="text-xs font-mono text-text-secondary">Event Stream</span>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              mode === "breach" ? "bg-cyber-red animate-pulse" : "bg-cyber-green"
            } ${isHovered ? "scale-150" : ""}`}
            style={{ boxShadow: isHovered ? `0 0 8px ${mode === "breach" ? "var(--color-cyber-red)" : "var(--color-cyber-green)"}` : "none" }}
          />
          <span className="text-xs font-mono text-text-dim">
            {mode === "breach" ? "INCIDENT" : "ACTIVE"}
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`h-48 overflow-y-auto p-3 font-mono text-xs space-y-1 transition-all duration-300 ${
          isHovered ? "opacity-100" : "opacity-90"
        }`}
        aria-live="polite"
        aria-label="System event logs"
      >
        {logs.length === 0 && (
          <p className="text-text-dim">Waiting for events...</p>
        )}
        {logs.map((log, i) => (
          <div
            key={i}
            className={`animate-log-entry flex gap-2 px-2 py-1 rounded transition-all duration-200 cursor-pointer ${
              selectedIndex === i ? "bg-elevated" : ""
            }`}
            onClick={() => setSelectedIndex(selectedIndex === i ? null : i)}
          >
            <span className="text-text-dim shrink-0">[{log.timestamp}]</span>
            <span className={`shrink-0 ${levelColors[log.level]}`}>{log.level}</span>
            <span className="text-text-secondary">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
