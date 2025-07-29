import React from 'react';
import { useIncident } from '../../context/IncidentContext';

const IncidentsPage: React.FC = () => {
  const { incidents, loading, error, selectedIncident, setSelectedIncident, refresh } = useIncident();

  return (
    <div className="container mt-4">
      <h2>Incidents</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-danger">{error}</div>}
      <button className="btn btn-sm btn-secondary mb-2" onClick={refresh}>Refresh</button>
      <ul className="list-group">
        {incidents.map(incident => (
          <li
            key={incident.incidentId}
            className={`list-group-item${selectedIncident && selectedIncident.incidentId === incident.incidentId ? ' active' : ''}`}
            onClick={() => setSelectedIncident(incident)}
            style={{ cursor: 'pointer' }}
          >
            {incident.name || incident.incidentId}
          </li>
        ))}
      </ul>
      {/* TODO: Add create/edit/delete UI */}
    </div>
  );
};

export default IncidentsPage;
