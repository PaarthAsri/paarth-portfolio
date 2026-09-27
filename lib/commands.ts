import { Command, TerminalLine } from "./types";
import { ENVIRONMENT_STATUS, ACTIVITY_STATUS, JOURNEY_MILESTONES, EXPERIENCES, SKILL_CATEGORIES, WRITEUPS, PROJECTS, CERTIFICATIONS, RESEARCH_AREAS, CV_PATH } from "./data";
import { getTimestamp, generateId } from "./utils";

function createLine(type: TerminalLine["type"], content: string): TerminalLine {
  return { id: generateId(), type, content };
}

const helpCmd: Command = {
  name: "help",
  description: "Display available commands",
  usage: "help",
  execute: () => ({
    lines: [
      createLine("info", "Available commands:"),
      createLine("output", ""),
      createLine("output", "  about         identity / professional overview"),
      createLine("output", "  whoami        current profile"),
      createLine("output", "  status        system status"),
      createLine("output", "  scan          security surface simulation"),
      createLine("output", "  skills        technical skills / arsenal"),
      createLine("output", "  journey       cybersecurity journey"),
      createLine("output", "  experience    professional history"),
      createLine("output", "  writeups      security research artifacts"),
      createLine("output", "  projects      security projects / builds"),
      createLine("output", "  certifications security credentials"),
      createLine("output", "  research      research areas"),
      createLine("output", "  github        open GitHub profile"),
      createLine("output", "  resume        download CV"),
      createLine("output", "  open <n>      open project detail"),
      createLine("output", "  theme         change interface theme"),
      createLine("output", "  contact       open secure transmission"),
      createLine("output", "  clear         clear terminal"),
    ],
  }),
};

const whoamiCmd: Command = {
  name: "whoami",
  description: "Display identity information",
  usage: "whoami",
  execute: () => ({
    lines: [
      createLine("success", "System Associate @ Infosys"),
      createLine("output", "Independent Security Researcher"),
      createLine("output", "Bug Bounty Hunter"),
      createLine("output", "Application Security / Security Engineering"),
    ],
  }),
};

const aboutCmd: Command = {
  name: "about",
  description: "About this portfolio",
  usage: "about",
  execute: () => ({
    lines: [
      createLine("info", "CYBERSECURITY PROFESSIONAL"),
      createLine("output", ""),
      createLine("output", "Security Engineering"),
      createLine("output", "Application Security"),
      createLine("output", "Security Research"),
      createLine("output", "Security Operations"),
      createLine("output", "Security Automation"),
      createLine("output", ""),
      createLine("output", "CURRENT ROLE:"),
      createLine("output", "System Associate @ Infosys"),
      createLine("output", ""),
      createLine("info", "Navigating to About section..."),
    ],
    navigate: "about",
  }),
};

const skillsCmd: Command = {
  name: "skills",
  description: "Display technical skills and arsenal",
  usage: "skills",
  execute: () => ({
    lines: [
      createLine("info", "SKILLS / ARSENAL"),
      createLine("output", ""),
      ...SKILL_CATEGORIES.flatMap((cat) => [
        createLine("info", `[${cat.number}] ${cat.title.toUpperCase()}`),
        createLine("output", cat.skills.map((s) => s.name).join(" · ")),
        createLine("output", ""),
      ]),
      createLine("info", "Navigating to Skills section..."),
    ],
    navigate: "skills",
  }),
};

const journeyCmd: Command = {
  name: "journey",
  description: "View cyber journey",
  usage: "journey",
  execute: () => {
    const current = JOURNEY_MILESTONES.find((m) => m.status === "current");
    return {
      lines: [
        createLine("info", "CYBER JOURNEY"),
        createLine("output", ""),
        ...JOURNEY_MILESTONES.map((m) =>
          createLine("output", `[${m.number}] ${m.title.toUpperCase()}`)
        ),
        createLine("output", ""),
        createLine("info", `CURRENT: [${current?.number}] ${current?.title.toUpperCase()}`),
        createLine("output", ""),
        createLine("info", "Navigating to Journey section..."),
      ],
      navigate: "journey",
    };
  },
};

const experienceCmd: Command = {
  name: "experience",
  description: "View professional experience",
  usage: "experience",
  execute: () => ({
    lines: [
      createLine("info", "PROFESSIONAL HISTORY"),
      createLine("output", ""),
      ...EXPERIENCES.flatMap((e, i) => [
        createLine("info", `[${String(i + 1).padStart(2, "0")}] ${e.role.toUpperCase()}`),
        createLine("output", `${e.organization}`),
        createLine("output", `${e.period}`),
        createLine("output", `${e.location}`),
        createLine("output", ""),
      ]),
      createLine("info", "Navigating to Experience section..."),
    ],
    navigate: "experience",
  }),
};

