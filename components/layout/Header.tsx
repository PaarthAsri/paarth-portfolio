"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/data";
import ThemeToggle from "@/components/home/ThemeToggle";
import HuntButton from "@/components/bug-hunter/HuntButton";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hunt, setHunt] = useState({ hunting: false, caught: 0 });

  // BugHunter broadcasts its state; the header reacts to it.
  useEffect(() => {
    const onState = (e: Event) =>
      setHunt((e as CustomEvent<{ hunting: boolean; caught: number }>).detail);
    window.addEventListener("hunt-state", onState);
    return () => window.removeEventListener("hunt-state", onState);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? "border-border bg-bg/80 backdrop-blur-md" : "border-transparent bg-bg"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[672px] items-center justify-between px-4 sm:px-6">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-pixel text-base text-text-primary transition-colors hover:text-accent"
          data-bug-inspect="logo"
        >
          {SITE.initials.toLowerCase()}
          <span className="text-accent">/</span>sec
        </a>

        <div className="flex items-center">
          {/* Search collapses away while hunting so the hunt button can take the space. */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              hunt.hunting ? "mr-0 max-w-0 opacity-0" : "mr-1.5 max-w-[14rem] opacity-100"
            }`}
            aria-hidden={hunt.hunting}
          >
          <button
            onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
            aria-label="Open command palette"
            tabIndex={hunt.hunting ? -1 : 0}
            className="group flex h-8 items-center gap-2 whitespace-nowrap rounded-md border border-border bg-surface pl-2.5 pr-1 font-mono text-xs text-text-dim transition-colors hover:border-border-light hover:text-text-secondary sm:w-52"
          >
            <span className="text-accent">$</span>
            <span className="hidden flex-1 text-left sm:inline">
              search<span className="ml-0.5 inline-block h-3 w-[6px] translate-y-[2px] bg-text-dim opacity-0 transition-opacity group-hover:animate-[caret_1s_steps(1)_infinite] group-hover:opacity-100" />
            </span>
            <kbd className="flex h-6 items-center gap-0.5 rounded border border-border bg-bg px-1.5 text-[10px] text-text-dim">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </button>
          </div>
          <HuntButton hunting={hunt.hunting} caught={hunt.caught} />
          <span className="ml-1.5">
            <ThemeToggle />
          </span>
        </div>
      </div>
    </header>
  );
}
