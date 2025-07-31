import React, { useState } from 'react';
import { Row, Spinner } from 'react-bootstrap';
import { Volunteer, VolunteerStatus } from '../types/Volunteer';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import VolunteerCard from './VolunteerCard';
import LocationColumn from './LocationColumn';
import { useSensors, useSensor, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { useVolunteers } from '../context/VolunteerContext';

interface AssignmentBoardProps {
  unitId?: string; // For future filtering by Unit
  orgId?: string; // For future filtering by Org
  readOnly?: boolean;
  // Add more filter props as needed
}

// For now, define some example locations. In the future, fetch from backend or config.
const DEFAULT_LOCATIONS = [
  'Staging',
  'On Duty',
  'Needs Relief',
  'Released',
];


const AssignmentBoard: React.FC<AssignmentBoardProps> = ({ unitId, orgId, readOnly = false }) => {

  const { volunteers, loading, error, refresh, updateVolunteer } = useVolunteers();
  // Filtering for orgId/unitId and checked-in status
  const filteredVolunteers = volunteers
    .filter(v => (!orgId || v.org_id === orgId))
    .filter(v => (!unitId || (v as any).unitId === unitId))
    .filter(v => v.status === VolunteerStatus.CheckedIn);

  // Group volunteers by currentLocation
  const grouped: { [location: string]: Volunteer[] } = {};
  for (const v of filteredVolunteers) {
    const loc = v.currentLocation || 'Unassigned';
    if (!grouped[loc]) grouped[loc] = [];
    grouped[loc].push(v);
  }

  // Ensure all default locations are present
  for (const loc of DEFAULT_LOCATIONS) {
    if (!grouped[loc]) grouped[loc] = [];
  }


  // --- dnd-kit integration ---

  // Track the currently dragged volunteer id
  const [activeVolunteerId, setActiveVolunteerId] = useState<string | null>(null);

  // Always call hooks in the same order and at the top level
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1, // Lower distance for easier drag start
      delay: 200, // Allow long-press to start drag (200ms)
      tolerance: 5, // Allow some movement before cancel
    },
  });
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(pointerSensor, touchSensor);

  // Log sensor activation for debugging
  React.useEffect(() => {
    console.log('[AssignmentBoard] PointerSensor and TouchSensor initialized.');
    // Log device info
    console.log('[AssignmentBoard] UserAgent:', navigator.userAgent);
    console.log('[AssignmentBoard] PointerEvent:', typeof window.PointerEvent !== 'undefined');
    console.log('[AssignmentBoard] TouchEvent:', typeof window.TouchEvent !== 'undefined');
    console.log('[AssignmentBoard] maxTouchPoints:', navigator.maxTouchPoints);
  }, []);



  // Handle drag end (only if not readOnly)
  const handleDragEnd = async (event: any) => {
    if (readOnly) return;
    const { active, over } = event;
    if (!over || !active) return;
    const volunteerId = active.id;
    const newLocation = over.id;
    const volunteer = filteredVolunteers.find(v => v.volunteerId === volunteerId);
    if (!volunteer || volunteer.currentLocation === newLocation) return;
    const updatedVolunteer = { ...volunteer, currentLocation: newLocation };
    try {
      await updateVolunteer(volunteerId, updatedVolunteer);
      await refresh(); // Ensure sync after update
    } catch (e) {
      // Optionally handle error, revert UI if needed
      console.error('[AssignmentBoard] Error updating volunteer:', e);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <div className="text-danger">{error}</div>;

  if (readOnly) {
    return (
      <Row className="g-3">
        {Object.entries(grouped).map(([location, vols]) => (
          <LocationColumn key={location} location={location} readOnly>
            {vols.length === 0 ? (
              <div className="text-muted">No volunteers</div>
            ) : (
              vols.map(v => (
                <VolunteerCard key={v.volunteerId} volunteer={v} readOnly />
              ))
            )}
          </LocationColumn>
        ))}
      </Row>
    );
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Row className="g-3">
        {Object.entries(grouped).map(([location, vols]) => (
          <LocationColumn key={location} location={location}>
            {vols.length === 0 ? (
              <div className="text-muted">No volunteers</div>
            ) : (
            vols.map(v => (
              <VolunteerCard
                key={v.volunteerId}
                volunteer={v}
                activeVolunteerId={activeVolunteerId}
                setActiveVolunteerId={setActiveVolunteerId}
              />
            ))
            )}
          </LocationColumn>
        ))}
      </Row>
      <DragOverlay zIndex={2000}>
        {activeVolunteerId ? (
          (() => {
            const v = filteredVolunteers.find(vol => vol.volunteerId === activeVolunteerId);
            if (!v) return null;
            return (
              <VolunteerCard volunteer={v} readOnly />
            );
          })()
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default AssignmentBoard;
