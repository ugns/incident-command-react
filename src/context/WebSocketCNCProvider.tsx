import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useWebSocketCNC } from '../hooks/useWebSocketCNC';
import { useVolunteers } from '../context/VolunteerContext';
import { useUnit } from '../context/UnitContext';
import { usePeriod } from '../context/PeriodContext';
import { useIncident } from '../context/IncidentContext';

// This component wires up the WebSocket CNC connection at the app root
// and logs connection status and all incoming messages for now.
const WebSocketCNCProvider: React.FC = () => {
  const { token } = useContext(AuthContext);
  const { refresh: refreshVolunteers } = useVolunteers();
  const { refresh: refreshUnits } = useUnit();
  const { refresh: refreshPeriods } = usePeriod();
  const { refresh: refreshIncidents } = useIncident();

  useWebSocketCNC(token, (msg) => {
    switch (msg.type) {
      case 'volunteersUpdated':
        refreshVolunteers();
        break;
      case 'unitsUpdated':
        refreshUnits();
        break;
      case 'periodsUpdated':
        refreshPeriods();
        break;
      case 'incidentsUpdated':
        refreshIncidents();
        break;
      case 'assignmentsUpdated':
        // AssignmentBoard uses volunteers context, so refresh volunteers
        refreshVolunteers();
        break;
      default:
        // eslint-disable-next-line no-console
        console.log('[WebSocketCNC] Unhandled message:', msg);
        break;
    }
  });

  return null;
};

export default WebSocketCNCProvider;
