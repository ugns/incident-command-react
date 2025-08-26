import React, { useContext, useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useRadios } from '../../context/RadioContext';
import ContextSelect from '../../components/ContextSelect';
import { AuthContext } from '../../context/AuthContext';
import { Container, Card, Table, Button, Alert, Placeholder, Row, Col, Spinner } from 'react-bootstrap';
import { CheckCircleFill, CircleFill, DashCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { Radio, RadioStatus } from '../../types/Radio';
import RadioForm from './RadioForm';
import RadioViewModal from './RadioViewModal';
import { ALERT_NOT_LOGGED_IN } from '../../constants/messages';

const RadiosPage: React.FC = () => {
  const { token } = useContext(AuthContext);
  const { adminAccess, superAdminAccess } = useFlags();
  const { 
    radios, 
    loading, 
    error, 
    addRadio, 
    updateRadio, 
    deleteRadio 
  } = useRadios();
  const [showForm, setShowForm] = useState(false);
  const [editRadio, setEditRadio] = useState<Radio | null>(null);
  const [showView, setShowView] = useState(false);
  const [viewRadio, setViewRadio] = useState<Radio | null>(null);
  const [selectedRadio, setSelectedRadio] = useState<Radio | null>(null);

  const handleAdd = () => {
    setEditRadio(null);
    setShowForm(true);
  };

  const handleEdit = (radio: Radio) => {
    setEditRadio(radio);
    setShowForm(true);
  };

  const handleView = (radio: Radio) => {
    setViewRadio(radio);
    setShowView(true);
  };

  const handleDelete = async (radio: Radio) => {
    if (!token || !adminAccess) return;
    try {
      await deleteRadio(radio.radioId);
    } catch (e: any) {
      // Optionally handle error locally if needed
    }
  };

  const handleFormSubmit = async (form: any) => {
    if (!token) return;
    try {
      if (editRadio) {
        await updateRadio(editRadio.radioId, form);
      } else {
        await addRadio(form);
      }
      setShowForm(false);
    } catch (e: any) {
      // Optionally handle error locally if needed
    }
  };

  if (!token) return <Alert variant="warning">{ALERT_NOT_LOGGED_IN}</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col><strong>Radios</strong></Col>
            <Col md="auto" className="d-flex align-items-center gap-2">
              <ContextSelect
                label="Radio"
                options={radios}
                value={selectedRadio ? selectedRadio.radioId : null}
                onSelect={id => setSelectedRadio(id ? radios.find(r => r.radioId === id) ?? null : null)}
                loading={loading}
                getOptionLabel={r => r.name ? `${r.name} (${r.serialNumber})` : r.serialNumber}
                getOptionValue={r => r.radioId}
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
                Add Radio
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          <Table striped bordered hover size="sm" responsive className="mb-0">
            <thead>
              <tr>
                <th>Serial Number</th>
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
                  </tr>
                ))
              ) : radios.length === 0 ? (
                <tr><td colSpan={3} className="text-center">No radios found.</td></tr>
              ) : (
                radios.map(r => (
                  <tr key={r.radioId}>
                    <td>{r.serialNumber}</td>
                    <td>
                      {r.status === RadioStatus.Available && (
                        <span title="Available" style={{ marginRight: 6 }}>
                          <CircleFill color="green" size={18} />
                        </span>
                      )}
                      {r.status === RadioStatus.Assigned && (
                        <span title="Assigned" style={{ marginRight: 6 }}>
                          <CheckCircleFill color="red" size={18} />
                        </span>
                      )}
                      {r.status === RadioStatus.Maintenance && (
                        <span title="Maintenance" style={{ marginRight: 6 }}>
                          <DashCircleFill color="orange" size={18} />
                        </span>
                      )}
                      {r.status === RadioStatus.Retired && (
                        <span title="Retired" style={{ marginRight: 6 }}>
                          <XCircleFill color="gray" size={18} />
                        </span>
                      )}
                    </td>
                    <td>
                      <Button size="sm" variant="info" onClick={() => handleView(r)}>View</Button>{' '}
                      <Button size="sm" variant="primary" onClick={() => handleEdit(r)}>Edit</Button>{' '}
                      <Button size="sm" variant="danger" disabled={!superAdminAccess} onClick={() => handleDelete(r)}>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <RadioForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initial={editRadio}
      />
      <RadioViewModal
        show={showView}
        onHide={() => setShowView(false)}
        radio={viewRadio}
      />
    </Container>
  );
};

export default RadiosPage;
