const express = require('express');
const router = express.Router();
const festivals = require('../data/festivals.json');

router.get('/', (req, res) => {
  res.json({ success: true, count: festivals.length, festivals });
});

module.exports = router;
