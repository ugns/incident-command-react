import { Radio } from '../../types/Radio';
import { Modal, Button } from 'react-bootstrap';
import FormField from '../../components/fields/FormField';
import NoteField from '../../components/fields/NoteField';
import { useFlags } from 'launchdarkly-react-client-sdk';

interface RadioViewModalProps {
  show: boolean;
  onHide: () => void;
  radio: Radio | null;
}

const RadioViewModal: React.FC<RadioViewModalProps> = ({ show, onHide, radio }) => {
  const { adminAccess } = useFlags();
  if (!radio) return null;
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>View Radio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormField
          name={radio.name || ''}
          label="Name"
          value={radio.name || ''}
          onChange={() => { }}
          readOnly={true}
        />
        <FormField
          name="serialNumber"
          label="Serial Number"
          value={radio.serialNumber || ''}
          require={true}
          onChange={() => { }}
          readOnly={true}
        />
        <FormField
          name="status"
          label='Status'
          value={radio.status || ''}
          onChange={() => { }}
          readOnly={true}
        />
        {adminAccess && (
          <>
            <FormField
              name="hostAgency"
              label='Host Agency'
              value={radio.hostAgency || ''}
              onChange={() => { }}
              readOnly={true}
            />
            <NoteField
              notes={radio.notes || ''}
              onChange={() => { }}
              readOnly={true}
            />
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RadioViewModal;