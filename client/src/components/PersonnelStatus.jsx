import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './PersonnelStatus.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function PersonnelStatus({ personnel }) {
  if (!personnel) return null;

  const data = {
    labels: ['Deployed', 'Available', 'Training', 'On Leave'],
    datasets: [{
      data: [personnel.deployed, personnel.available, personnel.training, personnel.onLeave],
      backgroundColor: [
        'rgba(0, 240, 255, 0.8)',
        'rgba(0, 255, 136, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(255, 149, 0, 0.8)'
      ],
      borderColor: [
        'rgba(0, 240, 255, 1)',
        'rgba(0, 255, 136, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(255, 149, 0, 1)'
      ],
      borderWidth: 2,
      hoverBorderWidth: 3,
      hoverOffset: 8
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#8892a4',
          font: { family: "'Share Tech Mono', monospace", size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10
        }
      },
      tooltip: {
        backgroundColor: '#1a2332',
        borderColor: '#2a3a4f',
        borderWidth: 1,
        titleFont: { family: "'Share Tech Mono', monospace" },
        bodyFont: { family: "'Rajdhani', sans-serif" },
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw} personnel`
        }
      }
    }
  };

  return (
    <div className="panel personnel-status">
      <div className="panel-header">
        <span>{'// PERSONNEL STATUS'}</span>
        <span className="header-count">{personnel.total} TOTAL</span>
      </div>
      <div className="panel-body">
        <div className="chart-container">
          <Doughnut data={data} options={options} />
          <div className="chart-center">
            <span className="center-value">{Math.round((personnel.available / personnel.total) * 100)}%</span>
            <span className="center-label">READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonnelStatus;
