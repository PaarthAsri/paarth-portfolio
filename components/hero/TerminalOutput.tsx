"use client";

import { TerminalLine } from "@/lib/types";

const typeColors: Record<TerminalLine["type"], string> = {
  input: "text-text-primary",
  output: "text-text-secondary",
  error: "text-cyber-red",
  success: "text-cyber-green",
  info: "text-cyber-cyan",
  system: "text-cyber-amber",
};

export default function TerminalOutput({ lines }: { lines: TerminalLine[] }) {
  return (
    <>
      {lines.map((line) => (
        <div key={line.id} className={`${typeColors[line.type]} leading-relaxed`}>
          {line.content}
        </div>
      ))}
    </>
  );
}
