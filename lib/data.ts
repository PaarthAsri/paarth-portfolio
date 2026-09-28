import { NavItem, Capability, JourneyMilestone, Experience, SkillCategory, Writeup, Project, Certification, ResearchArea } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Journey", href: "#journey" },
  { label: "Experience", href: "#experience" },
  { label: "Research", href: "#research" },
  { label: "Write-ups", href: "#writeups" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export const CV_PATH = "/resume.pdf";

export const CERTIFICATIONS: Certification[] = [
  {
    id: "cert1",
    number: "01",
    name: "ISC2 CC",
    fullName: "Certified in Cybersecurity",
    category: "Security Foundation",
  },
  {
    id: "cert2",
    number: "02",
    name: "ISO/IEC 27001",
    fullName: "Information Security Associate",
    category: "Information Security",
  },
];

export const RESEARCH_AREAS: ResearchArea[] = [
  {
    id: "r1",
    number: "01",
    title: "Application Security",
    focus: ["Authentication", "Authorization", "API Security", "Web Application Security"],
    description: "Analyzing application-layer security, authentication mechanisms, authorization logic, and API security controls.",
  },
  {
    id: "r2",
    number: "02",
    title: "Vulnerability Research",
    focus: ["Vulnerability Discovery", "Security Testing", "Responsible Disclosure", "Bug Bounty Research"],
    description: "Discovering, validating, and responsibly disclosing security vulnerabilities through controlled research and testing.",
  },
  {
    id: "r3",
    number: "03",
    title: "Security Monitoring & Detection",
    focus: ["SIEM", "Sysmon", "Detection Logic", "Event Investigation"],
    description: "Working with security telemetry, SIEM platforms, detection logic, and security event investigation workflows.",
  },
  {
    id: "r4",
    number: "04",
    title: "Security Automation",
    focus: ["Python", "Security Tooling", "Testing Automation", "Security Workflows"],
    description: "Building security tools, automating validation workflows, and engineering repeatable security testing processes.",
  },
  {
    id: "r5",
    number: "05",
    title: "Security Engineering",
    focus: ["Security Validation", "Application Analysis", "Remediation Verification", "Security-focused Engineering"],
    description: "Validating security controls, analyzing application security posture, verifying remediation, and engineering security-focused solutions.",
  },
];

export const IDENTITY = {
  name: "Paarth Asri",
  role: "Cybersecurity | Security Engineering | Application Security",
  tagline: "Security Research / Security Operations / Security Engineering",
  location: "India",
  status: "Available for Opportunities",
};

export const ABOUT_STATEMENT =
  "I approach cybersecurity as an engineering discipline — understanding how systems fail, how those failures are detected, and how they can be validated and improved.";

export const ABOUT_INTRO =
  "I am a cybersecurity-focused professional working as a System Associate at Infosys, combining enterprise application testing and automation with a growing focus on application security, security research, and security engineering.";

export const ABOUT_IDENTITY = {
  role: "Cybersecurity Professional",
  focus: ["Security Engineering", "Application Security", "Security Research"],
  status: "ACTIVE",
};

export const CURRENT_ROLE = {
  role: "System Associate",
  organization: "Infosys",
  location: "Bangalore, India",
  period: "2025 — Present",
  focus:
    "Enterprise application testing, automation, and security-focused validation across web applications and APIs.",
  detail:
    "Working in an enterprise SAP environment with a focus on automation testing and improving test execution efficiency rather than relying primarily on manual testing.",
};

export const CAPABILITIES: Capability[] = [
  {
    id: "research",
    title: "Security Research",
    lifecycle: ["DISCOVER", "VALIDATE"],
    description:
      "Finding, validating, and understanding security weaknesses through bug bounty, vulnerability research, and security testing.",
    related: ["Write-ups", "Research"],
    icon: "search",
  },
  {
    id: "operations",
    title: "Security Operations",
    lifecycle: ["INVESTIGATE", "DETECT", "REMEDIATE"],
    description:
      "Investigating security events, analyzing threats, and working with detection and response workflows.",
    related: ["Detection Engineering", "Research"],
    icon: "shield",
  },
  {
    id: "engineering",
    title: "Security Engineering",
    lifecycle: ["REMEDIATE", "VERIFY", "AUTOMATE"],
    description:
      "Building security tools, automating validation, and engineering remediation into practical systems.",
    related: ["Projects", "Automation"],
    icon: "wrench",
  },
];

export const LIFECYCLE_STAGES = [
  "DISCOVER",
  "VALIDATE",
  "INVESTIGATE",
  "DETECT",
  "REMEDIATE",
  "VERIFY",
  "AUTOMATE",
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "prog-eng",
    number: "01",
    title: "Programming & Engineering",
    subtitle: "Development · Automation · Testing",
    skills: [
      { name: "Python" },
      { name: "Java" },
      { name: "JavaScript" },
      { name: "SQL" },
      { name: "HTML / CSS" },
      { name: "Spring Boot" },
      { name: "Django" },
      { name: "Selenium", context: "Test Automation" },
      { name: "Cucumber", context: "BDD Testing" },
      { name: "TestNG", context: "Test Framework" },
      { name: "Maven", context: "Build Tool" },
      { name: "UFT", context: "Functional Testing" },
      { name: "ExtentReports", context: "Test Reporting" },
    ],
  },
  {
    id: "sec-det",
    number: "02",
    title: "Security & Detection",
    subtitle: "Application Security · Monitoring · Investigation",
    skills: [
      { name: "Application Security" },
      { name: "Authentication / Authorization" },
      { name: "API Security" },
      { name: "Vulnerability Research" },
      { name: "SIEM", context: "Log Analysis" },
      { name: "Security Monitoring" },
      { name: "Incident Investigation" },
      { name: "MITRE ATT&CK", context: "Threat Framework" },
      { name: "Sysmon", context: "Endpoint Telemetry" },
      { name: "KQL", context: "Query Language" },
    ],
  },
  {
    id: "sec-tools",
    number: "03",
    title: "Security Tooling / Recon",
    subtitle: "Offensive · Defensive · Research",
    skills: [
      { name: "Burp Suite", context: "Web Testing" },
      { name: "Nmap", context: "Network Scanning" },
      { name: "Splunk", context: "SIEM Platform" },
      { name: "Microsoft Sentinel", context: "Cloud SIEM" },
      { name: "Subfinder", context: "Subdomain Enum" },
      { name: "Amass", context: "Attack Surface" },
      { name: "httpx", context: "HTTP Toolkit" },
      { name: "ffuf", context: "Web Fuzzing" },
      { name: "nuclei", context: "Vulnerability Scan" },
      { name: "Shodan", context: "IoT Search" },
      { name: "Maltego", context: "OSINT" },
      { name: "SpiderFoot", context: "Recon Automation" },
    ],
  },
  {
    id: "infra",
    number: "04",
    title: "Infrastructure / Environment",
    subtitle: "Cloud · Systems · Version Control",
    skills: [
      { name: "Linux" },
      { name: "WSL" },
      { name: "AWS" },
      { name: "Google Cloud" },
      { name: "Cloudflare" },
      { name: "Git" },
      { name: "GitHub" },
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    number: "01",
    title: "JWT Security Auditor",
    category: "Application Security",
    status: "COMPLETED",
    description:
      "A Python CLI security auditing tool that analyzes JWT structure, claims, signing configuration, and common security indicators, producing evidence-based findings, severity information, remediation guidance, and risk scoring.",
    technologies: ["Python", "JWT", "CLI", "Security Analysis"],
    highlights: [
      "JWT structure analysis and Base64URL validation",
      "Algorithm and header security checks (alg:none, jku, x5u, jwk, kid)",
      "Claim analysis (exp, nbf, iat, iss, aud, sub)",
      "Sensitive data exposure detection",
      "Optional offline HMAC secret testing",
      "0-100 risk scoring with severity findings",
      "Text, JSON, and HTML report output",
      "CI security gating with exit codes",
    ],
    image: "/projects/jwt-security-auditor/primary.png",
    screenshots: [
      "/projects/jwt-security-auditor/primary.png",
      "/projects/jwt-security-auditor/screenshot-2.png",
    ],
    repositoryUrl: "https://github.com/PaarthAsri/jwt-security-auditor",
    featured: true,
  },
  {
    id: "p2",
    number: "02",
    title: "Advanced Phishing Email Detection System",
    category: "Machine Learning / NLP",
    status: "COMPLETED",
    description:
      "A comprehensive solution for detecting and analyzing phishing emails using advanced machine learning and natural language processing techniques.",
    technologies: ["Python", "Machine Learning", "NLP", "Web Interface"],
    highlights: [
      "Email header analysis",
      "Content-based phishing detection",
      "URL inspection and validation",
      "Behavioral pattern analysis",
      "Real-time threat assessment",
      "User-friendly web interface",
      "Detailed analysis reports",
    ],
    image: "/projects/phishing-email-detection/primary.png",
    screenshots: ["/projects/phishing-email-detection/primary.png"],
    repositoryUrl: "https://github.com/PaarthAsri/Email-Phising-Detection-System",
  },
  {
    id: "p3",
    number: "03",
    title: "Security Monitoring & Detection Environment",
    category: "Security Operations",
    status: "COMPLETED",
    description:
      "A self-built security monitoring environment involving security telemetry, monitoring, investigation, and detection workflows using Windows telemetry, Sysmon, and SIEM platforms.",
    technologies: ["Sysmon", "Splunk", "Microsoft Sentinel", "Windows Telemetry", "SIEM"],
    highlights: [
      "Windows telemetry collection and analysis",
      "Sysmon deployment and configuration",
      "SIEM platform integration (Splunk, Sentinel)",
      "Security event analysis and correlation",
      "Detection engineering workflows",
      "Incident investigation procedures",
      "Simulated security activity monitoring",
    ],
    image: "/projects/security-monitoring/primary.png",
    screenshots: ["/projects/security-monitoring/primary.png"],
  },
  {
    id: "p4",
    number: "04",
    title: "BeEF Browser Exploitation — Ethical Security Demonstration",
    category: "Security Research",
    status: "COMPLETED",
    description:
      "A controlled browser-exploitation demonstration using BeEF, Bettercap, Metasploit, and OWASP ZAP in a Kali Linux attacker environment with a Windows VM target.",
    technologies: ["BeEF", "Bettercap", "Metasploit", "OWASP ZAP", "Kali Linux"],
    highlights: [
      "Browser hooking and control via BeEF",
      "Session hijacking and cookie theft demonstration",
      "Keylogging and social engineering concepts",
      "MITM injection using Bettercap",
      "Post-exploitation integration with Metasploit",
      "Web vulnerability scanning with OWASP ZAP",
      "Controlled ethical security research environment",
    ],
    image: "/projects/beef-exploitation/primary.png",
    screenshots: [
      "/projects/beef-exploitation/primary.png",
    ],
    repositoryUrl: "https://github.com/PaarthAsri/beef-exploitation",
  },
  {
    id: "p5",
    number: "05",
    title: "Keylogger — Security Research / Controlled Demonstration",
    category: "Security Research",
    status: "COMPLETED",
    description:
      "A Python-based keylogger built for security research and educational purposes, demonstrating endpoint monitoring concepts and defensive awareness.",
    technologies: ["Python", "pynput", "pygetwindow"],
    highlights: [
      "Keystroke logging with timestamps",
      "Active window tracking",
      "Local log storage",
      "Background operation",
      "Endpoint monitoring concept demonstration",
      "Defensive awareness and detection research",
    ],
    image: "/projects/keylogger/primary.jpg",
    screenshots: ["/projects/keylogger/primary.jpg"],
    repositoryUrl: "https://github.com/PaarthAsri/Keylogger",
  },
  {
    id: "p6",
    number: "06",
    title: "SecureCI",
    category: "Security Engineering",
    status: "IN DEVELOPMENT",
    description:
      "Security-focused CI/CD project currently under development.",
    technologies: ["CI/CD", "Security"],
    highlights: [],
    repositoryUrl: "https://github.com/PaarthAsri/SecureCI",
  },
];

export const WRITEUPS: Writeup[] = [
  {
    id: "wu1",
    number: "01",
    title: "I Wasn't Allowed to See This Data. Search Found It Anyway.",
    category: ["Authorization", "Application Security", "Responsible Disclosure"],
    summary:
      "An anonymized responsible-disclosure write-up about a global search authorization bypass that exposed private record-level data. The issue involved a permission mismatch where record search used task-level permissions instead of record-level permissions.",
    tags: ["Authorization", "Application Security", "Responsible Disclosure", "Bug Bounty"],
    status: "PUBLISHED",
    url: "https://github.com/PaarthAsri/search-permission-writeup",
    visualization: "authorization",
  },
];

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    id: "j1",
    number: "01",
    title: "Technical Foundation",
    subtitle: "Programming & Development",
    period: "Early Learning · College",
    focus: ["PROGRAMMING", "DEVELOPMENT"],
    summary:
      "Started with programming and software development, building foundations in Java, web development, and databases.",
    expanded:
      "Built projects including a Java Quiz App and Django-based E-commerce Application. Established core software development practices and problem-solving skills.",
    skills: ["Java", "Web Development", "Databases"],
    tools: ["Java", "Django", "SQL"],
    status: "completed",
  },
  {
    id: "j2",
    number: "02",
    title: "Cybersecurity Fundamentals",
    subtitle: "ISC2 CC & Security Theory",
    period: "Cybersecurity Fundamentals",
    focus: ["SECURITY FUNDAMENTALS", "THEORY"],
    summary:
      "Moved from general software development into cybersecurity and completed the ISC2 Certified in Cybersecurity (CC) certification.",
    expanded:
      "Built a theoretical foundation in networking, security concepts, threats, vulnerabilities, and risk. This phase focused primarily on security theory and foundational knowledge.",
    skills: ["Networking", "Security Concepts", "Risk"],
    tools: ["ISC2 CC"],
    status: "completed",
  },
  {
    id: "j3",
    number: "03",
    title: "Theory → Practice",
    subtitle: "Linux · Labs · Bug Bounty",
    period: "Practical Security",
    focus: ["LINUX", "LABS", "SECURITY RESEARCH"],
    summary:
      "After building a cybersecurity foundation, moved into hands-on learning through Linux, virtual machines, security labs, and practical security testing.",
    expanded:
      "This was also the beginning of exploring bug bounty and vulnerability research. The transition from primarily theoretical learning to practical security work.",
    skills: ["Linux", "Security Labs", "Bug Bounty"],
    tools: ["Linux", "Virtual Machines", "Security Labs"],
    status: "completed",
  },
  {
    id: "j4",
    number: "04",
    title: "Security Labs",
    subtitle: "SIEM · Logs · Detection",
    period: "Home Lab · Detection & Monitoring",
    focus: ["SIEM", "LOG ANALYSIS", "DETECTION"],
    summary:
      "Developed practical labs into a dedicated security environment focused on log analysis, security monitoring, and detection.",
    expanded:
      "Worked with telemetry and tools such as Splunk while learning how security operations differ across detection and analysis workflows.",
    skills: ["SIEM", "Log Analysis", "Detection"],
    tools: ["Splunk", "Sysmon", "Log Analysis"],
    status: "completed",
  },
  {
    id: "j5",
    number: "05",
    title: "Engineering & Automation",
    subtitle: "Testing · Automation · Bug Bounty",
    period: "Professional Engineering",
    focus: ["AUTOMATION", "TESTING", "BUG BOUNTY"],
    summary:
      "While continuing the cybersecurity journey, entered the industry through an engineering/testing role and expanded into test automation.",
    expanded:
      "Worked with Selenium, UFT, Spring Boot, and TestNG while continuing bug-bounty learning alongside professional engineering work.",
    skills: ["Test Automation", "Selenium", "Spring Boot"],
    tools: ["Selenium", "UFT", "TestNG", "Maven", "Spring Boot"],
    status: "completed",
  },
  {
    id: "j6",
    number: "06",
    title: "Security Engineering",
    subtitle: "Research · Bug Bounty · Tool Building",
    period: "Current · Research & Tool Building",
    focus: ["SECURITY RESEARCH", "TOOL BUILDING", "BUG BOUNTY"],
    summary:
      "Now combining cybersecurity, engineering, and security research through hands-on projects and continued bug-bounty work.",
    expanded:
      "Currently building security tooling such as JWT Security Auditor while progressing from finding vulnerabilities toward understanding, validating, and improving security.",
    skills: ["Security Research", "Tool Building", "Bug Bounty"],
    tools: ["JWT Security Auditor", "Security Tools", "Bug Bounty"],
    status: "current",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: "exp1",
    organization: "Infosys",
    role: "System Associate",
    location: "Bangalore, India",
    period: "2025 — Present",
    summary: "Enterprise SAP environment · Automation Testing",
    responsibilities: [
      "Enterprise application testing",
      "Automation testing",
      "Functional testing",
      "SAP application testing",
      "SAP integration testing",
      "Designing and executing automated test cases",
      "Improving test execution efficiency",
      "Reducing reliance on repetitive manual testing",
      "Web application testing",
      "API validation",
      "Investigating defects and unexpected application behavior",
      "Working with enterprise software testing workflows",
    ],
    technologies: [
      "Java",
      "Selenium",
      "Cucumber",
      "TestNG",
      "Maven",
      "Spring Boot",
      "UFT",
      "ExtentReports",
    ],
    securityRelevance:
      "The role contributes to the broader understanding of application behavior, validation, testing, automation, and security-focused application analysis.",
    lifecycle: ["VALIDATE", "VERIFY", "AUTOMATE"],
    expandedSections: [
      {
        title: "Responsibilities",
        items: [
          "Enterprise application testing",
          "Automation testing",
          "Functional testing",
          "SAP application testing",
          "SAP integration testing",
          "Designing and executing automated test cases",
          "Improving test execution efficiency",
          "Reducing reliance on repetitive manual testing",
          "Web application testing",
          "API validation",
          "Investigating defects and unexpected application behavior",
          "Working with enterprise software testing workflows",
        ],
      },
      {
        title: "Technology",
        items: [
          "Java",
          "Selenium",
          "Cucumber",
          "TestNG",
          "Maven",
          "Spring Boot",
          "UFT",
          "CSV / Excel-based test data",
          "ExtentReports",
        ],
      },
    ],
    lessons:
      "Working in an enterprise environment has helped me understand how software is developed, tested, automated, and maintained at scale. It has also strengthened my interest in connecting software engineering and testing practices with application security and security engineering.",
  },
  {
    id: "exp2",
    organization: "DigiSuraksha Parhari Foundation",
    role: "Cybersecurity Intern",
    location: "Delhi, India",
    period: "Apr 2025 — May 2025",
    summary: "Adversary Simulation · Security Monitoring",
    isSimulated: true,
    responsibilities: [
      "Trained in adversary simulation and red-team tradecraft using Metasploit, BeEF, Bettercap, and SQLmap against a simulated enterprise environment",
      "Mapped executed attack chains to MITRE ATT&CK including Initial Access, Credential Access, and Persistence",
      "Studied detection from the attacker's side by analyzing Wireshark/PCAP traffic and Splunk/Sentinel telemetry generated by simulated attacks",
      "Analyzed authentication failures, port scans, and anomalous DNS activity across 50+ lab endpoints",
      "Reviewed 20+ simulated incident scenarios weekly, documenting attacker behavior and impact in practical incident write-ups",
    ],
    technologies: [
      "Metasploit",
      "BeEF",
      "Bettercap",
      "SQLmap",
      "Wireshark",
      "Splunk",
      "Microsoft Sentinel",
    ],
    securityRelevance:
      "Provided hands-on experience with both offensive and defensive security operations in a controlled lab environment, including adversary simulation, network traffic analysis, and security monitoring.",
    lifecycle: ["DISCOVER", "VALIDATE", "INVESTIGATE", "DETECT"],
    expandedSections: [
      {
        title: "Adversary Simulation",
        items: [
          "Trained in adversary simulation and red-team tradecraft",
          "Used Metasploit, BeEF, Bettercap, and SQLmap",
          "Executed attack chains in simulated enterprise environment",
          "Mapped attacks to MITRE ATT&CK framework",
        ],
      },
      {
        title: "Detection Analysis",
        items: [
          "Analyzed Wireshark/PCAP traffic from simulated attacks",
          "Reviewed Splunk/Sentinel telemetry",
          "Identified authentication failures, port scans, anomalous DNS",
          "Monitored 50+ lab endpoints",
        ],
      },
      {
        title: "Incident Scenarios",
        items: [
          "Reviewed 20+ simulated incident scenarios weekly",
          "Documented attacker behavior and impact",
          "Wrote practical incident write-ups",
          "Analyzed attack chains and detection opportunities",
        ],
      },
    ],
    lessons:
      "This experience provided practical exposure to both sides of security — understanding how attacks are executed and how they can be detected. The simulated lab environment allowed safe exploration of adversary techniques and defensive analysis.",
  },
  {
    id: "exp3",
    organization: "IBM",
    role: "Frontend Web Development Intern",
    location: "Delhi, India",
    period: "Jul 2024 — Aug 2024",
    summary: "Frontend Web Development · IBM SkillsBuild",
    responsibilities: [
      "Successfully completed the IBM SkillsBuild Internship Program",
      "Enhanced web development skills using HTML, CSS, and JavaScript",
      "Applied responsive web design principles",
      "Gained familiarity with web development tools and frameworks",
      "Worked with the Django framework",
    ],
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "Django",
      "Responsive Design",
    ],
    securityRelevance:
      "Built an early foundation in web application development and frontend technologies, contributing to the later transition toward application security.",
    lifecycle: ["VALIDATE"],
    expandedSections: [
      {
        title: "Web Development",
        items: [
          "Successfully completed the IBM SkillsBuild Internship Program",
          "Enhanced web development skills using HTML, CSS, and JavaScript",
          "Applied responsive web design principles",
          "Gained familiarity with web development tools and frameworks",
          "Worked with the Django framework",
        ],
      },
      {
        title: "Technologies",
        items: [
          "HTML",
          "CSS",
          "JavaScript",
          "Django",
          "Responsive Design",
        ],
      },
    ],
    lessons:
      "Developed practical foundations in frontend web development, responsive design, and web application frameworks while gaining early exposure to structured technical development workflows.",
  },
];

