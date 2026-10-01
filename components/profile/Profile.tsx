"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE_TABS, type ProfileTab } from "@/lib/data";
import ProfileHeader from "./ProfileHeader";
import Sheet from "./Sheet";
import ContactForm from "@/components/contact/Contact";
import {
  BountyPanel,
  WriteupsPanel,
  FindingDetail,
  ExperiencePanel,
  OverviewPanel,
  ProjectDetail,
  ProjectsPanel,
  WriteupDetail,
  type Selection,
} from "./Panels";

const isTab = (v: string): v is ProfileTab => PROFILE_TABS.some((t) => t.id === v);

export default function Profile({ hasAvatar }: { hasAvatar: boolean }) {
  const [tab, setTab] = useState<ProfileTab>("overview");
  const [selection, setSelection] = useState<Selection>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const goTo = useCallback((next: ProfileTab, scroll = true) => {
    setTab(next);
    history.replaceState(null, "", next === "overview" ? " " : `#${next}`);
    const bar = tabsRef.current;
    if (scroll && bar && bar.getBoundingClientRect().top < 56) {
      window.scrollTo({ top: bar.offsetTop - 56, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const fromHash = () => {
      const h = location.hash.slice(1);
      if (isTab(h)) setTab(h);
    };
    fromHash();
    const onTab = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (isTab(id)) {
        goTo(id, false);
        tabsRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };
    const onContact = () => setContactOpen(true);
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("profile-tab", onTab);
    window.addEventListener("open-contact", onContact);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("profile-tab", onTab);
      window.removeEventListener("open-contact", onContact);
    };
  }, [goTo]);

  // Sliding underline under the active tab.
  useEffect(() => {
    const measure = () => {
      const el = tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${tab}"]`);
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [tab]);

  const closeSheet = useCallback(() => setSelection(null), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  return (
    <>
      <ProfileHeader
        hasAvatar={hasAvatar}
        onContact={() => setContactOpen(true)}
      />

      <div
        ref={tabsRef}
        className="sticky top-14 z-30 mt-6 border-b border-border bg-bg/85 backdrop-blur-md"
      >
        <div role="tablist" aria-label="Profile sections" className="no-scrollbar relative flex overflow-x-auto px-2 sm:px-4">
          {PROFILE_TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              data-tab={t.id}
              aria-selected={tab === t.id}
              aria-controls="profile-panel"
              onClick={() => goTo(t.id)}
              className={`shrink-0 whitespace-nowrap px-3 py-3 font-mono text-[12.5px] lowercase transition-colors sm:px-3.5 ${
                tab === t.id
                  ? "font-medium text-text-primary"
                  : "text-text-dim hover:text-text-secondary"
              }`}
            >
              {t.label}
            </button>
          ))}
          <span
            aria-hidden
            className="absolute bottom-0 h-0.5 rounded-full bg-accent transition-all duration-300 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        </div>
      </div>

      <div
        key={tab}
        id="profile-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="panel-in min-h-[50vh] px-4 py-8 sm:px-6"
      >
        {tab === "overview" && <OverviewPanel onSelect={setSelection} />}
        {tab === "projects" && <ProjectsPanel onSelect={setSelection} />}
        {tab === "experience" && <ExperiencePanel />}
        {tab === "bounty" && <BountyPanel onSelect={setSelection} />}
        {tab === "writeups" && <WriteupsPanel onSelect={setSelection} />}
      </div>

      {selection && (
        <Sheet
          title={
            selection.kind === "project"
              ? "~/projects"
              : selection.kind === "finding"
                ? "~/bug-bounty/findings"
                : "~/write-ups"
          }
          onClose={closeSheet}
        >
          {selection.kind === "project" && <ProjectDetail project={selection.item} />}
          {selection.kind === "writeup" && <WriteupDetail writeup={selection.item} />}
          {selection.kind === "finding" && (
            <FindingDetail finding={selection.item} />
          )}
        </Sheet>
      )}

      {contactOpen && (
        <Sheet title="~/contact" onClose={closeContact} variant="center">
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-text-primary">
            Let&apos;s talk
          </h3>
          <p className="mb-5 mt-1 text-sm text-text-secondary">
            A security problem, a project or an opportunity. Send a note.
          </p>
          <ContactForm />
        </Sheet>
      )}
    </>
  );
}
