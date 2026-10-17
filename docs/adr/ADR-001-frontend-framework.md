# ADR-001: Selection of React 19 over Angular for Frontend Framework

**Status:** Accepted  
**Date:** 2026-10-17  
**Decision Makers:** Engineering Team  

---

## Context & Problem Statement
AgileFlow requires a lightweight, high-performance UI capable of responsive, touch-friendly drag-and-drop Kanban boards on both desktop browsers and mobile devices, with a clear future path to an installable Android application.

We evaluated **React 19 (Vite + Tailwind CSS)** vs. **Angular (Standalone Components + Angular CDK / Ionic)**.

## Decision Drivers
* Mobile touch drag-and-drop support and smooth card animations.
* Bundle size and rapid initial page load on mobile web connections.
* Frictionless compilation to native mobile shells (Capacitor / React Native).
* Ergonomics of modern styling with utility-first CSS (Tailwind).

## Considered Options
1. **React 19 + Vite + Tailwind CSS**
2. **Angular (latest) + Angular CDK + Ionic**

## Decision Outcome
**Chosen Option: React 19 + Vite + Tailwind CSS**

### Rationale:
1. **Touch Drag-and-Drop Ecosystem:** React boasts mature, highly optimized libraries like `@hello-pangea/dnd` and `dnd-kit` that handle touch gestures, virtualized long lists, and spring physics smoothly on mobile viewports.
2. **Bundle Footprint:** React + Vite produces minimal bundle overhead compared to full-framework alternatives, ensuring instantaneous startup on mobile browsers.
3. **Mobile Portability:** Capacitor wraps Vite builds into an Android APK with zero configuration changes, while React Native remains an easy parallel option if true native components are ever desired.

## Consequences
* **Positive:** Fast development iteration via Vite HMR, lightweight mobile client, clean component modularity.
* **Negative:** Requires assembling standard libraries (routing, state management) independently rather than having them bundled out of the box as in Angular.
