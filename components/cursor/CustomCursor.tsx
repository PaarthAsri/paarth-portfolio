"use client";

import { useEffect, useRef, useState } from "react";

type CursorVariant = "default" | "hover" | "click" | "attack" | "defense" | "engineering";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
    variant: "default" as CursorVariant,
    isVisible: false,
  });
  // Start with mounted=false so server and initial client render match (both render null)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only after mount, check if we should show the custom cursor
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!mediaQuery.matches || reducedMotion) return;

    // Use requestAnimationFrame to defer setState out of the effect body
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Separate effect for cursor event listeners — only runs after mounted is true
  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setCursor((prev) => ({ ...prev, x: e.clientX, y: e.clientY, isVisible: true }));
    };

    const handleMouseLeave = () => {
      setCursor((prev) => ({ ...prev, isVisible: false }));
    };

    const handleMouseDown = () => {
      setCursor((prev) => ({ ...prev, variant: "click" }));
    };

    const handleMouseUp = () => {
      setCursor((prev) => ({ ...prev, variant: "default" }));
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "button, a, [role='button'], .interactive-card, .interactive-node, .lifecycle-node, .journey-node, .experience-card, .terminal-panel, .interactive-tag"
      );

      if (interactive) {
        const variant = getVariantForElement(target);
        setCursor((prev) => ({ ...prev, variant }));
      } else {
        setCursor((prev) => ({ ...prev, variant: "default" }));
      }
    };

    const animate = () => {
      const lerp = 0.15;
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`;
      }
      if (ringRef.current) {
        const ringLerp = 0.08;
        const ringX = currentRef.current.x + (targetRef.current.x - currentRef.current.x) * ringLerp;
        const ringY = currentRef.current.y + (targetRef.current.y - currentRef.current.y) * ringLerp;
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mounted]);

  // Don't render anything until mounted — ensures server/client match
  if (!mounted) return null;

  const variantColors: Record<CursorVariant, string> = {
    default: "var(--color-cyber-cyan)",
    hover: "var(--color-cyber-cyan)",
    click: "var(--color-cyber-cyan)",
    attack: "var(--color-cyber-red)",
    defense: "var(--color-cyber-green)",
    engineering: "var(--color-cyber-cyan)",
  };

  const color = variantColors[cursor.variant];

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
        style={{
          opacity: cursor.isVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          className="relative w-8 h-8 rounded-full border transition-all duration-200"
          style={{
            borderColor: color,
            boxShadow: `0 0 12px ${color}40`,
            transform: cursor.variant === "click" ? "translate(-50%, -50%) scale(0.8)" : "translate(-50%, -50%) scale(1)",
          }}
        />
      </div>

      {/* Center reticle */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          opacity: cursor.isVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div className="relative">
          {/* Center dot */}
          <div
            className="absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-150"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
          {/* Crosshair marks */}
          <div
            className="absolute w-3 h-px -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            style={{
              backgroundColor: color,
              opacity: cursor.variant === "default" ? 0 : 0.6,
            }}
          />
          <div
            className="absolute h-3 w-px -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            style={{
              backgroundColor: color,
              opacity: cursor.variant === "default" ? 0 : 0.6,
            }}
          />
        </div>
      </div>

      {/* Click ripple */}
      {cursor.variant === "click" && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            transform: `translate(${cursor.x}px, ${cursor.y}px)`,
          }}
        >
          <div
            className="absolute w-12 h-12 rounded-full border-2 animate-ping"
            style={{ borderColor: color, transform: "translate(-50%, -50%)" }}
          />
        </div>
      )}
    </>
  );
}

function getVariantForElement(element: HTMLElement): CursorVariant {
  if (element.closest("[data-cursor='attack']")) return "attack";
  if (element.closest("[data-cursor='defense']")) return "defense";
  if (element.closest("[data-cursor='engineering']")) return "engineering";
  return "hover";
}
