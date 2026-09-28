"use client";

import { useState, useEffect } from "react";
import { useMode } from "@/components/providers/ModeProvider";
import { NAV_ITEMS } from "@/lib/data";

export default function Navbar() {
  const { mode, toggleMode } = useMode();
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let scrollRaf: number | null = null;

    const handleScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        setScrolled(window.scrollY > 50);

        const sectionIds = ["hero", "about", "skills", "journey", "experience", "writeups", "projects", "certifications", "research", "contact"];
        let current = sectionIds[0];
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 100) {
              current = id;
            }
          }
        }
        setActiveSection(current);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-void/90 backdrop-blur-sm border-b border-border-dim"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => handleNavClick("#hero")}
          className="font-mono text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
        >
          PAARTH://SEC
        </button>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.slice(1).map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`nav-link px-3 py-1.5 text-xs font-mono rounded transition-all ${
                activeSection === item.href.slice(1)
                  ? "text-cyber-cyan bg-cyber-cyan/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-panel"
              }`}
              aria-current={activeSection === item.href.slice(1) ? "true" : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMode}
            className={`px-3 py-1.5 text-xs font-mono rounded border transition-all ${
              mode === "breach"
                ? "border-cyber-red text-cyber-red bg-cyber-red/10"
                : "border-border-dim text-text-secondary hover:border-cyber-cyan hover:text-cyber-cyan"
            }`}
            aria-pressed={mode === "breach"}
          >
            {mode === "breach" ? "EXIT BREACH" : "BREACH"}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border-dim bg-void/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`block w-full text-left px-3 py-2 text-sm font-mono rounded transition-colors ${
                  activeSection === item.href.slice(1)
                    ? "text-cyber-cyan bg-cyber-cyan/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-panel"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