const writeupsCmd: Command = {
  name: "writeups",
  description: "List security research artifacts",
  usage: "writeups",
  execute: () => ({
    lines: [
      createLine("info", "RESEARCH ARTIFACTS"),
      createLine("output", ""),
      ...WRITEUPS.map((w) => [
        createLine("info", `[${w.number}] ${w.title.toUpperCase()}`),
        createLine("output", `    ${w.category.join(" · ")}`),
        createLine("output", `    STATUS: ${w.status}`),
        createLine("output", ""),
      ]).flat(),
      createLine("info", "Navigating to Write-ups section..."),
    ],
    navigate: "writeups",
  }),
};

const statusCmd: Command = {
  name: "status",
  description: "Display security environment status",
  usage: "status",
  execute: () => {
    const mode = (document.documentElement.dataset.mode || "normal") as "normal" | "breach";
    const isBreach = mode === "breach";
    const env = ENVIRONMENT_STATUS[mode];

    return {
      lines: [
        createLine("info", "SECURITY ENVIRONMENT"),
        createLine("output", "────────────────────"),
        createLine("output", ""),
        createLine("output", `ENVIRONMENT      ${env.environment}`),
        createLine("output", `MODE             ${isBreach ? "INCIDENT" : "NORMAL"}`),
        createLine(isBreach ? "error" : "success", `POSTURE          ${env.posture}`),
        createLine("output", `MONITORING       ${env.monitoring}`),
        createLine("output", `TERMINAL         ${env.terminal}`),
        createLine("output", `MODULES          ${env.modules}`),
        createLine("output", ""),
        createLine("info", "ACTIVITY"),
        createLine("output", `Navigation       ${ACTIVITY_STATUS.navigation}`),
        createLine("output", `Event Stream     ${ACTIVITY_STATUS.eventStream}`),
        createLine("output", `Interaction      ${ACTIVITY_STATUS.interaction}`),
        createLine("output", `Incident Engine  ${ACTIVITY_STATUS.incidentEngine}`),
        createLine("output", ""),
        createLine("output", `LAST EVENT: ${getTimestamp()}`),
      ],
    };
  },
};

const scanCmd: Command = {
  name: "scan",
  description: "Run security surface scan",
  usage: "scan",
  execute: () => ({
    lines: [
      createLine("info", "INITIALIZING SECURITY SURFACE ANALYSIS"),
      createLine("output", ""),
      createLine("output", "TARGET"),
      createLine("output", "PAARTH://SEC / LOCAL ENVIRONMENT"),
      createLine("output", ""),
      createLine("info", "DISCOVERED"),
      createLine("output", "+-- Navigation layer"),
      createLine("output", "+-- Terminal interface"),
      createLine("output", "+-- Interaction layer"),
      createLine("output", "+-- Incident engine"),
      createLine("output", "+-- Data layer"),
      createLine("output", "+-- Visual system"),
      createLine("output", ""),
      createLine("info", "CHECKING"),
      createLine("output", "Navigation integrity ........ PASS"),
      createLine("output", "Interactive modules ......... PASS"),
      createLine("output", "Terminal state .............. PASS"),
      createLine("output", "Mode controller ............. PASS"),
      createLine("output", "Reduced-motion support ...... PASS"),
      createLine("output", ""),
      createLine("success", "ANALYSIS COMPLETE"),
      createLine("output", ""),
      createLine("output", "SURFACE STATUS"),
      createLine("output", "warnings ........ 00"),
      createLine("output", ""),
      createLine("info", "[ portfolio self-scan ]"),
    ],
  }),
};

const themeCmd: Command = {
  name: "theme",
  description: "Display/change interface theme",
  usage: "theme [cyber|terminal|amber]",
  execute: (args: string[]) => {
    const current = document.documentElement.dataset.theme || "cyber";

    if (args.length === 0) {
      return {
        lines: [
          createLine("info", `CURRENT THEME: ${current.toUpperCase()}`),
          createLine("output", ""),
          createLine("output", "Available themes:"),
          createLine("output", "  cyber"),
          createLine("output", "  terminal"),
          createLine("output", "  amber"),
          createLine("output", ""),
          createLine("output", "Usage:"),
          createLine("output", "  theme terminal"),
          createLine("output", "  theme amber"),
        ],
      };
    }

    const requested = args[0].toLowerCase();
    if (requested !== "cyber" && requested !== "terminal" && requested !== "amber") {
      return {
        lines: [
          createLine("error", `Invalid theme: ${requested}`),
          createLine("output", ""),
          createLine("output", "Available themes:"),
          createLine("output", "  cyber"),
          createLine("output", "  terminal"),
          createLine("output", "  amber"),
        ],
      };
    }

    document.documentElement.dataset.theme = requested;
    localStorage.setItem("theme", requested);

    const themeDescriptions: Record<string, string> = {
      cyber: "Cyan primary — standard security operations",
      terminal: "Green primary — terminal environment",
      amber: "Amber primary — warm security console",
    };

    return {
      lines: [
        createLine("info", `Theme changed to: ${requested.toUpperCase()}`),
        createLine("output", ""),
        createLine("output", themeDescriptions[requested]),
        createLine("output", ""),
        createLine("output", "Interface colors updated."),
      ],
    };
  },
};

