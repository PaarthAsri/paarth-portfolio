"use client";

import { useState, useRef, useEffect } from "react";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { CERTIFICATIONS } from "@/lib/data";
import { Certification } from "@/lib/types";

function CertificationCard({ cert, index }: { cert: Certification; index: number }) {
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
      } ${isHovered ? "border-cyber-green/40" : "border-border-dim"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        <span className="font-mono text-cyber-cyan text-sm mt-1">[{cert.number}]</span>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-1">{cert.name}</h3>
          <p className="text-text-secondary text-sm mb-2">{cert.fullName}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-green" />
            <span className="text-xs font-mono text-cyber-green">{cert.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Certifications() {
  return (
    <Section id="certifications">
      <SectionHeader number="07" title="Certifications" subtitle="Security Credentials" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {CERTIFICATIONS.map((cert, i) => (
          <CertificationCard key={cert.id} cert={cert} index={i} />
        ))}
      </div>
    </Section>
  );
}
