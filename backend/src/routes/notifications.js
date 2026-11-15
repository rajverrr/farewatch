const express = require('express');
const router = express.Router();
const { getRecentNotifications, sendWhatsAppNotification } = require('../services/notificationService');

// Get recent notification history
router.get('/recent', (req, res) => {
  const notifications = getRecentNotifications();
  res.json({ success: true, count: notifications.length, notifications });
});

// Quick WhatsApp test endpoint
router.post('/test-whatsapp', async (req, res) => {
  try {
    const { phone, message, callMeBotApiKey } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    const testMessage = message || 
      `🔥 *FestiveFare WhatsApp Test Alert*\n\nYour flight price tracker is successfully connected! You will receive lowest-price alerts here.`;

    const result = await sendWhatsAppNotification({
      phone,
      messageText: testMessage,
      callMeBotApiKey
    });

    res.json({ success: true, message: 'WhatsApp notification dispatched!', result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