const projectsCmd: Command = {
  name: "projects",
  description: "List security projects",
  usage: "projects",
  execute: () => ({
    lines: [
      createLine("info", "SECURITY PROJECTS"),
      createLine("output", ""),
      ...PROJECTS.map((p) =>
        createLine("output", `[${p.number}] ${p.title.toUpperCase()} — ${p.status}`)
      ),
      createLine("output", ""),
      createLine("info", "Navigating to Projects section..."),
    ],
    navigate: "projects",
  }),
};

const certificationsCmd: Command = {
  name: "certifications",
  description: "Display security credentials",
  usage: "certifications",
  execute: () => ({
    lines: [
      createLine("info", "SECURITY CREDENTIALS"),
      createLine("output", ""),
      ...CERTIFICATIONS.flatMap((c) => [
        createLine("info", `[${c.number}] ${c.name.toUpperCase()}`),
        createLine("output", `     ${c.fullName}`),
        createLine("output", ""),
      ]),
      createLine("info", "Navigating to Certifications section..."),
    ],
    navigate: "certifications",
  }),
};

const researchCmd: Command = {
  name: "research",
  description: "Display security research areas",
  usage: "research",
  execute: () => ({
    lines: [
      createLine("info", "SECURITY RESEARCH AREAS"),
      createLine("output", ""),
      ...RESEARCH_AREAS.map((r) =>
        createLine("output", `[${r.number}] ${r.title.toUpperCase()}`)
      ),
      createLine("output", ""),
      createLine("info", "Navigating to Research section..."),
    ],
    navigate: "research",
  }),
};

const githubCmd: Command = {
  name: "github",
  description: "Open GitHub profile",
  usage: "github",
  execute: () => ({
    lines: [
      createLine("info", "GITHUB PROFILE"),
      createLine("output", ""),
      createLine("output", "Opening github.com/PaarthAsri..."),
    ],
    navigate: undefined,
  }),
};

const resumeCmd: Command = {
  name: "resume",
  description: "Download CV",
  usage: "resume",
  execute: () => ({
    lines: [
      createLine("info", "DOWNLOADING CV..."),
      createLine("output", ""),
      createLine("output", `Source: ${CV_PATH}`),
      createLine("success", "Download initiated."),
    ],
    navigate: undefined,
  }),
};

const openCmd: Command = {
  name: "open",
  description: "Open a project detail view",
  usage: "open <number>",
  execute: (args: string[]) => {
    const num = args[0]?.replace(/^0+/, "") || "";
    const project = PROJECTS.find((p) => p.number === `0${num}` || p.number === num);
    if (!project) {
      return {
        lines: [
          createLine("error", `Project not found: ${args[0] || "unknown"}`),
          createLine("output", "Usage: open <number> (e.g., open 01)"),
        ],
      };
    }
    return {
      lines: [
        createLine("info", `PROJECT DOSSIER`),
        createLine("output", ""),
        createLine("output", `[${project.number}] ${project.title.toUpperCase()}`),
        createLine("output", `Status: ${project.status}`),
        createLine("output", `Category: ${project.category}`),
        createLine("output", ""),
        createLine("output", project.description),
        createLine("output", ""),
        createLine("info", "Navigating to project..."),
      ],
      navigate: `project-${project.id}`,
    };
  },
};

const contactCmd: Command = {
  name: "contact",
  description: "Open secure transmission",
  usage: "contact",
  execute: () => ({
    lines: [
      createLine("info", "[SECURE TRANSMISSION]"),
      createLine("output", "Opening communication channel..."),
      createLine("output", ""),
      createLine("output", "Establishing secure connection..."),
      createLine("info", "Navigating to Contact section..."),
    ],
    navigate: "contact",
  }),
};

const clearCmd: Command = {
  name: "clear",
  description: "Clear terminal",
  usage: "clear",
  execute: () => ({ lines: [], navigate: undefined }),
};

export const COMMANDS: Command[] = [
  helpCmd,
  whoamiCmd,
  aboutCmd,
  skillsCmd,
  journeyCmd,
  experienceCmd,
  writeupsCmd,
  projectsCmd,
  certificationsCmd,
  researchCmd,
  statusCmd,
  scanCmd,
  themeCmd,
  githubCmd,
  resumeCmd,
  openCmd,
  contactCmd,
  clearCmd,
];

export function getCommand(name: string): Command | undefined {
  return COMMANDS.find((cmd) => cmd.name === name);
}

export function getCommandSuggestions(partial: string): string[] {
  const lower = partial.toLowerCase();
  return COMMANDS
    .map((cmd) => cmd.name)
    .filter((name) => name.startsWith(lower))
    .slice(0, 3);
}
