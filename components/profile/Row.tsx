import { ReactNode } from "react";

export function Label({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="font-mono text-[12px] lowercase text-text-dim">
        <span className="text-accent">{"// "}</span>
        {children}
      </h2>
      {hint && <span className="font-mono text-[11px] text-text-dim">{hint}</span>}
    </div>
  );
}

interface RowProps {
  title: ReactNode;
  sub?: ReactNode;
  meta?: ReactNode;
  lead?: ReactNode;
  onClick: () => void;
  expanded?: boolean;
  inspect?: string;
}

/** One-line clickable row (shedsgns / ramx style). */
export function Row({ title, sub, meta, lead, onClick, expanded, inspect }: RowProps) {
  return (
    <button
      onClick={onClick}
      aria-expanded={expanded}
      data-bug-inspect={inspect}
      className="group -mx-3 flex w-[calc(100%+1.5rem)] items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-elevated/70"
    >
      {lead && <span className="shrink-0">{lead}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium text-text-primary">
          {title}
        </span>
        {sub && <span className="block truncate text-[13px] text-text-dim">{sub}</span>}
      </span>
      {meta && (
        <span className="hidden shrink-0 font-mono text-[11px] text-text-dim sm:block">
          {meta}
        </span>
      )}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={`shrink-0 text-text-dim transition-transform duration-300 group-hover:text-text-primary ${
          expanded === undefined ? "group-hover:translate-x-0.5" : expanded ? "rotate-90" : ""
        }`}
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[11px] text-text-secondary">
      {children}
    </span>
  );
}

export function StatusDot({ done }: { done: boolean }) {
  return (
    <span
      title={done ? "Shipped" : "In progress"}
      className={`block h-1.5 w-1.5 rounded-full ${done ? "bg-accent" : "bg-amber-400"}`}
    />
  );
}
