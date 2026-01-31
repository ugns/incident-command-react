import React, { useState } from 'react';
import { Container, Card, Tabs, Tab } from 'react-bootstrap';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PeoplePage from './PeoplePage';
import RadiosResourcePage from './RadiosResourcePage';
import AgencyResourcePage from './AgencyResourcePage';
import PrizeInfoPage from './PrizeInfoPage';
import type { FeatureFlags } from '../../types/FeatureFlags';

const ResourcesPage: React.FC = () => {

  const [key, setKey] = useState<string>('people');
  const flags = useFlags<FeatureFlags>();
  const { showRadioResources, showAgencyResources } = flags;
  const { showPrizeinfoResources: showPrizeInfo } = flags;

  const resourceTabs = [
    { eventKey: 'people', title: 'People', component: <PeoplePage /> },
    { eventKey: 'radios', title: 'Radios', component: <RadiosResourcePage />, show: showRadioResources },
    { eventKey: 'agencies', title: 'Agencies', component: <AgencyResourcePage />, show: showAgencyResources },
    { eventKey: 'prize-info', title: 'Prize Info', component: <PrizeInfoPage />, show: showPrizeInfo },
  ];

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <Tabs activeKey={key} onSelect={k => setKey(k || 'people')} fill>
            {resourceTabs.map(tab =>
              tab.show === false ? null : (
                <Tab
                  key={tab.eventKey}
                  eventKey={tab.eventKey}
                  title={tab.title}
                >
                  {tab.component}
                </Tab>
              )
            )}
          </Tabs>
        </Card.Header>
      </Card>
    </Container>
  );
};

export default ResourcesPage;
