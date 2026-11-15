const express = require('express');
const router = express.Router();
const alertStore = require('../storage/alertStore');
const { triggerAlertManually, runAllAlertChecks } = require('../services/alertEngine');

// Get all alerts
router.get('/', (req, res) => {
  const alerts = alertStore.getAllAlerts();
  res.json({ success: true, count: alerts.length, alerts });
});

// Create new alert
router.post('/', (req, res) => {
  try {
    const { origin, destination, travelDate, targetPrice, contactInfo, channel } = req.body;
    if (!origin || !destination || !travelDate || !targetPrice || !contactInfo) {
      return res.status(400).json({
        success: false,
        error: 'origin, destination, travelDate, targetPrice, and contactInfo are required'
      });
    }

    const newAlert = alertStore.createAlert(req.body);
    res.status(201).json({ success: true, alert: newAlert });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete alert
router.delete('/:id', (req, res) => {
  const success = alertStore.deleteAlert(req.params.id);
  res.json({ success });
});

// Trigger test notification for an alert
router.post('/:id/trigger', async (req, res) => {
  try {
    const result = await triggerAlertManually(req.params.id);
    res.json({ success: true, message: 'Notification triggered successfully!', result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Run check for all alerts
router.post('/run-check', async (req, res) => {
  try {
    const results = await runAllAlertChecks();
    res.json({ success: true, message: 'Price checks completed', results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
