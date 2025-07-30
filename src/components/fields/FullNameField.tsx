import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
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
      name={givenName}
      onChange={onChange}
      readOnly={readOnly}
    />
    <div className="row">
      <div className="col-md-6 mb-3">
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
      </div>
      <div className="col-md-6 mb-3">
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
      </div>
    </div>
  </>
);

export default FullNameField;