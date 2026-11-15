const cron = require('node-cron');
const alertStore = require('../storage/alertStore');
const { searchFlights } = require('./flightService');
const { dispatchAlertNotification } = require('./notificationService');

let cronJob = null;

/**
 * Check a single alert against live prices
 */
async function checkAlert(alert) {
  try {
    const flightData = await searchFlights(alert.origin, alert.destination, alert.travelDate);
    const currentLowest = flightData.lowestPrice;
    const isTargetMet = currentLowest <= alert.targetPrice;
    const isStrongBuy = flightData.evaluation.verdict === 'STRONG_BUY';

    let triggered = false;
    let newStatus = alert.status;

    if (isTargetMet || isStrongBuy) {
      triggered = true;
      newStatus = isTargetMet ? 'TRIGGERED_PRICE_DROP' : 'TRIGGERED_STRONG_BUY';

      // Dispatch WhatsApp / Telegram notification
      await dispatchAlertNotification(alert, flightData);
    }

    // Update alert status
    alertStore.updateAlert(alert.id, {
      currentLowest,
      lastCheckedAt: new Date().toISOString(),
      status: newStatus
    });

    return { alertId: alert.id, currentLowest, triggered, newStatus };
  } catch (err) {
    console.error(`Error checking alert ${alert.id}:`, err.message);
    return { alertId: alert.id, error: err.message };
  }
}

/**
 * Run check for all active alerts
 */
async function runAllAlertChecks() {
  const alerts = alertStore.getAllAlerts().filter(a => a.active);
  console.log(`[AlertEngine] Running price check for ${alerts.length} active alerts...`);
  const results = [];
  for (const alert of alerts) {
    const res = await checkAlert(alert);
    results.push(res);
  }
  return results;
}

/**
 * Manually trigger a test notification for a specific alert
 */
async function triggerAlertManually(alertId) {
  const alert = alertStore.getAlertById(alertId);
  if (!alert) throw new Error('Alert not found');

  const flightData = await searchFlights(alert.origin, alert.destination, alert.travelDate);
  const notificationResults = await dispatchAlertNotification(alert, flightData);

  alertStore.updateAlert(alert.id, {
    currentLowest: flightData.lowestPrice,
    lastCheckedAt: new Date().toISOString(),
    status: 'TEST_TRIGGERED_SUCCESS'
  });

  return {
    alert,
    flightData,
    notificationResults
  };
}

/**
 * Initialize background cron job (runs every 30 minutes)
 */
function initScheduler() {
  if (cronJob) return;

  // Run every 30 mins
  cronJob = cron.schedule('*/30 * * * *', async () => {
    try {
      await runAllAlertChecks();
    } catch (err) {
      console.error('[AlertEngine] Cron error:', err);
    }
  });

  console.log('[AlertEngine] Background price-monitoring scheduler activated (every 30 mins).');
}

module.exports = {
  checkAlert,
  runAllAlertChecks,
  triggerAlertManually,
  initScheduler
};
