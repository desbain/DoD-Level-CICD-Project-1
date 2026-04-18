const express = require('express');
const router = express.Router();
const { alerts } = require('../data/mockData');

router.get('/', (req, res) => {
  const { severity } = req.query;
  let filtered = [...alerts];

  if (severity) {
    filtered = filtered.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
  }

  filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({
    count: filtered.length,
    alerts: filtered
  });
});

module.exports = router;
