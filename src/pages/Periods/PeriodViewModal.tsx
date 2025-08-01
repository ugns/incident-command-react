import { Period } from '../../types/Period';
import { Modal, Button } from 'react-bootstrap';
import DescriptorField from '../../components/fields/DescriptorField';
import TimePeriodField from '../../components/fields/TimePeriodField';
import { Incident } from '../../types/Incident';
import { Unit } from '../../types/Unit';
import FormField from '../../components/fields/FormField';
import { isoToLocal } from '../../utils/dateFormat';

interface PeriodViewModalProps {
  show: boolean;
  onHide: () => void;
  period: Period | null;
  incidents: Incident[];
  units: Unit[];
}

const PeriodViewModal: React.FC<PeriodViewModalProps> = ({ show, onHide, period, incidents, units }) => {
  if (!period) return null;

  const unit = period.unitId ? units.find(u => u.unitId === period.unitId) : null;
  const incident = period.incidentId ? incidents.find(i => i.incidentId === period.incidentId) : null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>View Period</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormField
          name="Incident"
          value={incident ? incident.name : 'N/A'}
          onChange={() => {}}
          readOnly={true}
        />
        <FormField
          name="Unit"
          value={unit ? unit.name : 'N/A'}
          onChange={() => {}}
          readOnly={true}
        />
        <DescriptorField
          name={period?.name || ''}
          description={period?.description || ''}
          onChange={() => { }}
          readOnly={true}
        />
        <TimePeriodField
          startTime={period?.startTime ? isoToLocal(period.startTime) : ''}
          endTime={period?.endTime ? isoToLocal(period.endTime) : ''}
          onChange={() => { }}
          readOnly={true}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PeriodViewModal;
