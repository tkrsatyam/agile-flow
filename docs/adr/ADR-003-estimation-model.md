# ADR-003: Adoption of Fibonacci Story Points over Time-Based Estimates

**Status:** Accepted  
**Date:** 2026-10-17  
**Decision Makers:** Engineering Team  

---

## Context & Problem Statement
Estimating software development tasks directly in hours or days frequently results in estimation paralysis and inaccurate sprint plans. We needed to choose an estimation model that balances speed, cognitive clarity, and realistic planning for solo and pair programming workflows.

## Decision Drivers
* Alignment with established Agile methodologies (Jira Scrum & Rally Plan Estimates).
* Reduction in estimation debates and cognitive overhead (Weber-Fechner Law of perception).
* Accurate velocity tracking across sprints of varying duration.

## Considered Options
1. **Fibonacci Story Points (1, 2, 3, 5, 8, 13, 21)**
2. **T-Shirt Sizing (XS, S, M, L, XL)**
3. **Exact Man-Hours / Days**

## Decision Outcome
**Chosen Option: Fibonacci Story Points (Modified: 1, 2, 3, 5, 8, 13)**

### Sizing Guidelines & Practical Calibration:
* **1 pt (Trivial):** Routine configuration or minor typo fix (~1–2 hours).
* **2 pts (Small):** Standard, well-understood feature or CRUD endpoint (~half day).
* **3 pts (Medium):** Standard feature requiring design, implementation, and tests (~1 full day).
* **5 pts (Large):** Substantial feature spanning multiple layers with minor unknowns (~2–3 days).
* **8 pts (Very Large):** High complexity; spans a significant portion of a sprint (~4–5 days).
* **13+ pts (Red Flag):** Must be decomposed into smaller user stories before pulling into an active sprint.

## Consequences
* **Positive:** Fast consensus, prevents false precision, seamlessly matches velocity calculations.
* **Negative:** Requires team or solo calibrating to detach raw hours from points.
