"use client";

import { useState, useRef, useEffect } from "react";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { JOURNEY_MILESTONES } from "@/lib/data";
import { JourneyMilestone } from "@/lib/types";

function TimelineNode({
  milestone,
  index,
  isActive,
  onSelect,
  isVisible,
}: {
  milestone: JourneyMilestone;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  isVisible: boolean;
}) {
  const statusColors = {
    completed: "border-cyber-green bg-cyber-green/10 text-cyber-green",
    current: "border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan",
    future: "border-border-dim bg-panel text-text-dim",
  };

  const lineColors = {
    completed: "bg-cyber-green/40",
    current: "bg-cyber-cyan/40",
    future: "bg-border-dim",
  };

  return (
    <div
      className={`relative pl-10 pb-6 last:pb-0 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Connecting line */}
      {index < JOURNEY_MILESTONES.length - 1 && (
        <div
          className={`absolute left-[15px] top-8 bottom-0 w-0.5 transition-colors duration-500 ${
            isActive ? "bg-cyber-cyan" : lineColors[milestone.status]
          }`}
        />
      )}

      {/* Node dot */}
      <button
        onClick={onSelect}
        className={`journey-node absolute left-0 top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-mono transition-all duration-300 ${statusColors[milestone.status]} ${
          isActive ? "active" : ""
        }`}
        aria-label={`Select milestone: ${milestone.title}`}
        aria-pressed={isActive}
      >
        {milestone.status === "completed" ? "✓" : milestone.status === "current" ? "●" : "○"}
      </button>

      {/* Content card */}
      <div
        className={`border rounded-lg bg-panel/60 backdrop-blur-sm overflow-hidden transition-all duration-300 cursor-pointer ${
          isActive
            ? "border-cyber-cyan/60 shadow-[0_0_20px_rgba(0,240,255,0.08)]"
            : "border-border-dim hover:border-cyber-cyan/30"
        }`}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isActive}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-cyber-cyan text-sm">{milestone.number}</span>
              <h3 className="font-display text-base font-semibold text-text-primary">
                {milestone.title}
              </h3>
            </div>
            <span className="text-text-dim text-xs font-mono">
              {isActive ? "[-]" : "[+]"}
            </span>
          </div>

          <p className="text-text-secondary text-sm mb-1">{milestone.subtitle}</p>
          <p className="text-text-dim text-xs font-mono mb-2">{milestone.period}</p>

          <div className="flex flex-wrap gap-1.5">
            {milestone.focus.map((f) => (
              <span
                key={f}
                className="px-2 py-0.5 text-xs font-mono text-text-secondary bg-elevated rounded"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Expanded content */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isActive ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-4 pt-3 border-t border-border-dim">
            <p className="text-text-secondary text-sm leading-relaxed mb-3">
              {milestone.expanded}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {milestone.tools.map((tool) => (
                <span
                  key={tool}
                  className="interactive-tag px-2 py-0.5 text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 rounded"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Journey() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSelect = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <Section id="journey">
      <SectionHeader number="02" title="Cyber Journey" subtitle="Progression & Development" />

      <div ref={ref} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-3">
          <div className="space-y-0">
            {JOURNEY_MILESTONES.map((milestone, i) => (
              <TimelineNode
                key={milestone.id}
                milestone={milestone}
                index={i}
                isActive={activeId === milestone.id}
                onSelect={() => handleSelect(milestone.id)}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* Journey Map Sidebar */}
        <div className="hidden lg:block">
          <div
            className={`sticky top-24 border border-border-dim rounded-lg bg-panel/60 backdrop-blur-sm p-5 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-xs font-mono text-text-dim mb-3">JOURNEY MAP</p>
            <div className="space-y-2">
              {JOURNEY_MILESTONES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelect(m.id)}
                  className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded transition-colors ${
                    activeId === m.id ? "bg-cyber-cyan/10" : "hover:bg-elevated"
                  }`}
                >
                  <span
                    className={`text-xs font-mono ${
                      m.status === "current"
                        ? "text-cyber-cyan"
                        : m.status === "completed"
                        ? "text-cyber-green"
                        : "text-text-dim"
                    }`}
                  >
                    {m.status === "current" ? "●" : m.status === "completed" ? "✓" : "○"}
                  </span>
                  <span
                    className={`text-xs font-mono ${
                      activeId === m.id ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {m.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
