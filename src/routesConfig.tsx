// Centralized route and navigation config for both Navbar and Offcanvas
// Add your page imports here
import MainPage from './pages/MainPage';
import ResourcesPage from './pages/Resources/ResourcesPage';
import ActivityPage from './pages/ActivityPage';
import AssignmentBoardPage from './pages/AssignmentBoardPage';
import OrganizationsPage from './pages/Organizations/OrganizationsPage';
import IncidentsPage from './pages/Incidents/IncidentsPage';
import UnitsPage from './pages/Units/UnitsPage';
import PeriodsPage from './pages/Periods/PeriodsPage';
import VolunteersPage from './pages/Volunteers/VolunteersPage';
import RadiosPage from './pages/Radios/RadiosPage';
import AgenciesPage from './pages/Agencies/AgenciesPage';
import ActivityLogPage from './pages/ActivityLogPage';

// Route config type
export interface RouteConfigNav {
  key: string;
  path?: string;
  element: React.ReactNode;
  label: string;
  nav?: boolean;
  admin?: boolean;
  disabled?: boolean;
  show?: string;
};
export interface RouteConfigSeparator {
  separator: true;
  group?: string;
};
export type RouteConfig = RouteConfigNav | RouteConfigSeparator;

export const routesConfig: RouteConfig[] = [
  // Main nav
  { key: 'home', path: '/', element: <MainPage />, label: 'Home' },
  { key: 'resources', element: <ResourcesPage />, label: 'Resources', nav: true },
  { key: 'activity', element: <ActivityPage />, label: 'Log Activity', nav: true, disabled: true },
  { key: 'assignment-board', path: '/assign', element: <AssignmentBoardPage />, label: 'Assignment Board', nav: true, show: 'showAssignmentBoard' },
  // Offcanvas/admin
  { separator: true, group: 'Resources' },
  { key: 'organizations', element: <OrganizationsPage />, label: 'Manage Organizations', admin: true, show: 'superAdminAccess' },
  { key: 'incidents', element: <IncidentsPage />, label: 'Manage Incidents', admin: true },
  { key: 'units', element: <UnitsPage />, label: 'Manage Units', admin: true },
  { key: 'periods', element: <PeriodsPage />, label: 'Manage Operating Periods', admin: true },
  { key: 'volunteers', element: <VolunteersPage />, label: 'Manage Volunteers', admin: true },
  { separator: true, group: 'Assets & Agencies' },
  { key: 'radios', element: <RadiosPage />, label: 'Manage Radios', admin: true, show: 'showRadioResources' },
  { key: 'agencies', element: <AgenciesPage />, label: 'Manage Agencies', admin: true, show: 'showAgencyResources' },
  { separator: true, group: 'Logs & Reports' },
  { key: 'activity-log', element: <ActivityLogPage />, label: 'Activity Logs', admin: true },
];
