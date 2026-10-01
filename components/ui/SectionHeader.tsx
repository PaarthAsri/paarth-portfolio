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
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`mb-10 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-mono text-xs text-text-dim">[{number}]</span>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="font-mono text-sm text-text-secondary ml-8">{subtitle}</p>
      )}
    </div>
  );
}
