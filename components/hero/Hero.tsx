"use client";

import { useEffect, useState, useRef } from "react";
import Terminal from "./Terminal";
import LiveLogPanel from "./LiveLogPanel";
import SystemStatusPanel from "./SystemStatusPanel";
import { IDENTITY, CV_PATH } from "@/lib/data";
import { useMode } from "@/components/providers/ModeProvider";

const ROLES = [
  "System Associate @ Infosys",
  "Independent Security Researcher",
  "Bug Bounty Hunter",
  "Application Security / Security Engineering",
];

const STATUS_MESSAGES = [
  "[BOOT] loading security_researcher.exe...",
  "[OK] recon modules online",
  "[OK] exploit chain ready",
  "[OK] system initialized",
];

const BREACH_STATUS_MESSAGES = [
  "[ALERT] unauthorized access detected",
  "[CRITICAL] system integrity compromised",
  "[WARNING] perimeter breach in progress",
  "[CRITICAL] incident response required",
];

function useTypewriter(text: string, speed: number = 50, startDelay: number = 0) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(text);
      setIsComplete(true);
      return;
    }

    let index = 0;
    let timer: NodeJS.Timeout;

    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
    };
  }, [text, speed, startDelay]);

  return { displayed, isComplete };
}

function WhoamiCommand() {
  const { displayed, isComplete } = useTypewriter("$ sudo whoami", 80, 200);

  return (
    <div className="text-center mb-4">
      <span className="font-mono text-text-dim text-sm md:text-base">
        {displayed}
        {!isComplete && <span className="animate-blink">_</span>}
      </span>
    </div>
  );
}

function StatusMessages() {
  const { mode } = useMode();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const messages = mode === "breach" ? BREACH_STATUS_MESSAGES : STATUS_MESSAGES;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const cycle = () => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 400);
    };

    const interval = setInterval(cycle, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="text-center mb-4 h-6">
      <span
        className={`font-mono text-xs md:text-sm transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        } ${mode === "breach" ? "text-cyber-red" : messages[currentIndex].includes("[BOOT]") ? "text-cyber-amber" : "text-cyber-green"}`}
      >
        {messages[currentIndex]}
      </span>
    </div>
  );
}

function RoleRotation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing");
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(ROLES[0]);
      return;
    }

    const role = ROLES[currentIndex];
    let timer: NodeJS.Timeout;

    if (phase === "typing") {
      let index = 0;
      const interval = setInterval(() => {
        index++;
        setDisplayed(role.slice(0, index));
        if (index >= role.length) {
          clearInterval(interval);
          setPhase("holding");
        }
      }, 60);
      return () => clearInterval(interval);
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("erasing"), 1500);
    } else {
      let index = role.length;
      const interval = setInterval(() => {
        index--;
        setDisplayed(role.slice(0, index));
        if (index <= 0) {
          clearInterval(interval);
          setCurrentIndex((prev) => (prev + 1) % ROLES.length);
          setPhase("typing");
        }
      }, 30);
      return () => clearInterval(interval);
    }

    return () => clearTimeout(timer);
  }, [currentIndex, phase]);

  return (
    <div className="text-center mb-4 h-8">
      <span className="font-mono text-text-secondary text-base md:text-lg">
        {displayed}
        {phase === "typing" && <span className="animate-blink">_</span>}
      </span>
    </div>
  );
}

