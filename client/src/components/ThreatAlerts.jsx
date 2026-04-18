import React from 'react';
import './ThreatAlerts.css';

function ThreatAlerts({ alerts }) {
  const getSeverityClass = (severity) => {
    const classes = {
      critical: 'severity-critical',
      high: 'severity-high',
      medium: 'severity-medium',
      low: 'severity-low'
    };
    return classes[severity] || '';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };

  return (
    <div className="panel threat-alerts">
      <div className="panel-header">
        <span>{'// THREAT ALERTS'}</span>
        <span className="header-count">{alerts.filter(a => !a.acknowledged).length} ACTIVE</span>
      </div>
      <div className="panel-body alerts-list">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-item ${getSeverityClass(alert.severity)} ${alert.acknowledged ? 'acknowledged' : ''}`}>
            <div className="alert-indicator" />
            <div className="alert-content">
              <div className="alert-top">
                <span className={`alert-severity ${getSeverityClass(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className="alert-time" title={alert.timestamp}>
                  {formatTime(alert.timestamp)}{' // '}{getTimeSince(alert.timestamp)}
                </span>
              </div>
              <h4 className="alert-title">{alert.title}</h4>
              <p className="alert-message">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThreatAlerts;
