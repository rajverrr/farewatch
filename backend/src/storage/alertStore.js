const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../../data/alerts.json');

// Ensure data file exists with default starter alerts
function ensureStorage() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const starterAlerts = [
      {
        id: 'alert-diwali-del-pat',
        origin: 'DEL',
        originCity: 'New Delhi',
        destination: 'PAT',
        destinationCity: 'Patna',
        travelDate: '2026-11-12',
        festivalId: 'diwali-chhath',
        festivalName: 'Diwali & Chhath Puja',
        targetPrice: 5500,
        currentLowest: 5200,
        historicalPeak: 19500,
        channel: 'whatsapp',
        contactInfo: '+91 98765 43210',
        active: true,
        lastCheckedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'TRIGGERED_STRONG_BUY'
      },
      {
        id: 'alert-puja-blr-ccu',
        origin: 'BLR',
        originCity: 'Bengaluru',
        destination: 'CCU',
        destinationCity: 'Kolkata',
        travelDate: '2026-10-17',
        festivalId: 'durga-puja',
        festivalName: 'Durga Puja',
        targetPrice: 6500,
        currentLowest: 5900,
        historicalPeak: 17800,
        channel: 'whatsapp',
        contactInfo: '+91 91234 56789',
        active: true,
        lastCheckedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        status: 'MONITORING'
      }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(starterAlerts, null, 2));
  }
}

function getAllAlerts() {
  ensureStorage();
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading alerts:', err);
    return [];
  }
}

function getAlertById(id) {
  const alerts = getAllAlerts();
  return alerts.find(a => a.id === id) || null;
}

function saveAlerts(alerts) {
  ensureStorage();
  fs.writeFileSync(DATA_FILE, JSON.stringify(alerts, null, 2));
}

function createAlert(data) {
  const alerts = getAllAlerts();
  const newAlert = {
    id: `alert-${Date.now()}-${uuidv4().slice(0, 6)}`,
    origin: data.origin.toUpperCase(),
    originCity: data.originCity || data.origin,
    destination: data.destination.toUpperCase(),
    destinationCity: data.destinationCity || data.destination,
    travelDate: data.travelDate,
    tripType: data.tripType || 'one-way',
    returnDate: data.returnDate || null,
    adults: Number(data.adults) || 1,
    children: Number(data.children) || 0,
    cabinClass: data.cabinClass || 'economy',
    festivalId: data.festivalId || 'custom',
    festivalName: data.festivalName || 'Custom Travel',
    targetPrice: Number(data.targetPrice),
    currentLowest: Number(data.currentLowest) || null,
    historicalPeak: Number(data.historicalPeak) || 15000,
    channel: data.channel || 'whatsapp',
    contactInfo: data.contactInfo,
    callMeBotApiKey: data.callMeBotApiKey || '',
    telegramChatId: data.telegramChatId || '',
    active: true,
    lastCheckedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 'MONITORING'
  };

  alerts.unshift(newAlert);
  saveAlerts(alerts);
  return newAlert;
}

function updateAlert(id, updates) {
  const alerts = getAllAlerts();
  const index = alerts.findIndex(a => a.id === id);
  if (index === -1) return null;

  alerts[index] = { ...alerts[index], ...updates, updatedAt: new Date().toISOString() };
  saveAlerts(alerts);
  return alerts[index];
}

function deleteAlert(id) {
  const alerts = getAllAlerts();
  const filtered = alerts.filter(a => a.id !== id);
  saveAlerts(filtered);
  return true;
}

module.exports = {
  getAllAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  deleteAlert
};
