import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useIncident } from '../context/IncidentContext';
import { usePeriod } from '../context/PeriodContext';
import { useUnit } from '../context/UnitContext';
import ContextSelect from './ContextSelect';

interface ContextSelectModalProps {
  show: boolean;
  onHide: () => void;
  onSelect: (incidentId: string | null, periodId: string | null, unitId: string | null) => void;
}

const ContextSelectModal: React.FC<ContextSelectModalProps> = ({ show, onHide, onSelect }) => {
  const { incidents, loading: loadingIncidents } = useIncident();
  const { periods, loading: loadingPeriods } = usePeriod();
  const { units, loading: loadingUnits } = useUnit();

  const [incidentId, setIncidentId] = useState<string | null>(null);
  const [periodId, setPeriodId] = useState<string | null>(null);
  const [unitId, setUnitId] = useState<string | null>(null);

  // Reset lower selections when upper changes
  useEffect(() => {
    setPeriodId(null);
    setUnitId(null);
  }, [incidentId]);
  useEffect(() => {
    setUnitId(null);
  }, [periodId]);

  // Filter periods/units by selection if needed
  const filteredPeriods = incidentId ? periods.filter(p => p.incidentId === incidentId) : periods;
  const filteredUnits = periodId ? units.filter(u => u.periodId === periodId) : units;

  const handleConfirm = () => {
    onSelect(incidentId, periodId, unitId);
    onHide();
  };

  const handleReset = () => {
    setIncidentId(null);
    setPeriodId(null);
    setUnitId(null);
    onSelect(null, null, null);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Select Operation Context</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ContextSelect
          label="Incident"
          options={incidents}
          value={incidentId}
          onSelect={setIncidentId}
          loading={loadingIncidents}
          getOptionLabel={i => i.name || i.incidentId}
          getOptionValue={i => i.incidentId}
        />
        <ContextSelect
          label="Period"
          options={filteredPeriods}
          value={periodId}
          onSelect={setPeriodId}
          loading={loadingPeriods}
          disabled={!incidentId}
          getOptionLabel={p => p.name || p.periodId}
          getOptionValue={p => p.periodId}
        />
        <ContextSelect
          label="Unit"
          options={filteredUnits}
          value={unitId}
          onSelect={setUnitId}
          loading={loadingUnits}
          disabled={!periodId}
          getOptionLabel={u => u.name || u.unitId}
          getOptionValue={u => u.unitId}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="warning" onClick={handleReset} disabled={!incidentId && !periodId && !unitId}>Reset</Button>
        <Button variant="primary" onClick={handleConfirm} disabled={!incidentId || !periodId || !unitId}>Select</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContextSelectModal;