function AnimatedName({ name }: { name: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [glitchFrame, setGlitchFrame] = useState(0);
  const glitchRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scheduleGlitch = () => {
      const delay = 4000 + Math.random() * 1000;
      glitchRef.current = setTimeout(() => {
        // 3 quick micro-frames for a sharp glitch effect
        setGlitchFrame(1);
        setTimeout(() => setGlitchFrame(2), 50);
        setTimeout(() => setGlitchFrame(3), 100);
        setTimeout(() => setGlitchFrame(0), 180);
        scheduleGlitch();
      }, delay);
    };

    scheduleGlitch();
    return () => {
      if (glitchRef.current) clearTimeout(glitchRef.current);
    };
  }, []);

  const getGlitchStyle = () => {
    if (!glitchFrame) return {};
    const offsets: Record<number, { transform: string; textShadow: string }> = {
      1: { transform: "translateX(-1px) skewX(-1deg)", textShadow: "1px 0 var(--color-cyber-red)" },
      2: { transform: "translateX(1px) skewX(1deg)", textShadow: "-1px 0 var(--color-cyber-cyan)" },
      3: { transform: "translateX(-0.5px)", textShadow: "0.5px 0 var(--color-cyber-red), -0.5px 0 var(--color-cyber-cyan)" },
    };
    return offsets[glitchFrame] || {};
  };

  return (
    <h1
      className="font-display text-5xl md:text-7xl font-bold text-text-primary mb-4 relative cursor-default transition-all duration-300"
      style={{
        textShadow: isHovered ? "0 0 30px rgba(0, 240, 255, 0.15)" : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="inline-block animate-char-reveal transition-all duration-75"
        style={{
          ...getGlitchStyle(),
          color: glitchFrame ? "var(--color-text-primary)" : isHovered ? "var(--color-cyber-cyan)" : "var(--color-text-primary)",
        }}
      >
        {name}
      </span>
      {/* Cyan light sweep */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-cyber-cyan/20 to-transparent animate-light-sweep"
          style={{ animationDelay: `${name.length * 60 + 400}ms` }}
        />
      </div>
    </h1>
  );
}

function AnimatedTagline() {
  const phrases = IDENTITY.tagline.split("/").map((s) => s.trim());

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
      {phrases.map((phrase, i) => (
        <span key={i} className="flex items-center gap-2 group/tagline">
          <span
            className="font-mono text-text-dim text-sm animate-tagline-phrase inline-block cursor-default relative transition-all duration-200 hover:text-text-secondary"
            style={{ animationDelay: `${1400 + i * 150}ms` }}
          >
            {phrase}
            <span className="absolute bottom-0 left-0 right-0 h-px bg-text-dim/40 scale-x-0 group-hover/tagline:scale-x-100 transition-transform duration-300 origin-left" />
          </span>
          {i < phrases.length - 1 && (
            <span className="text-text-dim/40 animate-separator transition-colors duration-200 group-hover/tagline:text-text-secondary" style={{ animationDelay: `${1500 + i * 150}ms` }}>
              /
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export default function Hero() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center pt-20 pb-16 px-4"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Whoami command */}
        <div
          className={`transition-all duration-500 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <WhoamiCommand />
        </div>

        {/* Eyebrow */}
        <div
          className={`text-center mb-4 transition-all duration-700 delay-300 ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-3">
            <div className="h-px w-8 bg-cyber-cyan/50 animate-line-sweep" />
            <p className="font-mono text-cyber-cyan text-sm tracking-widest animate-eyebrow">
              CYBERSECURITY PROFESSIONAL
            </p>
            <div className="h-px w-8 bg-cyber-cyan/50 animate-line-sweep" />
          </div>
        </div>

        {/* Name with character animation */}
        <div className="text-center mb-4">
          <AnimatedName name={IDENTITY.name} />
        </div>

        {/* Role rotation */}
        <div
          className={`text-center mb-2 transition-all duration-700 delay-500 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <RoleRotation />
        </div>

        {/* Status messages */}
        <div
          className={`transition-all duration-700 delay-700 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <StatusMessages />
        </div>

        {/* Tagline */}
        <div
          className={`text-center mb-8 transition-all duration-700 delay-900 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <AnimatedTagline />
        </div>

        {/* Main content grid */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 delay-1000 ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="lg:col-span-2 flex flex-col">
            <Terminal />
            {/* Action buttons - directly below terminal */}
            <div
              className={`mt-4 transition-all duration-700 delay-1200 ${
                showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex flex-wrap gap-4">
                <a
                  href={CV_PATH}
                  download
                  className="interactive-tag inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono text-cyber-cyan bg-panel/60 border border-cyber-cyan/30 rounded transition-all duration-200 hover:bg-cyber-cyan/10 hover:border-cyber-cyan/60"
                >
                  <span>&gt;</span>
                  DOWNLOAD CV
                </a>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="interactive-tag inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono text-cyber-cyan bg-panel/60 border border-cyber-cyan/30 rounded transition-all duration-200 hover:bg-cyber-cyan/10 hover:border-cyber-cyan/60"
                >
                  <span>&gt;</span>
                  CONTACT ME
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <SystemStatusPanel />
            <LiveLogPanel />
          </div>
        </div>

        {/* Footer hint + 2026 marker */}
        <div
          className={`mt-8 text-center transition-all duration-700 delay-1300 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="font-mono text-text-dim text-xs">
            Type &apos;help&apos; in the terminal or use the command chips
          </p>
          <p className="font-mono text-text-dim/50 text-xs mt-2">
            PORTFOLIO // 2026
          </p>
        </div>
      </div>
    </section>
  );
}
