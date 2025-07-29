import React, { useContext, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { OrganizationProvider } from './context/OrganizationContext';
import { IncidentProvider } from './context/IncidentContext';
import { UnitProvider } from './context/UnitContext';
import { PeriodProvider } from './context/PeriodContext';
import { VolunteerProvider } from './context/VolunteerContext';
import AppNavbar from './components/AppNavbar';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import OrganizationsPage from './pages/Organizations/OrganizationsPage';
import PeriodsPage from './pages/Periods/PeriodsPage';
import ResourcesPage from './pages/Resources/ResourcesPage';
import VolunteersPage from './pages/Volunteers/VolunteersPage';
import ActivityLogPage from './pages/ActivityLogPage';
import { LDProvider, useLDClient } from 'launchdarkly-react-client-sdk';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const AppContent: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <AppNavbar />
      {user ? (
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/organizations" element={<OrganizationsPage />} />
          <Route path="/volunteers" element={<VolunteersPage />} />
          <Route path="/periods" element={<PeriodsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/activity-log" element={<ActivityLogPage />} />
          <Route path="/assignment-board" element={React.createElement(require('./pages/AssignmentBoardPage').default)} />
        </Routes>
      ) : (
        <LoginPage />
      )}
    </>
  );
};


// Helper to build LD context from user
const buildLDContext = (user: any) => user ? {
  kind: 'multi',
  user: {
    key: user.email || user.sub,
    name: user.name,
    email: user.email,
    sub: user.sub,
    org_id: user.org_id,
    org_name: user.org_name,
  },
  organization: {
    key: user.org_id,
    name: user.org_name,
    org_id: user.org_id,
  },
} : { key: 'anonymous' };

const LDContextUpdater: React.FC = () => {
  const { user } = useContext(AuthContext);
  const ldClient = useLDClient();
  useEffect(() => {
    if (ldClient) {
      const newContext = buildLDContext(user);
      ldClient.identify(newContext);
      ldClient.track('68863cd3dc1f7209a938fe74');
    }
  }, [ldClient, user]);
  return null;
};

const App: React.FC = () => {
  const clientSideID = process.env.REACT_APP_LAUNCHDARKLY_CLIENT_ID || '';
  // Only use initial context for LDProvider; update after login with LDContextUpdater
  const { user } = useContext(AuthContext);
  const ldContext = buildLDContext(user);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <OrganizationProvider>
          <IncidentProvider>
            <PeriodProvider>
              <UnitProvider>
                <VolunteerProvider>
                  <LDProvider
                    clientSideID={clientSideID}
                    context={ldContext}
                  >
                    <LDContextUpdater />
                    <AppContent />
                  </LDProvider>
                </VolunteerProvider>
              </UnitProvider>
            </PeriodProvider>
          </IncidentProvider>
        </OrganizationProvider>
      </AuthProvider >
    </GoogleOAuthProvider >
  );
};

export default App;
