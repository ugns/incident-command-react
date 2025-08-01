import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { isoToLocal, toISO } from '../../utils/dateFormat';
import ContextSelect from '../../components/ContextSelect';
import DescriptorField from '../../components/fields/DescriptorField';
import TimePeriodField from '../../components/fields/TimePeriodField';
import { Incident } from '../../types/Incident';
import { Unit } from '../../types/Unit';

interface PeriodFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  initial?: any;
  incidents: Incident[];
  units: Unit[];
  incidentsLoading?: boolean;
  unitsLoading?: boolean;
}


const PeriodForm: React.FC<PeriodFormProps> = ({ show, onHide, onSubmit, initial, incidents, incidentsLoading, units, unitsLoading }) => {
  const [form, setForm] = useState({
    incidentId: initial?.incidentId || '',
    unitId: initial?.unitId || '',
    name: initial?.name || '',
    icsPosition: initial?.icsPosition || '',
    homeAgency: initial?.homeAgency || '',
    startTime: initial?.startTime || '',
    endTime: initial?.endTime || '',
    description: initial?.description || '',
  });


  useEffect(() => {
    if (show) {
      setForm({
        incidentId: initial?.incidentId || '',
        unitId: initial?.unitId || '',
        name: initial?.name || '',
        icsPosition: initial?.icsPosition || '',
        homeAgency: initial?.homeAgency || '',
        startTime: initial?.startTime ? isoToLocal(initial.startTime) : '',
        endTime: initial?.endTime ? isoToLocal(initial.endTime) : '',
        description: initial?.description || '',
      });
    }
  }, [initial, show]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIncidentSelect = (id: string | null) => {
    setForm(f => ({ ...f, incidentId: id || '' }));
  };

  const handleUnitSelect = (id: string | null) => {
    setForm(f => ({ ...f, unitId: id || '' }));
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
          <ContextSelect
            label="Incident"
            options={incidents}
            value={form.incidentId || null}
            onSelect={handleIncidentSelect}
            loading={incidentsLoading}
            getOptionLabel={i => i.name}
            getOptionValue={i => i.incidentId}
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
          <DescriptorField
            name={form.name}
            description={form.description}
            onChange={handleChange}
          />
          <TimePeriodField
            startTime={form.startTime}
            endTime={form.endTime}
            onChange={handleChange}
          />
          {/* <InputGroup className="mb-3">
            <FloatingLabel controlId='startTime' label='Start Time'>
              <Form.Control name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} />
              <Form.Text className="text-muted">Defaults to now</Form.Text>
            </FloatingLabel>
            <FloatingLabel controlId='endTime' label='End Time'>
              <Form.Control name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} />
              <Form.Text className="text-muted">Can be entered later</Form.Text>
            </FloatingLabel>
          </InputGroup> */}
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
