import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';


interface ReportModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (report: { positionTitle: string }) => void;
  initialPositionTitle?: string;
  preparedByName?: string;
  disableSubmit?: boolean;
}

const ReportModal: React.FC<ReportModalProps> = ({ show, onHide, onSubmit, initialPositionTitle, preparedByName, disableSubmit }) => {
  const [positionTitle, setPositionTitle] = useState(initialPositionTitle || '');

  useEffect(() => {
    setPositionTitle(initialPositionTitle || '');
  }, [initialPositionTitle, show]);
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidated(true);
    if (!positionTitle.trim()) return;
    onSubmit({ positionTitle });
    setPositionTitle('');
    setValidated(false);
  };

  const handleHide = () => {
    setPositionTitle(initialPositionTitle || '');
    setValidated(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleHide} centered>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="positionTitle" className="mt-3">
            <Form.Label>Position Title for <strong>{preparedByName || 'this user'}</strong></Form.Label>
            <Form.Control
              type="text"
              value={positionTitle}
              onChange={e => setPositionTitle(e.target.value)}
              required
              placeholder="Enter your position title"
            />
            <Form.Control.Feedback type="invalid">
              Please provide your position title.
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHide}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={!!disableSubmit} title={disableSubmit ? 'Required report type is not available.' : undefined}>Generate</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReportModal;
