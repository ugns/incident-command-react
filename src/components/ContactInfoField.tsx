import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';

interface ContactInfoFieldsProps {
  email: string;
  cellphone: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const ContactInfoFields: React.FC<ContactInfoFieldsProps> = ({
  email,
  cellphone,
  onChange,
  readOnly = false,
}) => (
  <>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='email' label='E-Mail'>
        <Form.Control name="email" type="email" onChange={onChange} readOnly={readOnly} />
      </FloatingLabel>
    </Form.Group>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='cellphone' label='Cell Phone'>
        <Form.Control name="cellphone" onChange={onChange} readOnly={readOnly} />
      </FloatingLabel>
    </Form.Group>
  </>
);

export default ContactInfoFields;