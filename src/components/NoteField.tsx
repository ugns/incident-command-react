import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';

interface NoteFieldProps {
  notes: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
}

const NoteField: React.FC<NoteFieldProps> = ({
  notes,
  onChange,
  readOnly = false,
}) => (
  <>
    <Form.Group className="mb-3">
      <FloatingLabel controlId='notes' label='Notes'>
        <Form.Control
          name="notes"
          value={notes}
          as="textarea"
          rows={3}
          onChange={onChange}
          className={readOnly ? "form-control-plaintext" : undefined}
          readOnly={readOnly}
        />
      </FloatingLabel>
    </Form.Group>
  </>
);

export default NoteField;