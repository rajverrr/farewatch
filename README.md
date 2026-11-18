# FestiveFare (FareWatch) 🪔✈️

> **AI-Powered Indian Festive Flight Price Predictor & Multi-Channel Alert Engine (WhatsApp & Telegram)**

[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey.svg?logo=express)](https://expressjs.com/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Alerts-25D366.svg?logo=whatsapp)](https://www.whatsapp.com/)
[![Telegram](https://img.shields.io/badge/Telegram-Bot-2CA5E0.svg?logo=telegram)](https://telegram.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 💡 The Core Problem

During major Indian festive windows (**Diwali, Chhath Puja, Durga Puja, Goa New Year, Holi, Eid, Onam**), domestic airfares skyrocket **3x to 5x**:
* **Delhi / Bengaluru ➔ Patna (Diwali & Chhath):** Jumps from typical ₹4,200 to ₹19,500+.
* **Bengaluru / Mumbai ➔ Kolkata (Durga Puja):** Jumps from typical ₹4,500 to ₹17,800+.
* **Mumbai / Delhi ➔ Goa (New Year):** Jumps from typical ₹3,000 to ₹16,800+.

Standard aggregators notify that a *"Price dropped by ₹150"*, but **fail to provide festive historical context**:
> *"Is this actually a bottom-floor festive rate or should I hold off? When does the exponential 2.5x surge curve start?"*

**FestiveFare** solves this by pairing:
1. **Historical Festive Benchmark Matrix** across 23+ high-density Indian festival corridors.
2. **Predictive Deal Score & "Buy vs Wait" Verdict** (evaluating bottom 15% historical price floors).
3. **Surge Curve Trajectory Visualizer** from 90 days out to 2 days before departure.
4. **Multi-Channel Instant Alert Dispatcher** via WhatsApp (Click-to-Chat, CallMeBot, Twilio) & Telegram with 1-click booking deep-links.

---

## ✨ Key Features

- 🪔 **Festive Travel Presets:** Quick 1-click presets for Diwali, Chhath Puja, Durga Puja, Holi, Goa New Year, and Eid with pre-mapped peak departure dates and routes.
- 🎯 **Deal Score & Gauge (0–100):** Real-time algorithm grading fares as *Strong Buy*, *Fair Value*, or *Overpriced (Wait)* based on sector benchmarks.
- 📈 **Historical Surge Curve Visualizer:** Visualizes price inflation milestones (T-90d, T-60d, T-30d, T-15d, T-7d, T-2d) so travelers know when surges trigger.
- 🔍 **Smart Airport Autocomplete:** Fast search across 30+ domestic airports with IATA codes, city, state, and hub badges.
- 📅 **Flexible Date Strip:** Interactive ±3-day fare carousel showing cheapest available price across adjacent days.
- ⚡ **Filter & Sort Engine:**
  - Non-stop vs 1-stop filtering.
  - Airline multi-selector (IndiGo, Air India, Akasa, SpiceJet, Vistara).
  - Departure time slots (Morning, Afternoon, Evening, Night).
  - Price slider & sort tabs (*Cheapest*, *Fastest*, *Best Value*).
- 👥 **Passenger & Cabin Selector:** Dynamic traveler composition (Adults, Children, Infants) with Economy, Premium Economy, and Business classes.
- 📱 **Multi-Channel Notification Gateway:**
  - **WhatsApp Click-to-Chat:** Zero API keys required; opens pre-filled deal templates directly in WhatsApp Web or mobile.
  - **Automated WhatsApp Bot:** Free delivery via CallMeBot API integration.
  - **Twilio WhatsApp API:** Production-grade WhatsApp notifications.
  - **Telegram Bot API:** Instant Markdown alert cards to any Telegram chat handle or ID.
  - **In-App Notification Feed:** Live audit log of all dispatched deals.
- 🛒 **1-Click Booking:** Seamless deep-links to MakeMyTrip, Google Flights, and airline reservation portals.

---

## 🚀 Live Ports

| Service | Port / URL | Description |
| :--- | :--- | :--- |
| **Frontend (React + Vite + Tailwind)** | `http://localhost:5173/` | Interactive UI, search bar, festival carousel, filters, deal meters & alert modals |
| **Backend (Node.js / Express)** | `http://localhost:5001/` | REST APIs, Amadeus flight engine, alert store, cron dispatcher & notification log |

---

## 🛠️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 React Frontend (Vite + Tailwind)            │
│  - Festival Carousel (Goa NY, Holi, Eid, Durga Puja, Diwali)│
│  - Airport Autosuggest (DEL, BOM, BLR, PAT, CCU, GOI, etc.)  │
│  - Deal Score & Buy/Wait Gauge (0 - 100)                    │
│  - Historical Surge Curve Visualizer (T-90d to T-2d)         │
│  - ±3 Days Date Strip & Fare Tabs (Cheapest / Fastest)      │
│  - Filter Sidebar (Stops, Airlines, Times, Price Range)     │
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
- 23+ Sector Matrix     - Amadeus Flight API   - WhatsApp (Click-to-Chat, CallMeBot, Twilio)
- Surge Curve Model     - IndiGo, Air India,   - Telegram Bot API
- Deal Score & Advice     Akasa, SpiceJet      - Persistent JSON Log
```

---

## 📂 Project Structure

```bash
farewatch/
├── backend/
│   ├── data/
│   │   ├── alerts.json                 # Persistent active user price alerts
│   │   └── notifications.json          # Dispatched alerts audit log
│   ├── src/
│   │   ├── data/
│   │   │   ├── airports.json           # Indian airports database with IATA codes
│   │   │   ├── festivals.json          # Calendar of major Indian festivals & dates
│   │   │   └── historicalBenchmarks.json # Historical floor & peak fares for 23+ routes
│   │   ├── routes/
│   │   │   ├── airports.js             # Airport search & query endpoints
│   │   │   ├── alerts.js               # Alert CRUD, cron check & trigger routes
│   │   │   ├── festivals.js            # Festival list endpoint
│   │   │   ├── flights.js              # Flight search & benchmark endpoints
│   │   │   └── notifications.js        # Notification dispatch & history routes
│   │   ├── services/
│   │   │   ├── alertEngine.js          # Background cron & price drop comparator
│   │   │   ├── flightService.js        # Amadeus API client & domestic simulator
│   │   │   ├── notificationService.js  # WhatsApp & Telegram gateway dispatcher
│   │   │   └── priceIntelligence.js    # Deal scoring & surge curve engine
│   │   ├── storage/
│   │   │   └── alertStore.js           # File-based alert storage manager
│   │   └── server.js                   # Express application entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActiveAlertsList.jsx    # User tracked route alerts drawer
│   │   │   ├── AirportAutocomplete.jsx # Fast airport selector dropdown
│   │   │   ├── BookingCartModal.jsx    # Booking breakdown & direct portal links
│   │   │   ├── CreateAlertModal.jsx    # WhatsApp / Telegram alert setup modal
│   │   │   ├── DateStrip.jsx           # Low-fare adjacent date ribbon
│   │   │   ├── DealMeter.jsx           # Buy vs Wait score gauge
│   │   │   ├── FareTabs.jsx            # Cheapest vs Fastest vs Best value selector
│   │   │   ├── FestivalCarousel.jsx    # Festival cards with 1-click preset dates
│   │   │   ├── FilterSidebar.jsx       # Stops, airlines, times & price filters
│   │   │   ├── FlightCard.jsx          # Rich flight card with itinerary details
│   │   │   ├── Navbar.jsx              # Navigation header with quick actions
│   │   │   ├── NotificationFeedModal.jsx # Dispatched notifications viewer
│   │   │   ├── PassengerSelector.jsx   # Adults, children, infants & cabin selector
│   │   │   ├── PriceTrendChart.jsx     # Historical surge curve line chart
│   │   │   └── SearchWidget.jsx        # Route, dates & trip type input form
│   │   ├── services/
│   │   │   └── api.js                  # Axios client for backend endpoints
│   │   ├── App.jsx                     # Core application orchestrator
│   │   └── main.jsx
│   └── package.json
└── package.json                        # Root workspace scripts (dev, install:all)
```

---

## 🏃 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Option 1: Run Full Stack Together (Recommended)
From the repository root:
```bash
# 1. Install all dependencies across backend and frontend
npm run install:all

# 2. Start both backend (port 5001) and frontend (port 5173) concurrently
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

### Option 2: Run Separately
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# Backend running on http://localhost:5001

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# Frontend running on http://localhost:5173
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/airports?q=del` | Search airports by city name or IATA code |
| `GET` | `/api/festivals` | Get list of upcoming Indian festivals and travel dates |
| `GET` | `/api/flights/search` | Search flights (`origin`, `destination`, `date`, `passengers`, `cabinClass`) |
| `GET` | `/api/flights/benchmark` | Retrieve historical benchmarks and surge curve for a route |
| `GET` | `/api/alerts` | List all tracked price alerts |
| `POST` | `/api/alerts` | Create a new alert with target price and channel (WhatsApp / Telegram) |
| `DELETE` | `/api/alerts/:id` | Remove a tracked price alert |
| `POST` | `/api/alerts/:id/trigger` | Manually trigger and dispatch an alert test notification |
| `POST` | `/api/alerts/run-check` | Force an on-demand cron check across all active alerts |
| `GET` | `/api/notifications/recent`| Fetch recently dispatched notifications history |

---

## 📱 WhatsApp & Telegram Notification Setup

### 1. Zero-Setup WhatsApp (Click-to-Chat)
- **Requires No API Keys.**
- When setting an alert or triggering a test, select **WhatsApp**.
- Click **"Open in WhatsApp Web / App"** to preview and dispatch pre-formatted festive deal templates.

### 2. Automated WhatsApp Alerts (Free via CallMeBot)
1. Add `+34 644 44 20 89` to your phone contacts as **CallMeBot**.
2. Send WhatsApp message: `I allow callmebot to send me messages`.
3. CallMeBot will reply with your free personal **API Key**.
4. Paste the API Key in the alert creation modal. All price drops will be delivered automatically to your WhatsApp.

### 3. Production Twilio WhatsApp
Add your Twilio credentials to `backend/.env`:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### 4. Telegram Bot
1. Message `@BotFather` on Telegram to generate a bot token.
2. Add your token to `backend/.env`:
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
```
3. Set your Telegram username or chat ID when creating an alert.

---

## ⚙️ Environment Variables (Optional)

Create a `.env` file in the `backend/` directory:

```env
PORT=5001

# Amadeus Flight API (Optional - defaults to realistic domestic simulator)
AMADEUS_CLIENT_ID=your_amadeus_api_key
AMADEUS_CLIENT_SECRET=your_amadeus_api_secret
AMADEUS_ENV=test # 'test' for sandbox, 'production' for live GDS

# Twilio WhatsApp (Optional)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# CallMeBot Free WhatsApp Gateway (Optional default)
# CALLMEBOT_API_KEY=your_callmebot_api_key

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN=your_bot_token
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
