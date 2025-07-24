import { Volunteer } from '../types/Volunteer';
import { Modal, Button, Table } from 'react-bootstrap';

interface VolunteerViewModalProps {
  show: boolean;
  onHide: () => void;
  volunteer: Volunteer | null;
}

const VolunteerViewModal: React.FC<VolunteerViewModalProps> = ({ show, onHide, volunteer }) => {
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
            <tr><th>Contact Info</th><td>{volunteer.contactInfo}</td></tr>
            <tr><th>Location</th><td>{volunteer.currentLocation}</td></tr>
            <tr><th>Status</th><td>{volunteer.status}</td></tr>
            <tr><th>Notes</th><td>{volunteer.notes}</td></tr>
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
