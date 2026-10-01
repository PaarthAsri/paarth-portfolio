"use client";

import { useEffect, useRef } from "react";

/*
 * Minimal animated banner: a quiet starfield with flowing contour lines on top.
 * The lines bend away from the cursor and settle back when it leaves.
 * Drawn in the theme's colours: white-on-black (dark) or black-on-white (light).
 */

type Pt = { x: number; y: number };

// Contour bundles follow a cubic Bézier spine; lines are offset along its normal.
const BUNDLES = [
  {
    p: [[0.34, 1.12], [0.62, 0.98], [0.7, 0.32], [1.06, 0.14]] as [number, number][],
    lines: 16, gap: 0.024, amp: 0.05, freq: 3.2, speed: 0.55,
  },
  {
    p: [[0.43, -0.12], [0.56, 0.12], [0.72, 0.06], [0.86, -0.14]] as [number, number][],
    lines: 11, gap: 0.016, amp: 0.035, freq: 4, speed: 0.7,
  },
  // Left side: runs from the pa/sec logo (above the top-left corner) down into
  // the avatar, whose centre sits on the banner's bottom edge at ~12% across.
  // Pinched at both ends, fanned out in the middle.
  {
    p: [[0.07, -0.18], [0.34, 0.22], [-0.06, 0.58], [0.12, 1]] as [number, number][],
    lines: 13, gap: 0.024, amp: 0.035, freq: 2.4, speed: 0.6, converge: true,
  },
];

function bezier(p: Pt[], s: number): { pt: Pt; n: Pt } {
  const u = 1 - s;
  const x = u * u * u * p[0].x + 3 * u * u * s * p[1].x + 3 * u * s * s * p[2].x + s * s * s * p[3].x;
  const y = u * u * u * p[0].y + 3 * u * u * s * p[1].y + 3 * u * s * s * p[2].y + s * s * s * p[3].y;
  const dx = 3 * u * u * (p[1].x - p[0].x) + 6 * u * s * (p[2].x - p[1].x) + 3 * s * s * (p[3].x - p[2].x);
  const dy = 3 * u * u * (p[1].y - p[0].y) + 6 * u * s * (p[2].y - p[1].y) + 3 * s * s * (p[3].y - p[2].y);
  const len = Math.hypot(dx, dy) || 1;
  return { pt: { x, y }, n: { x: -dy / len, y: dx / len } };
}

export default function BannerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let rect = canvas.getBoundingClientRect();
    let stars: { x: number; y: number; r: number; a: number; tw: number; ph: number }[] = [];
    let fg = "#fff";
    let bg = "#000";
    let raf = 0;
    let visible = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();

    // Smoothed cursor: position eases toward the pointer, presence fades in/out.
    const cursor = { x: 0, y: 0, tx: 0, ty: 0, inside: false, presence: 0 };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      fg = cs.getPropertyValue("--color-text-primary").trim() || fg;
      bg = cs.getPropertyValue("--color-bg").trim() || bg;
    };

    const resize = () => {
      rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const count = Math.round((w * h) / 900);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.08 ? 0.9 + Math.random() * 0.6 : 0.25 + Math.random() * 0.45,
        a: 0.3 + Math.random() * 0.6,
        tw: 0.4 + Math.random() * 1.2,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = fg;
      ctx.strokeStyle = fg;

      // Stars: mostly still, with a very soft twinkle.
      for (const s of stars) {
        ctx.globalAlpha = s.a * (0.75 + 0.25 * Math.sin(t * s.tw + s.ph));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cursor distortion field: points near the cursor are pushed away from it.
      const R = h * 0.45;
      const push = h * 0.09 * cursor.presence;
      const bend = (x: number, y: number): [number, number] => {
        if (push <= 0.01) return [x, y];
        const dx = x - cursor.x;
        const dy = y - cursor.y;
        const d = Math.hypot(dx, dy);
        if (d >= R || d < 0.001) return [x, y];
        const f = (1 - d / R) ** 2 * (1 + 0.35 * Math.sin(d * 0.09 - t * 5));
        return [x + (dx / d) * push * f, y + (dy / d) * push * f];
      };

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const b of BUNDLES) {
        const spine = b.p.map(([x, y]) => ({ x: x * w, y: y * h }));
        for (let i = 0; i < b.lines; i++) {
          const outer = i / (b.lines - 1);
          const amp = b.amp * h * (0.25 + outer);
          ctx.globalAlpha = 0.5 + 0.35 * (1 - outer);
          ctx.lineWidth = i % 4 === 0 ? 1.4 : 0.7;
          ctx.beginPath();
          const steps = 110;
          for (let k = 0; k <= steps; k++) {
            const s = k / steps;
            const { pt, n } = bezier(spine, s);
            // Converging bundles are centred on the spine and pinch together at both ends.
            const pinch = "converge" in b ? 0.05 + 0.95 * Math.sin(Math.PI * s) : 1;
            const wave =
              pinch *
              (amp * Math.sin(s * b.freq * Math.PI * 2 + t * b.speed + i * 0.35) +
                amp * 0.45 * Math.sin(s * b.freq * 5.3 - t * b.speed * 0.7 - i * 0.2));
            const lane = "converge" in b ? i - (b.lines - 1) / 2 : i;
            const off = lane * b.gap * h * pinch + wave;
            const [x, y] = bend(pt.x + n.x * off, pt.y + n.y * off);
            if (k === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    let last = start;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      const ease = 1 - Math.exp(-dt * 10);
      cursor.x += (cursor.tx - cursor.x) * ease;
      cursor.y += (cursor.ty - cursor.y) * ease;
      cursor.presence += ((cursor.inside ? 1 : 0) - cursor.presence) * (1 - Math.exp(-dt * 4));
      draw((now - start) / 1000);
    };

    readColors();
    resize();
    draw(0);
    canvas.style.opacity = "1";
    if (!reduce) raf = requestAnimationFrame(loop);

    // Listen on window: the avatar and buttons overlap the banner.
    const onMove = (e: PointerEvent) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= w && y <= h;
      if (inside && !cursor.inside && cursor.presence < 0.05) {
        cursor.x = x;
        cursor.y = y;
      }
      cursor.tx = x;
      cursor.ty = y;
      cursor.inside = inside;
    };
    const onLeave = () => (cursor.inside = false);
    const onScroll = () => (rect = canvas.getBoundingClientRect());
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      resize();
      draw((performance.now() - start) / 1000);
    });
    ro.observe(canvas);

    // Repaint in the new colours when the theme changes.
    const mo = new MutationObserver(() => {
      readColors();
      draw((performance.now() - start) / 1000);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // Pause when the banner is scrolled out of view.
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700"
    />
  );
}
