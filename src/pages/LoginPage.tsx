import React, { useContext } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import { Container, Row, Col, Card } from 'react-bootstrap';
import authService from '../services/authService';

const LoginPage: React.FC = () => {
  const { login } = useContext(AuthContext);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;
    try {
      const data = await authService.loginWithGoogle(credentialResponse.credential) as { token: string; user: any };
      console.log('Login user object:', data.user); // Debug: check hd claim
      login(data.token, data.user);
    } catch (e: any) {
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
