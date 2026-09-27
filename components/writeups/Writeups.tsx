"use client";

import { useState, useRef, useEffect } from "react";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { WRITEUPS } from "@/lib/data";
import { Writeup } from "@/lib/types";

function AuthorizationVisualization() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Normal Access */}
      <div className={`border border-border-dim rounded-lg p-4 transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <p className="text-xs font-mono text-cyber-green mb-3">NORMAL ACCESS</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-cyber-green/50 flex items-center justify-center text-[10px] font-mono text-cyber-green">U</div>
            <span className="text-xs font-mono text-text-secondary">User</span>
          </div>
          <div className="ml-3 h-4 w-px bg-border-dim" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-cyber-green/50 flex items-center justify-center text-[10px] font-mono text-cyber-green">R</div>
            <span className="text-xs font-mono text-text-secondary">Record Access Check</span>
          </div>
          <div className="ml-3 h-4 w-px bg-border-dim" />
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded bg-cyber-green/10 border border-cyber-green/30">
              <span className="text-xs font-mono text-cyber-green">DENIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Path */}
      <div className={`border border-cyber-amber/30 rounded-lg p-4 transition-all duration-500 delay-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <p className="text-xs font-mono text-cyber-amber mb-3">SEARCH PATH</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-cyber-amber/50 flex items-center justify-center text-[10px] font-mono text-cyber-amber">U</div>
            <span className="text-xs font-mono text-text-secondary">User</span>
          </div>
          <div className="ml-3 h-4 w-px bg-border-dim" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border border-cyber-amber/50 flex items-center justify-center text-[10px] font-mono text-cyber-amber">S</div>
            <span className="text-xs font-mono text-text-secondary">Global Search</span>
          </div>
          <div className="ml-3 h-4 w-px bg-border-dim" />
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded bg-cyber-amber/10 border border-cyber-amber/30">
              <span className="text-xs font-mono text-cyber-amber">Incorrect Permission</span>
            </div>
          </div>
          <div className="ml-3 h-4 w-px bg-border-dim" />
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded bg-cyber-red/10 border border-cyber-red/30">
              <span className="text-xs font-mono text-cyber-red">Private Record Found</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WriteupCard({ writeup }: { writeup: Writeup }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const handleClick = () => {
    setIsClicking(true);
    setTimeout(() => {
      window.open(writeup.url, "_blank", "noopener,noreferrer");
      setIsClicking(false);
    }, 600);
  };

  return (
    <div
      className={`border rounded-lg bg-panel/60 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
        isHovered ? "border-cyber-cyan/50 shadow-[0_0_30px_rgba(0,240,255,0.08)]" : "border-border-dim"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card header */}
      <div className="px-6 py-4 border-b border-border-dim bg-void/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-cyber-cyan text-sm">[{writeup.number}]</span>
            <span className="text-xs font-mono text-text-dim">RESEARCH ARTIFACT</span>
          </div>
          <span className="px-2 py-0.5 text-xs font-mono text-cyber-green bg-cyber-green/10 rounded">
            {writeup.status}
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Title */}
        <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
          {writeup.title}
        </h3>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {writeup.category.map((cat) => (
            <span key={cat} className="px-2 py-0.5 text-xs font-mono text-cyber-amber bg-cyber-amber/10 rounded">
              {cat}
            </span>
          ))}
        </div>

        {/* Summary */}
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          {writeup.summary}
        </p>

        {/* Authorization Visualization */}
        <div className="mb-6">
          <AuthorizationVisualization />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {writeup.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs font-mono text-text-secondary bg-elevated rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Action */}
        <button
          onClick={handleClick}
          className="interactive-tag w-full px-4 py-3 text-sm font-mono text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 rounded transition-all duration-200 hover:bg-cyber-cyan/20 text-center"
        >
          {isClicking ? "OPENING WRITE-UP..." : "INSPECT WRITE-UP →"}
        </button>
      </div>
    </div>
  );
}

function ResearchPipeline() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const stages = ["DISCOVER", "ANALYZE", "VALIDATE", "DOCUMENT", "DISCLOSE"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-12">
      <p className="text-xs font-mono text-text-dim mb-4 text-center">RESEARCH METHODOLOGY</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {stages.map((stage, i) => (
          <div key={stage} className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-all duration-500 ${
                isVisible
                  ? "border-cyber-cyan/40 text-cyber-cyan bg-cyber-cyan/10"
                  : "border-border-dim text-text-dim"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {stage}
            </span>
            {i < stages.length - 1 && (
              <span className={`text-text-dim transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
                style={{ transitionDelay: `${i * 150 + 75}ms` }}>
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Writeups() {
  return (
    <Section id="writeups">
      <SectionHeader number="04" title="Write-ups" subtitle="Security Research / Technical Analysis" />

      <p className="text-xs font-mono text-text-dim mb-6 text-center">
        {WRITEUPS.length} PUBLISHED ARTIFACT{WRITEUPS.length !== 1 ? "S" : ""}
      </p>

      <div className="space-y-6">
        {WRITEUPS.map((writeup) => (
          <WriteupCard key={writeup.id} writeup={writeup} />
        ))}
      </div>

      <ResearchPipeline />
    </Section>
  );
}
