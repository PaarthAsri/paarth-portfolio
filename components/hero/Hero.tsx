"use client";

import Fingerprint from "./Fingerprint";

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center px-6 pt-20"
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col items-start gap-6">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-text-primary leading-tight">
            Paarth Asri
          </h1>

          <p className="font-mono text-sm text-text-secondary">
            Security Engineer / Researcher
          </p>

          <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
            I build, test and break things to understand how they work — with a
            focus on application security, security research and security
            engineering.
          </p>

          <p className="text-sm text-text-dim max-w-lg leading-relaxed">
            Currently working at Infosys and spending my time around
            application security, bug bounty research and security tooling.
          </p>

          <div className="mt-4" data-bug-inspect="button.scan">
            <Fingerprint />
          </div>
        </div>
      </div>
    </section>
  );
}
