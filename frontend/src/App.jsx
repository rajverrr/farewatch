import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FestivalCarousel from './components/FestivalCarousel';
import SearchWidget from './components/SearchWidget';
import DealMeter from './components/DealMeter';
import PriceTrendChart from './components/PriceTrendChart';
import FlightCard from './components/FlightCard';
import CreateAlertModal from './components/CreateAlertModal';
import ActiveAlertsList from './components/ActiveAlertsList';
import NotificationFeedModal from './components/NotificationFeedModal';

import {
  getAirports,
  getFestivals,
  searchFlights,
  getAlerts,
  getRecentNotifications
} from './services/api';

export default function App() {
  const [festivals, setFestivals] = useState([]);
  const [airports, setAirports] = useState([]);
  const [selectedFestival, setSelectedFestival] = useState(null);

  // Search parameters
  const [origin, setOrigin] = useState('DEL');
  const [destination, setDestination] = useState('PAT');
  const [travelDate, setTravelDate] = useState('2026-11-12');

  // Search state & results
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');

  // Alerts & Notification states
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isActiveAlertsOpen, setIsActiveAlertsOpen] = useState(false);
  const [isNotifFeedOpen, setIsNotifFeedOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [festRes, airRes, alertRes, notifRes] = await Promise.all([
          getFestivals(),
          getAirports(),
          getAlerts(),
          getRecentNotifications()
        ]);

        if (festRes.success) {
          setFestivals(festRes.festivals);
          const diwali = festRes.festivals.find(f => f.id === 'diwali-chhath') || festRes.festivals[0];
          setSelectedFestival(diwali);
        }

        if (airRes.success) {
          setAirports(airRes.airports);
        }

        if (alertRes.success) {
          setAlerts(alertRes.alerts);
        }

        if (notifRes.success) {
          setNotifications(notifRes.notifications);
        }

        performSearch('DEL', 'PAT', '2026-11-12');
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }

    loadInitialData();
  }, []);

  // Perform flight search
  const performSearch = async (from = origin, to = destination, date = travelDate) => {
    try {
      setLoading(true);
      setError('');
      const data = await searchFlights(from, to, date);
      if (data.success) {
        setSearchResults(data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error searching flights');
    } finally {
      setLoading(false);
    }
  };

  // Handle festival preset selection
  const handleSelectFestival = (fest) => {
    setSelectedFestival(fest);
    const topRoute = fest.topRoutes?.[0] || { origin: 'DEL', destination: 'PAT' };
    setOrigin(topRoute.origin);
    setDestination(topRoute.destination);
    setTravelDate(fest.peakDate);
    performSearch(topRoute.origin, topRoute.destination, fest.peakDate);
  };

  // Refresh alert list and notifications
  const refreshAlerts = async () => {
    try {
      const [alertRes, notifRes] = await Promise.all([
        getAlerts(),
        getRecentNotifications()
      ]);
      if (alertRes.success) setAlerts(alertRes.alerts);
      if (notifRes.success) setNotifications(notifRes.notifications);
    } catch (err) {
      console.error('Error refreshing alerts:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#0A0A0A] font-curved flex flex-col antialiased selection:bg-[#FFD600] selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        onOpenAlerts={() => setIsActiveAlertsOpen(true)}
        onOpenNotifications={() => {
          refreshAlerts();
          setIsNotifFeedOpen(true);
        }}
        alertsCount={alerts.length}
      />

      {/* Loot Drop Signature Hero Section (Yellow Banner with 3px border & tilted stat cards) */}
      <section className="bg-loot-yellow border-b-[3px] border-black py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Hero Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-black text-loot-yellow font-mono text-xs font-bold uppercase tracking-wider border-2 border-black mb-4 shadow-loot-sm">
            🪔 100% FREE INDIAN FESTIVE FLIGHT RADAR
          </div>

          {/* Huge Curved Typography Headline */}
          <h1 className="font-curved font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-black mb-4 leading-[1.05]">
            STEAL THE LOWEST <br className="hidden sm:block" />
            <span className="underline decoration-black decoration-[5px] sm:decoration-[8px] underline-offset-4">
              FESTIVE FLIGHT FARES
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-curved font-medium text-base sm:text-xl text-black/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            Stop paying ₹18,000+ for Diwali, Chhath & Durga Puja tickets. We scan domestic airlines 24/7 and fire instant <strong>WhatsApp alerts</strong> the second fares dip into all-time low floors.
          </p>

          {/* Loot Drop 4-Card Hero Grid (Signature Tilted Cards) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-2">
            
            {/* Card 1: Lowest Historic Floor */}
            <div className="bg-white border-[3px] border-black p-4 rounded-2xl shadow-loot-lg hero-tilted-1 transition-all">
              <div className="font-mono text-[10px] font-bold uppercase text-gray-500">
                HISTORIC FLOOR
              </div>
              <div className="font-curved font-black text-2xl sm:text-3xl text-black mt-1">
                ₹4,200
              </div>
              <div className="font-curved text-xs text-gray-600 mt-1">
                DEL ➔ PAT Low
              </div>
            </div>

            {/* Card 2: Peak Panic Multiplier */}
            <div className="bg-loot-orange text-white border-[3px] border-black p-4 rounded-2xl shadow-loot-lg hero-tilted-2 transition-all">
              <div className="font-mono text-[10px] font-bold uppercase text-white/80">
                SURGE TAX
              </div>
              <div className="font-curved font-black text-2xl sm:text-3xl text-white mt-1">
                3.8x
              </div>
              <div className="font-curved text-xs text-white/90 mt-1">
                Peak Festival Rush
              </div>
            </div>

            {/* Card 3: Free WhatsApp Radar */}
            <div className="bg-loot-lime text-black border-[3px] border-black p-4 rounded-2xl shadow-loot-lg hero-tilted-3 transition-all">
              <div className="font-mono text-[10px] font-bold uppercase text-black/70">
                RADAR SPEED
              </div>
              <div className="font-curved font-black text-2xl sm:text-3xl text-black mt-1">
                &lt; 60s
              </div>
              <div className="font-curved text-xs text-black/80 mt-1">
                WhatsApp Delivery
              </div>
            </div>

            {/* Card 4: Top Festive Sectors */}
            <div className="bg-loot-pink text-black border-[3px] border-black p-4 rounded-2xl shadow-loot-lg hero-tilted-4 transition-all">
              <div className="font-mono text-[10px] font-bold uppercase text-black/70">
                COVERAGE
              </div>
              <div className="font-curved font-black text-2xl sm:text-3xl text-black mt-1">
                20+ HUBS
              </div>
              <div className="font-curved text-xs text-black/80 mt-1">
                DEL, BOM, BLR, PAT
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Festival Selection Carousel */}
        <FestivalCarousel
          festivals={festivals}
          selectedFestival={selectedFestival}
          onSelectFestival={handleSelectFestival}
        />

        {/* Neo-Brutalist Search Form */}
        <SearchWidget
          airports={airports}
          origin={origin}
          destination={destination}
          travelDate={travelDate}
          onOriginChange={(val) => setOrigin(val)}
          onDestinationChange={(val) => setDestination(val)}
          onTravelDateChange={(val) => setTravelDate(val)}
          onSearch={() => performSearch(origin, destination, travelDate)}
          loading={loading}
        />

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-loot-pink border-[3px] border-black font-curved font-bold text-black text-sm shadow-loot">
            {error}
          </div>
        )}

        {/* Lowest Fare Loot Item Card (Zero overlap, big bold price, savings tag) */}
        {searchResults && searchResults.evaluation && (
          <>
            <DealMeter
              evaluation={searchResults.evaluation}
              lowestPrice={searchResults.lowestPrice}
              onOpenAlertModal={() => setIsAlertModalOpen(true)}
            />

            {/* Historical Surge Timeline */}
            <PriceTrendChart
              surgeTimeline={searchResults.evaluation.surgeTimeline}
              daysUntilTrip={searchResults.evaluation.daysUntilTrip}
              origin={origin}
              destination={destination}
            />

            {/* Available Carrier Flights */}
            <div className="mt-10 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black text-white rounded-md">
                    AVAILABLE DROPS
                  </span>
                  <h2 className="font-curved font-black text-xl text-black mt-1 uppercase">
                    Flight Inventory ({origin} ➔ {destination})
                  </h2>
                </div>

                <button
                  onClick={() => setIsAlertModalOpen(true)}
                  className="btn-loot px-3.5 py-1.5 rounded-xl text-xs font-curved font-black uppercase bg-loot-yellow text-black flex items-center space-x-1"
                >
                  <span>+ TRACK THIS ROUTE</span>
                </button>
              </div>

              <div className="space-y-3">
                {searchResults.flights?.map((flight, idx) => (
                  <FlightCard
                    key={flight.id || idx}
                    flight={flight}
                    isLowest={flight.price === searchResults.lowestPrice}
                    onTrackRoute={() => setIsAlertModalOpen(true)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

      </main>

      {/* Loot Drop Footer */}
      <footer className="border-t-[3px] border-black bg-black text-white py-8 px-4 font-curved text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-black text-sm uppercase text-loot-yellow">FestiveFare</span>
            <span className="font-mono text-gray-400">// The Indian Flight Fare Graveyard & Loot Machine</span>
          </div>

          <div className="font-mono text-gray-400 text-center sm:text-right">
            <span>© 2026 FestiveFare • Built for Hackathons & Savvy Travelers</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CreateAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        routeData={searchResults}
        onAlertCreated={(newAlert) => {
          setAlerts(prev => [newAlert, ...prev]);
          setIsActiveAlertsOpen(true);
        }}
      />

      <ActiveAlertsList
        isOpen={isActiveAlertsOpen}
        onClose={() => setIsActiveAlertsOpen(false)}
        alerts={alerts}
        onRefresh={refreshAlerts}
        onAlertTriggered={() => {
          refreshAlerts();
          setIsNotifFeedOpen(true);
        }}
      />

      <NotificationFeedModal
        isOpen={isNotifFeedOpen}
        onClose={() => setIsNotifFeedOpen(false)}
        notifications={notifications}
      />

    </div>
  );
}
