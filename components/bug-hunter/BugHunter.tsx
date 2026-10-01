"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CursorMode = "normal" | "swatter";

const TRIAGE = [
  { label: "duplicate", tone: "text-text-dim" },
  { label: "informative", tone: "text-sky-500" },
  { label: "n/a: out of scope", tone: "text-red-500" },
  { label: "triaged", tone: "text-amber-500" },
  { label: "resolved: bounty awarded $", tone: "text-accent" },
];

interface Inspect {
  tag: string;
  cls: string;
  rect: DOMRect;
  scanned: boolean;
}

/*
 * The original bug. Each leg path starts at its root (the translated group's
 * origin), so rotating it about (0, 0) swings it from the body. Legs walk in a
 * tripod gait: group 0 (L1, R2, L3) swings opposite to group 1 (R1, L2, R3).
 */
const LEGS: { at: [number, number]; d: string; side: -1 | 1; group: 0 | 1 }[] = [
  { at: [110, 208], d: "M0 0Q-70 -3 -70 -68V-93", side: -1, group: 0 },
  { at: [404, 208], d: "M0 0Q70 -3 70 -68V-93", side: 1, group: 1 },
  { at: [110, 272], d: "M0 0H-96", side: -1, group: 1 },
  { at: [404, 272], d: "M0 0H96", side: 1, group: 0 },
  { at: [110, 335], d: "M0 0Q-70 5 -70 70V105", side: -1, group: 0 },
  { at: [404, 335], d: "M0 0Q70 5 70 70V105", side: 1, group: 1 },
];

/** Walking bug, drawn with currentColor so it follows the theme. */
function BugGlyph() {
  return (
    <svg viewBox="0 0 512 512" width="26" height="26" className="bug-svg block" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round">
        {LEGS.map((l, i) => (
          <g key={i} transform={`translate(${l.at[0]} ${l.at[1]})`}>
            <path data-leg={i} d={l.d} />
          </g>
        ))}
        <path d="M198 20L224 58" strokeWidth="24" />
        <path d="M316 20L290 58" strokeWidth="24" />
      </g>
      <g fill="currentColor">
        <path d="M143 132V108Q143 45 205 45H310Q372 45 372 108V132Z" />
        <path d="M128 160H246V337A11 11 0 0 0 268 337V160H386Q408 160 408 182V350A151 151 0 0 1 106 350V182Q106 160 128 160Z" />
      </g>
    </svg>
  );
}

const parseInspectId = (id: string) => {
  const [tag, ...rest] = id.split(".");
  return { tag, cls: rest.length ? `.${rest.join(".")}` : "" };
};

