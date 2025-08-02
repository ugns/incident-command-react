import { Location } from '../../types/Location';
import { Modal, Button } from 'react-bootstrap';
import LocationField from '../../components/fields/LocationField';
import FormField from '../../components/fields/FormField';
import DescriptorField from '../../components/fields/DescriptorField';
import { Unit } from '../../types/Unit';

interface LocationViewModalProps {
  show: boolean;
  onHide: () => void;
  location: Location | null;
  units: Unit[];
}

const LocationViewModal: React.FC<LocationViewModalProps> = ({ show, onHide, location, units }) => {
  if (!location) return null;

  const unit = location.unitId ? units.find(u => u.unitId === location.unitId) : null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Modal.Title>View Location</Modal.Title>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DescriptorField
          name={location.name || ''}
          description={location.description || ''}
          onChange={() => { }}
          readOnly={true}
        />
        <LocationField
          latitude={location?.latitude ?? 0}
          longitude={location?.longitude ?? 0}
          address={location?.address || ''}
          onChange={() => { }}
          readOnly={true}
        />
        <FormField
          name="Unit"
          value={unit ? unit.name : 'N/A'}
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

export default LocationViewModal;
