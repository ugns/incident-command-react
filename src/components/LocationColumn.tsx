import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { useDroppable } from '@dnd-kit/core';

interface LocationColumnProps {
  location: string;
  children: React.ReactNode;
  readOnly?: boolean;
  color?: string;
}

const LocationColumn: React.FC<LocationColumnProps> = ({ location, children, readOnly, color }) => {
  const { setNodeRef, isOver } = useDroppable({ id: location });
  if (readOnly) {
    return (
      <Col md={3} sm={6} xs={12}>
        <Card>
          <Card.Header style={{ background: color || '#1976d2', color: 'white' }}>{location}</Card.Header>
          <Card.Body>{children}</Card.Body>
        </Card>
      </Col>
    );
  }
  return (
    <Col
      ref={setNodeRef}
      md={3}
      sm={6}
      xs={12}
      style={{
        background: isOver ? '#e3f2fd' : undefined,
        transition: 'background 0.2s',
        touchAction: 'none',
      }}
    >
      <Card>
        <Card.Header style={{ background: color || '#1976d2', color: 'white' }}>{location}</Card.Header>
        <Card.Body>{children}</Card.Body>
      </Card>
    </Col>
  );
};

export default LocationColumn;
