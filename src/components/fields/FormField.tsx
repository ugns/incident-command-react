import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';

interface FormFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  require?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ 
  name,
  value,
  onChange,
  readOnly = false,
  require = false,
}) => (
  <>
    <Form.Group className="mb-3">
      <FloatingLabel controlId={name} label={name.charAt(0).toUpperCase() + name.slice(1)}>
        <Form.Control
          name={name}
          value={value}
          onChange={onChange}
          className={readOnly ? "form-control-plaintext" : undefined}
          readOnly={readOnly}
          required={require}
        />
      </FloatingLabel>
    </Form.Group>
  </>
);

export default FormField;