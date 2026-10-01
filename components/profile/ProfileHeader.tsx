"use client";

import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { SITE, CV_PATH, PROJECTS, CERTIFICATIONS, BUG_BOUNTY } from "@/lib/data";
import BannerCanvas from "./BannerCanvas";

const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

function Banner() {
  return (
    <div className="relative aspect-[3/1] w-full overflow-hidden border-b border-border bg-bg">
      <BannerCanvas />
    </div>
  );
}

function Avatar({ hasImage }: { hasImage: boolean }) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const check = () => setIsLight(document.documentElement.dataset.theme === "light");
    check();
    const mo = new MutationObserver(check);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const avatarSrc = isLight ? "/assets/dp-light.png" : "/assets/dp.jpeg";

  const face: ReactNode = hasImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={avatarSrc} alt={SITE.name} className="h-full w-full object-cover" />
  ) : (
    <span className="flex h-full w-full items-center justify-center bg-elevated font-mono text-2xl font-medium text-accent">
      {SITE.initials}
    </span>
  );

  return (
    <div className="glitch relative h-24 w-24 overflow-hidden rounded-full bg-bg ring-4 ring-bg sm:h-28 sm:w-28">
      {face}
      <span className="glitch-layer r" aria-hidden>{face}</span>
      <span className="glitch-layer b" aria-hidden>{face}</span>
      <span className="glitch-scan" />
    </div>
  );
}

function LocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: SITE.timezone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return <>{time ? `${time} IST` : "IST"}</>;
}

const Icon = ({ d }: { d: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d={d} />
  </svg>
);

const BRAND: Record<string, string> = {
  github:
    "M12 .5a11.5 11.5 0 00-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 015.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0012 .5z",
  linkedin:
    "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  x: "M18.9 1.2h3.7l-8 9.2 9.4 12.4h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9zm-1.3 19.4h2L6.5 3.2H4.3l13.3 17.4z",
};

let viewsRequest: Promise<{ views: number | null } | null> | null = null;

/** Counts each browser once, so the total approximates unique visitors. */
function useProfileViews() {
  const [views, setViews] = useState<number | null>(null);
  useEffect(() => {
    let counted = false;
    try {
      counted = localStorage.getItem("pv-counted") === "1";
    } catch {}
    // Shared promise: one request per page load, even if the effect runs twice.
    viewsRequest ??= fetch("/api/views", { method: counted ? "GET" : "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
    viewsRequest
      .then((d) => {
        if (typeof d?.views !== "number") return;
        setViews(d.views);
        if (!counted) {
          try {
            localStorage.setItem("pv-counted", "1");
          } catch {}
        }
      });
  }, []);
  return views;
}

const compact = (n: number) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);


export default function ProfileHeader({
  onContact,
  hasAvatar,
}: {
  onContact: () => void;
  hasAvatar: boolean;
}) {
  const views = useProfileViews();
  const stats = [
    { n: BUG_BOUNTY.disclosures, label: "Disclosures" },
    { n: PROJECTS.length, label: "Projects" },
    { n: CERTIFICATIONS.length, label: "Certifications" },
  ];

  const links = [
    { label: "GitHub", icon: "github", href: SITE.github },
    { label: "LinkedIn", icon: "linkedin", href: SITE.linkedin },
    ...(SITE.x ? [{ label: "X", icon: "x", href: SITE.x }] : []),
  ];

  return (
    <section id="profile" aria-label="Profile">
      <Banner />

      <div className="px-4 sm:px-6">
        <div className="flex items-end justify-between">
          <div className="rise-in -mt-12 sm:-mt-14" style={stagger(0)}>
            <Avatar hasImage={hasAvatar} />
          </div>

          <div className="rise-in flex items-center gap-2 pt-3" style={stagger(1)}>
            <a
              href={CV_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="slide-btn flex h-8 items-center gap-2 rounded-md border border-border bg-surface px-2.5 font-mono text-[12px] text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
              data-bug-inspect="a.resume"
            >
              <Icon d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8zM14 3v5h5M9 13h6M9 17h6" />
              resume
            </a>
            <button
              onClick={onContact}
              className="slide-btn h-8 rounded-md border border-text-primary bg-text-primary px-3 font-mono text-[12px] font-medium text-bg transition-colors [--slide-bg:var(--color-accent)] hover:border-accent"
              data-bug-inspect="button.contact"
            >
              Contact
            </button>
          </div>
        </div>

        <div className="rise-in mt-3" style={stagger(2)}>
          <h1 className="flex items-center gap-2 font-pixel text-[28px] leading-tight text-text-primary">
            {SITE.name}
            <svg width="20" height="20" viewBox="0 0 24 24" aria-label="Verified" className="text-accent">
              <path fill="currentColor" d="M12 2l7.5 3v6.1c0 4.7-3.2 8.8-7.5 10.1-4.3-1.3-7.5-5.4-7.5-10.1V5z" />
              <path d="M8.5 12.2l2.4 2.3 4.6-4.8" fill="none" stroke="var(--color-bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </h1>
          <p className="font-mono text-[12px] text-text-dim">
            {SITE.handle} <span className="text-border-light">|</span>{" "}
            <span className="shimmer">{SITE.status}</span>
          </p>
        </div>

        <p className="rise-in mt-3 text-[15px] leading-relaxed text-text-secondary" style={stagger(3)}>
          <span className="text-text-primary">Security engineer & bug bounty hunter.</span>{" "}
          I{" "}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("break-page"))}
            title="don't."
            data-bug-inspect="button.break"
            className="relative inline-block cursor-pointer font-mono text-[0.95em] leading-none text-accent transition-opacity hover:opacity-80"
          >
            break()
            <svg className="scribble absolute -bottom-1.5 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden>
              <path d="M2 6 C 25 2, 50 9, 98 4" fill="none" stroke="var(--color-accent)" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>{" "}
          apps to find security bugs before attackers do.
        </p>

        <ul className="rise-in mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-text-dim" style={stagger(4)}>
          <li className="flex items-center gap-1.5">
            <Icon d="M4 7h16v12H4zM9 7V5h6v2" />
            {SITE.company}
          </li>
          <li className="flex items-center gap-1.5">
            <Icon d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
            {SITE.location}
          </li>
          <li className="flex items-center gap-1.5">
            <Icon d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2" />
            <LocalTime />
          </li>
          <li className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {SITE.availability}
          </li>
        </ul>

        <nav aria-label="Links" className="rise-in mt-3 flex flex-wrap gap-2" style={stagger(5)}>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              data-bug-inspect={`a.${l.icon}`}
              className="slide-btn flex h-8 items-center gap-2 rounded-md border border-border bg-surface px-2.5 font-mono text-[12px] text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d={BRAND[l.icon]} />
              </svg>
              {l.label}
            </a>
          ))}
          <a
            href={`mailto:${SITE.email}`}
            data-bug-inspect="a.email"
            className="slide-btn flex h-8 items-center gap-2 rounded-md border border-border bg-surface px-2.5 font-mono text-[12px] text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Icon d="M3 5h18v14H3zM3 7l9 6 9-6" />
            Email
          </a>
        </nav>

        <p className="rise-in mt-3 flex flex-wrap gap-x-4 text-[13px] text-text-dim" style={stagger(6)}>
          {stats.map((s) => (
            <span key={s.label}>
              <span className="font-semibold text-text-primary">{s.n}</span> {s.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5" title="Unique profile views">
            <Icon d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z" />
            <span className="font-semibold text-text-primary tabular-nums">
              {views === null ? "…" : compact(views)}
            </span>{" "}
            Profile views
          </span>
        </p>
      </div>
    </section>
  );
}
