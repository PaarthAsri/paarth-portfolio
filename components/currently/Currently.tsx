"use client";

import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";

const AREAS = [
  "Application Security",
  "Security Research",
  "Bug Bounty",
  "Security Engineering",
  "Security Automation",
];

const TECH =
  "Python · Java · Selenium · Burp Suite · Nmap · Splunk · Sentinel · Sysmon · Git · Linux";

export default function Currently() {
  return (
    <Section id="currently">
      <SectionHeader number="04" title="Currently" />

      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          {AREAS.map((area) => (
            <span
              key={area}
              className="px-3 py-1.5 text-sm text-text-secondary border border-border rounded-full"
            >
              {area}
            </span>
          ))}
        </div>

        <p className="text-sm text-text-dim leading-relaxed">
          Currently exploring authorization issues, JWT security and security
          tooling.
        </p>

        <p className="font-mono text-xs text-text-dim">
          {TECH}
        </p>

        <div className="pt-2">
          <p className="font-mono text-xs text-text-dim mb-2">CERTIFIED</p>
          <p className="text-sm text-text-secondary">
            ISC2 CC · ISO/IEC 27001
          </p>
        </div>
      </div>
    </Section>
  );
}
