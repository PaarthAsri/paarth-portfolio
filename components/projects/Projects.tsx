"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import { PROJECTS } from "@/lib/data";
import { Project } from "@/lib/types";

function ProjectIndex({ activeId, onSelect }: { activeId: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="mb-12">
      <p className="text-xs font-mono text-text-dim mb-4">PROJECT INDEX</p>
      <div className="flex flex-wrap gap-2">
        {PROJECTS.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`interactive-tag px-3 py-1.5 text-xs font-mono rounded border transition-all duration-200 ${
              activeId === p.id
                ? "border-cyber-cyan/50 bg-cyber-cyan/10 text-cyber-cyan"
                : "border-border-dim bg-elevated text-text-secondary hover:border-cyber-cyan/30 hover:text-text-primary"
            }`}
          >
            [{p.number}] {p.title.toUpperCase().split(" ").slice(0, 3).join(" ")}
          </button>
        ))}
      </div>
    </div>
  );
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/95 backdrop-blur-sm p-4 animate-overlay-enter"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot viewer"
    >
      <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
        {imageError ? (
          <div className="text-center">
            <p className="text-text-dim font-mono text-sm">IMAGE UNAVAILABLE</p>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="max-w-full max-h-[85vh] object-contain rounded-lg border border-border-dim"
            priority
            sizes="90vw"
            onError={() => setImageError(true)}
          />
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ProjectDetailModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-cyber-cyan/30 rounded-lg bg-panel/95 backdrop-blur-sm animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border-dim bg-void/90 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="font-mono text-cyber-cyan text-sm">PROJECT DOSSIER</span>
            <span className="text-text-dim text-xs">[{project.number}]</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close project details"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Title */}
          <h3 className="font-display text-2xl font-bold text-text-primary mb-1">{project.title}</h3>
          <p className="text-text-dim text-xs font-mono mb-6">{project.category} / {project.status}</p>

          {/* Image */}
          {project.image && !imageError && (
            <div className="relative w-full h-[200px] md:h-[250px] mb-6">
              <Image
                src={project.image}
                alt={`${project.title} screenshot`}
                fill
                className="object-contain rounded border border-border-dim"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <p className="text-xs font-mono text-text-dim mb-2">OBJECTIVE</p>
            <p className="text-text-secondary text-sm leading-relaxed">{project.description}</p>
          </div>

          {/* Capabilities */}
          {project.highlights.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-mono text-text-dim mb-2">KEY CAPABILITIES</p>
              <ul className="space-y-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="text-text-secondary text-sm flex items-start gap-2">
                    <span className="text-cyber-cyan mt-0.5 text-xs">[{String(i + 1).padStart(2, "0")}]</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          <div className="mb-6">
            <p className="text-xs font-mono text-text-dim mb-2">TECHNOLOGY</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-2 py-0.5 text-xs font-mono text-text-secondary bg-elevated rounded border border-border-dim">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Repository */}
          {project.repositoryUrl && (
            <div className="flex items-center gap-3">
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-tag inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 rounded transition-all duration-200 hover:bg-cyber-cyan/20"
              >
                VIEW GITHUB
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectImage({ project, onOpenLightbox }: { project: Project; onOpenLightbox: (src: string) => void }) {
  const [imageError, setImageError] = useState(false);

  if (!project.image || imageError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[250px] md:h-[300px] text-center">
        <div className="w-12 h-12 rounded-lg border border-border-dim bg-elevated flex items-center justify-center mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-dim">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <p className="text-text-dim text-xs font-mono">PROJECT VISUAL</p>
        <p className="text-text-dim/60 text-xs font-mono mt-1">IMAGE UNAVAILABLE</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[250px] md:h-[300px] group">
      <Image
        src={project.image}
        alt={`${project.title} screenshot`}
        fill
        className="object-contain rounded border border-border-dim transition-all duration-300 group-hover:border-cyber-cyan/30"
        onError={() => setImageError(true)}
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={project.featured}
      />
      {project.screenshots && project.screenshots.length > 0 && (
        <button
          onClick={() => onOpenLightbox(project.screenshots![0])}
          className="absolute bottom-3 right-3 px-3 py-1.5 text-xs font-mono text-cyber-cyan bg-void/80 border border-cyber-cyan/30 rounded hover:bg-void transition-all duration-200"
        >
          VIEW SCREENSHOT
        </button>
      )}
    </div>
  );
}

function ProjectPanel({ project, index, onOpenDetail }: { project: Project; index: number; onOpenDetail: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isDev = project.status === "IN DEVELOPMENT";

  if (isDev) {
    return (
      <div
        ref={ref}
        id={`project-${project.id}`}
        className={`border border-border-dim rounded-lg bg-panel/60 backdrop-blur-sm p-6 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-cyber-cyan text-sm">[{project.number}]</span>
          <span className="px-2 py-0.5 text-xs font-mono text-cyber-amber bg-cyber-amber/10 rounded">
            IN DEVELOPMENT
          </span>
        </div>
        <h3 className="font-display text-xl font-semibold text-text-primary mb-2">{project.title}</h3>
        <p className="text-text-secondary text-sm mb-4">{project.description}</p>
        {project.repositoryUrl && (
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-tag inline-block px-4 py-2 text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 rounded transition-all duration-200 hover:bg-cyber-cyan/20"
          >
            VIEW DEVELOPMENT REPOSITORY
          </a>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id={`project-${project.id}`}
      className={`border rounded-lg bg-panel/60 backdrop-blur-sm overflow-hidden transition-all duration-500 cursor-pointer ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${isHovered ? "border-cyber-cyan/40" : "border-border-dim"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpenDetail}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenDetail(); } }}
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} details`}
    >
      {/* Project header */}
      <div className="px-6 py-4 border-b border-border-dim bg-void/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-cyber-cyan text-sm">[{project.number}]</span>
            <h3 className="font-display text-xl font-semibold text-text-primary">{project.title}</h3>
          </div>
          <span className="px-2 py-0.5 text-xs font-mono text-cyber-green bg-cyber-green/10 rounded">
            {project.status}
          </span>
        </div>
        <p className="text-text-dim text-xs font-mono mt-1">{project.category}</p>
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Image */}
        <div className="relative bg-void/50 p-6 min-h-[250px] md:min-h-[300px] flex items-center justify-center">
          <ProjectImage project={project} onOpenLightbox={setLightboxSrc} />
        </div>

        {/* Information */}
        <div className="p-6 flex flex-col">
          <div className="mb-4">
            <p className="text-xs font-mono text-text-dim mb-2">PROJECT OVERVIEW</p>
            <p className="text-text-secondary text-sm leading-relaxed">{project.description}</p>
          </div>

          <div className="mb-4">
            <p className="text-xs font-mono text-text-dim mb-2">KEY CAPABILITIES</p>
            <ul className="space-y-1">
              {project.highlights.slice(0, 4).map((h, i) => (
                <li key={i} className="text-text-secondary text-sm flex items-start gap-2">
                  <span className="text-cyber-cyan mt-0.5">›</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <p className="text-xs font-mono text-text-dim mb-2">TECHNOLOGY</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="interactive-tag px-2 py-0.5 text-xs font-mono text-text-secondary bg-elevated rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-mono text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 rounded">
              VIEW PROJECT DETAILS
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} alt={project.title} onClose={() => setLightboxSrc(null)} />
      )}
    </div>
  );
}

export default function Projects() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  const handleSelect = (id: string) => {
    setActiveId(id);
    document.getElementById(`project-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Section id="projects">
      <SectionHeader number="05" title="Projects" subtitle="Security Projects / Technical Builds" />

      <ProjectIndex activeId={activeId} onSelect={handleSelect} />

      <div className="space-y-8">
        {PROJECTS.map((project, i) => (
          <ProjectPanel key={project.id} project={project} index={i} onOpenDetail={() => setDetailProject(project)} />
        ))}
      </div>

      {/* Project Detail Modal */}
      {detailProject && (
        <ProjectDetailModal project={detailProject} onClose={() => setDetailProject(null)} />
      )}
    </Section>
  );
}