export const SYSTEM_STATUS = {
  normal: {
    systemStatus: "OPERATIONAL",
    threatLevel: "LOW",
    network: "STABLE",
    mode: "NORMAL",
  },
  breach: {
    systemStatus: "SIMULATED INCIDENT",
    threatLevel: "CRITICAL",
    network: "DEGRADED",
    mode: "INCIDENT",
  },
};

export const ENVIRONMENT_STATUS = {
  normal: {
    environment: "PORTFOLIO SANDBOX",
    posture: "OPERATIONAL",
    monitoring: "ACTIVE",
    terminal: "READY",
    modules: "9 COMMANDS LOADED",
  },
  breach: {
    environment: "PORTFOLIO SANDBOX",
    posture: "SIMULATED INCIDENT",
    monitoring: "ACTIVE",
    terminal: "READY",
    modules: "9 COMMANDS LOADED",
  },
};

export const ACTIVITY_STATUS = {
  navigation: "ACTIVE",
  eventStream: "ACTIVE",
  interaction: "READY",
  incidentEngine: "SIMULATED",
};

export const BOOT_SEQUENCE = [
  { label: "Loading interface", delay: 200 },
  { label: "Initializing security modules", delay: 300 },
  { label: "Loading terminal", delay: 250 },
  { label: "Loading identity", delay: 200 },
  { label: "Establishing interface", delay: 300 },
  { label: "SYSTEM READY", delay: 100 },
];

