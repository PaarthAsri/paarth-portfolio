"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { animate } from "motion";

/*
 * break(): the page cracks down the middle, splits into two halves that fall
 * apart, and reveals a 404 terminal underneath. "git restore ." (or Esc)
 * slams the halves back together.
 *
 * Each half is a clone of #site at the current scroll position (canvases are
 * copied so the banner survives), cut with a clip-path. A thin rim line on
 * each half marks the torn edge.
 */

type Phase = "idle" | "breaking" | "broken" | "restoring";

interface Crack {
  left: string;
  right: string;
  points: string;
}

function makeCrack(): Crack {
  const pts: [number, number][] = [];
  const steps = 16;
  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * 100;
    const x = i === 0 || i === steps ? 50 + (Math.random() - 0.5) * 4 : 50 + (Math.random() - 0.5) * 10;
    pts.push([x, y]);
  }
  const seam = pts.map(([x, y]) => `${x}% ${y}%`).join(", ");
  return {
    left: `polygon(0% 0%, ${seam}, 0% 100%)`,
    right: `polygon(100% 0%, ${seam}, 100% 100%)`,
    points: pts.map(([x, y]) => `${x},${y}`).join(" "),
  };
}

const EASE_OUT: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const EASE_IN: [number, number, number, number] = [0.55, 0, 0.9, 0.6]; // falls like it has weight
const EASE_IN_OUT: [number, number, number, number] = [0.7, 0, 0.2, 1];

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function BreakEffect() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [crack, setCrack] = useState<Crack | null>(null);
  const wrapL = useRef<HTMLDivElement>(null);
  const wrapR = useRef<HTMLDivElement>(null);
  const pageL = useRef<HTMLDivElement>(null);
  const pageR = useRef<HTMLDivElement>(null);
  const edgeL = useRef<SVGPolylineElement>(null);
  const edgeR = useRef<SVGPolylineElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  useEffect(() => {
    const onBreak = () => {
      if (busy.current) return;
      busy.current = true;
      setCrack(makeCrack());
      setPhase("breaking");
    };
    window.addEventListener("break-page", onBreak);
    return () => window.removeEventListener("break-page", onBreak);
  }, []);

  useLayoutEffect(() => {
    if (phase !== "breaking") return;
    const site = document.getElementById("site");
    const [wl, wr, pl, pr, el, er, screen] = [
      wrapL.current, wrapR.current, pageL.current, pageR.current, edgeL.current, edgeR.current, screenRef.current,
    ];
    if (!site || !wl || !wr || !pl || !pr || !el || !er || !screen) return;

    // Clone the page into both halves at the current scroll position.
    const scrollY = window.scrollY;
    const sourceCanvases = Array.from(site.querySelectorAll("canvas"));
    for (const half of [pl, pr]) {
      const clone = site.cloneNode(true) as HTMLElement;
      clone.removeAttribute("id");
      clone.classList.add("no-anim");
      Object.assign(clone.style, {
        position: "absolute",
        top: `${-scrollY}px`,
        left: "0",
        width: "100%",
        minHeight: "100vh",
      });
      clone.querySelectorAll("canvas").forEach((c, i) => {
        const src = sourceCanvases[i];
        if (!src) return;
        c.width = src.width;
        c.height = src.height;
        c.getContext("2d")?.drawImage(src, 0, 0);
      });
      half.replaceChildren(clone);
    }
    site.style.visibility = "hidden";
    document.body.style.overflow = "hidden";

    const reduce = reducedMotion();
    const t = (s: number) => (reduce ? 0 : s);

    const run = async () => {
      // 1. The crack line snaps down the page.
      const len = el.getTotalLength();
      for (const e of [el, er]) e.style.strokeDasharray = `${len}`;
      await Promise.all([
        animate(el, { strokeDashoffset: [len, 0] }, { duration: t(0.18), ease: "easeIn" }),
        animate(er, { strokeDashoffset: [len, 0] }, { duration: t(0.18), ease: "easeIn" }),
      ]);

      // 2. Straight away, the halves fall apart and the 404 comes up.
      const fall = { duration: t(0.6), ease: EASE_IN };
      animate(screen, { opacity: [0, 1], scale: [0.96, 1] }, { duration: t(0.5), delay: t(0.1), ease: EASE_OUT });
      await Promise.all([
        animate(wl, { x: "-70%", y: 140, rotate: -8 }, fall),
        animate(wr, { x: "70%", y: 140, rotate: 8 }, fall),
      ]);
      setPhase("broken");
    };
    void run();
  }, [phase]);

  const restore = useCallback(async () => {
    if (phase !== "broken") return;
    setPhase("restoring");
    const [wl, wr, el, er, screen] = [
      wrapL.current, wrapR.current, edgeL.current, edgeR.current, screenRef.current,
    ];
    const reduce = reducedMotion();
    const t = (s: number) => (reduce ? 0 : s);

    if (wl && wr && screen) {
      const back = { duration: t(0.4), ease: EASE_IN_OUT };
      await Promise.all([
        animate(screen, { opacity: 0 }, { duration: t(0.2) }),
        animate(wl, { x: 0, y: 0, rotate: 0 }, back),
        animate(wr, { x: 0, y: 0, rotate: 0 }, back),
      ]);
      // Impact: a small shake, then the seam fades.
      await Promise.all([
        animate(wl, { x: [0, -3, 2, 0] }, { duration: t(0.16) }),
        animate(wr, { x: [0, -3, 2, 0] }, { duration: t(0.16) }),
        el && animate(el, { opacity: 0 }, { duration: t(0.3) }),
        er && animate(er, { opacity: 0 }, { duration: t(0.3) }),
      ]);
    }

    const site = document.getElementById("site");
    if (site) site.style.visibility = "";
    document.body.style.overflow = "";
    setPhase("idle");
    setCrack(null);
    busy.current = false;
  }, [phase]);

  useEffect(() => {
    if (phase !== "broken") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && void restore();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, restore]);

  if (phase === "idle" || !crack) return null;

  const half = (
    wrap: RefObject<HTMLDivElement | null>,
    page: RefObject<HTMLDivElement | null>,
    edge: RefObject<SVGPolylineElement | null>,
    clip: string
  ) => (
    <div ref={wrap} className="absolute inset-0" style={{ transform: "translateX(0)" }}>
      <div ref={page} className="absolute inset-0 overflow-hidden" style={{ clipPath: clip }} />
      {/* Torn edge highlight, moving with its half */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <polyline
          ref={edge}
          points={crack.points}
          fill="none"
          className="tear-edge"
          strokeWidth="1.5"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-bg" role="dialog" aria-label="Page not found">
      <div ref={screenRef} className="absolute inset-0 flex items-center justify-center px-6 opacity-0">
        <div className="flex w-full max-w-md flex-col items-center text-center font-mono text-[12px] leading-relaxed">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/spongebob-404.png"
            alt="SpongeBob crying into a pillow"
            width={446}
            height={460}
            className="mb-5 h-auto w-40 select-none sm:w-48"
            draggable={false}
          />
          <p className="font-pixel text-6xl leading-none text-text-primary">404</p>
          <p className="mt-2 text-sm text-text-secondary">page not found. you break()&apos;d it.</p>

          <div className="mt-6 w-full rounded-lg border border-border bg-surface p-4">
            <p className="text-text-dim">
              <span className="text-accent">$</span> curl -sI https://paarth.sec/
            </p>
            <p className="text-red-400">HTTP/2 404 Not Found</p>
            <p className="mt-2 text-text-dim">
              <span className="text-accent">$</span> ls ./portfolio
            </p>
            <p className="text-text-secondary">
              ls: cannot access &apos;./portfolio&apos;: No such file or directory
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => void restore()}
              className="slide-btn h-8 rounded-md border border-text-primary bg-text-primary px-3 font-mono text-[12px] font-medium text-bg [--slide-bg:var(--color-accent)] hover:border-accent"
            >
              $ git restore .
            </button>
            <span className="text-[11px] text-text-dim">or press esc</span>
          </div>
        </div>
      </div>

      {half(wrapL, pageL, edgeL, crack.left)}
      {half(wrapR, pageR, edgeR, crack.right)}
    </div>
  );
}
