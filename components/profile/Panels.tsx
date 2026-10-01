"use client";

import { useEffect, useRef, useState } from "react";
import {
  ABOUT_STATEMENT,
  BUG_BOUNTY,
  CERTIFICATIONS,
  EXPERIENCES,
  PROJECTS,
  SKILL_CATEGORIES,
  WRITEUPS,
} from "@/lib/data";
import type { Project, Writeup } from "@/lib/types";
import { Label, Row, StatusDot, Tag } from "./Row";

export type Finding = (typeof BUG_BOUNTY.findings)[number];

export type Selection =
  | { kind: "project"; item: Project }
  | { kind: "writeup"; item: Writeup }
  | { kind: "finding"; item: Finding }
  | null;

const openTab = (id: string) =>
  window.dispatchEvent(new CustomEvent("profile-tab", { detail: id }));

type Select = (s: Selection) => void;

const readTime = (text: string) =>
  `${Math.max(3, Math.round(text.split(/\s+/).length / 12))} min`;

const shortPeriod = (p: string) => p.replace("Present", "now");

/* ── Overview ─────────────────────────────────────────── */

const TOP_SKILLS = [
  "Burp Suite", "Python", "nuclei", "ffuf", "Subfinder", "httpx", "Nmap",
  "Splunk", "Microsoft Sentinel", "Sysmon", "MITRE ATT&CK", "Java", "Selenium", "Linux",
];

