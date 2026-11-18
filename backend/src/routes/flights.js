const express = require('express');
const router = express.Router();
const { searchFlights } = require('../services/flightService');
const { getRouteBenchmark } = require('../services/priceIntelligence');

router.get('/search', async (req, res) => {
  try {
    const { origin, destination, date, tripType, returnDate, adults, children, cabinClass } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: origin, destination, date'
      });
    }

    const cleanOrigin = origin.trim().toUpperCase();
    const cleanDestination = destination.trim().toUpperCase();

    if (cleanOrigin === cleanDestination) {
      return res.status(400).json({
        success: false,
        error: 'Departure and destination airports cannot be the same.'
      });
    }

    const result = await searchFlights({
      origin: cleanOrigin,
      destination: cleanDestination,
      date,
      tripType: tripType || 'one-way',
      returnDate: returnDate || '',
      adults: parseInt(adults || '1', 10),
      children: parseInt(children || '0', 10),
      cabinClass: cabinClass || 'economy'
    });

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
  const benchmark = getRouteBenchmark(origin.trim().toUpperCase(), destination.trim().toUpperCase());
  res.json({ success: true, benchmark });
});

module.exports = router;
