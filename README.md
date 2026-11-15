# FestiveFare (TyoharFly) 🪔✈️
> **AI-Powered Indian Festive Flight Price Predictor & Multi-Channel Alert Engine (WhatsApp & Telegram)**

---

## 💡 The Core Problem
During Indian festive seasons (**Diwali, Chhath Puja, Durga Puja, Goa New Year, Holi, Onam**), flight prices skyrocket **3x to 5x**:
* **Delhi / Bengaluru ➔ Patna (Diwali & Chhath):** Jumps from ₹4,200 to ₹19,500+.
* **Bengaluru / Mumbai ➔ Kolkata (Durga Puja):** Jumps from ₹4,500 to ₹17,800+.
* **Mumbai / Delhi ➔ Goa (New Year):** Jumps from ₹3,000 to ₹16,800+.

Standard flight aggregators only say *"Price dropped by ₹200"*, but **never tell you the festive context**:
> *"Is this actually the lowest rate I will ever get, or should I wait? When does the steep 2.5x surge window begin?"*

**FestiveFare** solves this by combining:
1. **Historical Festive Benchmark Matrix** across 20+ key Indian sectors.
2. **Predictive Deal Score & "Buy vs Wait" Engine** (identifying bottom 15% festive price floors).
3. **Instant Multi-Channel Alerts via WhatsApp & Telegram** with 1-click booking deep links.

---

## 🚀 Live Demo & Ports

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend (React + Tailwind)** | `http://localhost:5173/` | Interactive Search, Festival Presets, Deal Meter, Surge Timeline & Alert Manager |
| **Backend (Node.js / Express)** | `http://localhost:5001/` | REST APIs, Price Intelligence Engine, Background Cron & Notification Dispatcher |

---

## 🛠️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 React Frontend (Vite + Tailwind)            │
│  - Festival Carousel (Diwali, Chhath, Durga Puja, Holi...)   │
│  - Airport Autosuggest (DEL, BOM, BLR, PAT, CCU, GOI, etc.)  │
│  - Deal Score & Buy/Wait Gauge (0 - 100)                    │
│  - Historical Surge Curve Visualizer (T-90d to T-2d)         │
│  - WhatsApp & Telegram Alert Subscription Drawer             │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API
┌──────────────────────────────▼──────────────────────────────┐
│                  Node.js / Express Backend                  │
│  - /api/festivals & /api/airports                            │
│  - /api/flights/search & /api/flights/benchmark             │
│  - /api/alerts (Persistent CRUD)                            │
│  - /api/alerts/:id/trigger (Instant Test Dispatch)          │
│  - /api/notifications/recent                                │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
[Price Intelligence]    [Flight Search]        [Notification Engine]
- Historical Matrix     - IndiGo, Air India,   - WhatsApp (Twilio & CallMeBot)
- Surge Curve Model       Akasa, SpiceJet      - Telegram Bot API
- Deal Score & Advice   - Live API / Fallback  - Click-to-Chat Deep Links
```

---

## 📱 WhatsApp & Telegram Notification Features

* **Direct WhatsApp Alerts:** Supports **Twilio WhatsApp API**, **CallMeBot Free WhatsApp Gateway**, and **WhatsApp Click-to-Chat** direct deep-links.
* **Telegram Bot API:** Instant Markdown messages delivered straight to mobile chat handles.
* **Instant In-App Test Dispatch:** Click the **"⚡ Test Alert Now"** button on any tracked route to see the exact formatted WhatsApp message appear in real-time.

---

## 🏃 Quick Start

### 1. Backend
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5001
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## ⚙️ Environment Variables (Optional)

Create a `.env` file in `backend/` to enable production notification gateways:

```env
PORT=5001

# Twilio WhatsApp (Optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN=your_bot_token

# Flight Data (Optional - defaults to high-fidelity domestic simulator)
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret
```
