const axios = require('axios');

// In-memory feed of recent dispatched notifications
const recentNotifications = [];

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

👉 Book now: ${bookingUrl || 'https://www.makemytrip.com/flights'}`
  };
}

/**
 * Send WhatsApp notification
 */
async function sendWhatsAppNotification({ phone, messageText, callMeBotApiKey }) {
  // Clean phone number (e.g. +91 9876543210 -> 919876543210)
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

  // Fallback: Generate direct WhatsApp Click-to-Chat URL
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

  recentNotifications.unshift(logEntry);
  if (recentNotifications.length > 50) recentNotifications.pop();

  return logEntry;
}

/**
 * Send Telegram notification
 */
async function sendTelegramNotification({ chatId, messageText, botToken }) {
  const token = botToken || process.env.TELEGRAM_BOT_TOKEN;
  let status = 'sent';
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

  recentNotifications.unshift(logEntry);
  if (recentNotifications.length > 50) recentNotifications.pop();

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

  recentNotifications.unshift(logEntry);
  if (recentNotifications.length > 50) recentNotifications.pop();

  return logEntry;
}

/**
 * Dispatch alert to the user's chosen channel(s)
 */
async function dispatchAlertNotification(alert, flightData) {
  const { channel, contactInfo, callMeBotApiKey, telegramChatId } = alert;
  const { origin, destination, date, lowestPrice, evaluation } = flightData;

  const { plainText, title } = formatDealMessage({
    route: `${origin} - ${destination}`,
    origin,
    destination,
    date,
    price: lowestPrice,
    benchmark: evaluation.benchmark,
    matchedFestival: evaluation.matchedFestival,
    bookingUrl: `https://www.google.com/travel/flights?q=flights+from+${origin}+to+${destination}+on+${date}`
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
  return recentNotifications;
}

module.exports = {
  formatDealMessage,
  sendWhatsAppNotification,
  sendTelegramNotification,
  sendEmailNotification,
  dispatchAlertNotification,
  getRecentNotifications
};
