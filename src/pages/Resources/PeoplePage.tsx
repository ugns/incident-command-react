import React, { useState, useContext, useRef } from 'react';
import ContextSelect from '../../components/ContextSelect';
import { Volunteer, VolunteerStatus } from '../../types/Volunteer';
import { ActivityLog, ActivityLogAction } from '../../types/ActivityLog';
import activityLogService from '../../services/activityLogService';
import { Button, ListGroup, ListGroupItem, Alert, Card, Form, Row, Col } from 'react-bootstrap';
import { usePeriod } from '../../context/PeriodContext';
import { useVolunteers } from '../../context/VolunteerContext';
import { AuthContext } from '../../context/AuthContext';
import AppToast from '../../components/AppToast';
import { ALERT_NO_CONTEXT_SELECTED, ALERT_NO_VOLUNTEERS_CHECKED_IN } from '../../constants/messages';

const PeoplePage: React.FC = () => {
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [toastBg, setToastBg] = useState<'info' | 'danger' | 'success'>('info');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const { volunteers, loading: volunteersLoading, updateVolunteer, refresh } = useVolunteers();
  const { selectedPeriod } = usePeriod();
  const { user } = useContext(AuthContext);

  const token = localStorage.getItem('token') || '';
  const isCheckedIn = selectedVolunteer?.status === VolunteerStatus.CheckedIn;
  const volunteerSelectRef = useRef<{ reset: () => void }>(null);

  // Check for selected period on load
  if (!selectedPeriod) {
    return <Alert variant="warning">{ALERT_NO_CONTEXT_SELECTED}</Alert>;
  }

  const handleCheckIn = async () => {
    if (!selectedVolunteer || isCheckedIn) return;
    setLoading(true);
    setMessage(null);
    try {
      await updateVolunteer(selectedVolunteer.volunteerId, { ...selectedVolunteer, status: VolunteerStatus.CheckedIn });
      const log: ActivityLog = {
        periodId: selectedPeriod.periodId,
        org_id: selectedPeriod.org_id,
        volunteerId: selectedVolunteer.volunteerId,
        action: ActivityLogAction.CheckIn,
        details: `${selectedVolunteer.name} ${(selectedVolunteer.callsign ? ` (${selectedVolunteer.callsign})` : '')} checked in with ${user?.name}`,
      };
      await activityLogService.create(log, token);
      setMessage(`${selectedVolunteer.name} checked in successfully.`);
      setToastBg('success');
      setShowToast(true);
      await refresh();
      volunteerSelectRef.current?.reset();
      setSelectedVolunteer(null);
    } catch (err: any) {
      setMessage(`Check-in failed: ${err.message}`);
      setToastBg('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedVolunteer || !isCheckedIn) return;
    setLoading(true);
    setMessage(null);
    try {
      await updateVolunteer(selectedVolunteer.volunteerId, { ...selectedVolunteer, status: VolunteerStatus.CheckedOut });
      const log: ActivityLog = {
        periodId: selectedPeriod.periodId,
        org_id: selectedPeriod.org_id,
        volunteerId: selectedVolunteer.volunteerId,
        action: ActivityLogAction.CheckOut,
        details: `${selectedVolunteer.name} ${(selectedVolunteer.callsign ? ` (${selectedVolunteer.callsign})` : '')} checked out with ${user?.name}`,
      };
      await activityLogService.create(log, token);
      setMessage(`${selectedVolunteer.name} checked out successfully.`);
      setToastBg('success');
      setShowToast(true);
      await refresh();
      volunteerSelectRef.current?.reset();
      setSelectedVolunteer(null);
    } catch (err: any) {
      setMessage(`Check-out failed: ${err.message}`);
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
              <span>Volunteers for {selectedPeriod.description}</span>
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
                        getOptionLabel={v => v.name}
                        getOptionValue={v => v.volunteerId}
                      />
                    </div>
                  </div>
                </Form.Group>
                <div className="d-flex gap-2 mb-3">
                  <Button
                    variant="success"
                    onClick={handleCheckIn}
                    disabled={!selectedVolunteer || loading || volunteersLoading || isCheckedIn}
                  >
                    Check-In
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleCheckOut}
                    disabled={!selectedVolunteer || loading || volunteersLoading || !isCheckedIn}
                  >
                    Check-Out
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
          <CheckedInVolunteers volunteers={volunteers} />
        </Col>
      </Row>
    </>
  );
};

export default PeoplePage;

const CheckedInVolunteers: React.FC<{ volunteers: Volunteer[] }> = ({ volunteers }) => {
  const checkedIn = volunteers.filter(v => v.status === VolunteerStatus.CheckedIn);
  if (checkedIn.length === 0) {
    return <Alert variant="secondary">{ALERT_NO_VOLUNTEERS_CHECKED_IN}</Alert>;
  }
  return (
    <Card className="mt-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Checked-In Volunteers</span>
      </Card.Header>
      <Card.Body>
        <ListGroup>
          {checkedIn.map(v => (
            <ListGroupItem key={v.volunteerId}>
              {v.name}{v.callsign ? ` (${v.callsign})` : ''}{' '}
              {/* Show radio icon if radio has a value */}
              {/* {v.radio && v.radioStatus === RadioStatus.Assigned && (
                <span title={`Radio: ${v.radio}`} style={{ marginRight: 6 }}>
                  <Broadcast color="#007bff" size={18} />
                </span>
              )} */}
            </ListGroupItem>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
