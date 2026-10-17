# ADR-002: Selection of PostgreSQL over NoSQL (Document Store)

**Status:** Accepted  
**Date:** 2026-10-17  
**Decision Makers:** Engineering Team  

---

## Context & Problem Statement
Agile project management requires managing deeply connected entities (`Project -> Epic -> Story -> Subtask`, with cross-cutting `Sprint` relationships). We evaluated whether a relational database (PostgreSQL) or a document-based NoSQL database (MongoDB) is the optimal storage engine.

## Decision Drivers
* Strict referential integrity (preventing orphaned stories, tasks, or broken sprint pointers).
* Atomic multi-item state transitions (closing a sprint, rolling unfinished work back to the backlog).
* Efficient aggregation queries for Burn-down and Velocity charts (`SUM(points)` grouped by status and sprint).
* Positional indexing and card reordering within boards.

## Considered Options
1. **PostgreSQL 16+ (via Spring Data JPA / Hibernate)**
2. **MongoDB (via Spring Data MongoDB)**

## Decision Outcome
**Chosen Option: PostgreSQL 16+**

### Rationale:
1. **Relational Graph:** The Agile domain is inherently relational. Foreign keys with `ON DELETE CASCADE` guarantee data cleanliness across Epics, Stories, and Subtasks.
2. **ACID Consistency:** Moving a story between sprints, updating sprint totals, or transitioning an Epic requires atomic consistency that relational SQL provides out-of-the-box.
3. **Hybrid Escape Hatch:** PostgreSQL's native `JSONB` column type allows storing flexible, unstructured metadata (e.g., custom user board settings or UI widget preferences) without sacrificing relational rigor.

## Consequences
* **Positive:** Bulletproof data consistency, rich SQL reporting, standard Docker containerization.
* **Negative:** Schema migrations must be tracked (via Flyway or Liquibase) as the entity model evolves.
