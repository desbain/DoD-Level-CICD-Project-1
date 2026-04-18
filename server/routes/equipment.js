const express = require('express');
const router = express.Router();
const { equipment } = require('../data/mockData');

router.get('/', (req, res) => {
  res.json(equipment);
});

module.exports = router;
