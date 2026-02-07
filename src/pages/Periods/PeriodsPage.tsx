import React, { useContext, useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AuthContext } from '../../context/AuthContext';
import { Container, Card, Table, Button, Alert, Placeholder, Row, Col, SplitButton, Dropdown } from 'react-bootstrap';
import ContextSelect from '../../components/ContextSelect';
import { Period } from '../../types/Period';
import { Unit } from '../../types/Unit';
import { formatLocalDateTime } from '../../utils/dateFormat';
import { useIncident } from '../../context/IncidentContext';
import PeriodForm from './PeriodForm';
import PeriodViewModal from './PeriodViewModal';
import { ALERT_NOT_LOGGED_IN } from '../../constants/messages';
import { useUnit } from '../../context/UnitContext';
import { usePeriod } from '../../context/PeriodContext';
import periodService from '../../services/periodService';
import { downloadBlob } from '../../utils/download';
import ImportModal from '../../components/ImportModal';

const PeriodsPage: React.FC = () => {
  const { token, logout } = useContext(AuthContext);
  const { adminAccess, superAdminAccess } = useFlags();
  const {
    periods,
    loading,
    error,
    addPeriod,
    updatePeriod,
    deletePeriod,
  } = usePeriod();
  const { incidents, loading: incidentsLoading } = useIncident();
  const { units, loading: unitsLoading } = useUnit();
  const [showForm, setShowForm] = useState(false);
  const [editPeriod, setEditPeriod] = useState<Period | null>(null);
  const [showView, setShowView] = useState(false);
  const [viewPeriod, setViewPeriod] = useState<Period | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [showImport, setShowImport] = useState(false);
  // Sorting and filtering state
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleAdd = () => {
    setEditPeriod(null);
    setShowForm(true);
  };

  const handleEdit = (period: Period) => {
    setEditPeriod(period);
    setShowForm(true);
  };

  const handleView = (period: Period) => {
    setViewPeriod(period);
    setShowView(true);
  };

  const handleDelete = async (period: Period) => {
    if (!token || !adminAccess) return;
    try {
      await deletePeriod(period.periodId);
    } catch (e: any) {
      // Optionally handle error locally if needed
    }
  };

  const handleFormSubmit = async (form: any) => {
    if (!token) return;
    try {
      if (editPeriod) {
        await updatePeriod(editPeriod.periodId, form);
      } else {
        await addPeriod(form);
      }
      setShowForm(false);
    } catch (e: any) {
      // error is now handled by context
    }
  };

  const handleExport = async () => {
    if (!token) return;
    setExporting(true);
    try {
      const { blob, filename } = await periodService.export(token, logout);
      downloadBlob(blob, filename || 'periods.csv');
    } catch (e: any) {
      // Optionally handle error locally if needed
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (file: File) => {
    if (!token) throw new Error('Not authenticated');
    setImporting(true);
    try {
      const result = await periodService.import(file, token, logout);
      return result;
    } finally {
      setImporting(false);
    }
  };

  if (!token) return <Alert variant="warning">{ALERT_NOT_LOGGED_IN}</Alert>;
  if (loading) return (
    <Container>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col><strong>Time Periods</strong></Col>
          </Row>
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          <Table striped bordered hover size="sm" responsive className="mb-0">
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, idx) => (
                <tr key={idx}>
                  <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                  <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                  <td><Placeholder animation="glow"><Placeholder xs={10} /></Placeholder></td>
                  <td><Placeholder animation="glow"><Placeholder xs={6} /></Placeholder></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
  if (error) return <Alert variant="danger">{error}</Alert>;

  const periodOptions = periods
    .filter(p => {
      if (selectedUnit && p.unitId !== selectedUnit.unitId) return false;
      return true;
    })
    .slice()
    .sort((a, b) => new Date(a.startTime || '').getTime() - new Date(b.startTime || '').getTime());

  // Filter and sort periods before rendering table
  const filteredPeriods = periodOptions
    .filter(p => {
      if (selectedPeriod && p.periodId !== selectedPeriod.periodId) return false;
      return true;
    })
    .slice()
    .sort((a, b) => {
      const aTime = new Date(a.startTime || '').getTime();
      const bTime = new Date(b.startTime || '').getTime();
      return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
    });

  return (
    <Container>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col><strong>Time Periods</strong></Col>
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
                label="Period"
                options={periodOptions}
                value={selectedPeriod ? selectedPeriod.periodId : null}
                onSelect={id => setSelectedPeriod(id ? periodOptions.find(p => p.periodId === id) ?? null : null)}
                loading={loading}
                getOptionLabel={p => p.description}
                getOptionValue={p => p.periodId}
              />
              <SplitButton
                variant="success"
                title="Add Period"
                onClick={handleAdd}
                disabled={loading}
              >
                <Dropdown.Item onClick={handleExport} disabled={loading || exporting}>
                  {exporting ? 'Exporting…' : 'Export'}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowImport(true)} disabled={loading || importing}>
                  Import…
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
                  Start {sortOrder === 'asc' ? '▲' : '▼'}
                </th>
                <th>End</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeriods.length === 0 ? (
                <tr><td colSpan={4} className="text-center">No periods found.</td></tr>
              ) : (
                filteredPeriods.map(p => (
                  <tr key={p.periodId}>
                    <td>{formatLocalDateTime(p.startTime)}</td>
                    <td>{formatLocalDateTime(p.endTime)}</td>
                    <td>{p.description}</td>
                    <td>
                      <Button size="sm" variant="info" onClick={() => handleView(p)}>View</Button>{' '}
                      <Button size="sm" variant="primary" onClick={() => handleEdit(p)}>Edit</Button>{' '}
                      {superAdminAccess && (
                        <Button size="sm" variant="danger" disabled={!superAdminAccess} onClick={() => handleDelete(p)}>Delete</Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <PeriodForm
        show={showForm}
        onHide={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initial={editPeriod}
        incidents={incidents}
        incidentsLoading={incidentsLoading}
        units={units}
        unitsLoading={unitsLoading}
      />
      <PeriodViewModal
        show={showView}
        onHide={() => setShowView(false)}
        period={viewPeriod}
        incidents={incidents}
        units={units}
      />
      <ImportModal
        show={showImport}
        title="Import Periods"
        busy={importing}
        onHide={() => setShowImport(false)}
        onImport={handleImport}
      />
    </Container>
  );
};

export default PeriodsPage;
