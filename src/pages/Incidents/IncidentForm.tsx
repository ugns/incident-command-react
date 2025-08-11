import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import NoteField from '../../components/fields/NoteField';
import DescriptorField from '../../components/fields/DescriptorField';
import LocationField from '../../components/fields/LocationField';

interface IncidentFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  initial?: any;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ show, onHide, onSubmit, initial }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    notes: initial?.notes || '',
    latitude: initial?.latitude || '',
    longitude: initial?.longitude || '',
    address: initial?.address || '',
  });

  React.useEffect(() => {
    if (show) {
      setForm({
        name: initial?.name || '',
        description: initial?.description || '',
        notes: initial?.notes || '',
        latitude: initial?.latitude || '',
        longitude: initial?.longitude || '',
        address: initial?.address || '',
      });
    }
  }, [initial, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    // Support batched lat/lng event from map picker
    if (e.target.name === 'latitude-longitude' && e.target.value) {
      setForm(f => ({
        ...f,
        latitude: e.target.value.latitude,
        longitude: e.target.value.longitude,
      }));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{initial ? 'Edit Incident' : 'Add Incident'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <DescriptorField
            name={form.name}
            description={form.description}
            onChange={handleChange}
          />
          <LocationField
            latitude={form.latitude}
            longitude={form.longitude}
            address={form.address}
            onChange={handleChange}
            incidentLat={form.latitude !== '' ? Number(form.latitude) : undefined}
            incidentLng={form.longitude !== '' ? Number(form.longitude) : undefined}
          />
          <NoteField
            notes={form.notes}
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button type="submit" variant="primary">{initial ? 'Save' : 'Add'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default IncidentForm;
