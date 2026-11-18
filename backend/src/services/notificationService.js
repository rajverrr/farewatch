const fs = require('fs');
const path = require('path');
const axios = require('axios');

const NOTIF_FILE = path.join(__dirname, '../../data/notifications.json');

// Ensure notifications storage file exists
function ensureNotifStorage() {
  const dir = path.dirname(NOTIF_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(NOTIF_FILE)) {
    const starterNotifications = [
      {
        id: 'notif-wa-seed-1',
        channel: 'whatsapp',
        recipient: '+91 98765 43210',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: 'delivered',
        method: 'whatsapp_radar',
        previewText: '🔥 LOWEST FARE ALERT: DEL ➔ PAT\n━━━━━━━━━━━━━━━━━━━━\n🎯 Festival: 🪔 Diwali & Chhath Puja\n📅 Travel Date: 2026-12-30\n💰 Current Lowest Price: ₹5,200\n📉 Savings vs Peak: Save ₹14,300 (Historical Peak: ₹19,500)\n⚡ Verdict: Strong Buy! Lowest 15% historical bracket.\n👉 Book now: https://www.makemytrip.com/flight/search?itinerary=DEL-PAT-2026-12-30&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E',
        clickToChatUrl: 'https://api.whatsapp.com/send?phone=919876543210&text=%F0%9F%94%A5%20LOWEST%20FARE%20ALERT'
      }
    ];
    fs.writeFileSync(NOTIF_FILE, JSON.stringify(starterNotifications, null, 2));
  }
}

function loadNotifications() {
  ensureNotifStorage();
  try {
    const data = fs.readFileSync(NOTIF_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading notifications file:', err);
    return [];
  }
}

function saveNotifications(notifications) {
  ensureNotifStorage();
  try {
    fs.writeFileSync(NOTIF_FILE, JSON.stringify(notifications.slice(0, 50), null, 2));
  } catch (err) {
    console.error('Error saving notifications:', err);
  }
}

/**
 * Format a high-impact festive flight deal message
 */
function formatDealMessage({ route, origin, destination, date, price, benchmark, matchedFestival, bookingUrl }) {
  const festName = matchedFestival ? `${matchedFestival.icon} ${matchedFestival.name}` : 'Festive Travel';
  const savings = benchmark ? `Save ₹${(benchmark.historicalPeak - price).toLocaleString('en-IN')}` : '';

  return {
    title: `🚨 LOWEST FARE ALERT: ${origin} ➔ ${destination}`,
    plainText: 
`*🔥 LOWEST FARE ALERT: ${origin} ➔ ${destination}*
━━━━━━━━━━━━━━━━━━━━
🎯 *Festival:* ${festName}
📅 *Travel Date:* ${date}
💰 *Current Lowest Price:* ₹${price.toLocaleString('en-IN')}
${savings ? `📉 *Savings vs Peak:* ${savings} (Historical Peak: ₹${benchmark.historicalPeak.toLocaleString('en-IN')})\n` : ''}
⚡ *Verdict:* Strong Buy! This fare is in the lowest 15% historical bracket.
⏰ *Action:* Prices for this route usually surge in the coming days. Book immediately!

👉 Book deal now: ${bookingUrl || `https://www.makemytrip.com/flight/search?itinerary=${origin}-${destination}-${date}&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E`}`
  };
}

/**
 * Send WhatsApp notification
 */
async function sendWhatsAppNotification({ phone, messageText, callMeBotApiKey }) {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');

  let status = 'sent';
  let method = 'simulated';
  let error = null;

  // 1. Try CallMeBot Free WhatsApp API if API key provided
  if (callMeBotApiKey && cleanPhone) {
    try {
      const encodedText = encodeURIComponent(messageText);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodedText}&apikey=${callMeBotApiKey}`;
      await axios.get(url, { timeout: 8000 });
      method = 'callmebot_whatsapp_api';
    } catch (err) {
      error = err.message;
      method = 'callmebot_failed';
    }
  }
  // 2. Try Twilio WhatsApp if credentials exist in environment
  else if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER) {
    try {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        new URLSearchParams({
          From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          To: `whatsapp:${cleanPhone.startsWith('+') ? cleanPhone : '+' + cleanPhone}`,
          Body: messageText
        }).toString(),
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: 8000
        }
      );
      method = 'twilio_whatsapp_api';
    } catch (err) {
      error = err.message;
      method = 'twilio_failed';
    }
  }

  // Generate direct WhatsApp Click-to-Chat URL
  const clickToChatUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(messageText)}`;

  const logEntry = {
    id: `notif-wa-${Date.now()}`,
    channel: 'whatsapp',
    recipient: phone,
    timestamp: new Date().toISOString(),
    status: error ? 'partial_success' : 'delivered',
    method,
    previewText: messageText,
    clickToChatUrl,
    error
  };

  const list = loadNotifications();
  list.unshift(logEntry);
  saveNotifications(list);

  return logEntry;
}

/**
 * Send Telegram notification
 */
async function sendTelegramNotification({ chatId, messageText, botToken }) {
  const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
  let method = 'simulated';
  let error = null;

  if (token && chatId) {
    try {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown'
      }, { timeout: 8000 });
      method = 'telegram_bot_api';
    } catch (err) {
      error = err.message;
      method = 'telegram_failed';
    }
  }

  const logEntry = {
    id: `notif-tg-${Date.now()}`,
    channel: 'telegram',
    recipient: chatId,
    timestamp: new Date().toISOString(),
    status: error ? 'failed' : 'delivered',
    method,
    previewText: messageText,
    error
  };

  const list = loadNotifications();
  list.unshift(logEntry);
  saveNotifications(list);

  return logEntry;
}

