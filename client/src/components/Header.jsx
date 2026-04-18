import React, { useState, useEffect } from 'react';
import './Header.css';

function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).toUpperCase();
  };

  return (
    <header className="header">
      <div className="classification-banner">
        UNCLASSIFIED // FOR TRAINING USE ONLY // FOUO
      </div>
      <div className="header-main">
        <div className="header-left">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="header-title">
            <h1>TACTICAL OPERATIONS CENTER</h1>
            <span className="header-subtitle">JOINT TASK FORCE // COMMAND DASHBOARD v2.4.1</span>
          </div>
        </div>
        <div className="header-right">
          <div className="header-clock">
            <span className="clock-time">{formatTime(time)}</span>
            <span className="clock-label">ZULU</span>
          </div>
          <div className="header-date">
            {formatDate(time)}
          </div>
          <div className="header-status">
            <span className="status-dot" />
            SYSTEM ONLINE
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
