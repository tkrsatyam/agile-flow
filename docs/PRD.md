# Product Requirements Document (PRD) — AgileFlow

**Product Name:** AgileFlow  
**Status:** In Progress (Phase 1: MVP Scaffolding)  
**Target Audience:** Solo developers, indie hackers, agile pair-programmers  
**Version:** 1.0.0-draft  

---

## 1. Executive Summary & Problem Statement

Commercial Agile tools currently sit at two undesirable extremes:
1. **Jira:** Feature-rich but notorious for sluggish page loads, excessive configuration overhead, deep 50-field forms, and enterprise clutter.
2. **Rally (Broadcom):** Excellent hierarchical work model (`Epic -> Story -> Task/Defect`), but has zero free-tier offering for personal/portfolio use.

**AgileFlow** is a lightweight, responsive Agile project management system designed for speed, clarity, and mobile accessibility. It preserves the clean item hierarchy of Rally and the rapid interaction model of modern Kanban boards, while ditching the enterprise bureaucracy.

---

## 2. Core Personas & Use Cases

* **Primary Persona — The Solo Builder / Indie Developer:**
  Needs a fast, keyboard-friendly way to organize complex software builds into Epics, break them down into Stories with Fibonacci estimates, and track active work in a clean Kanban board without spending hours configuring workflows.
* **Mobile Companion Use Case:**
  Quickly checking active sprint progress, updating story statuses on the go, or capturing a bug/idea on a smartphone during a walk or commute.

---

## 3. Scope & Phased Roadmap

```mermaid
flowchart TD
    subgraph Phase 1: MVP Core
        P1["Project Scaffolding (Java 25 + Spring Boot 4 + React 19)"]
        P2["PostgreSQL Relational Schema (Project, Epic, Story, Task)"]
        P3["Kanban Board with Drag & Drop (Desktop & Touch Mobile)"]
        P4["CRUD for Epics, Stories, and Checklist Tasks"]
    end

    subgraph Phase 2: Agile Planning & Sprints
        P5["Backlog Planning View with Prioritization"]
        P6["Sprint Lifecycle (Planned -> Active -> Completed)"]
        P7["Fibonacci Point Tally & Column WIP Limits"]
    end

    subgraph Phase 3: AI & Developer Superpowers
        P8["Spring AI: Definition of Done / Acceptance Criteria Generator"]
        P9["Spring AI: Story Splitter & Scope Analyzer"]
        P10["GitHub Webhooks: Auto status update from Commits/PRs"]
        P11["Automated Velocity & Burn-down Reporting"]
    end

    subgraph Phase 4: Mobile & Offline
        P12["Capacitor Android Shell (Installable APK)"]
        P13["Offline Support & Optimistic State Sync"]
        P14["Keyboard Command Palette (Cmd/Ctrl + K)"]
    end

    Phase 1 --> Phase 2 --> Phase 3 --> Phase 4
```

---

## 4. Phase 1 (MVP) Requirements Specification

### 4.1 Functional Requirements (FR)
* **FR-1 (Workspace Management):** Create and view a project workspace with a unique issue key prefix (e.g., `FLOW-`).
* **FR-2 (Hierarchical Items):** Support Epics, User Stories, and Checklist Subtasks.
* **FR-3 (Kanban Board):**
  * Interactive columns: `To Do`, `In Progress`, `Review`, `Done`.
  * Desktop: Smooth drag-and-drop between columns and re-ranking within columns.
  * Mobile: Responsive swipe / tabbed column carousel (one column focused at a time with touch reordering).
* **FR-4 (Story Estimation):** Fibonacci scale story point selection (`1, 2, 3, 5, 8, 13`).
* **FR-5 (Rich Descriptions):** Markdown rendering for story descriptions and acceptance criteria checkboxes.

### 4.2 Non-Functional Requirements (NFR)
* **Performance:** Card drag-and-drop response under 16ms (60 FPS); API response times $< 50\text{ms}$ for board queries.
* **Reliability:** Relational ACID integrity on PostgreSQL; zero orphaned tasks on story deletion.
* **Mobile Responsiveness:** 100% usable on mobile viewport widths ($360\text{px} - 430\text{px}$) with touch drag-and-drop.

---

## 5. Explicit Non-Goals (What We Are NOT Building)

To prevent enterprise bloat and maintain blazing performance:
* ❌ **No complex visual workflow engines:** Workflows are fixed to standard, predictable Agile states (`To Do`, `In Progress`, `Review`, `Done`).
* ❌ **No enterprise role-based permissions matrix:** No 20-level permission trees (e.g., Project Admin vs Space Admin vs Billing Auditor).
* ❌ **No 50-field issue modals:** Creating a story requires only 3 fields: Title, Estimate, and Description.

---

## 6. Definition of Done (DoD)

A feature or story is considered **Done** only when:
1. **Code Quality:** Written in Java 25 / TypeScript with zero critical linter warnings.
2. **Testing:** Unit tests cover business services (Spring Boot `@DataJpaTest` / JUnit 5) and React components (Vitest).
3. **Responsive Verification:** Tested on both desktop width ($> 1200\text{px}$) and mobile viewport ($375\text{px}$).
4. **Documentation:** API changes reflected in OpenAPI/Swagger; architecture changes reflected in ADRs.
