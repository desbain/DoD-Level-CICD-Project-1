const express = require('express');
const path = require('path');
const { helmetConfig, corsConfig, limiter } = require('./middleware/security');
const missionsRouter = require('./routes/missions');
const personnelRouter = require('./routes/personnel');
const equipmentRouter = require('./routes/equipment');
const alertsRouter = require('./routes/alerts');

const app = express();

// Security middleware
app.use(helmetConfig);
app.use(corsConfig);
app.use(express.json());

// Health check — registered before the rate limiter so Kubernetes
// liveness/readiness probes are never throttled
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Rate limiter applied only to API routes (not the health endpoint)
app.use(limiter);

// API routes
app.use('/api/missions', missionsRouter);
app.use('/api/personnel', personnelRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/alerts', alertsRouter);

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

module.exports = app;
