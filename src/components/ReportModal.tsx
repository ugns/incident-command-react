import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';


interface ReportModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (report: { positionTitle: string }) => void;
  initialPositionTitle?: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ show, onHide, onSubmit, initialPositionTitle }) => {
  const [positionTitle, setPositionTitle] = useState(initialPositionTitle || '');
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
          <Form.Group controlId="positionTitle">
            <Form.Label>Position Title</Form.Label>
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
          <Button variant="primary" type="submit">Generate</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReportModal;
