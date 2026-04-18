import React from 'react';
import './StatusCards.css';

function StatusCards({ missions, personnel, equipment, alerts }) {
  const activeMissions = missions.filter(m => m.status === 'Active').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
  const readinessRate = equipment ? equipment.overallReadiness : 0;

  const cards = [
    {
      label: 'ACTIVE MISSIONS',
      value: activeMissions,
      total: missions.length,
      icon: '//',
      color: 'var(--accent-cyan)',
      suffix: ` / ${missions.length}`
    },
    {
      label: 'PERSONNEL READY',
      value: personnel ? personnel.available : 0,
      total: personnel ? personnel.total : 0,
      icon: '::',
      color: 'var(--accent-green)',
      suffix: ` / ${personnel ? personnel.total : 0}`
    },
    {
      label: 'EQUIPMENT READINESS',
      value: readinessRate,
      icon: '%%',
      color: readinessRate >= 90 ? 'var(--accent-green)' : readinessRate >= 75 ? 'var(--accent-orange)' : 'var(--accent-red)',
      suffix: '%'
    },
    {
      label: 'THREAT ALERTS',
      value: criticalAlerts,
      icon: '!!',
      color: criticalAlerts > 0 ? 'var(--accent-red)' : 'var(--accent-green)',
      suffix: ' CRITICAL'
    }
  ];

  return (
    <div className="status-cards">
      {cards.map((card, i) => (
        <div key={i} className="status-card">
          <div className="card-icon" style={{ color: card.color }}>{card.icon}</div>
          <div className="card-content">
            <span className="card-label">{card.label}</span>
            <span className="card-value" style={{ color: card.color }}>
              {card.value}<span className="card-suffix">{card.suffix}</span>
            </span>
          </div>
          <div className="card-glow" style={{ background: card.color }} />
        </div>
      ))}
    </div>
  );
}

export default StatusCards;
