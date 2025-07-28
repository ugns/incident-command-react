import React, { useState } from 'react';
import { Form, Button, Modal, FloatingLabel } from 'react-bootstrap';

interface OrganizationFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  initial?: any;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ show, onHide, onSubmit, initial }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    aud: initial?.aud || '',
    hd: initial?.hd || '',
    notes: initial?.notes || '',
  });

  React.useEffect(() => {
    if (show) {
      setForm({
        name: initial?.name || '',
        aud: initial?.aud || '',
        hd: initial?.hd || '',
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
        <Modal.Title>{initial ? 'Edit Organization' : 'Add Organization'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <FloatingLabel controlId='name' label='Name'>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3">
            <FloatingLabel controlId='aud' label='Client ID'>
              <Form.Control name="aud" value={form.aud} onChange={handleChange} />
            </FloatingLabel>
          </Form.Group>
          <Form.Group className="mb-3">
            <FloatingLabel controlId='hd' label='Hosted Domain'>
              <Form.Control name="hd" value={form.hd} onChange={handleChange} />
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

export default OrganizationForm;
