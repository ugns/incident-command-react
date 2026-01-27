import React, { useContext, useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useIncident } from '../../context/IncidentContext';
import ContextSelect from '../../components/ContextSelect';
import { AuthContext } from '../../context/AuthContext';
import { Container, Card, Table, Button, Alert, Placeholder, Row, Col, Spinner, SplitButton, Dropdown } from 'react-bootstrap';
import { Incident } from '../../types/Incident';
import IncidentForm from './IncidentForm';
import IncidentViewModal from './IncidentViewModal';
import { ALERT_NOT_LOGGED_IN } from '../../constants/messages';
import incidentService from '../../services/incidentService';
import { downloadBlob } from '../../utils/download';

const IncidentsPage: React.FC = () => {
  const { token, logout } = useContext(AuthContext);
  const { superAdminAccess } = useFlags();
  const { 
    incidents, 
    loading, 
    error, 
    addIncident, 
    updateIncident, 
    deleteIncident 
  } = useIncident();
  const [showForm, setShowForm] = useState(false);
  const [editIncident, setEditIncident] = useState<Incident | null>(null);
  const [showView, setShowView] = useState(false);
  const [viewIncident, setViewIncident] = useState<Incident | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [exporting, setExporting] = useState(false);
  // Sorting and filtering state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleAdd = () => {
    setEditIncident(null);
    setShowForm(true);
  };

  const handleEdit = (incident: Incident) => {
    setEditIncident(incident);
    setShowForm(true);
  };

  const handleView = (incident: Incident) => {
    setViewIncident(incident);
    setShowView(true);
  };

  const handleDelete = async (incident: Incident) => {
    try {
      await deleteIncident(incident.incidentId);
    } catch (e: any) {
      // Optionally handle error locally if needed
    }
  };

  const handleFormSubmit = async (form: any) => {
    if (!token) return;
    try {
      if (editIncident) {
        await updateIncident(editIncident.incidentId, form);
      } else {
        await addIncident(form);
      }
      setShowForm(false);
    } catch (e: any) {
      // Optionally handle error locally if needed
    }
  };

  const handleExport = async () => {
    if (!token) return;
    setExporting(true);
    try {
      const { blob, filename } = await incidentService.export(token, logout);
      downloadBlob(blob, filename || 'incidents.csv');
    } catch (e) {
      // Optionally handle error locally if needed
    } finally {
      setExporting(false);
    }
  };

  if (!token) return <Alert variant="warning">{ALERT_NOT_LOGGED_IN}</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  // Filter and sort incidents before rendering
  const filteredIncidents = incidents
    .filter(o => {
      if (!selectedIncident) return true;
      return o.incidentId === selectedIncident.incidentId;
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
            <Col><strong>Incidents</strong></Col>
            <Col md="auto" className="d-flex align-items-center gap-2">
              <ContextSelect
                label="Incident"
                options={incidents}
                value={selectedIncident ? selectedIncident.incidentId : null}
                onSelect={id => setSelectedIncident(id ? incidents.find(o => o.incidentId === id) ?? null : null)}
                loading={loading}
                getOptionLabel={o => o.name}
                getOptionValue={o => o.incidentId}
              />
              <SplitButton
                variant="success"
                title="Add Incident"
                onClick={handleAdd}
                disabled={loading}
              >
                <Dropdown.Item onClick={handleExport} disabled={loading || exporting}>
                  {exporting ? 'Exporting…' : 'Export'}
                </Dropdown.Item>
              </SplitButton>
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
                  </tr>
                ))
              ) : filteredIncidents.length === 0 ? (
                <tr><td colSpan={3} className="text-center">No incidents found.</td></tr>
              ) : (
                filteredIncidents.map(o => (
                  <tr key={o.incidentId}>
                    <td>{o.name}</td>
                    <td>
                      <Button size="sm" variant="info" onClick={() => handleView(o)}>View</Button>{' '}
                      <Button size="sm" variant="primary" onClick={() => handleEdit(o)}>Edit</Button>{' '}
                      {superAdminAccess && (
                        <Button size="sm" variant="danger" disabled={!superAdminAccess} onClick={() => handleDelete(o)}>Delete</Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <IncidentForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initial={editIncident}
      />
      <IncidentViewModal
        show={showView}
        onHide={() => setShowView(false)}
        incident={viewIncident}
      />
    </Container>
  );
};

export default IncidentsPage;
