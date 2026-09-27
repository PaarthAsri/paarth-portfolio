"use client";

import { useState, useRef, useEffect } from "react";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { SKILL_CATEGORIES } from "@/lib/data";
import { SkillCategory } from "@/lib/types";

const CATEGORY_ACCENTS: Record<string, { border: string; text: string; bg: string }> = {
  "prog-eng": { border: "hover:border-cyber-cyan/50", text: "text-cyber-cyan", bg: "bg-cyber-cyan/10" },
  "sec-det": { border: "hover:border-cyber-green/50", text: "text-cyber-green", bg: "bg-cyber-green/10" },
  "sec-tools": { border: "hover:border-cyber-amber/50", text: "text-cyber-amber", bg: "bg-cyber-amber/10" },
  infra: { border: "hover:border-cyber-cyan/50", text: "text-cyber-cyan", bg: "bg-cyber-cyan/10" },
};

function SkillTag({ name, context }: { name: string; context?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`interactive-tag inline-block px-3 py-1.5 text-xs font-mono rounded border transition-all duration-200 cursor-default ${
        isHovered
          ? "border-cyber-cyan/50 bg-cyber-cyan/10 text-cyber-cyan -translate-y-0.5"
          : "border-border-dim bg-elevated text-text-secondary"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{name}</span>
      {context && isHovered && (
        <span className="ml-2 text-cyber-cyan/70 text-[10px]">{context}</span>
      )}
    </div>
  );
}

function CategoryModule({ category, index }: { category: SkillCategory; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const accent = CATEGORY_ACCENTS[category.id] || CATEGORY_ACCENTS["prog-eng"];

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
      className={`skills-module border rounded-lg bg-panel/60 backdrop-blur-sm overflow-hidden transition-all duration-500 cursor-pointer ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${isActive ? accent.border.replace("hover:", "") : "border-border-dim"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsActive(!isActive)}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsActive(!isActive);
        }
      }}
    >
      {/* Top accent line */}
      <div className={`h-0.5 transition-all duration-300 ${isHovered || isActive ? accent.bg.replace("/10", "/30") : "bg-transparent"}`} />

      {/* Category header */}
      <div className="px-5 py-4 border-b border-border-dim bg-void/30">
        <div className="flex items-center gap-3">
          <span className={`font-mono text-sm transition-colors duration-200 ${isHovered || isActive ? accent.text : "text-cyber-cyan"}`}>
            [{category.number}]
          </span>
          <div>
            <h3 className={`font-display text-base font-semibold text-text-primary transition-colors duration-200 ${isHovered ? "brightness-125" : ""}`}>
              {category.title}
            </h3>
            <p className="text-text-dim text-xs font-mono">{category.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <SkillTag key={skill.name} name={skill.name} context={skill.context} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <Section id="skills">
      <SectionHeader number="03" title="Skills / Arsenal" subtitle="Technical Stack · Security Tooling · Engineering" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SKILL_CATEGORIES.map((cat, i) => (
          <CategoryModule key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </Section>
  );
}
