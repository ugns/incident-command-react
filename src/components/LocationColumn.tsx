import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { useDroppable } from '@dnd-kit/core';

interface LocationColumnProps {
  location: string;
  children: React.ReactNode;
  readOnly?: boolean;
  color?: string;
  markerLabel?: string;
}

const LocationColumn: React.FC<LocationColumnProps> = ({ location, children, readOnly, color, markerLabel }) => {
  const { setNodeRef, isOver } = useDroppable({ id: location });
  const markerStyle: React.CSSProperties = {
    display: 'inline-block',
    minWidth: 28,
    height: 28,
    background: color || '#888',
    color: 'white',
    borderRadius: 6,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: '28px',
    marginRight: 6,
    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
    padding: '0 8px',
    letterSpacing: 1,
  };
  if (readOnly) {
    return (
      <Col lg={6} md={6} sm={12} xs={12}>
        <Card>
          <Card.Header className="bg-primary text-white">
            {markerLabel && <span style={markerStyle}>{markerLabel}</span>}
            <span>{location}</span>
          </Card.Header>
          <Card.Body>{children}</Card.Body>
        </Card>
      </Col>
    );
  }
  return (
    <Col
      ref={setNodeRef}
      lg={6}
      md={6}
      sm={12}
      xs={12}
      style={{
        background: isOver ? '#e3f2fd' : undefined,
        transition: 'background 0.2s',
        touchAction: 'none',
      }}
    >
      <Card>
        <Card.Header className="bg-primary text-white">
          {markerLabel && <span style={markerStyle}>{markerLabel}</span>}
          <span>{location}</span>
        </Card.Header>
        <Card.Body>{children}</Card.Body>
      </Card>
    </Col>
  );
};

export default LocationColumn;
