import React, { useState } from 'react';
import { Container, Card, Tabs, Tab } from 'react-bootstrap';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PeoplePage from './PeoplePage';
import RadiosPage from './RadiosPage';

const ResourcesPage: React.FC = () => {
  const [key, setKey] = useState<string>('people');
  const { showRadioResources } = useFlags();

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <Tabs activeKey={key} onSelect={k => setKey(k || 'people')} fill>
            <Tab eventKey="people" title="People">
              <PeoplePage />
            </Tab>
            {showRadioResources && (
              <Tab eventKey="radios" title="Radios">
                <RadiosPage />
              </Tab>
            )}
            <Tab eventKey="agencies" title="Agencies" disabled>
              <RadiosPage />
            </Tab>
          </Tabs>
        </Card.Header>
      </Card>
    </Container>
  );
};

export default ResourcesPage;
