# System Architecture & Technical Design — AgileFlow

**Version:** 1.0.0  
**Stack:** Spring Boot 4.x + Java 25 LTS | React 19 + Tailwind CSS | PostgreSQL 16+  

---

## 1. System Overview & Component Layout

AgileFlow follows a modern, decoupled client-server architecture designed for speed, low memory overhead, and clear API boundaries.

```mermaid
flowchart TD
    subgraph Client ["Client Layer"]
        WEB["Responsive Web App (React 19 + Vite + Tailwind)"]
        CAP["Mobile Shell (Capacitor / Android APK)"]
    end

    subgraph Gateway ["API & Security Layer"]
        REST["REST API / Springdoc OpenAPI 3.0"]
        SEC["Stateless Auth & CORS Filter"]
    end

    subgraph Backend ["Backend Core (Spring Boot 4 / Java 25)"]
        SVC["Agile Domain Services (Project, Sprint, Board)"]
        AI["Spring AI Assistant (Gemini / OpenAI Gateway)"]
        REPO["Spring Data JPA Repositories"]
    end

    subgraph Data ["Data & Storage Layer"]
        PG[("PostgreSQL 16+ (Docker)")]
    end

    WEB --> REST
    CAP --> REST
    REST --> SEC
    SEC --> SVC
    SVC --> AI
    SVC --> REPO
    REPO --> PG
```

---

## 2. Data Model & Entity-Relationship Diagram (ERD)

The data model maintains clean relational hierarchy inspired by Rally's work breakdowns, guaranteeing referential integrity via PostgreSQL foreign keys.

```mermaid
erDiagram
    PROJECT ||--o{ SPRINT : "contains"
    PROJECT ||--o{ EPIC : "contains"
    PROJECT ||--o{ ISSUE : "contains"
    EPIC ||--o{ ISSUE : "groups"
    SPRINT ||--o{ ISSUE : "plans"
    ISSUE ||--o{ SUBTASK : "breaks down into"

    PROJECT {
        uuid id PK
        string key "e.g. FLOW"
        string name
        string description
        timestamp created_at
    }

    SPRINT {
        uuid id PK
        uuid project_id FK
        string name
        string goal
        enum state "PLANNED, ACTIVE, COMPLETED"
        date start_date
        date end_date
    }

    EPIC {
        uuid id PK
        uuid project_id FK
        string key "e.g. FLOW-E1"
        string title
        string color
        string status "OPEN, IN_PROGRESS, DONE"
    }

    ISSUE {
        uuid id PK
        uuid project_id FK
        uuid epic_id FK "nullable"
        uuid sprint_id FK "nullable"
        string key "e.g. FLOW-12"
        string title
        text description
        enum issue_type "STORY, BUG, TASK"
        enum status "TODO, IN_PROGRESS, REVIEW, DONE"
        int story_points "Fibonacci: 1, 2, 3, 5, 8, 13"
        int rank "ordering position"
        timestamp updated_at
    }

    SUBTASK {
        uuid id PK
        uuid issue_id FK
        string title
        boolean is_completed
        int order_index
    }
```

---

## 3. Technology Stack Justification

| Layer | Selection | Core Rationale |
| :--- | :--- | :--- |
| **Backend** | Spring Boot 4.x + Java 25 LTS | Cutting-edge Java runtime, Virtual Threads for high-throughput I/O, robust Spring ecosystem, and seamless Spring AI integrations. |
| **Persistence** | PostgreSQL 16+ via Spring Data JPA | Enforces referential integrity on hierarchical work items, fast indexed positional reordering, and native `JSONB` flexibility for custom board settings. |
| **Frontend** | React 19 + Vite + Tailwind CSS | Lightweight footprint, instant HMR, superior drag-and-drop touch support (`@hello-pangea/dnd` / `dnd-kit`), and frictionless path to Android via Capacitor. |
| **API Contract** | Springdoc OpenAPI / Swagger UI | Self-documenting REST endpoints generated at runtime directly from Java controllers and DTOs. |
| **AI Integration** | Spring AI | Native Java abstraction over leading LLMs (Google Gemini, Anthropic, OpenAI) for automated acceptance criteria and story breakdown. |

---

## 4. Mobile Responsiveness Strategy

Traditional desktop Agile boards crowd 4 to 6 columns onto a single screen. On small mobile viewports ($< 768\text{px}$), AgileFlow switches to a **Single Column Focus View**:
* A sticky top status tab-bar (`To Do` | `In Progress` | `Review` | `Done`) with indicator badges.
* Horizontal touch-swipe gestures between columns.
* Full touch-handle support for card reordering inside each column.
* Native-like bottom-sheet drawers for quick story editing.
