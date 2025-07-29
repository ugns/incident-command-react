import React, { useContext, useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import ContextSelectModal from './ContextSelectModal';
import { useIncident } from '../context/IncidentContext';
import { usePeriod } from '../context/PeriodContext';
import { useUnit } from '../context/UnitContext';
import { Navbar, Container, Nav, Button, Offcanvas } from 'react-bootstrap';

import { GearFill } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AppNavbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const { adminAccess, superAdminAccess } = useFlags();
  const navigate = useNavigate();
  const [showCanvas, setShowCanvas] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
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
              <Nav className="me-auto">
                {[
                  { key: 'resources', label: 'Resources', to: '/resources' },
                  { key: 'activity', label: 'Log Activity', to: '/activity', disabled: true },
                  { key: 'assignment', label: 'Assignment Board', to: '/assignment-board' },
                  { key: 'admin', label: 'Admin', onClick: () => setShowCanvas(true), disabled: !adminAccess },
                ].map(link =>
                  link.to ? (
                    <Nav.Link
                      key={link.key}
                      as={Link}
                      to={link.to}
                      disabled={link.disabled}
                    >
                      {link.label}
                    </Nav.Link>
                  ) : (
                    <Nav.Link
                      key={link.key}
                      onClick={link.onClick}
                      disabled={link.disabled}
                    >
                      {link.label}
                    </Nav.Link>
                  )
                )}
              </Nav>
              <div className="d-flex align-items-center ms-auto">
                <Button variant="outline-light" className="me-2" onClick={() => setShowPeriodModal(true)} title="Select Operating Period">
                  <GearFill />
                </Button>
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
          <Nav className="flex-column">
            {[
              { key: 'organizations', label: 'Manage Organizations', to: '/organizations', show: superAdminAccess },
              { key: 'incidents', label: 'Manage Incidents', to: '/incidents' },
              { key: 'units', label: 'Manage Units', to: '/units' },
              { key: 'periods', label: 'Manage Operating Periods', to: '/periods' },
              { key: 'volunteers', label: 'Manage Volunteers', to: '/volunteers' },
              { key: 'activity-log', label: 'Activity Logs', to: '/activity-log' },
            ]
              .filter(link => link.show === undefined || link.show)
              .map(link => (
                <Nav.Link
                  key={link.key}
                  onClick={() => { setShowCanvas(false); navigate(link.to); }}
                >
                  {link.label}
                </Nav.Link>
              ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      {/* Modal for selecting incident, period, and unit */}
      <ContextSelectModal
        show={showPeriodModal}
        onHide={() => setShowPeriodModal(false)}
        onSelect={(incidentId, periodId, unitId) => {
          setSelectedIncident(incidentId ? (incidents.find(i => i.incidentId === incidentId) ?? null) : null);
          setSelectedPeriod(periodId ? (periods.find(p => p.periodId === periodId) ?? null) : null);
          setSelectedUnit(unitId ? (units.find(u => u.unitId === unitId) ?? null) : null);
          setShowPeriodModal(false);
        }}
      />
    </Navbar>
  );
};

export default AppNavbar;
