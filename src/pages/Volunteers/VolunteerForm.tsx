import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import NameFields from '../../components/fields/NameField';
import ContactInfoFields from '../../components/fields/ContactInfoField';
import CallsignField from '../../components/fields/CallsignField';
import LocationField from '../../components/fields/LocationField';
import NoteField from '../../components/fields/NoteField';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <NameFields
            name={form.name}
            givenName={form.givenName}
            familyName={form.familyName}
            onChange={handleChange}
          />
          <CallsignField
            callsign={form.callsign}
            onChange={handleChange}
          />
          <ContactInfoFields
            email={form.email}
            cellphone={form.cellphone}
            onChange={handleChange}
          />
          <LocationField
            currentLocation={form.currentLocation}
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

export default VolunteerForm;
