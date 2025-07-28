import { Organization } from '../types/Organization';
import { Modal, Button, Table } from 'react-bootstrap';

interface OrganizationViewModalProps {
  show: boolean;
  onHide: () => void;
  organization: Organization | null;
}

const OrganizationViewModal: React.FC<OrganizationViewModalProps> = ({ show, onHide, organization }) => {
  if (!organization) return null;
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {organization.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table borderless size="sm">
          <tbody>
            <tr><th>Name</th><td>{organization.name}</td></tr>
            <tr><th>Client ID</th><td><span title={organization.aud}>{organization.aud.slice(0, 20)}...</span></td></tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrganizationViewModal;
