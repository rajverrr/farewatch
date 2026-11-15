const express = require('express');
const router = express.Router();
const { searchFlights } = require('../services/flightService');
const { getRouteBenchmark } = require('../services/priceIntelligence');

router.get('/search', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: origin, destination, date'
      });
    }

    const result = await searchFlights(origin.toUpperCase(), destination.toUpperCase(), date);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Flight search error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/benchmark', (req, res) => {
  const { origin, destination } = req.query;
  if (!origin || !destination) {
    return res.status(400).json({ success: false, error: 'origin and destination required' });
  }
  const benchmark = getRouteBenchmark(origin, destination);
  res.json({ success: true, benchmark });
});

module.exports = router;
