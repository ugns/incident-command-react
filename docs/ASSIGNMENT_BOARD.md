# AssignmentBoard Component: Features & Roadmap

## Overview
The `AssignmentBoard` is a React component for visualizing and managing volunteer assignments in a multi-tenant, multi-unit environment. It is designed for both interactive (dispatch/mobile) and read-only (dashboard/monitor) use cases, supporting drag-and-drop assignment, polling refresh, and future extensibility.

---

## Implemented Features

- **Volunteer Grouping:**
  - Volunteers are grouped into columns by their `currentLocation` field.
  - Only volunteers with `status === VolunteerStatus.CheckedIn` are shown.

- **Static Locations:**
  - Columns are defined by a static `DEFAULT_LOCATIONS` array (e.g., Staging, On Duty, Needs Relief, Released).

- **Drag-and-Drop (dnd-kit):**
  - Volunteers can be dragged between columns to update their assignment (unless in read-only mode).
  - Drag-and-drop updates the backend and optimistically updates the UI.

- **Read-Only Mode:**
  - `readOnly` prop disables drag-and-drop and editing, for use on dashboards/monitors.

- **Polling/Auto-Refresh:**
  - `refreshInterval` prop enables periodic polling of volunteer data for real-time dashboards.

- **Filtering:**
  - Supports filtering by `orgId` and `unitId` props for multi-tenant and multi-unit scenarios.

- **Responsive Layout:**
  - Uses Bootstrap grid for responsive display on desktop, tablet, and mobile.

---

## To Be Implemented

- **Dynamic Locations:**
  - Fetch assignment locations from a backend API (with orgId/unitId filtering) instead of using a static array.
  - Use location IDs as column keys and for volunteer assignment.

- **Shift End Time Display:**
  - Show each volunteer's shift end time and highlight those needing relief soon.

- **Location Management:**
  - UI and API for adding, editing, and removing assignment locations.

- **Error Handling:**
  - Improved error feedback and UI rollback if backend updates fail.

- **WebSocket/Real-Time Updates:**
  - Use WebSockets or server-sent events for instant updates across devices (instead of polling).

- **Unit Model Integration:**
  - Full support for filtering and displaying by Unit once the model is available.

---

## Potential Enhancements

- **Customizable Columns:**
  - Allow users to configure which columns/locations are shown and their order.

- **Volunteer Details Modal:**
  - Click/tap a volunteer card to view or edit full details in a modal.

- **Color Coding & Badges:**
  - Use color, icons, or badges to indicate status, shift urgency, or special roles.

- **Bulk Actions:**
  - Support for moving or updating multiple volunteers at once.

- **Accessibility Improvements:**
  - Enhanced keyboard navigation and ARIA support for drag-and-drop.

- **Audit Log:**
  - Track and display assignment changes for accountability.

---

## Usage Examples

- **Dispatch/Tablet:**
  - Interactive mode for mobile dispatchers to manage assignments in real time.
- **Dashboard/Monitor:**
  - Read-only mode with polling for large-screen status boards in command centers.

---

## API Requirements (for future)
- `GET /locations?orgId=...&unitId=...` — fetch assignment locations
- `POST/PUT/DELETE /locations` — manage locations
- `PATCH /volunteers/:id` — update volunteer assignment/location

---

## Authors & Contributors
- See project README for main contributors.

---

_Last updated: July 29, 2025_
