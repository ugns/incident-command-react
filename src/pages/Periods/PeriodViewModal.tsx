import { Period } from '../../types/Period';
import { Modal, Button, Table } from 'react-bootstrap';

interface PeriodViewModalProps {
  show: boolean;
  onHide: () => void;
  period: Period | null;
}

const PeriodViewModal: React.FC<PeriodViewModalProps> = ({ show, onHide, period }) => {
  if (!period) return null;
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {period.description}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table borderless size="sm">
          <tbody>
            <tr><th>Start</th><td>{period.startTime}</td></tr>
            <tr><th>End</th><td>{period.endTime}</td></tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PeriodViewModal;
