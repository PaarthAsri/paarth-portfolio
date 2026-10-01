import { SITE, CV_PATH } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[672px]">
      <div className="frame-x frame-line flex flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-mono text-[11px] text-text-dim">
          © {new Date().getFullYear()} {SITE.name} · built to be broken
        </p>
        <div className="flex items-center gap-4 text-[13px] text-text-dim">
          <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-text-primary">
            GitHub
          </a>
          <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-text-primary">
            Email
          </a>
          <a href={CV_PATH} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-text-primary">
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
}
