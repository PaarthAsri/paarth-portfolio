"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Project } from "@/lib/types";

export default function ProjectDetail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm p-4 animate-overlay-enter"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-border rounded-lg bg-surface animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-surface/95 backdrop-blur-sm">
          <span className="font-mono text-xs text-text-dim">PROJECT</span>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <h3 className="font-display text-2xl font-bold text-text-primary mb-1">
            {project.title}
          </h3>
          <p className="text-sm text-text-dim mb-6">
            {project.category} · {project.status}
          </p>

          {project.image && !imageError && (
            <div className="relative w-full h-48 mb-6 rounded border border-border overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}

          <div className="space-y-5">
            <div>
              <p className="text-xs font-mono text-text-dim mb-2">OBJECTIVE</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.highlights.length > 0 && (
              <div>
                <p className="text-xs font-mono text-text-dim mb-2">KEY CAPABILITIES</p>
                <ul className="space-y-1.5">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="text-accent mt-0.5 text-xs">[{String(i + 1).padStart(2, "0")}]</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-xs font-mono text-text-dim mb-2">TECHNOLOGY</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs font-mono text-text-secondary bg-elevated rounded border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.repositoryUrl && project.status !== "IN DEVELOPMENT" && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
              >
                View on GitHub
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
