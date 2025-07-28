import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const MainPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const orgName = user?.org_name || 'Event Coordination';

  return (
    <Container className="mt-4">
      <h2>{orgName}</h2>
      {/* Add dashboard or navigation here */}
    </Container>
  );
};

export default MainPage;
