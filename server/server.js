const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[TOC Server] Tactical Operations Center API running on port ${PORT}`);
  console.log(`[TOC Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[TOC Server] Health check: http://localhost:${PORT}/api/health`);
});
