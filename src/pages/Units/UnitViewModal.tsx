import { Unit } from '../../types/Unit';
import { Modal, Button } from 'react-bootstrap';
import DescriptorField from '../../components/fields/DescriptorField';
import NoteField from '../../components/fields/NoteField';

interface UnitViewModalProps {
  show: boolean;
  onHide: () => void;
  unit: Unit | null;
}

const UnitViewModal: React.FC<UnitViewModalProps> = ({ show, onHide, unit }) => {
  if (!unit) return null;
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>View Unit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DescriptorField
          name={unit.name || ''}
          description={unit.description || ''}
          onChange={() => { }}
          readOnly={true}
        />
        <NoteField
          notes={unit.notes || ''}
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

export default UnitViewModal;
