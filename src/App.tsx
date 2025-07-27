
import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { PeriodProvider } from './context/PeriodContext';
import { VolunteerProvider } from './context/VolunteerContext';
import AppNavbar from './components/AppNavbar';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import VolunteersPage from './pages/VolunteersPage';
import PeriodsPage from './pages/PeriodsPage';
import ResourcesPage from './pages/ResourcesPage';
import ActivityLogPage from './pages/ActivityLogPage';


const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const AppContent: React.FC = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <AppNavbar />
      {user ? (
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/volunteers" element={<VolunteersPage />} />
          <Route path="/periods" element={<PeriodsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/activity-log" element={<ActivityLogPage />} />
        </Routes>
      ) : (
        <LoginPage />
      )}
    </>
  );
};

const App: React.FC = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <PeriodProvider>
        <VolunteerProvider>
          <AppContent />
        </VolunteerProvider>
      </PeriodProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);

export default App;
