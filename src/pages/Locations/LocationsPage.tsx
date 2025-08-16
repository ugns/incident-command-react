import React, { useContext, useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useLocation } from '../../context/LocationContext';
import ContextSelect from '../../components/ContextSelect';
import { AuthContext } from '../../context/AuthContext';
import { Container, Card, Table, Button, Alert, Placeholder, Row, Col, Spinner } from 'react-bootstrap';
import { ArchiveFill, CheckCircleFill, DashCircleFill } from 'react-bootstrap-icons';
import { Location, LocationStatus } from '../../types/Location';
import { Unit } from '../../types/Unit';
import LocationForm from './LocationForm';
import { useIncident } from '../../context/IncidentContext';
import LocationViewModal from './LocationViewModal';
import { ALERT_NOT_LOGGED_IN } from '../../constants/messages';
import { useUnit } from '../../context/UnitContext';

const LocationsPage: React.FC = () => {
  const { token } = useContext(AuthContext);
  const { adminAccess, superAdminAccess } = useFlags();
  const { 
    locations, 
    loading, 
    error, 
    addLocation, 
    updateLocation, 
    deleteLocation 
  } = useLocation();
  const { units, loading: unitsLoading } = useUnit();
  const { selectedIncident } = useIncident();
  const [showForm, setShowForm] = useState(false);
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [showView, setShowView] = useState(false);
  const [viewLocation, setViewLocation] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  // Sorting and filtering state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleAdd = () => {
    setEditLocation(null);
    setShowForm(true);
  };

  const handleEdit = (loc: Location) => {
    setEditLocation(loc);
    setShowForm(true);
  };

  const handleView = (loc: Location) => {
    setViewLocation(loc);
    setShowView(true);
  };

  const handleDelete = async (loc: Location) => {
    if (!token || !adminAccess) return;
    try {
      await deleteLocation(loc.locationId);
    } catch (e: any) {
      // Optionally handle error locally if needed
    }
  };

  const handleFormSubmit = async (form: any) => {
    if (!token) return;
    try {
      if (editLocation) {
        await updateLocation(editLocation.locationId, form);
      } else {
        await addLocation(form);
      }
      setShowForm(false);
    } catch (e: any) {
      // Optionally handle error locally if needed
    }
  };

  if (!token) return <Alert variant="warning">{ALERT_NOT_LOGGED_IN}</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  // Filter and sort locations before rendering
  const filteredLocations = (locations || [])
    .filter(l => {
      // Filter by selected unit if set
      if (selectedUnit && l.unitId !== selectedUnit.unitId) return false;
      // Then filter by selected location if set
      if (selectedLocation && l.locationId !== selectedLocation.locationId) return false;
      return true;
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
            <Col><strong>Locations</strong></Col>
            <Col md="auto" className="d-flex align-items-center gap-2">
              <ContextSelect
                label="Unit"
                options={units}
                value={selectedUnit ? selectedUnit.unitId : null}
                onSelect={id => setSelectedUnit(id ? units.find(u => u.unitId === id) ?? null : null)}
                loading={unitsLoading}
                getOptionLabel={u => u.name}
                getOptionValue={u => u.unitId}
              />
              <ContextSelect
                label="Location"
                options={locations}
                value={selectedLocation ? selectedLocation.locationId : null}
                onSelect={id => setSelectedLocation(id ? locations.find(l => l.locationId === id) ?? null : null)}
                loading={loading}
                getOptionLabel={l => l.name}
                getOptionValue={l => l.locationId}
              />
              <Button variant="success" onClick={handleAdd} disabled={loading}>
                {loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                )}
                Add Location
              </Button>
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
                <th>Description</th>
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
              ) : filteredLocations.length === 0 ? (
                <tr><td colSpan={5} className="text-center">No locations found.</td></tr>
              ) : (
                filteredLocations.map(l => (
                  <tr key={l.locationId}>
                    <td>{l.name}</td>
                    <td>{l.description}</td>
                    <td>
                      {l.address ? l.address :
                        (l.latitude && l.longitude ? `${l.latitude}, ${l.longitude}` : '')}
                    </td>
                    <td>
                      {l.status === LocationStatus.Active && (
                        <span title="Active" style={{ marginRight: 6 }}>
                          <CheckCircleFill color="green" size={18} />
                        </span>
                      )}
                      {l.status === LocationStatus.Inactive && (
                        <span title="Inactive" style={{ marginRight: 6 }}>
                          <DashCircleFill color="red" size={18} />
                        </span>
                      )}
                      {l.status === LocationStatus.Archived && (
                        <span title="Archived" style={{ marginRight: 6 }}>
                          <ArchiveFill color="black" size={18} />
                        </span>
                      )}
                    </td>
                    <td>
                      <Button size="sm" variant="info" onClick={() => handleView(l)}>View</Button>{' '}
                      <Button size="sm" variant="primary" onClick={() => handleEdit(l)}>Edit</Button>{' '}
                      {superAdminAccess && (
                        <Button size="sm" variant="danger" disabled={!superAdminAccess} onClick={() => handleDelete(l)}>Delete</Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <LocationForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initial={editLocation}
        units={units}
        unitsLoading={unitsLoading}
        incidentLat={selectedIncident?.latitude}
        incidentLng={selectedIncident?.longitude}
      />
      <LocationViewModal
        show={showView}
        onHide={() => setShowView(false)}
        location={viewLocation}
        units={units} 
      />
    </Container>
  );
}

export default LocationsPage;
