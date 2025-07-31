import React, { useContext, useState } from 'react';
import ContextSelectModal from './ContextSelectModal';
import { useIncident } from '../context/IncidentContext';
import { usePeriod } from '../context/PeriodContext';
import { useUnit } from '../context/UnitContext';
import { Navbar, Container, Button, Offcanvas } from 'react-bootstrap';
import AppNavLinks from './AppNavLinks';
import { routesConfig } from '../routesConfig';

import { GearFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface AppNavbarProps {
  featureFlags?: Record<string, boolean>;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ featureFlags = {} }) => {
  const { user, logout } = useContext(AuthContext);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const { incidents, setSelectedIncident } = useIncident();
  const { periods, setSelectedPeriod } = usePeriod();
  const { units, setSelectedUnit } = useUnit();
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">EventCoord</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {user && (
            <>
              <AppNavLinks
                links={routesConfig}
                navType="main"
                featureFlags={featureFlags}
                onNav={() => {}}
              />
              <div className="d-flex align-items-center ms-auto">
                <Button variant="outline-light" className="me-2" onClick={() => setShowContextModal(true)} title="Select Operating Context">
                  <GearFill />
                </Button>
                {(featureFlags?.adminAccess === true || featureFlags?.superAdminAccess === true) && (
                  <Button variant="outline-light" className="me-2" onClick={() => setShowCanvas(true)} title="Open Admin Menu">
                    Admin
                  </Button>
                )}
                <Navbar.Text className="me-2">{user.name}</Navbar.Text>
                {user.picture && (
                  <img
                    src={user.picture}
                    alt={user.name}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 8 }}
                  />
                )}
                <Button variant="outline-light" onClick={logout}>Logout</Button>
              </div>
            </>
          )}
        </Navbar.Collapse>
      </Container>
      {/* Offcanvas menu for setup/admin links */}
      <Offcanvas show={showCanvas} onHide={() => setShowCanvas(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Administration</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <AppNavLinks
            links={routesConfig}
            navType="admin"
            featureFlags={featureFlags}
            onNav={() => setShowCanvas(false)}
          />
        </Offcanvas.Body>
      </Offcanvas>
      {/* Modal for selecting incident, period, and unit */}
      <ContextSelectModal
        show={showContextModal}
        onHide={() => setShowContextModal(false)}
        onSelect={(incidentId, periodId, unitId) => {
          setSelectedIncident(incidentId ? (incidents.find(i => i.incidentId === incidentId) ?? null) : null);
          setSelectedPeriod(periodId ? (periods.find(p => p.periodId === periodId) ?? null) : null);
          setSelectedUnit(unitId ? (units.find(u => u.unitId === unitId) ?? null) : null);
          setShowContextModal(false);
        }}
      />
    </Navbar>
  );
};

export default AppNavbar;
