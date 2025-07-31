# Testing Recommendations Checklist

This checklist covers recommended tests for the current incident-command-react project, organized by area. Use this as a guide to incrementally implement robust validation and regression testing.

---

## 1. Components (`src/components/`)
- [ ] Render tests for all UI components (e.g., AppNavbar, AppNavLinks, AppToast, AssignmentBoard, ContextSelect, ReportModal, VolunteerCard)
- [ ] Interaction tests for modals, buttons, and forms (e.g., ContextSelectModal, ReportGeneratorButton)
- [ ] Field component tests (fields/):
  - [ ] Input validation
  - [ ] Change events
  - [ ] Error display
- [ ] Navigation rendering via AppNavLinks (ensure correct links/feature flags)

## 2. Pages (`src/pages/`)
- [ ] Render and smoke tests for all route-level pages
- [ ] Page-level integration tests (e.g., VolunteersPage, PeriodsPage, AssignmentBoardPage)
- [ ] Access control/feature flag tests (admin/superAdmin gating)
- [ ] Modal open/close and data flow tests

## 3. Context Providers (`src/context/`)
- [ ] CRUD and refresh method tests for each context (Auth, Organization, Period, Volunteer, etc.)
- [ ] Access control logic (LaunchDarkly flag enforcement)
- [ ] Context value propagation to consumers
- [ ] WebSocketCNCProvider: connection, reconnection, and message handling

## 4. Services (`src/services/`)
- [ ] API call tests for each service (mocking apiFetch)
- [ ] Error handling and edge case tests
- [ ] Data normalization and transformation tests

## 5. Hooks (`src/hooks/`)
- [ ] Custom hook tests (e.g., useWebSocketCNC, usePeriods)
- [ ] WebSocket connection lifecycle and message handling
- [ ] Hook integration with context/providers

## 6. Models & Types (`src/types/`)
- [ ] Type validation (using TypeScript, but consider runtime validation for critical models)
- [ ] Enum and status mapping tests

## 7. Utilities (`src/utils/`)
- [ ] Unit tests for utility functions (e.g., date formatting)

## 8. Routing & Navigation
- [ ] Route config validation (routesConfig.tsx)
- [ ] Navigation rendering and feature flag gating

## 9. End-to-End (E2E) Testing (optional, but recommended)
- [ ] User login/logout flow
- [ ] Volunteer/period/org CRUD flows
- [ ] Assignment board drag-and-drop
- [ ] Report generation and download
- [ ] Access control (admin/superAdmin features)

## 10. Mocking & Test Utilities
- [ ] Mock Service Worker (MSW) setup for API and WebSocket mocking
- [ ] Test data factories for common models

---

## General
- [ ] 100% code coverage is not required, but aim for high coverage on critical logic
- [ ] Add regression tests for all fixed bugs
- [ ] Document any test setup in `README.md` or a dedicated `TESTING.md`

---

_This checklist should be updated as new features are added or architecture changes._
