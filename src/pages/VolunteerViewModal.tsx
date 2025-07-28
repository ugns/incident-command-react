import { Volunteer } from '../types/Volunteer';
import { Modal, Button, Table } from 'react-bootstrap';
import { useFlags } from 'launchdarkly-react-client-sdk';
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
          {volunteer.name}
          {volunteer.callsign ? ` (${volunteer.callsign})` : ''}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table borderless size="sm">
          <tbody>
            <tr><th>E-Mail</th><td>{volunteer.email}</td></tr>
            <tr><th>Location</th><td>{volunteer.currentLocation}</td></tr>
            <tr><th>Status</th><td>{volunteer.status}</td></tr>
            <tr><th>Notes</th><td>{volunteer.notes}</td></tr>
            {adminAccess && (
              <>
                <tr><th>Cellphone</th><td>{volunteer.cellphone}</td></tr>
                <tr><th>Family Name</th><td>{volunteer.familyName}</td></tr>
                <tr><th>Given Name</th><td>{volunteer.givenName}</td></tr>
              </>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VolunteerViewModal;
