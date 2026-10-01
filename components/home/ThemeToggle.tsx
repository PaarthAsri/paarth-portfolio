"use client";

export function applyTheme(t: "light" | "dark") {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem("theme", t);
  } catch {}
}

/** Switches theme with a circular wipe from (x, y) where supported. */
export function toggleTheme(x?: number, y?: number) {
  const next =
    document.documentElement.dataset.theme === "light" ? "dark" : "light";
  const root = document.documentElement;
  root.style.setProperty("--wipe-x", `${x ?? window.innerWidth}px`);
  root.style.setProperty("--wipe-y", `${y ?? 0}px`);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (document.startViewTransition && !reduce) {
    document.startViewTransition(() => applyTheme(next));
  } else {
    applyTheme(next);
  }
  return next;
}

export default function ThemeToggle() {
  return (
    <button
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme(r.left + r.width / 2, r.top + r.height / 2);
      }}
      aria-label="Toggle theme"
      className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="block [[data-theme=light]_&]:hidden">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="hidden [[data-theme=light]_&]:block">
        <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
      </svg>
    </button>
  );
}
