import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import DescriptorField from '../../components/fields/DescriptorField';
import LocationField from '../../components/fields/LocationField';
import ContextSelect from '../../components/ContextSelect';
import { Unit } from '../../types/Unit';
import FormField from '../../components/fields/FormField';

interface LocationFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  initial?: any;
  units: Unit[];
  unitsLoading?: boolean;
}

const LocationForm: React.FC<LocationFormProps> = ({ show, onHide, onSubmit, initial, units, unitsLoading }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    label: initial?.label || '',
    description: initial?.description || '',
    latitude: initial?.latitude || '',
    longitude: initial?.longitude || '',
    address: initial?.address || '',
    status: initial?.status || '',
    unitId: initial?.unitId || '',
  });

  React.useEffect(() => {
    if (show) {
      setForm({
        name: initial?.name || '',
        label: initial?.label || '',
        description: initial?.description || '',
        latitude: initial?.latitude || '',
        longitude: initial?.longitude || '',
        address: initial?.address || '',
        status: initial?.status || '',
        unitId: initial?.unitId || '',
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

  const handleUnitSelect = (id: string | null) => {
    setForm(f => ({ ...f, unitId: id || '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No normalization: just submit the form as-is
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{initial ? 'Edit Location' : 'Add Location'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <DescriptorField
            name={form.name}
            description={form.description}
            onChange={handleChange}
          />
          <FormField
            name="label"
            value={form.label}
            onChange={handleChange}
          />
          <LocationField
            latitude={form.latitude}
            longitude={form.longitude}
            address={form.address}
            onChange={handleChange}
          />
          <ContextSelect
            label='Unit'
            options={units}
            value={form.unitId || null}
            onSelect={handleUnitSelect}
            loading={unitsLoading}
            getOptionLabel={u => u.name}
            getOptionValue={u => u.unitId}
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

export default LocationForm;
