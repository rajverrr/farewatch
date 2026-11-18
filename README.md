# FestiveFare (FareWatch) 🪔✈️
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
1. **Historical Festive Benchmark Matrix** across 23+ key Indian sectors.
2. **Predictive Deal Score & "Buy vs Wait" Engine** (identifying bottom 15% festive price floors).
3. **Instant Multi-Channel Alerts via WhatsApp & Telegram** with 1-click booking deep links.
4. **Flight Inventory Filtering & Sorting** by price, non-stop vs 1-stop, and airlines.

---

## 🚀 Live Ports

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend (React + Vite + Tailwind)** | `http://localhost:5173/` | Interactive Search, Festival Presets, Deal Meter, Surge Timeline, Filter & Alert Manager |
| **Backend (Node.js / Express)** | `http://localhost:5001/` | REST APIs, Price Intelligence Engine, Background Cron & Notification Dispatcher |

---

## 🛠️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 React Frontend (Vite + Tailwind)            │
│  - Festival Carousel (Goa NY, Holi, Eid, Durga Puja, Diwali)│
│  - Airport Autosuggest (DEL, BOM, BLR, PAT, CCU, GOI, etc.)  │
│  - Deal Score & Buy/Wait Gauge (0 - 100)                    │
│  - Historical Surge Curve Visualizer (T-90d to T-2d)         │
│  - Filter (Stops, Airlines) & Sort (Price, Earliest)         │
│  - WhatsApp & Telegram Alert Subscription Drawer             │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API
┌──────────────────────────────▼──────────────────────────────┐
│                  Node.js / Express Backend                  │
│  - /api/festivals & /api/airports                            │
│  - /api/flights/search & /api/flights/benchmark             │
│  - /api/alerts (Persistent CRUD & Cron Price Monitor)       │
│  - /api/alerts/:id/trigger (Instant Test Dispatch)          │
│  - /api/notifications/recent (Dispatched Alerts History)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
[Price Intelligence]    [Flight Search]        [Notification Engine]
- Historical Matrix     - IndiGo, Air India,   - WhatsApp (Click-to-Chat, CallMeBot, Twilio)
- Surge Curve Model       Akasa, SpiceJet      - Telegram Bot API
- Deal Score & Advice   - Live API / Fallback  - Persistent notification log
```

---

## 🏃 Quick Start

### Option 1: Run Both Together (Recommended)
From the repository root:
```bash
npm run install:all   # Installs both backend and frontend dependencies
npm run dev           # Starts both backend (5001) & frontend (5173) concurrently
```

### Option 2: Run Separately
```bash
# 1. Backend
cd backend
npm install
npm run dev
# Running on http://localhost:5001

# 2. Frontend
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 📱 WhatsApp & Telegram Notification Setup

* **Zero-Setup WhatsApp (Click-to-Chat):** Works out of the box with zero API keys. When an alert triggers or you test it, click **"Open in WhatsApp Web / App"** to preview and send pre-filled messages.
* **Automated WhatsApp Bot (Free via CallMeBot):**
  1. Save `+34 644 44 20 89` in your phone contacts as *CallMeBot*.
  2. Send WhatsApp message: `I allow callmebot to send me messages`.
  3. You will receive an API key. Enter it in the alert modal for automated bot alerts.
* **Twilio WhatsApp (Production):** Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_WHATSAPP_NUMBER` in `backend/.env`.
* **Telegram Bot:** Set `TELEGRAM_BOT_TOKEN` in `backend/.env` and pass your chat handle/ID.

---

## ⚙️ Environment Variables (Optional)

Create a `.env` file in `backend/` to configure live notification gateways or Amadeus flight data:

```env
PORT=5001

# Twilio WhatsApp (Optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN=your_bot_token

# Amadeus Flight Data (Optional - defaults to high-fidelity domestic simulator)
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret
```
