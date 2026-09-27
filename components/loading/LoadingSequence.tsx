"use client";

import { useState, useEffect } from "react";
import { BOOT_SEQUENCE } from "@/lib/data";

export default function LoadingSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      onComplete();
      return;
    }

    const totalDuration = BOOT_SEQUENCE.reduce((sum, s) => sum + s.delay, 0);
    let elapsed = 0;

    const timers: NodeJS.Timeout[] = [];

    BOOT_SEQUENCE.forEach((step, index) => {
      timers.push(
        setTimeout(() => {
          setCurrentStep(index);
          elapsed += step.delay;
          setProgress(Math.min((elapsed / totalDuration) * 100, 100));
        }, elapsed)
      );
    });

    timers.push(
      setTimeout(() => {
        setVisible(false);
        onComplete();
      }, totalDuration + 200)
    );

    return () => timers.forEach(clearTimeout);
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-void"
      onClick={() => {
        setVisible(false);
        onComplete();
      }}
      role="button"
      tabIndex={0}
      aria-label="Skip loading sequence"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setVisible(false);
          onComplete();
        }
      }}
    >
      <div className="w-full max-w-md px-8 font-mono text-sm">
        <div className="mb-6 text-center">
          <p className="text-cyber-cyan text-lg tracking-widest">PAARTH://SEC</p>
          <p className="text-text-secondary text-xs mt-1">Interactive Cybersecurity Portfolio</p>
        </div>

        <div className="space-y-2 mb-6">
          {BOOT_SEQUENCE.slice(0, currentStep + 1).map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-text-primary">
              <span className="text-cyber-green">[OK]</span>
              <span>{step.label}</span>
            </div>
          ))}
        </div>

        <div className="mb-2 h-1 bg-panel rounded overflow-hidden">
          <div
            className="h-full bg-cyber-cyan transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-text-secondary text-xs text-right">{Math.round(progress)}%</p>

        {progress >= 100 && (
          <p className="text-cyber-green text-center mt-4 text-sm tracking-wider">
            ACCESS GRANTED
          </p>
        )}

        <p className="text-text-dim text-xs text-center mt-6">Click anywhere to skip</p>
      </div>
    </div>
  );
}
