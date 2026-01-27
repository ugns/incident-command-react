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

  // When modal is opened, pre-populate with selected context
  // Get selected context from context providers
  const { selectedIncident } = useIncident();
  const { selectedPeriod } = usePeriod();
  const { selectedUnit } = useUnit();

  // Wait for context to be ready before initializing modal state
  // If all context arrays are empty, consider context ready (no data to wait for)
  const contextReady =
    !loadingIncidents &&
    !loadingPeriods &&
    !loadingUnits &&
    (
      (
        incidents.length > 0 ||
        periods.length > 0 ||
        units.length > 0 ||
        (incidents.length === 0 && periods.length === 0 && units.length === 0)
      ) || (
        (incidents.length === 0 || selectedIncident || incidentId) &&
        (periods.length === 0 || selectedPeriod || periodId) &&
        (units.length === 0 || selectedUnit || unitId)
      )
    );

  useEffect(() => {
    if (show && contextReady) {
      setIncidentId(selectedIncident ? selectedIncident.incidentId : null);
      setPeriodId(selectedPeriod ? selectedPeriod.periodId : null);
      setUnitId(selectedUnit ? selectedUnit.unitId : null);
    }
    // Only run when modal is shown and context is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, contextReady]);

  // Filter periods by selected incident and unit
  const filteredPeriods = periods.filter(p => {
    if (incidentId && p.incidentId !== incidentId) return false;
    if (unitId && p.unitId !== unitId) return false;
    return true;
  });
  const filteredUnits = units;

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

  if (!contextReady && show) {
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Select Operation Context</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Loading context...</div>
        </Modal.Body>
      </Modal>
    );
  }

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
          onSelect={id => {
            setIncidentId(id);
            setUnitId(null);
            setPeriodId(null);
          }}
          loading={loadingIncidents}
          getOptionLabel={i => i.name || i.incidentId}
          getOptionValue={i => i.incidentId}
        />
        <ContextSelect
          label="Unit"
          options={filteredUnits}
          value={unitId}
          onSelect={id => {
            setUnitId(id);
            setPeriodId(null);
          }}
          loading={loadingUnits}
          disabled={!incidentId}
          getOptionLabel={u => u.description || u.name || u.unitId}
          getOptionValue={u => u.unitId}
        />
        <ContextSelect
          label="Period"
          options={filteredPeriods}
          value={periodId}
          onSelect={setPeriodId}
          loading={loadingPeriods}
          disabled={!unitId}
          getOptionLabel={p => p.description || p.periodId}
          getOptionValue={p => p.periodId}
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
