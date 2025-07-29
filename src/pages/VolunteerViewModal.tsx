import { Volunteer } from '../types/Volunteer';
import { Modal, Button } from 'react-bootstrap';
import { useFlags } from 'launchdarkly-react-client-sdk';
import NameFields from '../components/NameField';
import ContactInfoFields from '../components/ContactInfoField';
import CallsignField from '../components/CallsignField';
import LocationField from '../components/LocationField';
import NoteField from '../components/NoteField';

interface VolunteerViewModalProps {
  show: boolean;
  onHide: () => void;
  volunteer: Volunteer | null;
}

const VolunteerViewModal: React.FC<VolunteerViewModalProps> = ({ show, onHide, volunteer }) => {
  const { adminAccess } = useFlags();
  if (!volunteer) return null;
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Modal.Title>View Volunteer</Modal.Title>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NameFields
          name={volunteer.name}
          givenName={volunteer?.givenName || ''}
          familyName={volunteer?.familyName || ''}
          onChange={() => { }}
          readOnly={true}
        />
        <CallsignField
          callsign={volunteer?.callsign || ''}
          onChange={() => { }}
          readOnly={true}
        />
        {adminAccess && (
          <>
            <ContactInfoFields
              email={volunteer?.email || ''}
              cellphone={volunteer?.cellphone || ''}
              onChange={() => { }}
              readOnly={true}
            />
          </>
        )}
        <LocationField
          currentLocation={volunteer?.currentLocation || ''}
          onChange={() => { }}
          readOnly={true}
        />
        {adminAccess && (
          <>
            <NoteField
              notes={volunteer?.notes || ''}
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

export default VolunteerViewModal;
