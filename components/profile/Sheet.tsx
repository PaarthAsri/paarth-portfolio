"use client";

import { ReactNode, useEffect, useRef } from "react";

interface SheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  variant?: "side" | "center";
}

export default function Sheet({ title, onClose, children, variant = "side" }: SheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const panel =
    variant === "side"
      ? "animate-sheet fixed inset-x-0 bottom-0 max-h-[88vh] rounded-t-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[480px] sm:rounded-none sm:border-l"
      : "animate-modal-enter fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border";

  return (
    <div className="fixed inset-0 z-[90]">
      <div
        className="animate-overlay-enter absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`${panel} flex flex-col overflow-hidden border-border bg-surface shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <p className="truncate font-mono text-xs text-text-dim">{title}</p>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
