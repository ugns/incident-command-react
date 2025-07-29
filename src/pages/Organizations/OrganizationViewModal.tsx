import { Organization } from '../../types/Organization';
import { Modal, Button, Table } from 'react-bootstrap';
import OrganizationField from '../../components/fields/OrganizationField';
import NoteField from '../../components/fields/NoteField';

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
        <Modal.Title>View Organization</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <OrganizationField
            name={organization.name || ''}
            aud={organization.aud || ''}
            hd={organization?.hd || ''}
            onChange={() => {}}
            readOnly={true}
          />
          <NoteField
            notes={organization?.notes || ''}
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

export default OrganizationViewModal;
