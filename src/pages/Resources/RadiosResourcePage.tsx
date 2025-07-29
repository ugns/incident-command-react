import React, { useState, useRef } from 'react';
import { useVolunteers } from '../../context/VolunteerContext';
import { Modal } from 'react-bootstrap';
import ContextSelect from '../../components/ContextSelect';
import { Volunteer, RadioStatus } from '../../types/Volunteer';
import { ActivityLog, ActivityLogAction } from '../../types/ActivityLog';
import activityLogService from '../../services/activityLogService';
import { Button, ListGroup, ListGroupItem, Alert, Card, Form, Row, Col } from 'react-bootstrap';
import { Broadcast } from 'react-bootstrap-icons';
import AppToast from '../../components/AppToast';
import { usePeriod } from '../../context/PeriodContext';

const RadiosResourcePage: React.FC = () => {
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [radioSerial, setRadioSerial] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [toastBg, setToastBg] = useState<'info' | 'danger' | 'success'>('info');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const { volunteers, loading: volunteersLoading, updateVolunteer, refresh } = useVolunteers();
  const { selectedPeriod } = usePeriod();

  const token = localStorage.getItem('token') || '';
  const isAssigned = selectedVolunteer?.radioStatus === RadioStatus.Assigned;
  const volunteerSelectRef = useRef<{ reset: () => void }>(null);

  if (!selectedPeriod) {
    return <Alert variant="warning">No operating period selected.</Alert>;
  }

  const handleAssign = async () => {
    if (!selectedVolunteer || !radioSerial) return;
    // Prevent assigning a radio that is already assigned to another volunteer
    const alreadyAssigned = volunteers.find(v => v.radio === radioSerial && v.radioStatus === RadioStatus.Assigned && v.volunteerId !== selectedVolunteer.volunteerId);
    if (alreadyAssigned) {
      setMessage(`Radio ${radioSerial} is already assigned to ${alreadyAssigned.name}.`);
      setToastBg('danger');
      setShowToast(true);
      return;
    }
    // Prevent assigning a radio if one is already assigned
    if (selectedVolunteer.radio && selectedVolunteer.radioStatus === RadioStatus.Assigned) {
      setMessage(`${selectedVolunteer.name} already has radio ${selectedVolunteer.radio} assigned.`);
      setToastBg('danger');
      setShowToast(true);
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await updateVolunteer(selectedVolunteer.volunteerId, { ...selectedVolunteer, radio: radioSerial, radioStatus: RadioStatus.Assigned });
      const log: ActivityLog = {
        periodId: selectedPeriod.periodId,
        org_id: selectedPeriod.org_id,
        volunteerId: selectedVolunteer.volunteerId,
        action: ActivityLogAction.RadioAssigned,
        details: `${selectedVolunteer.name} assigned radio ${radioSerial}`,
      };
      await activityLogService.create(log, token);
      setMessage(`${selectedVolunteer.name} assigned radio ${radioSerial}.`);
      setToastBg('success');
      setShowToast(true);
      setRadioSerial('');
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
    if (!selectedVolunteer) return;
    setLoading(true);
    setMessage(null);
    try {
      // Validate serial number matches assigned
      if (!selectedVolunteer || selectedVolunteer.radio !== radioSerial) {
        setMessage('Serial number does not match the assigned radio.');
        setToastBg('danger');
        setShowToast(true);
        setLoading(false);
        return;
      }
      await updateVolunteer(selectedVolunteer.volunteerId, { ...selectedVolunteer, radioStatus: RadioStatus.Returned });
      const log: ActivityLog = {
        periodId: selectedPeriod.periodId,
        org_id: selectedPeriod.org_id,
        volunteerId: selectedVolunteer.volunteerId,
        action: ActivityLogAction.RadioReturned,
        details: `${selectedVolunteer.name} returned radio ${radioSerial}`,
      };
      await activityLogService.create(log, token);
      setMessage(`${selectedVolunteer.name} returned their radio.`);
      setToastBg('success');
      setShowToast(true);
      setRadioSerial('');
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
                  <Form.Label>Select Volunteer</Form.Label>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <ContextSelect
                        label="Volunteer"
                        options={volunteers}
                        value={selectedVolunteer ? selectedVolunteer.volunteerId : null}
                        onSelect={id => setSelectedVolunteer(id ? volunteers.find(v => v.volunteerId === id) ?? null : null)}
                        loading={loading}
                        getOptionLabel={v => v.name}
                        getOptionValue={v => v.volunteerId}
                      />
                    </div>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="radioSerial">
                  <Form.Label>Radio Serial Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={radioSerial}
                    onChange={e => setRadioSerial(e.target.value)}
                    placeholder="Enter radio serial number"
                    disabled={!selectedVolunteer || loading}
                  />
                </Form.Group>
                <div className="d-flex gap-2 mb-3">
                  <Button
                    variant="primary"
                    onClick={handleAssign}
                    disabled={!selectedVolunteer || loading || volunteersLoading || isAssigned || !radioSerial}
                  >
                    Assign Radio
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleReturn}
                    disabled={!selectedVolunteer || loading || volunteersLoading || !isAssigned || !radioSerial}
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
          <AssignedRadios volunteers={volunteers} />
        </Col>
      </Row>
    </>
  );
};

export default RadiosResourcePage;

const AssignedRadios: React.FC<{ volunteers: Volunteer[] }> = ({ volunteers }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchSerial, setSearchSerial] = useState('');
  const assigned = volunteers.filter(v => v.radioStatus === RadioStatus.Assigned);
  const found = assigned.find(v => v.radio === searchSerial);
  if (assigned.length === 0) {
    return <Alert variant="secondary">No radios are currently assigned.</Alert>;
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
            {assigned.map(v => (
              <ListGroupItem key={v.volunteerId}>
                {v.name}{v.callsign ? ` (${v.callsign})` : ''}{' '}
                {v.radio && v.radioStatus === RadioStatus.Assigned && (
                  <span title={`Radio: ${v.radio}`} style={{ marginRight: 6 }}>
                    <Broadcast color="#007bff" size={18} />
                  </span>
                )}
              </ListGroupItem>
            ))}
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
                Assigned to: {found.name}{found.callsign ? ` (${found.callsign})` : ''}
              </Alert>
            ) : (
              <Alert variant="danger" className="mt-3">
                No volunteer found with that radio serial.
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
