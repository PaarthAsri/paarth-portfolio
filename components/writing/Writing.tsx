"use client";

import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { WRITEUPS } from "@/lib/data";

export default function Writing() {
  return (
    <Section id="writing">
      <SectionHeader number="03" title="Writing" />

      <div className="border border-border rounded-lg p-6" data-bug-inspect="writing.case-study">
        <h3 className="font-display text-xl font-medium text-text-primary mb-2">
          {WRITEUPS[0].title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {WRITEUPS[0].category.map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 text-xs font-mono text-text-secondary bg-elevated rounded border border-border"
            >
              {cat}
            </span>
          ))}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          {WRITEUPS[0].summary}
        </p>
        <a
          href={WRITEUPS[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
        >
          Read case study
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </a>
      </div>
    </Section>
  );
}
