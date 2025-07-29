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
                <Nav.Link as={Link} to="/resources">Resources</Nav.Link>
                <Nav.Link as={Link} to="/activity" disabled>Log Activity</Nav.Link>
                <Nav.Link as={Link} to="/assignment-board">Assignment Board</Nav.Link>
                <Nav.Link onClick={() => setShowCanvas(true)} disabled={!adminAccess}>Admin</Nav.Link>
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
            {superAdminAccess && (
              <Nav.Link onClick={() => { setShowCanvas(false); navigate('/organizations'); }}>Manage Organizations</Nav.Link>
            )}
            <Nav.Link onClick={() => { setShowCanvas(false); navigate('/incidents'); }}>Manage Incidents</Nav.Link>
            <Nav.Link onClick={() => { setShowCanvas(false); navigate('/units'); }}>Manage Units</Nav.Link>
            <Nav.Link onClick={() => { setShowCanvas(false); navigate('/periods'); }}>Manage Operating Periods</Nav.Link>
            <Nav.Link onClick={() => { setShowCanvas(false); navigate('/volunteers'); }}>Manage Volunteers</Nav.Link>
            <Nav.Link onClick={() => { setShowCanvas(false); navigate('/activity-log'); }}>Activity Logs</Nav.Link>
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
