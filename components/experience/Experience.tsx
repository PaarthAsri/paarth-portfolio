"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { EXPERIENCES } from "@/lib/data";

export default function Experience() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Section id="experience">
      <SectionHeader number="02" title="Experience" />

      <div className="divide-y divide-border border-t border-b border-border">
        {EXPERIENCES.map((exp) => {
          const isExpanded = expandedId === exp.id;
          return (
            <div key={exp.id}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                className="w-full flex items-center justify-between py-5 px-2 group text-left transition-colors hover:bg-elevated/30"
                aria-expanded={isExpanded}
                data-bug-inspect={`experience.${exp.id}`}
              >
                <div>
                  <p className="font-mono text-xs text-text-dim mb-1">
                    {exp.period}
                  </p>
                  <h3 className="font-display text-lg font-medium text-text-primary">
                    {exp.organization}
                  </h3>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {exp.role}
                  </p>
                </div>
                <span className="text-text-dim text-xs font-mono">
                  {isExpanded ? "[-]" : "[+]"}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-2 pb-5 pt-2">
                  <p className="text-sm text-text-secondary mb-3">
                    {exp.summary}
                  </p>
                  {isExpanded && exp.expandedSections[0] && (
                    <ul className="space-y-1.5">
                      {exp.expandedSections[0].items.slice(0, 5).map((item, i) => (
                        <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                          <span className="text-accent mt-0.5">›</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
