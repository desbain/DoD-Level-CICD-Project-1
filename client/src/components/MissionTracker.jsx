import React from 'react';
import './MissionTracker.css';

function MissionTracker({ missions }) {
  const getStatusClass = (status) => {
    const classes = {
      Active: 'status-active',
      Pending: 'status-pending',
      Complete: 'status-complete'
    };
    return classes[status] || '';
  };

  const getPriorityClass = (priority) => {
    const classes = {
      Critical: 'priority-critical',
      High: 'priority-high',
      Medium: 'priority-medium',
      Low: 'priority-low'
    };
    return classes[priority] || '';
  };

  return (
    <div className="panel mission-tracker">
      <div className="panel-header">
        <span>{'// MISSION TRACKER'}</span>
        <span className="header-count">{missions.length} OPERATIONS</span>
      </div>
      <div className="panel-body">
        <table className="mission-table">
          <thead>
            <tr>
              <th>OP ID</th>
              <th>CODENAME</th>
              <th>TYPE</th>
              <th>STATUS</th>
              <th>PRIORITY</th>
              <th>PROGRESS</th>
            </tr>
          </thead>
          <tbody>
            {missions.map(mission => (
              <tr key={mission.id}>
                <td className="mono">{mission.id}</td>
                <td className="mission-name">{mission.name}</td>
                <td>{mission.type}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(mission.status)}`}>
                    {mission.status}
                  </span>
                </td>
                <td>
                  <span className={`priority-badge ${getPriorityClass(mission.priority)}`}>
                    {mission.priority}
                  </span>
                </td>
                <td>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${mission.progress}%`,
                        background: mission.progress === 100
                          ? 'var(--accent-green)'
                          : mission.progress > 60
                          ? 'var(--accent-cyan)'
                          : 'var(--accent-orange)'
                      }}
                    />
                    <span className="progress-text">{mission.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MissionTracker;