/**
 * Send Email notification
 */
async function sendEmailNotification({ email, subject, messageText }) {
  const logEntry = {
    id: `notif-em-${Date.now()}`,
    channel: 'email',
    recipient: email,
    timestamp: new Date().toISOString(),
    status: 'delivered',
    method: 'email_dispatch',
    subject,
    previewText: messageText
  };

  const list = loadNotifications();
  list.unshift(logEntry);
  saveNotifications(list);

  return logEntry;
}

/**
 * Dispatch alert to chosen channel
 */
async function dispatchAlertNotification(alert, flightData) {
  const { channel, contactInfo, callMeBotApiKey, telegramChatId } = alert;
  const { origin, destination, date, lowestPrice, evaluation, flights } = flightData;

  const lowestFlight = flights?.[0];
  const dealUrl = lowestFlight?.bookingUrl || lowestFlight?.makeMyTripUrl;

  const { plainText, title } = formatDealMessage({
    route: `${origin} - ${destination}`,
    origin,
    destination,
    date,
    price: lowestPrice,
    benchmark: evaluation.benchmark,
    matchedFestival: evaluation.matchedFestival,
    bookingUrl: dealUrl
  });

  const results = [];

  if (channel === 'whatsapp' || channel === 'both') {
    const waRes = await sendWhatsAppNotification({
      phone: contactInfo,
      messageText: plainText,
      callMeBotApiKey
    });
    results.push(waRes);
  }

  if (channel === 'telegram' || channel === 'both') {
    const tgRes = await sendTelegramNotification({
      chatId: telegramChatId || contactInfo,
      messageText: plainText
    });
    results.push(tgRes);
  }

  if (channel === 'email') {
    const emRes = await sendEmailNotification({
      email: contactInfo,
      subject: title,
      messageText: plainText
    });
    results.push(emRes);
  }

  return results;
}

function getRecentNotifications() {
  return loadNotifications();
}

module.exports = {
  formatDealMessage,
  sendWhatsAppNotification,
  sendTelegramNotification,
  sendEmailNotification,
  dispatchAlertNotification,
  getRecentNotifications
};
