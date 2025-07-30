import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
import NameField from './NameField';

interface DescriptorFieldProps {
  name: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const DescriptorField: React.FC<DescriptorFieldProps> = ({
  name,
  description,
  onChange,
  readOnly = false,
}) => (
  <>
    <NameField
      name={name}
      onChange={onChange}
      readOnly={readOnly}
    />
    <Form.Group className="mb-3">
      <FloatingLabel controlId='description' label='Description'>
        <Form.Control
          name="description"
          value={description}
          onChange={onChange}
          className={readOnly ? "form-control-plaintext" : undefined}
          readOnly={readOnly}
        />
      </FloatingLabel>
    </Form.Group>
  </>
);

export default DescriptorField;