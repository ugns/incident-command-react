import React, { useContext, useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useVolunteers } from '../context/VolunteerContext';
import VolunteerSelect from '../components/VolunteerSelect';
import { AuthContext } from '../context/AuthContext';
import { Container, Card, Table, Button, Alert, Placeholder, Row, Col } from 'react-bootstrap';
import { CheckCircleFill, Broadcast } from 'react-bootstrap-icons';
import { Volunteer, VolunteerStatus, RadioStatus } from '../types/Volunteer';
import VolunteerForm from './VolunteerForm';
import VolunteerViewModal from './VolunteerViewModal';

const VolunteersPage: React.FC = () => {
  const { token } = useContext(AuthContext);
  const { adminAccess, superAdminAccess } = useFlags();
  const { volunteers, loading, error, addVolunteer, updateVolunteer, deleteVolunteer } = useVolunteers();
  const [showForm, setShowForm] = useState(false);
  const [editVolunteer, setEditVolunteer] = useState<Volunteer | null>(null);
  const [showView, setShowView] = useState(false);
  const [viewVolunteer, setViewVolunteer] = useState<Volunteer | null>(null);
  // Sorting and filtering state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  const handleAdd = () => {
    setEditVolunteer(null);
    setShowForm(true);
  };

  const handleEdit = (vol: Volunteer) => {
    setEditVolunteer(vol);
    setShowForm(true);
  };

  const handleView = (vol: Volunteer) => {
    setViewVolunteer(vol);
    setShowView(true);
  };

  const handleDelete = async (vol: Volunteer) => {
    if (!token || !adminAccess) return;
    try {
      await deleteVolunteer(vol.volunteerId);
    } catch (e: any) {
      // Optionally handle error locally if needed
    }
  };

  const handleFormSubmit = async (form: any) => {
    if (!token) return;
    try {
      if (editVolunteer) {
        await updateVolunteer(editVolunteer.volunteerId, form);
      } else {
        await addVolunteer(form);
      }
      setShowForm(false);
    } catch (e: any) {
      // Optionally handle error locally if needed
    }
  };

  if (!token) return <Alert variant="warning">You must be logged in.</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  // Filter and sort volunteers before rendering
  const filteredVolunteers = volunteers
    .filter(v => {
      if (!selectedVolunteer) return true;
      return v.volunteerId === selectedVolunteer.volunteerId;
    })
    .sort((a, b) => {
      const aName = a.name ? a.name.toLowerCase() : '';
      const bName = b.name ? b.name.toLowerCase() : '';
      if (aName < bName) return sortOrder === 'asc' ? -1 : 1;
      if (aName > bName) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <Container>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col><strong>Volunteers</strong></Col>
            <Col md="auto" className="d-flex align-items-center gap-2">
              <VolunteerSelect
                volunteers={volunteers}
                value={selectedVolunteer}
                onSelect={setSelectedVolunteer}
              />
              <Button variant="success" onClick={handleAdd}>Add Volunteer</Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          <Table striped bordered hover size="sm" responsive className="mb-0">
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                  Name {sortOrder === 'asc' ? '▲' : '▼'}
                </th>
                <th>Callsign</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={idx}>
                    <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                    <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                    <td><Placeholder animation="glow"><Placeholder xs={5} /></Placeholder></td>
                    <td><Placeholder animation="glow"><Placeholder xs={4} /></Placeholder></td>
                    <td><Placeholder animation="glow"><Placeholder xs={7} /></Placeholder></td>
                  </tr>
                ))
              ) : filteredVolunteers.length === 0 ? (
                <tr><td colSpan={5} className="text-center">No volunteers found.</td></tr>
              ) : (
                filteredVolunteers.map(v => (
                  <tr key={v.volunteerId}>
                    <td>{v.name}</td>
                    <td>{v.callsign}</td>
                    <td>{v.currentLocation}</td>
                    <td>
                      {v.status === VolunteerStatus.CheckedIn && (
                        <span title="Checked In" style={{ marginRight: 6 }}>
                          <CheckCircleFill color="green" size={18} />
                        </span>
                      )}
                      {v.radio && v.radioStatus === RadioStatus.Assigned && (
                        <span title={`Radio: ${v.radio}`} style={{ marginRight: 6 }}>
                          <Broadcast color="#007bff" size={18} />
                        </span>
                      )}
                    </td>
                    <td>
                      <Button size="sm" variant="info" onClick={() => handleView(v)}>View</Button>{' '}
                      <Button size="sm" variant="primary" disabled={!(adminAccess || superAdminAccess)} onClick={() => handleEdit(v)}>Edit</Button>{' '}
                      {adminAccess && (
                        <Button size="sm" variant="danger" disabled={!superAdminAccess} onClick={() => handleDelete(v)}>Delete</Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <VolunteerForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initial={editVolunteer}
      />
      <VolunteerViewModal
        show={showView}
        onHide={() => setShowView(false)}
        volunteer={viewVolunteer}
      />
    </Container>
  );
}

export default VolunteersPage;
