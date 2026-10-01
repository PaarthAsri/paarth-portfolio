"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE_TABS, CV_PATH } from "@/lib/data";
import { toggleTheme } from "./ThemeToggle";

interface Cmd {
  id: string;
  label: string;
  group: "Go to" | "Actions";
  key: string;
  run: () => void;
}

// Only the essentials. Each command also has an Alt + key shortcut
// that works anywhere on the page.
const COMMANDS: Cmd[] = [
  ...PROFILE_TABS.map((t, i) => ({
    id: t.id,
    label: t.label,
    group: "Go to" as const,
    key: String(i + 1),
    run: () => window.dispatchEvent(new CustomEvent("profile-tab", { detail: t.id })),
  })),
  { id: "contact", label: "Contact me", group: "Actions", key: "c", run: () => window.dispatchEvent(new Event("open-contact")) },
  { id: "resume", label: "Open resume", group: "Actions", key: "r", run: () => window.open(CV_PATH, "_blank") },
  { id: "theme", label: "Toggle theme", group: "Actions", key: "t", run: () => void toggleTheme() },
];

// Match on the physical key: on Mac, Option+key produces special characters.
const codeFor = (key: string) => (/^\d$/.test(key) ? `Digit${key}` : `Key${key.toUpperCase()}`);

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      // Alt + key shortcuts work anywhere, even while the palette is open.
      if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const cmd = COMMANDS.find((c) => codeFor(c.key) === e.code);
      if (cmd) {
        e.preventDefault();
        setOpen(false);
        cmd.run();
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  return open ? <PaletteDialog onClose={() => setOpen(false)} /> : null;
}

function PaletteDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const alt = isMac() ? "⌥" : "Alt";
  const q = query.trim().toLowerCase();
  const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(q));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const exec = (c?: Cmd) => {
    if (!c) return;
    onClose();
    c.run();
  };

  return (
    <div
      className="animate-overlay-enter fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[14vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label="Command palette"
        className="animate-modal-enter w-full max-w-sm overflow-hidden rounded-xl border border-border-light bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-11 items-center gap-2.5 border-b border-border px-3.5 font-mono">
          <span className="shrink-0 text-[13px] text-accent">$</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              const n = Math.max(filtered.length, 1);
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => (i + 1) % n);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => (i - 1 + n) % n);
              } else if (e.key === "Enter") {
                exec(filtered[index]);
              }
            }}
            placeholder="search…"
            aria-label="Command"
            spellCheck={false}
            className="no-ring min-w-0 flex-1 bg-transparent text-[13px] text-text-primary caret-accent outline-none placeholder:text-text-dim"
          />
          <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-text-dim">
            esc
          </kbd>
        </div>

        <ul role="listbox" className="p-1.5">
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center font-mono text-xs text-text-dim">
              command not found: <span className="text-text-secondary">{query}</span>
            </li>
          )}
          {filtered.map((c, i) => {
            const header = i === 0 || filtered[i - 1].group !== c.group;
            const active = i === index;
            return (
              <li key={c.id}>
                {header && (
                  <p className="px-2.5 pb-1 pt-2 font-mono text-[10px] uppercase tracking-wider text-text-dim">
                    {c.group}
                  </p>
                )}
                <button
                  role="option"
                  aria-selected={active}
                  onMouseMove={() => setIndex(i)}
                  onClick={() => exec(c)}
                  className={`no-ring flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                    active ? "bg-elevated text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {c.label}
                  <span
                    className={`flex items-center gap-0.5 font-mono text-[10px] ${
                      active ? "text-accent" : "text-text-dim"
                    }`}
                  >
                    {[alt, c.key.toUpperCase()].map((k) => (
                      <kbd
                        key={k}
                        className={`flex h-5 min-w-5 items-center justify-center rounded border px-1 ${
                          active ? "border-accent/50" : "border-border"
                        }`}
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="border-t border-border px-3.5 py-2 font-mono text-[10px] text-text-dim">
          tip: {alt} + key works anywhere on the page
        </p>
      </div>
    </div>
  );
}
