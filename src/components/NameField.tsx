import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';

interface NameFieldsProps {
  name: string;
  givenName: string;
  familyName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const NameFields: React.FC<NameFieldsProps> = ({ 
  name, 
  givenName, 
  familyName, 
  onChange,
  readOnly = false,
}) => (
  <>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='name' label='Display Name'>
        <Form.Control name="name" value={name} onChange={onChange} required readOnly={readOnly} />
      </FloatingLabel>
    </Form.Group>
    <div className="row">
      <div className="col-md-6 mb-3">
        <FloatingLabel controlId='givenName' label='First Name'>
          <Form.Control name="givenName" aria-label="First name" value={givenName} onChange={onChange} readOnly={readOnly} />
        </FloatingLabel>
      </div>
      <div className="col-md-6 mb-3">
        <FloatingLabel controlId='familyName' label='Last Name'>
          <Form.Control name="familyName" aria-label="Last name" value={familyName} onChange={onChange} readOnly={readOnly} />
        </FloatingLabel>
      </div>
    </div>
  </>
);

export default NameFields;