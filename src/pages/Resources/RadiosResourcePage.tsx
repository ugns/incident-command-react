import React, { useState, useRef } from 'react';
import { useVolunteers } from '../../context/VolunteerContext';
import { useRadios } from '../../context/RadioContext';
import { Modal } from 'react-bootstrap';
import ContextSelect from '../../components/ContextSelect';
import { Volunteer } from '../../types/Volunteer';
import { Radio, RadioStatus } from '../../types/Radio';
import { ActivityLog, ActivityLogAction } from '../../types/ActivityLog';
import activityLogService from '../../services/activityLogService';
import { Button, ListGroup, ListGroupItem, Alert, Card, Form, Row, Col } from 'react-bootstrap';
import { Broadcast } from 'react-bootstrap-icons';
import AppToast from '../../components/AppToast';
import { usePeriod } from '../../context/PeriodContext';
import { ALERT_NO_CONTEXT_SELECTED, ALERT_NO_RADIOS_ASSIGNED } from '../../constants/messages';

const RadiosResourcePage: React.FC = () => {
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [selectedRadioId, setSelectedRadioId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [toastBg, setToastBg] = useState<'info' | 'danger' | 'success'>('info');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const { volunteers, loading: volunteersLoading } = useVolunteers();
  const { radios, loading: radiosLoading, updateRadio, refresh } = useRadios();
  const { selectedPeriod } = usePeriod();

  const token = localStorage.getItem('token') || '';
  // Find the radio assigned to this volunteer (if any)
  const assignedRadio = selectedVolunteer ? radios.find(r => r.assignedToVolunteerId === selectedVolunteer.volunteerId && r.status === RadioStatus.Assigned) : undefined;
  const isAssigned = !!assignedRadio;
  const volunteerSelectRef = useRef<{ reset: () => void }>(null);

  if (!selectedPeriod) {
    return <Alert variant="warning">{ALERT_NO_CONTEXT_SELECTED}</Alert>;
  }

  const handleAssign = async () => {
    if (!selectedVolunteer || !selectedRadioId) return;
    // Prevent assigning a radio that is already assigned
    const radio = radios.find(r => r.radioId === selectedRadioId);
    if (!radio) {
      setMessage(`Radio not found.`);
      setToastBg('danger');
      setShowToast(true);
      return;
    }
    if (radio.status === RadioStatus.Assigned && radio.assignedToVolunteerId !== selectedVolunteer.volunteerId) {
      setMessage(`Radio ${radio.serialNumber || radio.name} is already assigned to another volunteer.`);
      setToastBg('danger');
      setShowToast(true);
      return;
    }
    if (assignedRadio) {
      setMessage(`${selectedVolunteer.name} already has radio ${assignedRadio.serialNumber || assignedRadio.name} assigned.`);
      setToastBg('danger');
      setShowToast(true);
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await updateRadio(radio.radioId, { assignedToVolunteerId: selectedVolunteer.volunteerId, status: RadioStatus.Assigned });
      const log: ActivityLog = {
        periodId: selectedPeriod.periodId,
        org_id: selectedPeriod.org_id,
        volunteerId: selectedVolunteer.volunteerId,
        action: ActivityLogAction.RadioAssigned,
        details: `${selectedVolunteer.name} assigned radio ${radio.serialNumber || radio.name}`,
      };
      await activityLogService.create(log, token);
      setMessage(`${selectedVolunteer.name} assigned radio ${radio.serialNumber || radio.name}.`);
      setToastBg('success');
      setShowToast(true);
      setSelectedRadioId(null);
      await refresh();
      volunteerSelectRef.current?.reset();
      setSelectedVolunteer(null);
    } catch (err: any) {
      setMessage(`Radio assignment failed: ${err.message}`);
      setToastBg('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!selectedVolunteer || !assignedRadio) return;
    setLoading(true);
    setMessage(null);
    try {
      // Validate selected radio matches assigned
      if (assignedRadio.radioId !== selectedRadioId) {
        setMessage('Selected radio does not match the assigned radio.');
        setToastBg('danger');
        setShowToast(true);
        setLoading(false);
        return;
      }
      await updateRadio(assignedRadio.radioId, { assignedToVolunteerId: undefined, status: RadioStatus.Available });
      const log: ActivityLog = {
        periodId: selectedPeriod.periodId,
        org_id: selectedPeriod.org_id,
        volunteerId: selectedVolunteer.volunteerId,
        action: ActivityLogAction.RadioReturned,
        details: `${selectedVolunteer.name} returned radio ${assignedRadio.serialNumber || assignedRadio.name}`,
      };
      await activityLogService.create(log, token);
      setMessage(`${selectedVolunteer.name} returned their radio.`);
      setToastBg('success');
      setShowToast(true);
      setSelectedRadioId(null);
      await refresh();
      volunteerSelectRef.current?.reset();
      setSelectedVolunteer(null);
    } catch (err: any) {
      setMessage(`Radio return failed: ${err.message}`);
      setToastBg('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={8} lg={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Radio Assignment for {selectedPeriod.description}</span>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="volunteerSelect">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <ContextSelect
                        label="Volunteer"
                        options={volunteers}
                        value={selectedVolunteer ? selectedVolunteer.volunteerId : null}
                        onSelect={id => setSelectedVolunteer(id ? volunteers.find(v => v.volunteerId === id) ?? null : null)}
                        loading={loading}
                        getOptionLabel={v => v.callsign ? `${v.name} (${v.callsign})` : v.name}
                        getOptionValue={v => v.volunteerId}
                      />
                    </div>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="radioSelect">
                  <ContextSelect
                    label="Radio"
                    options={radios.filter(r => r.status === RadioStatus.Available || (assignedRadio && r.radioId === assignedRadio.radioId))}
                    value={selectedRadioId}
                    onSelect={id => setSelectedRadioId(id as string)}
                    loading={loading || radiosLoading}
                    getOptionLabel={r => r.serialNumber ? `${r.serialNumber}${r.name ? ` (${r.name})` : ''}` : r.name}
                    getOptionValue={r => r.radioId}
                    disabled={!selectedVolunteer || loading}
                  />
                </Form.Group>
                <div className="d-flex gap-2 mb-3">
                  <Button
                    variant="primary"
                    onClick={handleAssign}
                    disabled={!selectedVolunteer || loading || volunteersLoading || isAssigned || !selectedRadioId}
                  >
                    Assign Radio
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleReturn}
                    disabled={!selectedVolunteer || loading || volunteersLoading || !isAssigned || !selectedRadioId}
                  >
                    Return Radio
                  </Button>
                </div>
                <AppToast
                  show={!!message && showToast}
                  message={message}
                  bg={toastBg}
                  onClose={() => setShowToast(false)}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <AssignedRadios radios={radios} volunteers={volunteers} />
        </Col>
      </Row>
    </>
  );
};

export default RadiosResourcePage;

interface AssignedRadiosProps {
  radios: Radio[];
  volunteers: Volunteer[];
}

const AssignedRadios: React.FC<AssignedRadiosProps> = ({ radios, volunteers }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchSerial, setSearchSerial] = useState('');
  // Only show radios that are assigned
  const assigned = radios.filter(r => r.status === RadioStatus.Assigned && r.assignedToVolunteerId);
  const found = assigned.find(r => r.serialNumber === searchSerial);
  if (assigned.length === 0) {
    return <Alert variant="secondary">{ALERT_NO_RADIOS_ASSIGNED}</Alert>;
  }
  return (
    <>
      <Card className="mt-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>Assigned Radios</span>
          <Button variant="outline-primary" size="sm" onClick={() => setShowModal(true)}>
            Search for Radio
          </Button>
        </Card.Header>
        <Card.Body>
          <ListGroup>
            {assigned.map(r => {
              const volunteer = volunteers.find(v => v.volunteerId === r.assignedToVolunteerId);
              return (
                <ListGroupItem key={r.radioId}>
                  {r.serialNumber || r.name} {' '}
                  <span title="Assigned">
                    <Broadcast color="#007bff" size={18} />
                  </span>
                  {volunteer && (
                    <span style={{ marginLeft: 8 }}>
                      Assigned to: {volunteer.name}{volunteer.callsign ? ` (${volunteer.callsign})` : ''}
                    </span>
                  )}
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Search Assigned Radios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="searchSerial">
            <Form.Label>Enter Radio Serial Number</Form.Label>
            <Form.Control
              type="text"
              value={searchSerial}
              onChange={e => setSearchSerial(e.target.value)}
              placeholder="Serial number"
            />
          </Form.Group>
          {searchSerial && (
            found ? (
              <Alert variant="success" className="mt-3">
                Assigned to: {(() => {
                  const v = volunteers.find(v => v.volunteerId === found.assignedToVolunteerId);
                  return v ? `${v.name}${v.callsign ? ` (${v.callsign})` : ''}` : 'Unknown';
                })()}
              </Alert>
            ) : (
              <Alert variant="danger" className="mt-3">
                No radio found with that serial number.
              </Alert>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
