require('dotenv').config();
const express = require('express');
const cors = require('cors');

const festivalRoutes = require('./routes/festivals');
const airportRoutes = require('./routes/airports');
const flightRoutes = require('./routes/flights');
const alertRoutes = require('./routes/alerts');
const notificationRoutes = require('./routes/notifications');
const { initScheduler } = require('./services/alertEngine');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/festivals', festivalRoutes);
app.use('/api/airports', airportRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FestiveFare Flight Tracking Engine',
    timestamp: new Date().toISOString()
  });
});

// Start scheduler and server
app.listen(PORT, () => {
  console.log(`🚀 FestiveFare Backend running on http://localhost:${PORT}`);
  initScheduler();
});
