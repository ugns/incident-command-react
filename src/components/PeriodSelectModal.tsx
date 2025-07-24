import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PeriodSelect from './PeriodSelect';
import type { Period } from '../types/Period';
// No data fetching here; periods are passed as props

// Removed unused imports and variables

interface PeriodSelectModalProps {
  show: boolean;
  selectedPeriod: Period | null;
  periods: Period[];
  loading?: boolean;
  onHide: () => void;
  onSelect: (period: Period | null) => void;
}

const PeriodSelectModal: React.FC<PeriodSelectModalProps> = ({ show, selectedPeriod, periods, loading, onHide, onSelect }) => {
  const [pendingPeriod, setPendingPeriod] = useState<Period | null>(selectedPeriod);

  useEffect(() => {
    if (show) setPendingPeriod(selectedPeriod);
  }, [show, selectedPeriod]);

  const handleSelect = (period: Period | null) => {
    setPendingPeriod(period);
  };

  const handleConfirm = () => {
    onSelect(pendingPeriod || null);
    onHide();
  };

  const handleReset = () => {
    setPendingPeriod(null);
    onSelect(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Select Operating Period</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PeriodSelect
          periods={periods}
          value={pendingPeriod}
          onSelect={handleSelect}
          loading={loading}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="warning" onClick={handleReset} disabled={!pendingPeriod && !selectedPeriod}>Reset Period</Button>
        <Button variant="primary" onClick={handleConfirm} disabled={!pendingPeriod}>Select</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PeriodSelectModal;
