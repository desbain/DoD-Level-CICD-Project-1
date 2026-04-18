import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from 'chart.js';
import './EquipmentReadiness.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

function EquipmentReadiness({ equipment }) {
  if (!equipment) return null;

  const getBarColor = (value) => {
    if (value >= 95) return 'rgba(0, 255, 136, 0.8)';
    if (value >= 85) return 'rgba(0, 240, 255, 0.8)';
    if (value >= 75) return 'rgba(255, 149, 0, 0.8)';
    return 'rgba(255, 59, 92, 0.8)';
  };

  const data = {
    labels: equipment.categories.map(c => c.name),
    datasets: [{
      data: equipment.categories.map(c => c.readiness),
      backgroundColor: equipment.categories.map(c => getBarColor(c.readiness)),
      borderColor: equipment.categories.map(c => getBarColor(c.readiness).replace('0.8', '1')),
      borderWidth: 1,
      borderRadius: 4,
      barThickness: 20
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(42, 58, 79, 0.3)', drawBorder: false },
        ticks: {
          color: '#5a6577',
          font: { family: "'Share Tech Mono', monospace", size: 10 },
          callback: (v) => `${v}%`
        }
      },
      y: {
        grid: { display: false },
        ticks: {
          color: '#8892a4',
          font: { family: "'Share Tech Mono', monospace", size: 10 },
          crossAlign: 'far'
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a2332',
        borderColor: '#2a3a4f',
        borderWidth: 1,
        titleFont: { family: "'Share Tech Mono', monospace" },
        bodyFont: { family: "'Rajdhani', sans-serif" },
        callbacks: {
          label: (ctx) => {
            const cat = equipment.categories[ctx.dataIndex];
            return ` ${cat.operational}/${cat.total} operational (${cat.readiness}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="panel equipment-readiness">
      <div className="panel-header">
        <span>{'// EQUIPMENT READINESS'}</span>
        <span className="header-count">{equipment.overallReadiness}% OVERALL</span>
      </div>
      <div className="panel-body">
        <div className="bar-chart-container">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default EquipmentReadiness;
