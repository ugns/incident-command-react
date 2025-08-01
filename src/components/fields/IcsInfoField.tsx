import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';

interface IcsInfoFieldsProps {
  icsPosition: string;
  homeAgency: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const IcsInfoFields: React.FC<IcsInfoFieldsProps> = ({
  icsPosition,
  homeAgency,
  onChange,
  readOnly = false,
}) => (
  <>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='icsPosition' label='ICS Position'>
        <Form.Control
          name="icsPosition"
          type="text"
          value={icsPosition}
          onChange={onChange}
          className={readOnly ? "form-control-plaintext" : undefined}
          readOnly={readOnly}
        />
      </FloatingLabel>
    </Form.Group>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='homeAgency' label='Home Agency'>
        <Form.Control
          name="homeAgency"
          type="text"
          value={homeAgency}
          onChange={onChange}
          className={readOnly ? "form-control-plaintext" : undefined}
          readOnly={readOnly}
        />
      </FloatingLabel>
    </Form.Group>
  </>
);

export default IcsInfoFields;