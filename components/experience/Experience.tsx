"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { EXPERIENCES } from "@/lib/data";
import type { Experience } from "@/lib/types";

function ExperienceCard({ exp }: { exp: Experience }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isDigiSuraksha = exp.id === "exp2";

  return (
    <div
      className={`experience-card border rounded-lg bg-panel/60 backdrop-blur-sm overflow-hidden ${
        isExpanded
          ? isDigiSuraksha
            ? "border-cyber-amber/60"
            : "border-cyber-cyan/60"
          : "border-border-dim"
      }`}
    >
      {/* Collapsed header - always visible */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display text-xl font-semibold text-text-primary">
                {exp.role}
              </h3>
              {exp.isSimulated && (
                <span className="px-2 py-0.5 text-xs font-mono text-cyber-amber bg-cyber-amber/10 rounded">
                  LAB
                </span>
              )}
            </div>
            <p className={`font-mono text-sm ${isDigiSuraksha ? "text-cyber-amber" : "text-cyber-cyan"}`}>
              {exp.organization}
            </p>
          </div>
          <span className="text-text-dim text-xs font-mono mt-1">
            {isExpanded ? "[-]" : "[+]"}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm mb-3">
          <div>
            <span className="text-text-dim text-xs font-mono">Location: </span>
            <span className="text-text-secondary">{exp.location}</span>
          </div>
          <div>
            <span className="text-text-dim text-xs font-mono">Period: </span>
            <span className="text-text-secondary">{exp.period}</span>
          </div>
        </div>

        <p className="text-text-secondary text-sm mb-3">{exp.summary}</p>

        <div className="flex flex-wrap gap-2">
          {exp.lifecycle.map((stage) => (
            <span
              key={stage}
              className="px-2 py-0.5 text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 rounded"
            >
              {stage}
            </span>
          ))}
        </div>
      </div>

      {/* Expanded content - multi-column layout */}
      <div
        className={`overflow-hidden transition-all duration-400 ${
          isExpanded ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-4 border-t border-border-dim">
          {/* Two-column layout for responsibilities and technology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Column 1: Responsibilities / Main content */}
            <div>
              <p className="text-xs font-mono text-text-dim mb-3">
                {exp.id === "exp1" ? "RESPONSIBILITIES" : "ADVERSARY SIMULATION"}
              </p>
              <ul className="space-y-2">
                {(exp.id === "exp1"
                  ? exp.expandedSections[0].items
                  : exp.expandedSections[0].items
                ).map((item, i) => (
                  <li key={i} className="text-text-secondary text-sm flex items-start gap-2">
                    <span className={isDigiSuraksha ? "text-cyber-amber mt-0.5" : "text-cyber-cyan mt-0.5"}>›</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Second section for DigiSuraksha */}
              {exp.id === "exp2" && exp.expandedSections[1] && (
                <div className="mt-6">
                  <p className="text-xs font-mono text-text-dim mb-3">DETECTION ANALYSIS</p>
                  <ul className="space-y-2">
                    {exp.expandedSections[1].items.map((item, i) => (
                      <li key={i} className="text-text-secondary text-sm flex items-start gap-2">
                        <span className="text-cyber-green mt-0.5">›</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Column 2: Technology / Additional info */}
            <div>
              <p className="text-xs font-mono text-text-dim mb-3">
                {exp.id === "exp1" ? "TECHNOLOGY" : "INCIDENT SCENARIOS"}
              </p>
              {exp.id === "exp1" ? (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="interactive-tag px-2 py-1 text-xs font-mono text-text-secondary bg-elevated rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {exp.expandedSections[2]?.items.map((item, i) => (
                    <li key={i} className="text-text-secondary text-sm flex items-start gap-2">
                      <span className="text-cyber-amber mt-0.5">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Tools for DigiSuraksha */}
              {exp.id === "exp2" && (
                <div className="mt-6">
                  <p className="text-xs font-mono text-text-dim mb-3">TOOLS</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tool) => (
                      <span
                        key={tool}
                        className="interactive-tag px-2 py-1 text-xs font-mono text-text-secondary bg-elevated rounded"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Relevance - full width bottom */}
          <div className={`p-4 border rounded ${isDigiSuraksha ? "border-cyber-amber/20 bg-cyber-amber/5" : "border-border-dim bg-void/50"}`}>
            <p className="text-xs font-mono text-text-dim mb-2">Security Relevance</p>
            <p className="text-text-secondary text-sm">{exp.securityRelevance}</p>
          </div>

          {/* What I Learned - full width bottom */}
          <div className={`mt-4 p-4 border rounded ${isDigiSuraksha ? "border-cyber-amber/20 bg-cyber-amber/5" : "border-cyber-cyan/20 bg-cyber-cyan/5"}`}>
            <p className="text-xs font-mono text-text-dim mb-2">What I Learned</p>
            <p className="text-text-secondary text-sm italic">{exp.lessons}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <Section id="experience">
      <SectionHeader number="03" title="Experience" subtitle="Professional History" />

      <div className="space-y-6">
        {EXPERIENCES.map((exp) => (
          <ExperienceCard key={exp.id} exp={exp} />
        ))}
      </div>
    </Section>
  );
}
