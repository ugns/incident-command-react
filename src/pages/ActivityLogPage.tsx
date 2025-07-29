import React, { useEffect, useState, useContext } from 'react';
import { Container, Card, Table, Row, Col, Placeholder, Alert } from 'react-bootstrap';
import { formatLocalDateTime } from '../utils/dateFormat';
import { AuthContext } from '../context/AuthContext';
import { usePeriod } from '../context/PeriodContext';
import { useVolunteers } from '../context/VolunteerContext';
import activityLogService from '../services/activityLogService';
import ReportGeneratorButton from '../components/ReportGeneratorButton';
import VolunteerSelect from '../components/VolunteerSelect';
import { Volunteer } from '../types/Volunteer';
import { ActivityLog } from '../types/ActivityLog';
import { ReportType } from '../types/Report';


const ActivityLogPage: React.FC = () => {
  const { selectedPeriod } = usePeriod();
  const { volunteers } = useVolunteers();
  const { user, token } = useContext(AuthContext);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  useEffect(() => {
    if (!selectedPeriod) return;
    setLoading(true);
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        let logs: ActivityLog[] = [];
        if (selectedVolunteer) {
          logs = await activityLogService.listByVolunteer(selectedVolunteer.volunteerId, token);
          // Filter to current period
          logs = logs.filter(l => l.periodId === selectedPeriod.periodId);
        } else {
          logs = await activityLogService.list(token);
          logs = logs.filter(l => l.periodId === selectedPeriod.periodId);
        }
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

  if (!selectedPeriod) {
    return <Alert variant="warning">No operating period selected.</Alert>;
  }

  return (
    <Container>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col><strong>Activity Log</strong></Col>
            <Col md="auto" className="d-flex align-items-center gap-2">
              <VolunteerSelect
                volunteers={volunteers}
                value={selectedVolunteer}
                onSelect={setSelectedVolunteer}
              />
              <ReportGeneratorButton
                requiredReportType={ReportType.ICS214}
                token={token || ''}
                user={user}
                buttonText="Generate ICS-214"
                disabled={!selectedPeriod || activityLogs.length === 0}
                buildReportData={({ positionTitle }) => {
                  // ICS-214 report payload builder
                  // Find referenced volunteers and count log entries per volunteer
                  const logCounts: Record<string, number> = {};
                  for (const log of activityLogs) {
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
                    activityLogs,
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
              ) : activityLogs.length === 0 ? (
                <tr><td colSpan={2} className="text-center">No activity log entries found.</td></tr>
              ) : (
                activityLogs.map(entry => (
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
