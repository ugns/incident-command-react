import React, { useState } from 'react';
import { Row, Spinner } from 'react-bootstrap';
import { Volunteer, VolunteerStatus } from '../types/Volunteer';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import VolunteerCard from './VolunteerCard';
import LocationColumn from './LocationColumn';
import { useSensors, useSensor, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { useVolunteers } from '../context/VolunteerContext';
import { useLocation } from '../context/LocationContext';
import { GoogleMap, Marker } from '@react-google-maps/api';

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

const mapContainerStyle = { width: '100%', height: '400px' };


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

  // Color palette for locations (extend as needed)
  const COLOR_PALETTE = [
    '#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#f57c00', '#0288d1', '#c2185b', '#455a64',
    '#009688', '#8bc34a', '#e91e63', '#ff9800', '#3f51b5', '#00bcd4', '#9c27b0', '#ffc107', '#607d8b',
    '#795548', '#ff5722', '#4caf50', '#673ab7', '#b71c1c', '#827717', '#1b5e20', '#01579b', '#004d40',
    '#263238', '#e65100', '#f44336', '#aeea00', '#00e676', '#00bfae', '#d500f9', '#ff4081', '#ff1744',
    '#c51162', '#aa00ff', '#6200ea', '#304ffe', '#0091ea', '#00b8d4', '#00bfae', '#64dd17', '#aeea00',
    '#ffd600', '#ffab00', '#ff6d00', '#dd2c00', '#a1887f', '#90a4ae', '#b0bec5', '#cfd8dc', '#fbc02d',
  ];
  // Map location name to color
  const locationColorMap: { [name: string]: string } = {};
  locationNames.forEach((name, idx) => {
    locationColorMap[name] = COLOR_PALETTE[idx % COLOR_PALETTE.length];
  });

  // Helper to create a colored SVG marker icon
  function markerSvg(color: string, label: string) {
    const initial = label ? label.toUpperCase() : '';
    const len = initial.length;
    let width = 32, height = 28, rectX = 0, rectY = 0, rectRx = 6, fontSize = 16, textX = 16;
    if (len === 2) {
      width = 40; textX = 20;
    } else if (len === 3) {
      width = 48; textX = 24;
    }
    // Use a rounded rectangle for all cases
    const shape = `<rect x='${rectX}' y='${rectY}' width='${width}' height='${height}' rx='${rectRx}' fill='${encodeURIComponent(color)}' stroke='black' stroke-width='2'/>`;
    return `data:image/svg+xml;utf8,<svg width='${width}' height='${height}' viewBox='0 0 ${width} ${height}' fill='none' xmlns='http://www.w3.org/2000/svg'>${shape}<text x='${textX}' y='21' text-anchor='middle' font-size='${fontSize}' font-family='Arial' fill='white' font-weight='bold'>${initial}</text></svg>`;
  }
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

  // Find all valid locations and compute centroid for map center
  function parseLatLng(val: any) {
    const lat = typeof val.latitude === 'number' ? val.latitude : parseFloat(val.latitude);
    const lng = typeof val.longitude === 'number' ? val.longitude : parseFloat(val.longitude);
    return (!isNaN(lat) && !isNaN(lng)) ? { lat, lng } : null;
  }
  const validLocations = filteredLocations.map(parseLatLng).filter(Boolean) as { lat: number, lng: number }[];
  const hasValidLocations = validLocations.length > 0;
  // Compute centroid (average lat/lng)
  const mapCenter = hasValidLocations
    ? {
        lat: validLocations.reduce((sum, l) => sum + l.lat, 0) / validLocations.length,
        lng: validLocations.reduce((sum, l) => sum + l.lng, 0) / validLocations.length,
      }
    : null;

  return (
    <>
      {hasValidLocations && mapCenter ? (
        <div className="g-3 row mb-4">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={18}
            mapTypeId="satellite"
            options={{
              mapTypeControl: false,
              rotateControl: false,
              streetViewControl: false,
              mapTypeId: 'satellite',
            }}
          >
            {filteredLocations.map((loc, idx) => {
              const parsed = parseLatLng(loc);
              const color = locationColorMap[loc.name] || COLOR_PALETTE[idx % COLOR_PALETTE.length];
              const markerLabel =
                loc.label && loc.label.trim()
                  ? loc.label.trim()
                  : loc.name
                      .split(/\s+/)
                      .map(w => w[0])
                      .join('')
                      .slice(0, 2);
              return parsed ? (
                <Marker
                  key={loc.locationId}
                  position={parsed}
                  title={loc.name}
                  icon={{
                    url: markerSvg(color, markerLabel),
                    scaledSize: typeof window !== 'undefined' && window.google && window.google.maps
                      ? new window.google.maps.Size(32, 32)
                      : undefined
                  }}
                />
              ) : null;
            })}
          </GoogleMap>
        </div>
      ) : (
        <div className="text-muted mb-2">No map data available for these locations.</div>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="assignment-board-scroll">
          <Row className="g-3">
            {(readOnly
              ? locationNames.filter(location => grouped[location].length > 0)
              : locationNames
            ).map((location, idx) => {
              // Compute markerLabel as for the map marker
              let markerLabel = location;
              // Try to find the matching location object for label
              const locObj = filteredLocations.find(l => l.name === location);
              if (locObj) {
                markerLabel = locObj.label && locObj.label.trim()
                  ? locObj.label.trim()
                  : locObj.name
                      .split(/\s+/)
                      .map(w => w[0])
                      .join('')
                      .slice(0, 2);
              } else if (location === 'Unassigned') {
                markerLabel = 'U';
              }
              return (
                <LocationColumn
                  key={location}
                  location={location}
                  color={locationColorMap[location]}
                  markerLabel={markerLabel}
                >
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
              );
            })}
          </Row>
        </div>
        <DragOverlay zIndex={2000}>
          {activeVolunteerId && (() => {
            const v = filteredVolunteers.find(vol => vol.volunteerId === activeVolunteerId);
            if (!v) return null;
            return <VolunteerCard volunteer={v} readOnly />;
          })()}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default AssignmentBoard;
