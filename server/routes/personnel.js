const express = require('express');
const router = express.Router();
const { personnel } = require('../data/mockData');

router.get('/', (req, res) => {
  res.json(personnel);
});

module.exports = router;
