import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatusCards from './components/StatusCards';
import MissionTracker from './components/MissionTracker';
import PersonnelStatus from './components/PersonnelStatus';
import EquipmentReadiness from './components/EquipmentReadiness';
import ThreatAlerts from './components/ThreatAlerts';
import './App.css';

function App() {
  const [missions, setMissions] = useState([]);
  const [personnel, setPersonnel] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [missionsRes, personnelRes, equipmentRes, alertsRes] = await Promise.all([
          fetch('/api/missions'),
          fetch('/api/personnel'),
          fetch('/api/equipment'),
          fetch('/api/alerts')
        ]);

        const missionsData = await missionsRes.json();
        const personnelData = await personnelRes.json();
        const equipmentData = await equipmentRes.json();
        const alertsData = await alertsRes.json();

        setMissions(missionsData.missions);
        setPersonnel(personnelData);
        setEquipment(equipmentData);
        setAlerts(alertsData.alerts);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>INITIALIZING TACTICAL OPERATIONS CENTER...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="dashboard">
        <StatusCards
          missions={missions}
          personnel={personnel}
          equipment={equipment}
          alerts={alerts}
        />
        <div className="dashboard-grid">
          <MissionTracker missions={missions} />
          <div className="charts-column">
            <PersonnelStatus personnel={personnel} />
            <EquipmentReadiness equipment={equipment} />
          </div>
          <ThreatAlerts alerts={alerts} />
        </div>
      </main>
    </div>
  );
}

export default App;
