import React from 'react';
import { Form, FloatingLabel, InputGroup } from 'react-bootstrap';

interface LocationFieldProps {
  latitude: number;
  longitude: number;
  address: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const LocationField: React.FC<LocationFieldProps> = ({
  latitude,
  longitude,
  address,
  onChange,
  readOnly = false,
}) => (
  <>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='address' label='Address'>
        <Form.Control
          name="address"
          value={address}
          onChange={onChange}
          className={readOnly ? "form-control-plaintext" : undefined}
          readOnly={readOnly}
        />
      </FloatingLabel>
    </Form.Group>
    <Form.Group className="mb-3">
      <InputGroup className="mb-3">
        <FloatingLabel controlId='latitude' label='Latitude'>
          <Form.Control
            name="latitude"
            type="text"
            value={latitude}
            onChange={onChange}
            className={readOnly ? "form-control-plaintext" : undefined}
            readOnly={readOnly}
          />
        </FloatingLabel>
        <FloatingLabel controlId='longitude' label='Longitude'>
          <Form.Control
            name="longitude"
            type="text"
            value={longitude}
            onChange={onChange}
            className={readOnly ? "form-control-plaintext" : undefined}
            readOnly={readOnly}
          />
        </FloatingLabel>
      </InputGroup>
    </Form.Group>
  </>
);

export default LocationField;