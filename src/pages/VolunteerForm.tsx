import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

interface VolunteerFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  initial?: any;
}

const VolunteerForm: React.FC<VolunteerFormProps> = ({ show, onHide, onSubmit, initial }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    callsign: initial?.callsign || '',
    contactInfo: initial?.contactInfo || '',
    currentLocation: initial?.currentLocation || '',
    notes: initial?.notes || '',
  });

  React.useEffect(() => {
    if (show) {
      setForm({
        name: initial?.name || '',
        callsign: initial?.callsign || '',
        contactInfo: initial?.contactInfo || '',
        currentLocation: initial?.currentLocation || '',
        notes: initial?.notes || '',
      });
    }
  }, [initial, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{initial ? 'Edit Volunteer' : 'Add Volunteer'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={form.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Callsign</Form.Label>
            <Form.Control name="callsign" value={form.callsign} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contact Info</Form.Label>
            <Form.Control name="contactInfo" value={form.contactInfo} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Current Location</Form.Label>
            <Form.Control name="currentLocation" value={form.currentLocation} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control name="notes" value={form.notes} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button type="submit" variant="primary">{initial ? 'Save' : 'Add'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default VolunteerForm;
