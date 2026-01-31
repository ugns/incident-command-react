import React, { useContext, useState } from 'react';
import { Alert, Card, Col, Form, Row } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import ReportGeneratorButton from '../../components/ReportGeneratorButton';
import { ReportType } from '../../types/Report';
import { ALERT_NOT_LOGGED_IN } from '../../constants/messages';


const PrizeInfoPage: React.FC = () => {
  const { token, user } = useContext(AuthContext);
  const [file, setFile] = useState<File | null>(null);

  if (!token) return <Alert variant="warning">{ALERT_NOT_LOGGED_IN}</Alert>;

  return (
    <Row className="justify-content-center mt-4">
      <Col xs={12} md={8} lg={6}>
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>Prize Info</span>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group controlId="prizeInfoFile" className="mb-3">
                <Form.Label>Upload Prize Info CSV</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.currentTarget.files?.[0] ?? null)}
                />
                <Form.Text className="text-muted">
                  Select the prize info CSV file to generate the Prize Tickets report.
                </Form.Text>
              </Form.Group>
              <div className="d-flex gap-2">
                <ReportGeneratorButton<File>
                  requiredReportType={ReportType.PKEY}
                  token={token}
                  user={user}
                  buttonText="Generate Prize Tickets"
                  disabled={!file}
                  modalEnabled={false}
                  defaultFormData={file as File}
                  buildReportData={selectedFile => selectedFile}
                  getGenerateOptions={selectedFile => ({
                    json: false,
                    contentType: selectedFile.type || 'text/csv',
                  })}
                  onReportGenerated={() => setFile(null)}
                />
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PrizeInfoPage;
