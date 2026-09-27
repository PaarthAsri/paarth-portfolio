"use client";

import { useState, useRef, useEffect } from "react";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { RESEARCH_AREAS, LIFECYCLE_STAGES } from "@/lib/data";
import { ResearchArea } from "@/lib/types";

const LIFECYCLE_DESCRIPTIONS: Record<string, string> = {
  DISCOVER: "Identify unusual behavior, weaknesses, or attack surface.",
  VALIDATE: "Confirm whether the observation is reproducible and meaningful.",
  INVESTIGATE: "Understand the underlying behavior and potential impact.",
  DETECT: "Determine how the behavior could be observed or detected.",
  REMEDIATE: "Address the underlying weakness.",
  VERIFY: "Confirm that the issue is resolved.",
  AUTOMATE: "Turn repeatable security validation into a reliable workflow.",
};

function LifecycleFlow() {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <div className="mb-12">
      <p className="text-xs font-mono text-text-dim mb-4 text-center">RESEARCH METHODOLOGY</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {LIFECYCLE_STAGES.map((stage, i) => (
          <div key={stage} className="flex items-center gap-2">
            <button
              onClick={() => setActiveStage(activeStage === stage ? null : stage)}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-all duration-300 ${
                activeStage === stage
                  ? "border-cyber-cyan/60 text-cyber-cyan bg-cyber-cyan/10"
                  : "border-border-dim text-text-secondary hover:border-cyber-cyan/30 hover:text-text-primary"
              }`}
            >
              {stage}
            </button>
            {i < LIFECYCLE_STAGES.length - 1 && (
              <span className="text-text-dim">→</span>
            )}
          </div>
        ))}
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${activeStage ? "max-h-16 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
        {activeStage && (
          <p className="text-text-secondary text-sm text-center">
            {LIFECYCLE_DESCRIPTIONS[activeStage]}
          </p>
        )}
      </div>
    </div>
  );
}

function ResearchCard({ area, index }: { area: ResearchArea; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`border rounded-lg bg-panel/60 backdrop-blur-sm p-6 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${isHovered ? "border-cyber-cyan/40" : "border-border-dim"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="font-mono text-cyber-cyan text-sm">[{area.number}]</span>
        <h3 className="font-display text-base font-semibold text-text-primary">{area.title}</h3>
      </div>
      <p className="text-text-secondary text-sm mb-4">{area.description}</p>
      <div className="flex flex-wrap gap-2">
        {area.focus.map((f) => (
          <span key={f} className="px-2 py-0.5 text-xs font-mono text-text-secondary bg-elevated rounded">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Research() {
  return (
    <Section id="research">
      <SectionHeader number="08" title="Security Research" subtitle="Research Areas / Methodology" />

      <LifecycleFlow />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {RESEARCH_AREAS.map((area, i) => (
          <ResearchCard key={area.id} area={area} index={i} />
        ))}
      </div>
    </Section>
  );
}
