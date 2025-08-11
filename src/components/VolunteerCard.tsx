import React from 'react';
import { Card } from 'react-bootstrap';
import { Volunteer } from '../types/Volunteer';
import { useDraggable } from '@dnd-kit/core';

interface VolunteerCardProps {
  volunteer: Volunteer;
  readOnly?: boolean;
  activeVolunteerId?: string | null;
  setActiveVolunteerId?: (id: string | null) => void;
}

const VolunteerCard: React.FC<VolunteerCardProps> = ({ volunteer, readOnly, activeVolunteerId, setActiveVolunteerId }) => {
  // Always call hooks in the same order
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: volunteer.volunteerId });
  React.useEffect(() => {
    if (readOnly || !setActiveVolunteerId) return;
    if (isDragging) {
      setActiveVolunteerId(volunteer.volunteerId);
      console.log('[VolunteerCard] Drag start:', volunteer.volunteerId, volunteer.name);
    } else if (activeVolunteerId === volunteer.volunteerId) {
      setActiveVolunteerId(null);
      console.log('[VolunteerCard] Drag end:', volunteer.volunteerId, volunteer.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, readOnly]);

  if (readOnly) {
    return (
      <Card className="mb-2">
        <Card.Body style={{ padding: '0.5rem' }}>
          <div><strong>{volunteer.name}</strong> {volunteer.callsign && <span>({volunteer.callsign})</span>}</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      className="mb-2"
      style={{
        padding: 0,
        opacity: isDragging ? 0.5 : 1,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        cursor: 'grab',
        touchAction: 'none',
      }}
      {...listeners}
      {...attributes}
    >
      <Card.Body style={{ padding: '0.5rem' }}>
        <div><strong>{volunteer.name}</strong> {volunteer.callsign && <span>({volunteer.callsign})</span>}</div>
        <div className="small text-muted">{volunteer.notes}</div>
      </Card.Body>
    </Card>
  );
};

export default VolunteerCard;