export function OverviewPanel({ onSelect }: { onSelect: Select }) {
  const [allSkills, setAllSkills] = useState(false);
  const featured = PROJECTS.find((p) => p.featured) ?? PROJECTS[0];
  const latest = WRITEUPS[0];
  const everySkill = SKILL_CATEGORIES.flatMap((c) => c.skills.map((s) => s.name));
  const rest = everySkill.filter((s) => !TOP_SKILLS.includes(s));

  return (
    <div className="space-y-10">
      <section>
        <Label>About</Label>
        <p className="leading-relaxed text-text-secondary">{ABOUT_STATEMENT}</p>
      </section>

      <section>
        <Label>Highlights</Label>
        <Row
          lead={<StatusDot done={featured.status === "COMPLETED"} />}
          title={featured.title}
          sub={featured.description}
          meta="featured"
          onClick={() => onSelect({ kind: "project", item: featured })}
          inspect={`project.${featured.id}`}
        />
        <Row
          lead={<span className="block h-1.5 w-1.5 rounded-full bg-red-400" />}
          title={`${BUG_BOUNTY.paid} paid bounties`}
          sub={BUG_BOUNTY.summary}
          meta="bug bounty"
          onClick={() => openTab("bounty")}
          inspect="row.bug-bounty"
        />
        {latest && (
          <Row
            lead={<span className="block h-1.5 w-1.5 rounded-full bg-amber-400" />}
            title={latest.title}
            sub="Authorization bypass · public write-up"
            meta="write-up"
            onClick={() => onSelect({ kind: "writeup", item: latest })}
            inspect="writing.case-study"
          />
        )}
      </section>

      <section>
        <Label hint={`${everySkill.length} tools`}>Stack</Label>
        <div className="flex flex-wrap gap-1.5">
          {TOP_SKILLS.map((s) => <Tag key={s}>{s}</Tag>)}
          {!allSkills && (
            <button
              onClick={() => setAllSkills(true)}
              className="rounded-md border border-dashed border-border-light px-2 py-0.5 font-mono text-[11px] text-text-dim transition-colors hover:text-text-primary"
            >
              +{rest.length} more
            </button>
          )}
        </div>
        <div className="expand" data-open={allSkills}>
          <div>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {rest.map((s) => <Tag key={s}>{s}</Tag>)}
            </div>
          </div>
        </div>
      </section>

      <section>
        <Label>Certifications</Label>
        <ul className="space-y-2">
          {CERTIFICATIONS.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-4 text-[15px]">
              <span className="flex items-center gap-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={c.status ? "text-text-dim" : "text-accent"}>
                  <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span className="text-text-primary">{c.name}</span>
                <span className="hidden text-text-dim sm:inline">{c.fullName}</span>
              </span>
              {c.status ? (
                <span className="rounded-full bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] text-amber-500">
                  {c.status}
                </span>
              ) : (
                <span className="font-mono text-[11px] text-text-dim">{c.category}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}

/* ── Projects ─────────────────────────────────────────── */

export function ProjectsPanel({ onSelect }: { onSelect: Select }) {
  return (
    <section>
      <Label hint="click to read">Projects</Label>
      <div>
        {PROJECTS.map((p, i) => (
          <Row
            key={p.id}
            lead={
              <span className="flex w-6 items-center gap-1.5 font-mono text-[11px] text-text-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
            }
            title={
              <span className="flex items-center gap-2">
                <span className="truncate">{p.title}</span>
                <StatusDot done={p.status === "COMPLETED"} />
              </span>
            }
            sub={p.category}
            meta={p.technologies.slice(0, 2).join(" · ")}
            onClick={() => onSelect({ kind: "project", item: p })}
            inspect={`project.${p.id}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ── Experience ───────────────────────────────────────── */

export function ExperiencePanel() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section>
      <Label hint="click to expand">Experience</Label>
      <div className="space-y-1">
        {EXPERIENCES.map((exp, i) => {
          const isOpen = open === exp.id;
          return (
            <div key={exp.id}>
              <Row
                lead={
                  <span
                    className={`block h-8 w-8 rounded-md border border-border bg-surface text-center font-mono text-[11px] leading-8 ${
                      i === 0 ? "text-accent" : "text-text-dim"
                    }`}
                  >
                    {exp.organization.slice(0, 2).toUpperCase()}
                  </span>
                }
                title={exp.organization}
                sub={exp.role}
                meta={shortPeriod(exp.period)}
                expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : exp.id)}
                inspect={`experience.${exp.id}`}
              />
              <div className="expand" data-open={isOpen}>
                <div>
                  <div className="pb-4 pl-11 pt-1">
                    <p className="font-mono text-[11px] text-text-dim sm:hidden">
                      {exp.period}
                    </p>
                    <p className="text-[13px] text-text-dim">
                      {exp.location}
                      {exp.isSimulated ? " · lab / simulated environment" : ""}
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {exp.responsibilities.slice(0, 5).map((r) => (
                        <li key={r} className="flex gap-2 text-sm leading-relaxed text-text-secondary">
                          <span className="font-mono text-accent">›</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {exp.technologies.map((t) => <Tag key={t}>{t}</Tag>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Bug bounty ───────────────────────────────────────── */

export function BountyPanel({ onSelect }: { onSelect: Select }) {
  // "10+" -> count 0..10 then show the "+"; the year counts up from 2004.
  const paid = parseInt(BUG_BOUNTY.paid, 10);
  const stats = [
    { from: 0, to: paid, suffix: BUG_BOUNTY.paid.replace(String(paid), ""), k: "bounties" },
    { from: 2004, to: parseInt(BUG_BOUNTY.since, 10), suffix: "", k: "hunting since" },
  ];

  return (
    <div className="space-y-10">
      <section>
        <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-border">
          {stats.map((st, i) => (
            <div key={st.k} className={`bg-surface p-3.5 ${i ? "border-l border-border" : ""}`}>
              <p className="font-pixel text-2xl tabular-nums text-text-primary">
                <CountUp from={st.from} to={st.to} suffix={st.suffix} />
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-text-dim">{st.k}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Label hint="click to read">Findings</Label>
        {BUG_BOUNTY.findings.map((f) => (
          <Row
            key={f.id}
            lead={<span className="block h-1.5 w-1.5 rounded-full bg-red-400" />}
            title={
              <span className="flex items-center gap-2">
                <span className="truncate">{f.vuln}</span>
                {f.severity && <Severity level={f.severity} />}
              </span>
            }
            sub={f.target}
            meta={f.cwe}
            onClick={() => onSelect({ kind: "finding", item: f })}
            inspect={`finding.${f.cwe.toLowerCase()}`}
          />
        ))}
        <p className="mt-2 font-mono text-[11px] text-text-dim">
          program names and targets are redacted per disclosure policies
        </p>
      </section>

      <p className="font-mono text-[12px] text-text-dim">
        <span className="text-accent">{"> "}</span>currently researching:{" "}
        <span className="text-text-secondary">{BUG_BOUNTY.researching}</span>
      </p>
    </div>
  );
}

export function FindingDetail({ finding: f }: { finding: Finding }) {
  return (
    <article>
      <div className="flex items-center gap-2 font-mono text-[11px] text-text-dim">
        <span className="block h-1.5 w-1.5 rounded-full bg-red-400" />
        reported · {f.cwe}
        {f.severity && <Severity level={f.severity} />}
      </div>
      <h3 className="mt-2 font-pixel text-2xl leading-tight text-text-primary">{f.vuln}</h3>
      <p className="mt-1 text-sm text-text-dim">{f.target}</p>

      <div className="mt-5 rounded-lg border border-border bg-bg p-4 font-mono text-[12px] leading-relaxed">
        <p className="text-text-dim"># the bug</p>
        <p className="text-text-secondary">{f.detail}</p>
        <p className="mt-3 text-text-dim"># impact</p>
        <p className="text-red-400">{f.impact}</p>
      </div>

      <p className="mt-4 text-[13px] text-text-dim">
        Program names and full report details stay private until disclosure is allowed.
      </p>
    </article>
  );
}

/* ── Write-ups & disclosures ─────────────────────────── */

export function WriteupsPanel({ onSelect }: { onSelect: Select }) {
  return (
    <section>
      <Label hint="click to read">Write-ups</Label>
      {WRITEUPS.map((w) => (
        <Row
          key={w.id}
          lead={<span className="block h-1.5 w-1.5 rounded-full bg-amber-400" />}
          title={w.title}
          sub={w.category.join(" · ")}
          meta={`${readTime(w.summary)} read`}
          onClick={() => onSelect({ kind: "writeup", item: w })}
          inspect="writing.case-study"
        />
      ))}
    </section>
  );
}

/** Counts from `from` to `to` once it scrolls into view; the suffix appears at the end. */
function CountUp({ from, to, suffix = "", duration = 1400 }: {
  from: number;
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(from);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = reduce ? 1 : Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 4); // fast start, gentle landing
        setValue(Math.round(from + (to - from) * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [from, to, duration]);

  return (
    <span ref={ref}>
      {value}
      <span className={value === to ? "opacity-100 transition-opacity" : "opacity-0"}>{suffix}</span>
    </span>
  );
}

function Severity({ level }: { level: string }) {
  return (
    <span className="shrink-0 rounded bg-red-500/10 px-1.5 py-px font-mono text-[10px] uppercase text-red-500">
      {level}
    </span>
  );
}

/* ── Detail views (rendered inside the Sheet) ─────────── */

export function ProjectDetail({ project: p }: { project: Project }) {
  return (
    <article>
      {p.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.image}
          alt={`${p.title} screenshot`}
          className="mb-5 w-full rounded-lg border border-border bg-elevated"
        />
      )}
      <div className="flex items-center gap-2 font-mono text-[11px] text-text-dim">
        <StatusDot done={p.status === "COMPLETED"} />
        {p.status === "COMPLETED" ? "shipped" : "in progress"} · {p.category}
      </div>
      <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-text-primary">
        {p.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{p.description}</p>

      {p.highlights.length > 0 && (
        <>
          <h4 className="mb-2 mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-text-dim">
            What it does
          </h4>
          <ul className="space-y-1.5">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-sm leading-relaxed text-text-secondary">
                <span className="font-mono text-accent">›</span>
                {h}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-1.5">
        {p.technologies.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>

      {p.repositoryUrl && (
        <a
          href={p.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-text-primary px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85"
        >
          View source ↗
        </a>
      )}
    </article>
  );
}

export function WriteupDetail({ writeup: w }: { writeup: Writeup }) {
  return (
    <article>
      <div className="font-mono text-[11px] text-text-dim">
        {w.status.toLowerCase()} · {readTime(w.summary)} read
      </div>
      <h3 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.02em] text-text-primary">
        {w.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{w.summary}</p>

      {w.tldr && (
        <div className="mt-5 rounded-lg border border-border bg-bg p-4 font-mono text-[12px] leading-relaxed">
          <p className="text-text-dim"># the bug, in short</p>
          {w.tldr.map((line, i) => (
            <p
              key={line}
              className={i === w.tldr!.length - 1 ? "text-red-400" : "text-text-secondary"}
            >
              {line}
            </p>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-1.5">
        {w.tags.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>

      <a
        href={w.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-text-primary px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-85"
      >
        Read full write-up ↗
      </a>
    </article>
  );
}
