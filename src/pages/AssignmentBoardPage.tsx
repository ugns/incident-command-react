import React, { useContext, useState, useRef, useEffect } from 'react';
import AssignmentBoard from '../components/AssignmentBoard';
import { AuthContext } from '../context/AuthContext';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useUnit } from '../context/UnitContext';


const AssignmentBoardPage: React.FC = () => {
  const { token, user } = useContext(AuthContext);
  const { selectedUnit } = useUnit();
  const flags = useFlags();
  const [readOnly, setReadOnly] = useState(true); // Default to dashboard mode
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enter/exit fullscreen when toggling isFullScreen
  useEffect(() => {
    if (isFullScreen && containerRef.current && !document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else if (!isFullScreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
    // eslint-disable-next-line
  }, [isFullScreen]);

  // Listen for user exiting fullscreen (ESC, etc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) setIsFullScreen(false);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!token) return <div>You must be logged in to view the assignment board.</div>;
  const darkMode = readOnly || isFullScreen;
  return (
    <div ref={containerRef} style={{ background: darkMode ? '#222' : undefined, minHeight: '100vh' }}>
      <Container className="py-4">
        <Row className="align-items-center mb-3">
          <Col><h2 className="mb-0" style={{ color: darkMode ? '#fff' : undefined }}>Assignment Board</h2></Col>
          <Col xs="auto" className="d-flex align-items-center gap-2" style={{ color: darkMode ? '#fff' : undefined }}>
            {flags.dispatchAccess && (
              <Form.Check
                type="switch"
                id="mode-switch"
                label={readOnly ? 'Dashboard Mode' : 'Dispatch Mode'}
                checked={!readOnly}
                onChange={() => setReadOnly(r => !r)}
                reverse
              />
            )}
            <Form.Check
              type="switch"
              id="fullscreen-switch"
              label={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
              checked={isFullScreen}
              onChange={() => setIsFullScreen(f => !f)}
              reverse
            />
          </Col>
        </Row>
        <AssignmentBoard orgId={user?.org_id} unitId={selectedUnit?.unitId} readOnly={readOnly} />
      </Container>
    </div>
  );
};

export default AssignmentBoardPage;
