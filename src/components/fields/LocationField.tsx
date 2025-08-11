import React, { useState } from 'react';
import { Form, FloatingLabel, InputGroup } from 'react-bootstrap';

import LocationPickerModal from './LocationPickerModal';

interface LocationFieldProps {
  latitude: number | string;
  longitude: number | string;
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
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Convert to number if possible, else undefined
  const latNum = typeof latitude === 'number' ? latitude : parseFloat(latitude as string);
  const lngNum = typeof longitude === 'number' ? longitude : parseFloat(longitude as string);
  const hasCoords = !isNaN(latNum) && !isNaN(lngNum);

  const handlePick = (lat: number, lng: number) => {
    // Batch update both fields in a single synthetic event if possible
    const batchEvent = {
      target: {
        name: 'latitude-longitude',
        value: { latitude: lat.toString(), longitude: lng.toString() }
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    if (typeof onChange === 'function' && onChange.length === 1) {
      // If parent supports batch, use it
      onChange(batchEvent);
    } else {
      // Fallback: update latitude then longitude
      const latEvent = { target: { name: 'latitude', value: lat.toString() } } as React.ChangeEvent<HTMLInputElement>;
      const lngEvent = { target: { name: 'longitude', value: lng.toString() } } as React.ChangeEvent<HTMLInputElement>;
      setTimeout(() => onChange(latEvent), 0);
      setTimeout(() => onChange(lngEvent), 0);
    }
  };

  return (
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
          {!readOnly && (
            <button
              type="button"
              className="btn btn-outline-secondary ms-2"
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => setShowPicker(true)}
            >
              Pick on Map
            </button>
          )}
        </InputGroup>
      </Form.Group>
      <LocationPickerModal
        show={showPicker}
        onHide={() => setShowPicker(false)}
        onPick={handlePick}
        initialLat={hasCoords ? latNum : undefined}
        initialLng={hasCoords ? lngNum : undefined}
      />
    </>
  );
};

export default LocationField;