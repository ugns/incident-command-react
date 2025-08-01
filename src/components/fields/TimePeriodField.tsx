import React from 'react';
import { Form, FloatingLabel, InputGroup } from 'react-bootstrap';

interface IcsInfoFieldsProps {
  startTime: string;
  endTime: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const IcsInfoFields: React.FC<IcsInfoFieldsProps> = ({
  startTime,
  endTime,
  onChange,
  readOnly = false,
}) => (
  <>
    <Form.Group className="mb-3">
      <InputGroup className="mb-3">
        <FloatingLabel controlId='startTime' label='Start Time'>
          <Form.Control
            name="startTime"
            type="datetime-local"
            value={startTime}
            onChange={onChange}
            className={readOnly ? "form-control-plaintext" : undefined}
            readOnly={readOnly}
          />
          <Form.Text className="text-muted">Defaults to now</Form.Text>
        </FloatingLabel>
        <FloatingLabel controlId='endTime' label='End Time'>
          <Form.Control
            name="endTime"
            type="datetime-local"
            value={endTime}
            onChange={onChange}
            className={readOnly ? "form-control-plaintext" : undefined}
            readOnly={readOnly}
          />
          <Form.Text className="text-muted">Can be entered later</Form.Text>
        </FloatingLabel>
      </InputGroup>
    </Form.Group>
  </>
);

export default IcsInfoFields;