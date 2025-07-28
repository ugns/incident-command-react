import React, { useState } from 'react';
import { Form, Button, Modal, InputGroup, FloatingLabel } from 'react-bootstrap';

interface VolunteerFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  initial?: any;
}

const VolunteerForm: React.FC<VolunteerFormProps> = ({ show, onHide, onSubmit, initial }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    familyName: initial?.familyName || '',
    givenName: initial?.givenName || '',
    email: initial?.email || '',
    cellphone: initial?.cellphone || '',
    icsPosition: initial?.icsPosition || '',
    homeAgency: initial?.homeAgency || '',
    status: initial?.status || '',
    callsign: initial?.callsign || '',
    radio: initial?.radio || '',
    radioStatus: initial?.radioStatus || '',
    currentLocation: initial?.currentLocation || '',
    notes: initial?.notes || '',
  });

  React.useEffect(() => {
    if (show) {
      setForm({
        name: initial?.name || '',
        familyName: initial?.familyName || '',
        givenName: initial?.givenName || '',
        email: initial?.email || '',
        cellphone: initial?.cellphone || '',
        icsPosition: initial?.icsPosition || '',
        homeAgency: initial?.homeAgency || '',
        status: initial?.status || '',
        callsign: initial?.callsign || '',
        radio: initial?.radio || '',
        radioStatus: initial?.radioStatus || '',
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
            <FloatingLabel controlId='name' label='Display Name'>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </FloatingLabel>
          </Form.Group>
          <InputGroup className="mb-3">
            <FloatingLabel controlId='givenName' label='First Name'>
              <Form.Control name="givenName" aria-label="First name" value={form.givenName} onChange={handleChange} />
            </FloatingLabel>
            <FloatingLabel controlId='familyName' label='Last Name'>
              <Form.Control name="familyName" aria-label="Last name" value={form.familyName} onChange={handleChange} />
            </FloatingLabel>
          </InputGroup>
          <Form.Group className="mb-3">
            <FloatingLabel controlId='callsign' label='Callsign'>
              <Form.Control name="callsign" value={form.callsign} onChange={handleChange} />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3">
            <FloatingLabel controlId='email' label='E-Mail'>
              <Form.Control name="email" value={form.email} onChange={handleChange} />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3">
            <FloatingLabel controlId='currentLocation' label='Current Location'>
              <Form.Control name="currentLocation" value={form.currentLocation} onChange={handleChange} />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3">
            <FloatingLabel controlId='notes' label='Notes'>
              <Form.Control name="notes" value={form.notes} onChange={handleChange} />
            </FloatingLabel>
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
