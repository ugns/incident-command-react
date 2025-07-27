import React, { useState } from 'react';
import { Container, Card, Tabs, Tab } from 'react-bootstrap';

import RosterPage from './RosterPage';
import RadiosPage from './RadiosPage';

const ResourcesPage: React.FC = () => {
  const [key, setKey] = useState<string>('people');

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <Tabs activeKey={key} onSelect={k => setKey(k || 'people')}>
            <Tab eventKey="people" title="People">
              <RosterPage />
            </Tab>
            <Tab eventKey="radios" title="Radios">
              <RadiosPage />
            </Tab>
          </Tabs>
        </Card.Header>
      </Card>
    </Container>
  );
};

export default ResourcesPage;
