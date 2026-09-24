export const PHASES_SUMMARY = [
  {
    title: "Discovery & Requirements",
    items: [
      "Define the core problem",
      "Scope the MVP (Minimum Viable Product)",
      "Write user stories & acceptance criteria",
    ],
  },
  {
    title: "System Architecture & Tech Stack",
    items: [
      "Select the stack",
      "Design the data model",
      "Define API contracts",
      "Architect infrastructure & security",
    ],
  },
  {
    title: "Environment & Tooling Setup",
    items: [
      "Repository & branching strategy",
      "Local environment containerization",
      "Linting & formatting",
    ],
  },
  {
    title: "Implementation (Iterative Sprints)",
    items: [
      "Core backend & database setup",
      "Authentication & authorization",
      "Core business logic",
      "Frontend development",
    ],
  },
  {
    title: "Testing & Quality Assurance",
    items: [
      "Unit tests",
      "Integration tests",
      "End-to-End (E2E) tests",
      "Security & performance audits",
    ],
  },
  {
    title: "DevOps & Deployment",
    items: [
      "Set up CI/CD pipelines",
      "Provision cloud environments",
      "Observability & monitoring",
    ],
  },
  {
    title: "Launch & Post-Release",
    items: [
      "Staging smoke test",
      "Production release",
      "Feedback loop",
    ],
  },
] as const;
