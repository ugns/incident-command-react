import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import FormField from '../../components/fields/FormField';
import NoteField from '../../components/fields/NoteField';
import ContextSelect from '../../components/ContextSelect';
import { RadioStatus } from '../../types/Radio';

interface RadioFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  initial?: any;
}

// Convert enum to array of { value, label }
const radioStatusOptions = Object.values(RadioStatus).map(status => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
}));

const RadioForm: React.FC<RadioFormProps> = ({ show, onHide, onSubmit, initial }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    status: initial?.status || '',
    serialNumber: initial?.serialNumber || '',
    hostAgency: initial?.hostAgency || '',
    notes: initial?.notes || '',
  });

  React.useEffect(() => {
    if (show) {
      setForm({
        name: initial?.name || '',
        status: initial?.status || '',
        serialNumber: initial?.serialNumber || '',
        hostAgency: initial?.hostAgency || '',
        notes: initial?.notes || '',
      });
    }
  }, [initial, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No normalization: just submit the form as-is
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{initial ? 'Edit Radio' : 'Add Radio'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <FormField
            name={form.name}
            label="Name"
            value={form.name}
            onChange={handleChange}
          />
          <FormField
            name="serialNumber"
            label="Serial Number"
            value={form.serialNumber}
            require={true}
            onChange={handleChange}
          />
          <ContextSelect
            label='Status'
            options={radioStatusOptions}
            value={form.status}
            onSelect={status => setForm({ ...form, status })}
            getOptionLabel={o => o.label}
            getOptionValue={o => o.value}
          />
          <FormField
            name="hostAgency"
            label='Host Agency'
            value={form.hostAgency}
            onChange={handleChange}
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

export default RadioForm;
