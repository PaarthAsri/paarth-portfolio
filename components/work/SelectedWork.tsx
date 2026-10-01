"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { PROJECTS } from "@/lib/data";
import ProjectDetail from "./ProjectDetail";

const SELECTED_PROJECTS = ["p1", "p2", "p3", "p6"];

export default function SelectedWork() {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  const projects = SELECTED_PROJECTS.map((id) =>
    PROJECTS.find((p) => p.id === id)!
  ).filter(Boolean);

  const active = projects.find((p) => p.id === activeProject);

  return (
    <Section id="work">
      <SectionHeader number="01" title="Selected Work" />

      <div className="divide-y divide-border border-t border-b border-border">
        {projects.map((project, i) => (
          <button
            key={project.id}
            onClick={() => setActiveProject(project.id)}
            className="w-full flex items-center justify-between py-5 px-2 group text-left transition-colors hover:bg-elevated/30"
            data-bug-inspect={`project.${project.id}`}
          >
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-text-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-medium text-text-primary group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  {project.category} · {project.status}
                </p>
              </div>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-text-dim group-hover:text-accent transition-colors shrink-0"
              data-bug-inspect={`link.project-${project.id}`}
            >
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </button>
        ))}
      </div>

      {active && (
        <ProjectDetail project={active} onClose={() => setActiveProject(null)} />
      )}
    </Section>
  );
}
