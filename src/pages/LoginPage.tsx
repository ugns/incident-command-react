import React, { useContext } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import { Container, Row, Col, Card } from 'react-bootstrap';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
const BACKEND_AUTH_URL = `${API_BASE_URL}/auth/login`;

const LoginPage: React.FC = () => {
  const { login } = useContext(AuthContext);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    // Send Google token to backend to get JWT
    const resp = await fetch(BACKEND_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential }),
    });
    if (resp.ok) {
      const data = await resp.json();
      login(data.token, data.user);
    } else {
      alert('Login failed');
    }
  };

  return (
    <Container className="d-flex vh-100">
      <Row className="m-auto align-self-center w-100">
        <Col md={{ span: 4, offset: 4 }}>
          <Card className="p-4 text-center">
            <Card.Title>Sign in to Incident Command</Card.Title>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert('Google login failed')} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
