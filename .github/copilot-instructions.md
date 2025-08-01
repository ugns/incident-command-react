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
## Common Patterns: Context Providers

### 1. CRUD Contexts (Organization, Volunteer, Location, etc.)
- Expose: list, loading, error, refresh, add<Model>, update<Model>, delete<Model>
- No selected<Model> state or localStorage logic.
- `refresh` loads all items and is called on mount and after CRUD.
- Service methods: `list`, `get`, `create`, `update`, `delete` (no org/period IDs unless required by API).

### 2. Selectable Contexts (Incident, Period, Unit, etc.)
- Expose: list, loading, error, refresh, add<Model>, update<Model>, delete<Model>, selected<Model>, setSelected<Model>
- Maintain `selected<Model>` in state and localStorage.
- On load/refresh, validate `selected<Model>` against the list; clear if not found.
- Use a private `fetch<Model>s` for initial load/validation, and a public `refresh` for consumer reloads.
- Service methods: `list`, `get`, `create`, `update`, `delete` (may require org/period IDs).

### 3. General Notes
- Always use context for shared state, never local state for org/period/volunteer/etc.
- Use `useCallback` for refresh and CRUD methods to avoid unnecessary re-renders.
- Use `useEffect(() => { refresh(); }, [refresh])` for initial data load.
- Handle auth errors in `refresh` and CRUD methods (call `logout` if needed).
- Keep context/provider APIs consistent for maintainability.

See existing context files for reference implementations.

## Integration Points
- **Backend API:** See OpenAPI spec at https://api.undergrid.services/openapi.json
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
