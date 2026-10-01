export interface Capability {
  id: string;
  title: string;
  lifecycle: string[];
  description: string;
  related: string[];
  icon: string;
}

export interface JourneyMilestone {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  period: string;
  focus: string[];
  summary: string;
  expanded: string;
  skills: string[];
  tools: string[];
  status: "completed" | "current" | "future";
}

export interface Experience {
  id: string;
  organization: string;
  role: string;
  location: string;
  period: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  securityRelevance: string;
  lifecycle: string[];
  expandedSections: {
    title: string;
    items: string[];
  }[];
  lessons: string;
  isSimulated?: boolean;
}

export interface SkillCategory {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  skills: SkillItem[];
}

export interface SkillItem {
  name: string;
  context?: string;
}

export interface Writeup {
  id: string;
  number: string;
  title: string;
  category: string[];
  summary: string;
  tags: string[];
  status: string;
  url: string;
  visualization: "authorization" | "pipeline";
  /** Short terminal-style summary; the last line is shown as the impact. */
  tldr?: string[];
}

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  status: "COMPLETED" | "IN DEVELOPMENT";
  description: string;
  technologies: string[];
  highlights: string[];
  image?: string;
  screenshots?: string[];
  repositoryUrl?: string;
  featured?: boolean;
}

export interface Certification {
  id: string;
  number: string;
  name: string;
  fullName: string;
  category: string;
  verificationUrl?: string;
  status?: string;
}

export interface ResearchArea {
  id: string;
  number: string;
  title: string;
  focus: string[];
  description: string;
}

export interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
}

export interface TerminalLine {
  id: string;
  type: "input" | "output" | "error" | "success" | "info" | "system";
  content: string;
}

export type Mode = "normal" | "breach";

export interface CommandResult {
  lines: TerminalLine[];
  navigate?: string;
}

export interface Command {
  name: string;
  description: string;
  usage?: string;
  execute: (args: string[]) => CommandResult;
}
