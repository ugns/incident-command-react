# Copilot Coding Agent Instructions

## Project Overview
- **Type:** React + TypeScript SPA for incident management
- **Bootstrapped with:** Create React App
- **Key Directories:**
  - `src/` — All source code
    - `components/` — UI components (e.g., `AppNavbar`, `AppNavLinks`, selection modals)
    - `context/` — React context providers for Auth, Organization, Period, Volunteer, etc.
    - `pages/` — Route-level pages (e.g., `VolunteersPage`, `PeriodsPage`)
    - `services/` — API service modules, all use `apiFetch`
    - `types/` — TypeScript models (normalized, enums for statuses)
    - `utils/` — Utility functions (e.g., date formatting)
    - `api/` — API fetch abstraction (`api.ts`)
  - `public/` — Static assets
  - `docs/PROJECT_UML.md` — Up-to-date UML and context documentation

## Architecture & Patterns
- **Navigation & Routing:**
  - Centralized in `src/routesConfig.tsx` (single source of truth for all routes, navigation, and feature flags)
  - Use `AppNavLinks` for DRY, type-safe navigation rendering
- **State Management:**
  - Context-driven (see `src/context/`)
  - Each context exposes CRUD and refresh methods, with access control enforced in UI via LaunchDarkly flags
- **API Services:**
  - All API calls go through `apiFetch` in `src/api/api.ts`
  - Service modules in `src/services/` map 1:1 to backend endpoints (see OpenAPI spec)
- **Models:**
  - All models normalized in `src/types/` (see enums for statuses)
  - Relationships and context responsibilities documented in `docs/PROJECT_UML.md`
- **Feature Flags:**
  - LaunchDarkly used for admin/superAdmin access and feature gating

## Developer Workflows
- **Start Dev Server:** `npm start`
- **Run Tests:** `npm test`
- **Build:** `npm run build`
- **Lint:** (uses CRA defaults)
- **Debugging:** Use React DevTools and browser console; context and service logic are separated for easy tracing

## Conventions & Tips
- **Never hardcode routes or navigation:** Always use `routesConfig.tsx` and `AppNavLinks`
- **Always use context for state:** Do not use local state for org/period/volunteer data
- **API calls:** Use the appropriate service in `src/services/`, never call `apiFetch` directly from components
- **Access control:** Enforced in UI via context and LaunchDarkly; backend should also enforce
- **Keep models in sync:** Update `src/types/` and `docs/PROJECT_UML.md` together
- **Add new features:** Scaffold context, service, and page; update UML and navigation config

## Integration Points
- **Backend API:** See OpenAPI spec at https://icapi.undergrid.services/openapi.json
- **Feature Flags:** LaunchDarkly (see context and navbar usage)

## Reference Files
- `src/routesConfig.tsx` — Routing/nav config
- `src/components/AppNavLinks.tsx` — Navigation rendering
- `src/context/` — Context providers
- `src/services/` — API services
- `src/types/` — Data models
- `docs/PROJECT_UML.md` — Architecture/UML

---
For more details, see `docs/PROJECT_UML.md` and code comments in context/service files.
