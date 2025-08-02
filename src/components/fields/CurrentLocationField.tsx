import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';

interface CurrentLocationFieldProps {
  currentLocation: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const CurrentLocationField: React.FC<CurrentLocationFieldProps> = ({ 
  currentLocation, 
  onChange,
  readOnly = false,
}) => (
  <>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='currentLocation' label='Current Location'>
        <Form.Control
          name="currentLocation"
          value={currentLocation}
          onChange={onChange}
          className={readOnly ? "form-control-plaintext" : undefined}
          readOnly={readOnly}
        />
      </FloatingLabel>
    </Form.Group>
  </>
);

export default CurrentLocationField;