export const LOG_TEMPLATES_NORMAL = [
  { level: "INFO" as const, message: "Interface initialized — all modules loaded" },
  { level: "INFO" as const, message: "Terminal session established — ready for input" },
  { level: "DEBUG" as const, message: "Scroll-spy attached — navigation tracking active" },
  { level: "INFO" as const, message: "Mode controller synced — NORMAL state confirmed" },
  { level: "DEBUG" as const, message: "Accessibility checks passed — ARIA live regions active" },
  { level: "INFO" as const, message: "Event stream connected — log feed active" },
  { level: "DEBUG" as const, message: "Reduced-motion preference detected — animations minimized" },
  { level: "INFO" as const, message: "Security surface monitor — posture nominal" },
];

export const LOG_TEMPLATES_BREACH = [
  { level: "ERROR" as const, message: "INCIDENT: Simulated breach mode activated" },
  { level: "WARN" as const, message: "ALERT: Threat level elevated — CRITICAL" },
  { level: "ERROR" as const, message: "ALERT: Network degradation detected — DEGRADED" },
  { level: "WARN" as const, message: "Incident engine engaged — simulation only" },
  { level: "ERROR" as const, message: "ALERT: Perimeter anomaly — investigating" },
  { level: "WARN" as const, message: "Containment protocols on standby" },
  { level: "ERROR" as const, message: "ALERT: Lateral movement detected — simulated" },
  { level: "WARN" as const, message: "Incident timeline recording — all events logged" },
];
