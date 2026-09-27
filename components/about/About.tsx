"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { ABOUT_STATEMENT, ABOUT_INTRO, ABOUT_IDENTITY, CAPABILITIES, LIFECYCLE_STAGES } from "@/lib/data";
import { Capability } from "@/lib/types";

const STAGE_TO_CAPABILITY: Record<string, string> = {
  DISCOVER: "Security Research",
  VALIDATE: "Application Security",
  INVESTIGATE: "Security Operations",
  DETECT: "Security Operations",
  REMEDIATE: "Security Engineering",
  VERIFY: "Security Engineering",
  AUTOMATE: "Security Automation",
};

const STAGE_COLORS: Record<string, string> = {
  DISCOVER: "#ff3355",
  VALIDATE: "#ffb800",
  INVESTIGATE: "#ffb800",
  DETECT: "#00ff88",
  REMEDIATE: "#00f0ff",
  VERIFY: "#00ff88",
  AUTOMATE: "#00f0ff",
};

function LifecycleGraphic() {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="relative h-28 mb-4">
        <svg
          viewBox="0 0 700 80"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <line x1="20" y1="40" x2="680" y2="40" stroke="var(--color-border-dim)" strokeWidth="2" />
          {activeStage && (
            <line
              x1="20" y1="40"
              x2={20 + (LIFECYCLE_STAGES.indexOf(activeStage) + 0.5) * (660 / LIFECYCLE_STAGES.length)}
              y2="40"
              stroke={STAGE_COLORS[activeStage]}
              strokeWidth="2"
              style={{ filter: `drop-shadow(0 0 4px ${STAGE_COLORS[activeStage]})` }}
            />
          )}
          {LIFECYCLE_STAGES.map((stage, i) => {
            const x = 20 + (i + 0.5) * (660 / LIFECYCLE_STAGES.length);
            const isActive = activeStage === stage;
            const isPast = activeStage && LIFECYCLE_STAGES.indexOf(stage) < LIFECYCLE_STAGES.indexOf(activeStage);
            const color = STAGE_COLORS[stage];
            return (
              <g key={stage} className={`lifecycle-node ${isActive ? "active" : ""}`}
                onClick={() => setActiveStage(isActive ? null : stage)}
                onMouseEnter={() => setActiveStage(stage)}
                onMouseLeave={() => setActiveStage(null)}
                style={{ cursor: "pointer" }}
              >
                <circle cx={x} cy="40" r={isActive ? 18 : 14}
                  fill={isActive ? `${color}20` : "var(--color-panel)"}
                  stroke={isActive ? color : isPast ? color : "var(--color-border-dim)"}
                  strokeWidth={isActive ? 2 : 1}
                />
                <circle cx={x} cy="40" r={4}
                  fill={isActive ? color : isPast ? color : "var(--color-text-dim)"}
                />
                <text x={x} y="70" textAnchor="middle"
                  fill={isActive ? color : "var(--color-text-dim)"}
                  fontSize="9" fontFamily="var(--font-mono)"
                >
                  {stage}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${activeStage ? "max-h-16 opacity-100" : "max-h-0 opacity-0"}`}>
        {activeStage && (
          <div className="text-center">
            <span className="text-sm font-mono" style={{ color: STAGE_COLORS[activeStage] }}>{activeStage}</span>
            <span className="text-text-dim text-sm font-mono"> → </span>
            <span className="text-text-secondary text-sm font-mono">{STAGE_TO_CAPABILITY[activeStage]}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function IdentityPanel() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`border rounded-lg bg-panel/60 backdrop-blur-sm p-5 transition-all duration-300 ${
        isHovered ? "border-cyber-cyan/40" : "border-border-dim"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="text-xs font-mono text-text-dim mb-4">IDENTITY</p>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-mono text-text-dim mb-1">ROLE</p>
          <p className="text-text-primary text-sm font-medium">{ABOUT_IDENTITY.role}</p>
        </div>
        <div>
          <p className="text-xs font-mono text-text-dim mb-1">FOCUS</p>
          <div className="flex flex-wrap gap-1.5">
            {ABOUT_IDENTITY.focus.map((f) => (
              <span key={f} className="px-2 py-0.5 text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 rounded">
                {f}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-mono text-text-dim mb-1">STATUS</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-glow" />
            <span className="text-cyber-green text-xs font-mono">{ABOUT_IDENTITY.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CapabilityCard({ capability }: { capability: Capability }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`interactive-card border rounded-lg bg-panel/60 backdrop-blur-sm overflow-hidden ${
        isExpanded ? "border-cyber-cyan/60" : "border-border-dim"
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsExpanded(!isExpanded); }
      }}
      role="button" tabIndex={0} aria-expanded={isExpanded}
    >
      <div className={`h-0.5 transition-all duration-300 ${isHovered || isExpanded ? "bg-cyber-cyan" : "bg-transparent"}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-semibold text-text-primary">{capability.title}</h3>
          <span className={`text-text-dim text-xs font-mono transition-transform duration-300 ${isExpanded ? "rotate-45" : ""}`}>+</span>
        </div>
        <div className="flex gap-2 mb-3">
          {capability.lifecycle.map((stage) => (
            <span key={stage} className="px-2 py-0.5 text-xs font-mono rounded"
              style={{ color: STAGE_COLORS[stage], backgroundColor: `${STAGE_COLORS[stage]}15` }}>
              {stage}
            </span>
          ))}
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{capability.description}</p>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-5 pb-5 pt-3 border-t border-border-dim">
          <p className="text-xs font-mono text-text-dim mb-2">Related Sections:</p>
          <div className="flex flex-wrap gap-2">
            {capability.related.map((rel) => (
              <span key={rel} className="interactive-tag px-2 py-1 text-xs font-mono text-text-secondary bg-elevated rounded">
                {rel}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <Section id="about">
      <SectionHeader number="02" title="About" subtitle="Security Identity & Capabilities" />

      {/* Identity Statement + Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="border-l-2 border-cyber-cyan/50 pl-6">
            <p className="text-text-primary text-lg leading-relaxed font-medium">
              {ABOUT_STATEMENT}
            </p>
          </div>
          <p className="text-text-secondary leading-relaxed">
            {ABOUT_INTRO}
          </p>
        </div>
        <div>
          <IdentityPanel />
        </div>
      </div>

      {/* Security Lifecycle */}
      <div className="mb-12">
        <p className="text-xs font-mono text-text-dim mb-4 text-center">SECURITY LIFECYCLE</p>
        <LifecycleGraphic />
      </div>

      {/* Core Capabilities */}
      <div>
        <p className="text-xs font-mono text-text-dim mb-4 text-center">CORE CAPABILITIES</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CAPABILITIES.map((cap) => (
            <CapabilityCard key={cap.id} capability={cap} />
          ))}
        </div>
      </div>
    </Section>
  );
}
