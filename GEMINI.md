# AgileFlow — Project Context & Assistant Guidelines

## 1. Project Summary & Vision
**AgileFlow** is a lightweight, high-performance Agile project management application designed for solo builders, indie developers, and small teams.
- **Inspiration:** Rally's structured item hierarchy (`Epic -> User Story -> Subtask / Defect`) + Jira's rapid Kanban board interaction, without enterprise bloat, sluggishness, or paywalls.
- **Repository:** https://github.com/tkrsatyam/agile-flow
- **Owner:** Satyam Kr (@tkrsatyam)

---

## 2. Tech Stack & Architecture Decisions
- **Backend Runtime:** Java 25 LTS
- **Backend Framework:** Spring Boot 4.x (Spring Data JPA, Spring Security, Springdoc OpenAPI 3.0)
- **Database:** PostgreSQL 16+ (Dockerized container)
- **Frontend Framework:** React 19 + Vite + TypeScript + Tailwind CSS
- **Drag-and-Drop:** `@hello-pangea/dnd` / `dnd-kit` (optimized for mobile touch & 60 FPS desktop)
- **Mobile Path (Phase 4):** Capacitor Android wrapper
- **AI Integrations (Phase 3):** Spring AI (Acceptance criteria generation, Story breakdown, automated release notes)

### Key Architecture Decision Records (ADRs):
- **ADR-001:** Selected React 19 + Tailwind over Angular for superior mobile touch drag-and-drop, lightweight bundle, and easy Capacitor/React Native paths.
- **ADR-002:** Selected PostgreSQL over NoSQL for strict referential integrity across Epics, Stories, and Tasks, plus atomic sprint transactions.
- **ADR-003:** Fibonacci Story Points (`1, 2, 3, 5, 8, 13`) for relative complexity sizing.

---

## 3. Project Documentation Index
All foundational documents are located in the `docs/` directory:
- `docs/PRD.md`: Full requirements, user personas, non-goals, and Definition of Done.
- `docs/ARCHITECTURE.md`: High-level system architecture, component layout, and Mermaid ERD.
- `docs/adr/`: Architecture Decision Records.

---

## 4. Current State & Next Steps
- **Phase 0 (Complete):** Architecture, PRD, ADRs, initial documentation, git setup, and GitHub repository initialized.
- **Phase 1 (Complete — MVP Scaffolding):**
  1. `docker-compose.yml` for local PostgreSQL 16 database with health check.
  2. Spring Boot (Java 25 LTS) backend initialization with Maven wrapper (`mvnw`), JPA entities (`Project`, `Epic`, `Sprint`, `Issue`, `SubTask`), repositories, OpenAPI/Swagger UI 3.0, unified error handling, and test suite.
  3. React 19 + Vite + Tailwind CSS frontend with touch-friendly Kanban board, mobile single-column focus carousel mode, checklist subtasks, and 3-field fast issue creation modal.
- **Phase 2 (Next Up — Agile Planning & Sprints):**
  1. Backlog planning view with drag-and-drop prioritization.
  2. Sprint lifecycle management (Start, Active, Complete).
  3. Column WIP limits and point velocity calculator.