export default function BugHunter() {
  const [mode, setMode] = useState<CursorMode>("normal");
  const [inspect, setInspect] = useState<Inspect | null>(null);
  const [feedback, setFeedback] = useState<{ label: string; tone: string; x: number; y: number } | null>(null);
  const [swatting, setSwatting] = useState(false);
  const [caught, setCaught] = useState(0);

  const bugRef = useRef<HTMLDivElement>(null);
  const swatterRef = useRef<HTMLDivElement>(null);

  // Per-frame state lives in refs so the animation never re-renders React.
  const sim = useRef({
    x: 0, y: 0, heading: -Math.PI / 2, speed: 0,
    wanderX: 0, wanderY: 0, pause: 0, hit: false, t: 0,
    stamina: 90, // frames of full sprint before it tires, so it stays catchable
  });
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const inspectRef = useRef<Inspect | null>(null);
  const modeRef = useRef<CursorMode>("normal");
  const triageIndex = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    modeRef.current = mode;
    if (mode === "swatter") document.documentElement.setAttribute("data-cursor-mode", "swatter");
    else document.documentElement.removeAttribute("data-cursor-mode");
    return () => document.documentElement.removeAttribute("data-cursor-mode");
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((m) => {
      if (m === "swatter") setFeedback(null);
      return m === "swatter" ? "normal" : "swatter";
    });
  }, []);

  // The hunt toggle lives in the header; talk to it through window events.
  useEffect(() => {
    window.addEventListener("toggle-hunt", toggleMode);
    return () => window.removeEventListener("toggle-hunt", toggleMode);
  }, [toggleMode]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("hunt-state", { detail: { hunting: mode === "swatter", caught } })
    );
  }, [mode, caught]);

  // Animation loop: time-based steering with eased acceleration.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const s = sim.current;
    s.x = window.innerWidth * 0.75;
    s.y = window.innerHeight * 0.55;
    s.wanderX = s.x;
    s.wanderY = s.y;

    let raf = 0;
    let last = performance.now();
    let gait = 0;
    let lastSwing = 1;
    const legEls = Array.from(bugRef.current?.querySelectorAll<SVGPathElement>("[data-leg]") ?? []);

    const pickWander = () => {
      const pad = 60;
      s.wanderX = pad + Math.random() * (window.innerWidth - pad * 2);
      s.wanderY = 80 + Math.random() * (window.innerHeight - 160);
    };

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50) / 16.667; // 1 = one 60fps frame
      last = now;
      s.t += dt;

      let tx = s.wanderX;
      let ty = s.wanderY;
      let desired = 0;
      let panic = false;
      const ins = inspectRef.current;
      const p = pointer.current;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const hunting = modeRef.current === "swatter";
      const near = p ? Math.hypot(p.x - s.x, p.y - s.y) : Infinity;

      if (s.hit) {
        desired = 0;
      } else if (p && near < (hunting ? 200 : 120)) {
        // Flee straight away from the cursor, pulled toward the centre near
        // edges so it doesn't pin itself in a corner.
        panic = true;
        s.pause = 0;
        const ax = (s.x - p.x) / (near || 1);
        const ay = (s.y - p.y) / (near || 1);
        const cx = W / 2 - s.x;
        const cy = H / 2 - s.y;
        const cl = Math.hypot(cx, cy) || 1;
        const edge = Math.min(s.x, s.y, W - s.x, H - s.y) < 90 ? 0.9 : 0.2;
        tx = s.x + ax * 120 + (cx / cl) * 120 * edge;
        ty = s.y + ay * 120 + (cy / cl) * 120 * edge;
        s.stamina = Math.max(0, s.stamina - dt);
        desired = hunting ? (s.stamina > 0 ? 8 : 3.2) : 4.5;
      } else if (ins && !ins.scanned) {
        tx = ins.rect.right - 6;
        ty = ins.rect.top - 10;
        const d = Math.hypot(tx - s.x, ty - s.y);
        desired = Math.min(4.5, 1 + d * 0.04);
        if (d < 8) {
          ins.scanned = true;
          setInspect({ ...ins });
          s.pause = 70;
          desired = 0;
        }
      } else if (s.pause > 0) {
        s.pause -= dt;
      } else {
        const d = Math.hypot(s.wanderX - s.x, s.wanderY - s.y);
        if (d < 12) {
          s.pause = 20 + Math.random() * 80; // stop-and-go like a real insect
          pickWander();
        } else {
          desired = Math.min(2.6, 1 + d * 0.012);
        }
      }
      if (!panic) s.stamina = Math.min(90, s.stamina + dt * 0.5);

      // Ease speed, then turn toward the target with a capped turn rate.
      // Panicking bugs accelerate and turn much harder.
      s.speed += (desired - s.speed) * Math.min(1, (panic ? 0.28 : 0.1) * dt);
      if (s.speed > 0.05) {
        let diff = Math.atan2(ty - s.y, tx - s.x) - s.heading;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        const maxTurn = (panic ? 0.38 : 0.13) * dt;
        s.heading += Math.max(-maxTurn, Math.min(maxTurn, diff * (panic ? 0.6 : 0.22) * dt));
        s.heading += Math.sin(s.t * 0.07) * 0.004 * dt; // tiny natural wobble
        s.x += Math.cos(s.heading) * s.speed * dt;
        s.y += Math.sin(s.heading) * s.speed * dt;
      }

      // Clamp to the viewport, except while scurrying in after a respawn.
      if (s.x > 0 && s.x < W && s.y > 0 && s.y < H) {
        s.x = Math.max(16, Math.min(W - 16, s.x));
        s.y = Math.max(16, Math.min(H - 16, s.y));
      }

      const el = bugRef.current;
      if (el) {
        el.style.opacity = "1";
        // Plain 2D transform: 3D/will-change layers get rasterised and look blurry.
        el.style.transform = `translate(${s.x - 13}px, ${s.y - 13}px) rotate(${(s.heading * 180) / Math.PI + 90}deg)`;

        // Gait: phase advances with distance walked (~one stride per body
        // length), so feet don't slide. Swing fades to a neutral stance at rest.
        gait += s.speed * dt * 0.24;
        const swing = 13 * Math.min(1, s.speed / 0.8);
        if (swing > 0.05 || lastSwing > 0.05) {
          legEls.forEach((p, i) => {
            const l = LEGS[i];
            const a = -l.side * swing * Math.sin(gait + l.group * Math.PI);
            // Leg paths start at (0, 0) = their root, so rotate around that.
            p.setAttribute("transform", `rotate(${a.toFixed(2)})`);
          });
        }
        lastSwing = swing;
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
      if (modeRef.current === "swatter" && swatterRef.current) {
        swatterRef.current.style.transform = `translate3d(${e.clientX - 8}px, ${e.clientY - 30}px, 0)`;
      }
    };
    const onLeave = () => (pointer.current = null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modeRef.current === "swatter") setMode("normal");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("keydown", onKey);
    const pending = timers.current;
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("keydown", onKey);
      pending.forEach(clearTimeout);
    };
  }, []);

  // Devtools-style element inspection.
  useEffect(() => {
    let current: Element | null = null;
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-bug-inspect]");
      if (target === current) return;
      current = target;
      if (!target) {
        inspectRef.current = null;
        setInspect(null);
        return;
      }
      const next: Inspect = {
        ...parseInspectId(target.getAttribute("data-bug-inspect")!),
        rect: target.getBoundingClientRect(),
        scanned: false,
      };
      inspectRef.current = next;
      setInspect(next);
    };
    const clear = () => {
      current = null;
      inspectRef.current = null;
      setInspect(null);
    };
    document.addEventListener("mouseover", onOver);
    window.addEventListener("scroll", clear, { passive: true });
    return () => {
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("scroll", clear);
    };
  }, []);

  // Swatting.
  useEffect(() => {
    if (mode !== "swatter") return;
    const onDown = (e: PointerEvent) => {
      // Tapping the hunt toggle is for leaving the mode, not swatting.
      if ((e.target as Element | null)?.closest?.("[data-hunt-toggle]")) return;

      // Touch never fires pointermove before a tap, so snap the swatter and the
      // bug's fear point to the tap itself; otherwise the swatter stays stuck.
      pointer.current = { x: e.clientX, y: e.clientY };
      if (swatterRef.current) {
        swatterRef.current.style.transform = `translate3d(${e.clientX - 8}px, ${e.clientY - 30}px, 0)`;
      }

      setSwatting(true);
      timers.current.push(setTimeout(() => setSwatting(false), 110));

      // Fingers are fatter than cursors, so give touch a bigger hit radius.
      const radius = e.pointerType === "touch" ? 56 : 46;
      const s = sim.current;
      if (s.hit || Math.hypot(e.clientX - s.x, e.clientY - s.y) > radius) return;

      const result = TRIAGE[triageIndex.current++ % TRIAGE.length];
      s.hit = true;
      s.speed = 0;
      setCaught((c) => c + 1);
      setFeedback({
        ...result,
        x: Math.min(Math.max(s.x + 22, 12), window.innerWidth - 220),
        y: Math.max(s.y - 34, 64),
      });
      bugRef.current?.setAttribute("data-hit", "true");

      timers.current.push(
        setTimeout(() => {
          // Respawn just off a random screen edge and scurry back in.
          const W = window.innerWidth;
          const H = window.innerHeight;
          const side = Math.floor(Math.random() * 4);
          s.x = side === 0 ? -24 : side === 1 ? W + 24 : 60 + Math.random() * (W - 120);
          s.y = side === 2 ? -24 : side === 3 ? H + 24 : 80 + Math.random() * (H - 160);
          s.wanderX = W * (0.25 + Math.random() * 0.5);
          s.wanderY = H * (0.25 + Math.random() * 0.5);
          s.heading = Math.atan2(s.wanderY - s.y, s.wanderX - s.x);
          s.speed = 3;
          s.pause = 0;
          s.stamina = 90;
          s.hit = false;
          bugRef.current?.removeAttribute("data-hit");
        }, 900),
        setTimeout(() => setFeedback(null), 1700)
      );
    };
    // iOS Safari ignores overflow:hidden for touch scrolling, so block it directly.
    const lockQuery = window.matchMedia("(pointer: coarse), (max-width: 767px)");
    const onTouchMove = (e: TouchEvent) => {
      if (lockQuery.matches && !(e.target as Element | null)?.closest?.("[data-hunt-toggle]")) e.preventDefault();
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [mode]);

  const r = inspect?.rect;
  const tipBelow = r ? r.top < 70 : false;

  return (
    <>
      <div
        ref={bugRef}
        className="bug pointer-events-none fixed left-0 top-0 z-[60] text-text-primary motion-reduce:hidden"
        style={{ opacity: 0 }}
      >
        <BugGlyph />
      </div>

      {mode === "swatter" && (
        <div
          ref={swatterRef}
          className="pointer-events-none fixed left-0 top-0 z-[70]"
          style={{ transform: "translate3d(-100px, -100px, 0)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/fly-swatter.png"
            alt=""
            width={40}
            height={40}
            draggable={false}
            className="block drop-shadow-md transition-transform duration-100 ease-out"
            style={{ transform: swatting ? "rotate(-24deg) scale(0.85)" : "none", transformOrigin: "30% 90%" }}
          />
        </div>
      )}

      {/* Devtools highlight box */}
      <div
        aria-hidden
        className="devtools-box pointer-events-none fixed z-[65]"
        style={
          r
            ? { left: r.left, top: r.top, width: r.width, height: r.height, opacity: 1 }
            : { opacity: 0 }
        }
      />

      {/* Devtools tooltip */}
      {inspect && r && (
        <div
          aria-hidden
          className="devtools-tip pointer-events-none fixed z-[66]"
          style={{
            left: Math.min(Math.max(r.left, 8), window.innerWidth - 180),
            top: tipBelow ? r.bottom + 8 : r.top - 8,
            transform: tipBelow ? "none" : "translateY(-100%)",
          }}
          data-below={tipBelow}
        >
          <div className="whitespace-nowrap">
            <span className="dt-tag">{inspect.tag}</span>
            <span className="dt-class">{inspect.cls}</span>
          </div>
        </div>
      )}

      {feedback && (
        <div
          className="animate-modal-enter pointer-events-none fixed z-[80] rounded-md border border-border bg-surface/95 px-2 py-1 font-mono text-[11px] shadow-lg backdrop-blur"
          style={{ left: feedback.x, top: feedback.y }}
        >
          <span className={feedback.tone}>{feedback.label}</span>
        </div>
      )}

    </>
  );
}
