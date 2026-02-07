import React, { useEffect, useState, useContext } from 'react';
import { Container, Card, Table, Row, Col, Placeholder, Alert } from 'react-bootstrap';
import { formatLocalDateTime } from '../utils/dateFormat';
import { AuthContext } from '../context/AuthContext';
import { usePeriod } from '../context/PeriodContext';
import { useVolunteers } from '../context/VolunteerContext';
import activityLogService from '../services/activityLogService';
import ReportGeneratorButton from '../components/ReportGeneratorButton';
import ContextSelect from '../components/ContextSelect';
import { Volunteer } from '../types/Volunteer';
import { Period } from '../types/Period';
import { ActivityLog } from '../types/ActivityLog';
import { ReportType } from '../types/Report';
import { ALERT_NOT_LOGGED_IN } from '../constants/messages';


const ActivityLogPage: React.FC = () => {
  const { user, token } = useContext(AuthContext);
  const { volunteers, loading: volunteersLoading } = useVolunteers();
  const { periods, loading: periodsLoading } = usePeriod();
  const [loading, setLoading] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        let logs: ActivityLog[] = [];
        logs = await activityLogService.list(token);
        logs.sort((a, b) => new Date(a.timestamp || '').getTime() - new Date(b.timestamp || '').getTime());
        setActivityLogs(logs);
      } catch (e) {
        setActivityLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [selectedPeriod, selectedVolunteer]);

  if (!token) return <Alert variant="warning">{ALERT_NOT_LOGGED_IN}</Alert>;

  // Filter and sort activity logs before rendering
  const filteredActivityLogs = (activityLogs || [])
    .filter(l => {
      // Filter by selected period if set
      if (selectedPeriod && l.periodId !== selectedPeriod.periodId) return false;
      // Filter by selected volunteer if set
      if (selectedVolunteer && l.volunteerId !== selectedVolunteer.volunteerId) return false;
      return true;
    })
    .sort((a, b) => {
      const aTimestamp = new Date(a.timestamp || '').getTime();
      const bTimestamp = new Date(b.timestamp || '').getTime();
      return aTimestamp - bTimestamp;
    });

  const sortedPeriods = (periods || [])
    .slice()
    .sort((a, b) => new Date(a.startTime || '').getTime() - new Date(b.startTime || '').getTime());

  return (
    <Container>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col><strong>Activity Log</strong></Col>
            <Col md="auto" className="d-flex align-items-center gap-2">
              <ContextSelect
                label="Period"
                options={sortedPeriods}
                value={selectedPeriod ? selectedPeriod.periodId : null}
                onSelect={id => setSelectedPeriod(id ? sortedPeriods.find(p => p.periodId === id) ?? null : null)}
                loading={periodsLoading}
                getOptionLabel={p => p.description}
                getOptionValue={p => p.periodId}
              />
              <ContextSelect
                label="Volunteer"
                options={volunteers}
                value={selectedVolunteer ? selectedVolunteer.volunteerId : null}
                onSelect={id => setSelectedVolunteer(id ? volunteers.find(v => v.volunteerId === id) ?? null : null)}
                loading={volunteersLoading}
                getOptionLabel={v => v.callsign ? `${v.name} (${v.callsign})` : v.name}
                getOptionValue={v => v.volunteerId}
              />
              <ReportGeneratorButton
                requiredReportType={ReportType.ICS214}
                token={token}
                user={user}
                buttonText="Generate ICS-214"
                disabled={filteredActivityLogs.length === 0}
                buildReportData={({ positionTitle }) => {
                  // ICS-214 report payload builder
                  // Find referenced volunteers and count log entries per volunteer
                  const logCounts: Record<string, number> = {};
                  for (const log of filteredActivityLogs) {
                    if (log.volunteerId) {
                      logCounts[log.volunteerId] = (logCounts[log.volunteerId] || 0) + 1;
                    }
                  }
                  const topVolunteerIds = Object.entries(logCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([id]) => id);
                  const referencedVolunteers = volunteers.filter(v => topVolunteerIds.includes(v.volunteerId));
                  return {
                    period: selectedPeriod,
                    activityLogs: filteredActivityLogs,
                    volunteers: referencedVolunteers,
                    preparedBy: user,
                    positionTitle,
                  };
                }}
              />
            </Col>
          </Row>
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          <Table striped bordered hover size="sm" responsive className="mb-0">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>Date/Time</th>
                <th>Notable Activities</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={idx}>
                    <td><Placeholder animation="glow"><Placeholder xs={8} /></Placeholder></td>
                    <td><Placeholder animation="glow"><Placeholder xs={10} /></Placeholder></td>
                  </tr>
                ))
              ) : filteredActivityLogs.length === 0 ? (
                <tr><td colSpan={2} className="text-center">No activity log entries found.</td></tr>
              ) : (
                filteredActivityLogs.map(entry => (
                  <tr key={entry.logId}>
                    <td>{entry.timestamp ? formatLocalDateTime(entry.timestamp) : ''}</td>
                    <td>{entry.details ? `${entry.details}` : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ActivityLogPage;
