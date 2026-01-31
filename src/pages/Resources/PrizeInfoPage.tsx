import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import AppToast from '../../components/AppToast';
import reportService from '../../services/reportService';
import type { ReportType } from '../../types/ReportType';
import { ReportType as ReportTypeEnum } from '../../types/Report';
import { ALERT_NOT_LOGGED_IN } from '../../constants/messages';

const REQUIRED_REPORT_TYPE = ReportTypeEnum.PKEY;

const PrizeInfoPage: React.FC = () => {
  const { token, logout } = useContext(AuthContext);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableReportTypes, setAvailableReportTypes] = useState<ReportType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; bg: 'info' | 'danger' | 'success' }>({
    show: false,
    message: '',
    bg: 'info',
  });

  const availableType = useMemo(
    () => availableReportTypes.find(rt => rt.type === REQUIRED_REPORT_TYPE),
    [availableReportTypes]
  );

  useEffect(() => {
    if (!token) return;
    const loadReportTypes = async () => {
      setLoadingTypes(true);
      try {
        const types = await reportService.list(token, logout);
        setAvailableReportTypes(types.reports || []);
      } catch (err) {
        setAvailableReportTypes([]);
      } finally {
        setLoadingTypes(false);
      }
    };
    loadReportTypes();
  }, [token, logout]);

  if (!token) return <Alert variant="warning">{ALERT_NOT_LOGGED_IN}</Alert>;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || busy) return;
    setError(null);
    setBusy(true);
    try {
      const mediaType = availableType?.mediaType || 'application/octet-stream';
      const { blob, filename } = await reportService.generate(
        file,
        token,
        REQUIRED_REPORT_TYPE,
        mediaType,
        logout,
        {
          json: false,
          contentType: file.type || 'text/csv',
        }
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `${REQUIRED_REPORT_TYPE}.bin`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setToast({ show: true, message: 'Prize info report generated and downloaded.', bg: 'success' });
      setFile(null);
    } catch (err: any) {
      const message = err?.message || 'Failed to generate prize info report.';
      setError(message);
      setToast({ show: true, message, bg: 'danger' });
    } finally {
      setBusy(false);
    }
  };

  const isReportAvailable = !!availableType;

  return (
    <Row className="justify-content-center mt-4">
      <Col xs={12} md={8} lg={6}>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>Prize Info</span>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="prizeInfoFile" className="mb-3">
                <Form.Label>Upload Prize Info CSV</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.currentTarget.files?.[0] ?? null)}
                  disabled={busy}
                />
                <Form.Text className="text-muted">
                  Select the prize info CSV file to generate the PKEY report.
                </Form.Text>
              </Form.Group>
              {!isReportAvailable && !loadingTypes && (
                <Alert variant="warning" className="mt-2">
                  PKEY report type is not available.
                </Alert>
              )}
              {error && (
                <Alert variant="danger" className="mt-2">
                  {error}
                </Alert>
              )}
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!file || busy || !isReportAvailable || loadingTypes}
                >
                  {busy ? 'Generating…' : 'Generate PKEY Sheets'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
        <AppToast
          show={toast.show}
          message={toast.message}
          bg={toast.bg}
          onClose={() => setToast(t => ({ ...t, show: false }))}
        />
      </Col>
    </Row>
  );
};

export default PrizeInfoPage;
