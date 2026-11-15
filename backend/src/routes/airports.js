const express = require('express');
const router = express.Router();
const airports = require('../data/airports.json');

router.get('/', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ success: true, count: airports.length, airports });
  }

  const query = q.toLowerCase();
  const filtered = airports.filter(a => 
    a.code.toLowerCase().includes(query) ||
    a.city.toLowerCase().includes(query) ||
    a.name.toLowerCase().includes(query) ||
    a.state.toLowerCase().includes(query)
  );

  res.json({ success: true, count: filtered.length, airports: filtered });
});

module.exports = router;
