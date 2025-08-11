import React, { useState } from 'react';
import { Row, Spinner } from 'react-bootstrap';
import { Volunteer, VolunteerStatus } from '../types/Volunteer';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import VolunteerCard from './VolunteerCard';
import LocationColumn from './LocationColumn';
import { useSensors, useSensor, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { useVolunteers } from '../context/VolunteerContext';
import { useLocation } from '../context/LocationContext';

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
  const { locations: apiLocations, loading: locationsLoading, refresh: refreshLocations } = useLocation();
  // Filtering for orgId/unitId and checked-in status
  const filteredVolunteers = volunteers
    .filter(v => (!orgId || v.org_id === orgId))
    .filter(v => (!unitId || (v as any).unitId === unitId))
    .filter(v => v.status === VolunteerStatus.CheckedIn);

  // Use API locations if available, otherwise fallback to defaults
  let filteredLocations = apiLocations;
  if (unitId) {
    filteredLocations = apiLocations.filter(l => l.unitId === unitId);
  }
  let locationNames = (filteredLocations && filteredLocations.length > 0)
    ? filteredLocations.map(l => l.name)
    : DEFAULT_LOCATIONS;
  // Always include 'Unassigned' as the first column
  if (!locationNames.includes('Unassigned')) {
    locationNames = ['Unassigned', ...locationNames];
  }

  // Group volunteers by currentLocation
  const grouped: { [location: string]: Volunteer[] } = {};
  for (const v of filteredVolunteers) {
    const loc = v.currentLocation || 'Unassigned';
    if (!grouped[loc]) grouped[loc] = [];
    grouped[loc].push(v);
  }

  // Ensure all locations are present
  for (const loc of locationNames) {
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

  // Refresh locations when unitId changes
  React.useEffect(() => {
    refreshLocations();
  }, [unitId, refreshLocations]);



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

  if (loading || locationsLoading) return <Spinner animation="border" />;
  if (error) return <div className="text-danger">{error}</div>;

  if (readOnly) {
    return (
      <Row className="g-3">
        {locationNames.map(location => (
          <LocationColumn key={location} location={location} readOnly>
            {grouped[location].length === 0 ? (
              <div className="text-muted">No volunteers</div>
            ) : (
              grouped[location].map(v => (
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
        {locationNames.map(location => (
          <LocationColumn key={location} location={location}>
            {grouped[location].length === 0 ? (
              <div className="text-muted">No volunteers</div>
            ) : (
              grouped[location].map(v => (
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
        {activeVolunteerId && (() => {
          const v = filteredVolunteers.find(vol => vol.volunteerId === activeVolunteerId);
          if (!v) return null;
          return <VolunteerCard volunteer={v} readOnly />;
        })()}
      </DragOverlay>
    </DndContext>
  );
};

export default AssignmentBoard;
