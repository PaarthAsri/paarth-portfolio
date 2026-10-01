"use client";

/** Header toggle for bug-hunting mode. Grows while hunting; the count sits inside. */
export default function HuntButton({ hunting, caught }: { hunting: boolean; caught: number }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("toggle-hunt"))}
      aria-pressed={hunting}
      title={hunting ? "Stop hunting (Esc)" : "Catch the bug"}
      data-bug-inspect="button.hunt"
      data-hunt-toggle
      className={`flex h-8 items-center gap-2 whitespace-nowrap rounded-md border font-mono text-[11px] transition-all duration-300 ease-out ${
        hunting
          ? "border-accent/50 bg-accent-dim px-3 text-accent"
          : "border-border px-2 text-text-dim hover:border-border-light hover:text-text-secondary"
      }`}
    >
      <svg width="13" height="13" viewBox="0 0 512 512" fill="currentColor" aria-hidden className="shrink-0">
        <path d="M143 132V108Q143 45 205 45H310Q372 45 372 108V132Z" />
        <path d="M128 160H246V337A11 11 0 0 0 268 337V160H386Q408 160 408 182V350A151 151 0 0 1 106 350V182Q106 160 128 160Z" />
      </svg>
      <span className={hunting ? "" : "hidden sm:inline"}>{hunting ? "hunting" : "hunt"}</span>
      {caught > 0 && (
        <span className={`tabular-nums ${hunting ? "text-text-primary" : "text-accent"}`}>
          {caught}
        </span>
      )}
      {/* Extra hint slides in while hunting, widening the button. */}
      <span
        className={`overflow-hidden text-text-dim transition-all duration-300 ease-out ${
          hunting ? "max-w-[5rem] opacity-100" : "-ml-2 max-w-0 opacity-0"
        }`}
      >
        · esc
      </span>
    </button>
  );
}
