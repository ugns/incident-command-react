import React, { useContext, useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useOrganizations } from '../context/OrganizationContext';
import OrganizationSelect from '../components/OrganizationSelect';
import { AuthContext } from '../context/AuthContext';
import { Container, Card, Table, Button, Alert, Placeholder, Row, Col } from 'react-bootstrap';
import { Organization } from '../types/Organization';
import OrganizationForm from './OrganizationForm';
import OrganizationViewModal from './OrganizationViewModal';

const OrganizationsPage: React.FC = () => {
  const { token } = useContext(AuthContext);
  const { superAdminAccess } = useFlags();
  const { organizations, loading, error, addOrganization, updateOrganization, deleteOrganization } = useOrganizations();
  const [showForm, setShowForm] = useState(false);
  const [editOrganization, setEditOrganization] = useState<Organization | null>(null);
  const [showView, setShowView] = useState(false);
  const [viewOrganization, setViewOrganization] = useState<Organization | null>(null);
  // Sorting and filtering state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  const handleAdd = () => {
    setEditOrganization(null);
    setShowForm(true);
  };

  const handleEdit = (org: Organization) => {
    if (!token || !superAdminAccess) return;
    setEditOrganization(org);
    setShowForm(true);
  };

  const handleView = (org: Organization) => {
    if (!token || !superAdminAccess) return;
    setViewOrganization(org);
    setShowView(true);
  };

  const handleDelete = async (org: Organization) => {
    if (!token || !superAdminAccess) return;
    try {
      await deleteOrganization(org.org_id);
    } catch (e: any) {
      // Optionally handle error locally if needed
    }
  };

  const handleFormSubmit = async (form: any) => {
    if (!token) return;
    try {
      if (editOrganization) {
        await updateOrganization(editOrganization.org_id, form);
      } else {
        await addOrganization(form);
      }
      setShowForm(false);
    } catch (e: any) {
      // Optionally handle error locally if needed
    }
  };

  if (!token) return <Alert variant="warning">You must be logged in.</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  // Filter and sort organizations before rendering
  const filteredOrganizations = organizations
    .filter(o => {
      if (!selectedOrganization) return true;
      return o.org_id === selectedOrganization.org_id;
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
            <Col><strong>Organizations</strong></Col>
            <Col md="auto" className="d-flex align-items-center gap-2">
              <OrganizationSelect
                organizations={organizations}
                value={selectedOrganization}
                onSelect={setSelectedOrganization}
              />
              <Button variant="success" onClick={handleAdd}>Add Organization</Button>
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
              ) : filteredOrganizations.length === 0 ? (
                <tr><td colSpan={3} className="text-center">No organizations found.</td></tr>
              ) : (
                filteredOrganizations.map(o => (
                  <tr key={o.org_id}>
                    <td>{o.name}</td>
                    <td>
                      <Button size="sm" variant="info" onClick={() => handleView(o)} disabled={!superAdminAccess}>View</Button>{' '}
                      <Button size="sm" variant="primary" onClick={() => handleEdit(o)} disabled={!superAdminAccess}>Edit</Button>{' '}
                      <Button size="sm" variant="danger" onClick={() => handleDelete(o)} disabled={!superAdminAccess}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <OrganizationForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initial={editOrganization}
      />
      <OrganizationViewModal
        show={showView}
        onHide={() => setShowView(false)}
        organization={viewOrganization}
      />
    </Container>
  );
}

export default OrganizationsPage;
