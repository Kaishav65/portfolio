// All site copy lives here — edit text without touching components.

export const profile = {
  firstName: "Kaishav",
  lastName: "Basodiya",
  role: "Software Engineer",
  location: "Bengaluru, India",
  company: "Ati Robotics",
  intro:
    "Software engineer at a robotics company, open to forward deployed engineering roles. I build analytics platforms, full-stack systems and LLM-powered automation — and use AI tools, LLMs and agentic workflows to ship scalable frontends and backends faster.",
  rotatingLines: [
    "build analytics and visualization for real time data.",
    "ship full-stack systems end to end.",
    "automate reporting with AI and LLM agents.",
    "deploy AI solutions alongside users on client site.",
    "craft pixel-perfect React interfaces.",
    "ship faster with AI-powered workflows.",
  ],
  resumeUrl: "/Kaishav_Basodiya_Resume.pdf",
  about: [
    "I'm a software engineer at **Ati Robotics**, a robotics company whose **autonomous robots** move material across factory floors. My work is making what those robots do visible, understandable and useful to the people who run them.",
    "I've built an **analytics platform used by 1000+ people**, a **full-stack material tracking system**, and an **LLM-powered reporting workflow** that writes and validates its own SQL. I care about **fast, maintainable frontends**, **clean APIs**, and interfaces that feel effortless.",
    "AI is a core part of how I build. I use **AI coding agents** and **LLM tooling** across the whole lifecycle — architecture, implementation, testing and reviews — to deliver **scalable frontend and backend systems** faster without trading off quality. And I build with AI too: **agents, MCP tools and LLM workflows** that automate real work in production.",
    "That mix makes me a natural fit for **forward deployed engineering**. Much of my work starts with the people running the robots: I learn their workflows, turn their problems into working software, and keep refining it in production. I'm open to **Software Engineer** and **Forward Deployed Engineer** roles where I can work closely with users to design, build and deploy **AI-powered systems**.",
  ],
  education: {
    school: "Indian Institute of Information Technology (IIIT)",
    degree: "B.Tech, Computer Science & Engineering",
    period: "2020 — 2024",
    grade: "CGPA 8.47 / 10",
  },
};

export const links = {
  email: "kaishavbasodiya@gmail.com",
  phone: "+91 7610632240",
  linkedin: "https://www.linkedin.com/in/kaishav-basodiya-8329b5208/",
  github: "https://github.com/Kaishav65",
  leetcode: "https://leetcode.com/u/Keshav_code/",
};

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const metrics = [
  { value: 1000, suffix: "+", label: "Active users on Sanjaya" },
  { value: 99.9, suffix: "%", decimals: 1, label: "Platform uptime" },
  { value: 90, suffix: "%", label: "Less manual intervention" },
  { value: 95, suffix: "%", label: "LLM query success rate" },
];

export const experience = [
  {
    company: "Ati Robotics",
    role: "Software Engineer",
    period: "Jun 2024 — Present",
    highlights: [
      "Built Sanjaya, a robot analytics & monitoring platform used by 1000+ users.",
      "Built a full-stack Material Tracking System (FastAPI, PostgreSQL, Redis, React).",
      "Engineered an LLM-powered reporting workflow with n8n, agents and MCP tools.",
    ],
    tech: ["React", "TypeScript", "Zustand", "FastAPI", "PostgreSQL", "Redis", "n8n"],
  },
  {
    company: "Ati Robotics",
    role: "Frontend Engineer Intern",
    period: "Jan 2024 — May 2024",
    highlights: [
      "Created a reusable React UI library with 25+ components, 90% Jest coverage and Storybook docs.",
      "Set up CI/CD with GitHub Actions for testing, build and release.",
      "Built an HMI app streaming real-time robot data over WebSockets.",
    ],
    tech: ["React", "Jest", "Storybook", "GitHub Actions", "WebSockets"],
  },
  {
    company: "Stealth, ArtSpot Technologies",
    role: "Software Engineering Intern",
    period: "May 2023 — Jun 2023",
    highlights: [
      "Launched a cross-platform React Native app with a 4-member Agile team.",
      "Reduced deployment time by 30%.",
    ],
    tech: ["React Native", "Git", "Agile"],
  },
];

export type ProjectId = "sanjaya" | "mts" | "llm";

export const projects: {
  id: ProjectId;
  index: string;
  title: string;
  kicker: string;
  color: "cyan" | "blue" | "violet";
  stack: string[];
  steps: { title: string; body: string }[];
}[] = [
  {
    id: "sanjaya",
    index: "01",
    title: "Sanjaya",
    kicker: "Analytics & Monitoring Platform",
    color: "cyan",
    stack: ["React", "TypeScript", "Vite", "Zustand", "REST APIs"],
    steps: [
      {
        title: "Built from scratch",
        body: "A data-rich analytics app that visualises robot trip data and performance metrics — improving data accessibility for stakeholders by 60%.",
      },
      {
        title: "Fast by design",
        body: "A modern React + TypeScript frontend on Vite with Zustand for global state, cutting page load times by 40%.",
      },
      {
        title: "Live at scale",
        body: "A pixel-perfect, production-grade UI trusted by 1000+ active users for real-time robot monitoring, at 99.9% uptime.",
      },
    ],
  },
  {
    id: "mts",
    index: "02",
    title: "Material Tracking",
    kicker: "Full-Stack System",
    color: "blue",
    stack: ["Python", "FastAPI", "PostgreSQL", "Redis", "React", "TypeScript"],
    steps: [
      {
        title: "Full-stack architecture",
        body: "FastAPI, PostgreSQL and Redis on the backend with a React + TypeScript frontend for real-time material tracking and staging-area management.",
      },
      {
        title: "Request fulfilment logic",
        body: "Configurable material, container and workflow modules, integrated with external servers to fetch maps, staging info and book robot trips.",
      },
      {
        title: "Automated end to end",
        body: "Structured, configurable workflows with Redis-backed real-time state reduced manual intervention by 90%.",
      },
    ],
  },
  {
    id: "llm",
    index: "03",
    title: "LLM Reporting",
    kicker: "Automated Workflow System",
    color: "violet",
    stack: ["n8n", "LLM Agents", "MCP", "SQL", "PostgreSQL", "MongoDB"],
    steps: [
      {
        title: "Natural language in",
        body: "Users describe the report they need in plain English; an LLM agent with memory turns it into a query plan.",
      },
      {
        title: "Self-healing SQL",
        body: "Generated SQL is validated through MCP tools and retried automatically on failure — a 95% query success rate.",
      },
      {
        title: "Delivered everywhere",
        body: "Cron-triggered schedules deliver personalised reports via email, webhooks and chat to 100+ users, with 65% fewer query errors.",
      },
    ],
  },
];

export const skills = [
  { group: "Languages", items: ["C", "Python", "Java", "JavaScript", "TypeScript", "SQL"] },
  { group: "Frontend", items: ["React.js", "Next.js", "TypeScript", "Zustand", "Material UI", "React Native"] },
  { group: "Backend", items: ["FastAPI", "Node.js", "Express.js", "WebSockets", "GraphQL", "Redis", "Microservices"] },
  { group: "AI & Tooling", items: ["LLM Agents", "MCP", "Prompt Engineering", "Claude Code", "Cursor", "GitHub Copilot", "ChatGPT"] },
  { group: "Data", items: ["PostgreSQL", "MongoDB", "MySQL"] },
  { group: "DevOps & Tools", items: ["Docker", "Linux", "GitHub Actions", "CI/CD", "n8n", "Jira", "Postman"] },
];
