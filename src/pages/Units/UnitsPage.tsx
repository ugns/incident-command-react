import React, { useContext, useState } from 'react';
import { useUnit } from '../../context/UnitContext';
import { Button, Card, Table, Container, Row, Col, Placeholder, Alert, Spinner, SplitButton, Dropdown } from 'react-bootstrap';
import UnitForm from './UnitForm';
import UnitViewModal from './UnitViewModal';
import { Unit } from '../../types/Unit';
import ContextSelect from '../../components/ContextSelect';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AuthContext } from '../../context/AuthContext';
import { ALERT_NOT_LOGGED_IN } from '../../constants/messages';
import unitService from '../../services/unitService';
import { downloadBlob } from '../../utils/download';

const UnitsPage: React.FC = () => {
  const { token, logout } = useContext(AuthContext);
  const { superAdminAccess } = useFlags();
  const { units, loading, error, refresh, addUnit, updateUnit, deleteUnit } = useUnit();
  const [showForm, setShowForm] = useState(false);
  const [editUnit, setEditUnit] = useState<Unit | null>(null);
  const [showView, setShowView] = useState(false);
  const [viewUnit, setViewUnit] = useState<Unit | null>(null);
  const [exporting, setExporting] = useState(false);
  // Sorting and filtering state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const handleAdd = () => {
    setEditUnit(null);
    setShowForm(true);
  };

  const handleEdit = (unit: Unit) => {
    setEditUnit(unit);
    setShowForm(true);
  };

  const handleView = (unit: Unit) => {
    setViewUnit(unit);
    setShowView(true);
  };

  const handleDelete = async (unit: Unit) => {
    try {
      await deleteUnit(unit.unitId);
      await refresh();
    } catch (e) {
      // Optionally handle error locally
    }
  };

  const handleFormSubmit = async (form: Partial<Unit>) => {
    try {
      if (editUnit) {
        await updateUnit(editUnit.unitId, form);
      } else {
        await addUnit(form);
      }
      setShowForm(false);
      await refresh();
    } catch (e) {
      // Optionally handle error locally
    }
  };

  const handleExport = async () => {
    if (!token) return;
    setExporting(true);
    try {
      const { blob, filename } = await unitService.export(token, logout);
      downloadBlob(blob, filename || 'units.csv');
    } catch (e) {
      // Optionally handle error locally
    } finally {
      setExporting(false);
    }
  };

  if (!token) return <Alert variant="warning">{ALERT_NOT_LOGGED_IN}</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  // Sort units by name
  const sortedUnits = [...units].sort((a, b) => {
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
            <Col><strong>Units</strong></Col>
            <Col md="auto" className="d-flex align-items-center gap-2">
              <ContextSelect
                label="Unit"
                options={units}
                value={selectedUnit ? selectedUnit.unitId : null}
                onSelect={id => setSelectedUnit(id ? units.find(u => u.unitId === id) ?? null : null)}
                loading={loading}
                getOptionLabel={v => v.name}
                getOptionValue={v => v.unitId}
              />
              <SplitButton
                variant="success"
                title="Add Unit"
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
                  </tr>
                ))
              ) : sortedUnits.length === 0 ? (
                <tr><td colSpan={2} className="text-center">No units found.</td></tr>
              ) : (
                sortedUnits.map(unit => (
                  <tr key={unit.unitId} className={selectedUnit && selectedUnit.unitId === unit.unitId ? 'table-active' : ''}>
                    <td>{unit.name || unit.unitId}</td>
                    <td>
                      <Button size="sm" variant="info" onClick={() => handleView(unit)}>View</Button>{' '}
                      <Button size="sm" variant="primary" onClick={() => handleEdit(unit)}>Edit</Button>{' '}
                      {superAdminAccess && (
                        <Button size="sm" variant="danger" disabled={!superAdminAccess} onClick={() => handleDelete(unit)}>Delete</Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <UnitForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initial={editUnit}
      />
      <UnitViewModal
        show={showView}
        onHide={() => setShowView(false)}
        unit={viewUnit}
      />
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
};

export default UnitsPage;
