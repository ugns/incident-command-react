import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { GoogleMap, Marker } from '@react-google-maps/api';

interface LocationPickerModalProps {
  show: boolean;
  onHide: () => void;
  onPick: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  incidentLat?: number;
  incidentLng?: number;
}

const mapContainerStyle = { width: '100%', height: '300px' };

// Default fallback center (Orlando, FL)
const defaultCenter = { lat: 28.5383, lng: -81.3792 };


const LocationPickerModal: React.FC<LocationPickerModalProps> = ({ show, onHide, onPick, initialLat, initialLng, incidentLat, incidentLng }) => {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLat != null && initialLng != null
      ? { lat: Number(initialLat), lng: Number(initialLng) }
      : null
  );

  React.useEffect(() => {
    if (show) {
      setMarker(
        initialLat != null && initialLng != null
          ? { lat: Number(initialLat), lng: Number(initialLng) }
          : null
      );
    }
  }, [show, initialLat, initialLng]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const handleConfirm = () => {
    if (marker) {
      onPick(marker.lat, marker.lng);
      onHide();
    }
  };

  // Determine the map center: marker > incident location > default
  let mapCenter = defaultCenter;
  if (marker) {
    mapCenter = marker;
  } else if (incidentLat != null && incidentLng != null) {
    mapCenter = { lat: Number(incidentLat), lng: Number(incidentLng) };
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Pick Location on Map</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={marker ? 18 : (incidentLat && incidentLng) ?  15 : 10}
          mapTypeId="hybrid"
          onClick={handleMapClick}
        >
          {marker && (
            <Marker
              position={marker}
              draggable
              onDragEnd={e => {
                if (e.latLng) setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
              }}
            />
          )}
        </GoogleMap>
        <div className="mt-2 text-muted" style={{ fontSize: '0.9em' }}>
          Click on the map or drag the marker to select a location.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleConfirm} disabled={!marker}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationPickerModal;
