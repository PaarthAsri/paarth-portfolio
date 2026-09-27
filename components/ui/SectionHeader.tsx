"use client";

import { useEffect, useRef, useState } from "react";

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ number, title, subtitle }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mb-12">
      {/* Section number */}
      <div
        className={`flex items-baseline gap-3 mb-2 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <span className="font-mono text-cyber-cyan text-sm">[{number}]</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
          {title}
        </h2>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div
          className={`transition-all duration-500 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <p className="font-mono text-text-secondary text-sm ml-8">{subtitle}</p>
        </div>
      )}

      {/* Accent line */}
      <div
        className={`mt-4 h-px bg-gradient-to-r from-cyber-cyan/50 to-transparent transition-all duration-700 delay-200 ${
          isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}
