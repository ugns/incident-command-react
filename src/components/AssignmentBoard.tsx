import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { Volunteer, VolunteerStatus } from '../types/Volunteer';
import volunteerService from '../services/volunteerService';
import { DndContext, closestCenter, useDroppable, useDraggable } from '@dnd-kit/core';

interface AssignmentBoardProps {
  token: string;
  unitId?: string; // For future filtering by Unit
  orgId?: string; // For future filtering by Org
  readOnly?: boolean;
  refreshInterval?: number; // ms
  // Add more filter props as needed
}

// For now, define some example locations. In the future, fetch from backend or config.
const DEFAULT_LOCATIONS = [
  'Staging',
  'On Duty',
  'Needs Relief',
  'Released',
];

const AssignmentBoard: React.FC<AssignmentBoardProps> = ({ token, unitId, orgId, readOnly = false, refreshInterval }) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch volunteers (with future filtering)
  const fetchVolunteers = () => {
    setLoading(true);
    volunteerService.list(token)
      .then(data => {
        let filtered = data;
        if (orgId) filtered = filtered.filter(v => v.org_id === orgId);
        if (unitId) filtered = filtered.filter(v => (v as any).unitId === unitId); // Adjust when Unit model is added
        filtered = filtered.filter(v => v.status === VolunteerStatus.CheckedIn);
        setVolunteers(filtered);
        setLoading(false);
      })
      .catch(e => {
        setError('Failed to load volunteers');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVolunteers();
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchVolunteers, refreshInterval);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [token, orgId, unitId, refreshInterval]);

  // Group volunteers by currentLocation
  const grouped: { [location: string]: Volunteer[] } = {};
  for (const v of volunteers) {
    const loc = v.currentLocation || 'Unassigned';
    if (!grouped[loc]) grouped[loc] = [];
    grouped[loc].push(v);
  }

  // Ensure all default locations are present
  for (const loc of DEFAULT_LOCATIONS) {
    if (!grouped[loc]) grouped[loc] = [];
  }

  // --- dnd-kit integration ---

  // Droppable column (only if not readOnly)
  function DroppableColumn({ location, children }: { location: string; children: React.ReactNode }) {
    // Always call the hook
    const { setNodeRef, isOver } = useDroppable({ id: location });
    if (readOnly) {
      return (
        <Col md={3} sm={6} xs={12}>
          <Card>
            <Card.Header className="bg-primary text-white">{location}</Card.Header>
            <Card.Body style={{ minHeight: 200 }}>{children}</Card.Body>
          </Card>
        </Col>
      );
    }
    return (
      <Col ref={setNodeRef} md={3} sm={6} xs={12} style={{ background: isOver ? '#e3f2fd' : undefined, transition: 'background 0.2s' }}>
        <Card>
          <Card.Header className="bg-primary text-white">{location}</Card.Header>
          <Card.Body style={{ minHeight: 200 }}>{children}</Card.Body>
        </Card>
      </Col>
    );
  }

  // Draggable card (only if not readOnly)
  function DraggableVolunteer({ volunteer }: { volunteer: Volunteer }) {
    // Always call the hook
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: volunteer.volunteerId });
    if (readOnly) {
      return (
        <Card className="mb-2">
          <Card.Body style={{ padding: '0.5rem' }}>
            <div><strong>{volunteer.name}</strong> {volunteer.callsign && <span>({volunteer.callsign})</span>}</div>
            <div className="small text-muted">Shift End: TBD</div>
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
        }}
        {...listeners}
        {...attributes}
      >
        <Card.Body style={{ padding: '0.5rem' }}>
          <div><strong>{volunteer.name}</strong> {volunteer.callsign && <span>({volunteer.callsign})</span>}</div>
          <div className="small text-muted">Shift End: TBD</div>
        </Card.Body>
      </Card>
    );
  }


  // Handle drag end (only if not readOnly)
  const handleDragEnd = async (event: any) => {
    if (readOnly) return;
    const { active, over } = event;
    if (!over || !active) return;
    const volunteerId = active.id;
    const newLocation = over.id;
    const volunteer = volunteers.find(v => v.volunteerId === volunteerId);
    if (!volunteer || volunteer.currentLocation === newLocation) return;
    setVolunteers(prev => prev.map(v => v.volunteerId === volunteerId ? { ...v, currentLocation: newLocation } : v));
    try {
      await volunteerService.update(volunteerId, { currentLocation: newLocation }, token);
    } catch (e) {
      // Optionally handle error, revert UI if needed
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <div className="text-danger">{error}</div>;

  if (readOnly) {
    return (
      <Row className="g-3">
        {Object.entries(grouped).map(([location, vols]) => (
          <DroppableColumn key={location} location={location}>
            {vols.length === 0 ? (
              <div className="text-muted">No volunteers</div>
            ) : (
              vols.map(v => (
                <DraggableVolunteer key={v.volunteerId} volunteer={v} />
              ))
            )}
          </DroppableColumn>
        ))}
      </Row>
    );
  }
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Row className="g-3">
        {Object.entries(grouped).map(([location, vols]) => (
          <DroppableColumn key={location} location={location}>
            {vols.length === 0 ? (
              <div className="text-muted">No volunteers</div>
            ) : (
              vols.map(v => (
                <DraggableVolunteer key={v.volunteerId} volunteer={v} />
              ))
            )}
          </DroppableColumn>
        ))}
      </Row>
    </DndContext>
  );
};

export default AssignmentBoard;
