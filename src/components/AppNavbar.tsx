import React, { useContext, useState } from 'react';
import PeriodSelectModal from './PeriodSelectModal';
import { usePeriod } from '../context/PeriodContext';
import { Navbar, Container, Nav, Button, Offcanvas } from 'react-bootstrap';
import { usePeriods } from '../hooks/usePeriods';
import { GearFill } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AppNavbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showCanvas, setShowCanvas] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const { selectedPeriod, setSelectedPeriod } = usePeriod();
  const { periods, loading: periodsLoading } = usePeriods();
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Incident Command</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/roster">Roster</Nav.Link>
            <Nav.Link as={Link} to="/radios">Radios</Nav.Link>
            <Nav.Link as={Link} to="/activity-log">Activity Log</Nav.Link>
            {user?.is_admin && (
              <Nav.Link onClick={() => setShowCanvas(true)}>Admin</Nav.Link>
            )}
          </Nav>
          {user && (
            <div className="d-flex align-items-center ms-auto">
              <Button variant="outline-light" className="me-2" onClick={() => setShowPeriodModal(true)} title="Select Operating Period">
                <GearFill />
              </Button>
              <Navbar.Text className="me-2">{user.name}</Navbar.Text>
              <Button variant="outline-light" onClick={logout}>Logout</Button>
            </div>
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
            <Nav.Link onClick={() => { setShowCanvas(false); navigate('/volunteers'); }}>Manage Volunteers</Nav.Link>
            <Nav.Link onClick={() => { setShowCanvas(false); navigate('/periods'); }}>Manage Operating Periods</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      {/* Modal for selecting operating period */}
      <PeriodSelectModal
        show={showPeriodModal}
        selectedPeriod={selectedPeriod}
        periods={periods}
        loading={periodsLoading}
        onHide={() => setShowPeriodModal(false)}
        onSelect={period => {
          setSelectedPeriod(period);
          setShowPeriodModal(false);
        }}
      />
    </Navbar>
  );
};

export default AppNavbar;
