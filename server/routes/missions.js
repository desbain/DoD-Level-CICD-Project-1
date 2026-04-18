const express = require('express');
const router = express.Router();
const { missions } = require('../data/mockData');

router.get('/', (req, res) => {
  const { status, priority } = req.query;
  let filtered = [...missions];

  if (status) {
    filtered = filtered.filter(m => m.status.toLowerCase() === status.toLowerCase());
  }
  if (priority) {
    filtered = filtered.filter(m => m.priority.toLowerCase() === priority.toLowerCase());
  }

  res.json({
    count: filtered.length,
    missions: filtered
  });
});

module.exports = router;
