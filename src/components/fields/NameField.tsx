import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';

interface NameFieldProps {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const NameField: React.FC<NameFieldProps> = ({ 
  name, 
  onChange,
  readOnly = false,
}) => (
  <>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='name' label='Display Name'>
        <Form.Control
          name="name"
          value={name}
          onChange={onChange}
          className={readOnly ? "form-control-plaintext" : undefined}
          required
          readOnly={readOnly}
        />
      </FloatingLabel>
    </Form.Group>
  </>
);

export default NameField;