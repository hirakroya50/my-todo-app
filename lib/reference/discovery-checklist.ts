export type ReferenceSection = { title: string; items: string[] };

export const DISCOVERY_CHECKLIST: ReferenceSection[] = [
  {
    title: "1. Discovery & Planning",
    items: [
      "Define the core problem: Articulate what specific pain point the software solves and who the primary target user is.",
      "Map the MVP scope: Separate must-have core features from nice-to-have future enhancements.",
      "Write user stories & acceptance criteria: As a [user], I want to [action] so that [benefit].",
    ],
  },
  {
    title: "2. Discovery & Requirements",
    items: [
      "Define the core problem and primary target audience.",
      "Scope the MVP: must-have vs nice-to-have.",
      "Write user stories and acceptance criteria.",
    ],
  },
  {
    title: "3. System Architecture & Tech Stack",
    items: [
      "Select languages, frameworks, runtime, and databases (throughput, latency, team skills).",
      "Design data model: ERDs, schemas, indexes, validation.",
      "Define API contracts: REST/GraphQL, DTOs, status codes.",
      "Plan auth (JWT, OAuth), RBAC, encryption, secret management.",
    ],
  },
  {
    title: "4. Environment & Tooling Setup",
    items: [
      "Git repo, branching (main, develop, feature), commit conventions.",
      "Local containerization (Docker / Compose).",
      "Linting & formatting with pre-commit hooks.",
    ],
  },
  {
    title: "5. Implementation (Iterative Sprints)",
    items: [
      "Migrations, ORM, base models, seed data.",
      "Registration, sessions, password hashing, token refresh.",
      "Services, integrations, webhooks, error middleware.",
      "UI components, state, forms, API error handling.",
    ],
  },
  {
    title: "6. Testing & Quality Assurance",
    items: [
      "Unit tests for utilities and domain services.",
      "Integration tests for APIs and database.",
      "E2E for signup, core workflows (Playwright/Cypress).",
      "Security scans, dependency audits, load testing.",
    ],
  },
  {
    title: "7. DevOps & Deployment",
    items: [
      "CI/CD on every PR (tests, build, lint).",
      "Staging and production environments.",
      "Logging, Sentry, infrastructure metrics.",
    ],
  },
  {
    title: "8. Launch & Post-Release",
    items: [
      "Staging smoke test and migration validation.",
      "Production release (blue-green or rolling).",
      "Monitor crashes, telemetry, bugs, next sprints.",
    ],
  },
];
