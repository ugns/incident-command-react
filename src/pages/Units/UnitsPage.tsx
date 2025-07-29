import React from 'react';
import { useUnit } from '../../context/UnitContext';

const UnitsPage: React.FC = () => {
  const { units, loading, error, selectedUnit, setSelectedUnit, refresh } = useUnit();

  return (
    <div className="container mt-4">
      <h2>Units</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-danger">{error}</div>}
      <button className="btn btn-sm btn-secondary mb-2" onClick={refresh}>Refresh</button>
      <ul className="list-group">
        {units.map(unit => (
          <li
            key={unit.unitId}
            className={`list-group-item${selectedUnit && selectedUnit.unitId === unit.unitId ? ' active' : ''}`}
            onClick={() => setSelectedUnit(unit)}
            style={{ cursor: 'pointer' }}
          >
            {unit.name || unit.unitId}
          </li>
        ))}
      </ul>
      {/* TODO: Add create/edit/delete UI */}
    </div>
  );
};

export default UnitsPage;
