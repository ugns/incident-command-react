import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';

interface CallsignFieldProps {
  callsign: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const CallsignField: React.FC<CallsignFieldProps> = ({ 
  callsign, 
  onChange,
  readOnly = false,
}) => (
  <>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='callsign' label='Callsign'>
        <Form.Control name="callsign" value={callsign} onChange={onChange} readOnly={readOnly} />
      </FloatingLabel>
    </Form.Group>
  </>
);

export default CallsignField;