import React from 'react';
import { Container, Card, Table, Button, Placeholder, Row, Col } from 'react-bootstrap';

// TODO: Replace with actual Radio type once defined
// import { Radio } from '../../types/Radio';

const RadiosPage: React.FC = () => {
  // Placeholder state and handlers for CRUD actions
  // Replace with real hooks/context once backend/API is ready
  const radios: Array<{ id: string; serialNumber: string; model: string; status: string }> = [];
  const loading = false;
  // const error = null;

  return (
    <Container>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col><strong>Radios</strong></Col>
            <Col md="auto" className="d-flex align-items-center gap-2">
              <Button variant="success" /* onClick={handleAdd} */ disabled>
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
                <th>Model</th>
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
                    <td><Placeholder animation="glow"><Placeholder xs={7} /></Placeholder></td>
                  </tr>
                ))
              ) : radios.length === 0 ? (
                <tr><td colSpan={4} className="text-center">No radios found.</td></tr>
              ) : (
                radios.map(radio => (
                  <tr key={radio.id}>
                    <td>{radio.serialNumber}</td>
                    <td>{radio.model}</td>
                    <td>{radio.status}</td>
                    <td>
                      <Button size="sm" variant="info" disabled>View</Button>{' '}
                      <Button size="sm" variant="primary" disabled>Edit</Button>{' '}
                      <Button size="sm" variant="danger" disabled>Delete</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RadiosPage;
