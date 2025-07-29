import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';

interface OrganizationFieldProps {
  name: string;
  aud: string;
  hd: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const OrganizationField: React.FC<OrganizationFieldProps> = ({
  name,
  aud,
  hd,
  onChange,
  readOnly = false,
}) => (
  <>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='name' label='Name'>
        <Form.Control
          name="name"
          value={name}
          onChange={onChange}
          required
          className={readOnly ? "form-control-plaintext" : undefined}
          readOnly={readOnly}
        />
      </FloatingLabel>
    </Form.Group>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='aud' label='Client ID'>
        <Form.Control
          name="aud"
          value={aud}
          onChange={onChange}
          className={readOnly ? "form-control-plaintext" : undefined}
          readOnly={readOnly}
        />
      </FloatingLabel>
    </Form.Group>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='hd' label='Hosted Domain'>
        <Form.Control
          name="hd"
          value={hd}
          onChange={onChange}
          className={readOnly ? "form-control-plaintext" : undefined}
          readOnly={readOnly}
        />
      </FloatingLabel>
    </Form.Group>
  </>
);

export default OrganizationField;