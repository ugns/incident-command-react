import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, FloatingLabel, InputGroup } from 'react-bootstrap';
import { isoToLocal, toISO } from '../utils/dateFormat';

interface PeriodFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  initial?: any;
}

const PeriodForm: React.FC<PeriodFormProps> = ({ show, onHide, onSubmit, initial }) => {
  const [form, setForm] = useState({
    startTime: initial?.startTime || '',
    endTime: initial?.endTime || '',
    description: initial?.description || '',
  });

  useEffect(() => {
    if (show) {
      setForm({
        startTime: initial?.startTime ? isoToLocal(initial.startTime) : '',
        endTime: initial?.endTime ? isoToLocal(initial.endTime) : '',
        description: initial?.description || '',
      });
    }
  }, [initial, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      startTime: form.startTime ? toISO(form.startTime) : undefined,
      endTime: form.endTime ? toISO(form.endTime) : undefined,
    };
    onSubmit(data);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{initial ? 'Edit Period' : 'Add Period'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <FloatingLabel controlId='description' label='Description'>
              <Form.Control name="description" value={form.description} onChange={handleChange} required />
            </FloatingLabel>
          </Form.Group>
          <InputGroup className="mb-3">
            <FloatingLabel controlId='startTime' label='Start Time'>
              <Form.Control name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} />
              <Form.Text className="text-muted">Defaults to now</Form.Text>
            </FloatingLabel>
            <FloatingLabel controlId='endTime' label='End Time'>
              <Form.Control name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} />
              <Form.Text className="text-muted">Can be entered later</Form.Text>
            </FloatingLabel>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button type="submit" variant="primary">{initial ? 'Save' : 'Add'}</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PeriodForm;
