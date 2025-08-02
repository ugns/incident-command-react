import React from 'react';
import { Form, FloatingLabel, InputGroup } from 'react-bootstrap';
import NameField from './NameField';

interface FullNameFieldProps {
  name: string;
  givenName: string;
  familyName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const FullNameField: React.FC<FullNameFieldProps> = ({
  name,
  givenName,
  familyName,
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
      <InputGroup className="mb-3">
        <FloatingLabel controlId='givenName' label='First Name'>
          <Form.Control
            name="givenName"
            aria-label="First name"
            value={givenName}
            onChange={onChange}
            className={readOnly ? "form-control-plaintext" : undefined}
            readOnly={readOnly}
          />
        </FloatingLabel>
        <FloatingLabel controlId='familyName' label='Last Name'>
          <Form.Control
            name="familyName"
            aria-label="Last name"
            value={familyName}
            onChange={onChange}
            className={readOnly ? "form-control-plaintext" : undefined}
            readOnly={readOnly}
          />
        </FloatingLabel>
      </InputGroup>
    </Form.Group>
  </>
);

export default FullNameField;