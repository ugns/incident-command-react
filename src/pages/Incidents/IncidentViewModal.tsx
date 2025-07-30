import { Incident } from '../../types/Incident';
import { Modal, Button } from 'react-bootstrap';
import IncidentField from '../../components/fields/DescriptorField';
import NoteField from '../../components/fields/NoteField';

interface IncidentViewModalProps {
  show: boolean;
  onHide: () => void;
  incident: Incident | null;
}

const IncidentViewModal: React.FC<IncidentViewModalProps> = ({ show, onHide, incident }) => {
  if (!incident) return null;
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>View Incident</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <IncidentField
            name={incident.name || ''}
            description={incident.description || ''}
            onChange={() => {}}
            readOnly={true}
          />
          <NoteField
            notes={incident?.notes || ''}
            onChange={() => {}}
            readOnly={true}
          />
        </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IncidentViewModal;
