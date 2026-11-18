import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import FestivalCarousel from './components/FestivalCarousel';
import SearchWidget from './components/SearchWidget';
import DateStrip from './components/DateStrip';
import FareTabs from './components/FareTabs';
import FilterSidebar from './components/FilterSidebar';
import DealMeter from './components/DealMeter';
import PriceTrendChart from './components/PriceTrendChart';
import FlightCard from './components/FlightCard';
import BookingCartModal from './components/BookingCartModal';
import CreateAlertModal from './components/CreateAlertModal';
import ActiveAlertsList from './components/ActiveAlertsList';
import NotificationFeedModal from './components/NotificationFeedModal';
import { Filter, ArrowUpDown } from 'lucide-react';

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

  // Default flagship sector: DEL ➔ PAT during Diwali & Chhath rush
  const DEFAULT_ORIGIN = 'DEL';
  const DEFAULT_DEST = 'PAT';
  const DEFAULT_DATE = '2026-11-28';
  const DEFAULT_RETURN = '2026-12-02';

  // Search parameters
  const [origin, setOrigin] = useState(DEFAULT_ORIGIN);
  const [destination, setDestination] = useState(DEFAULT_DEST);
  const [travelDate, setTravelDate] = useState(DEFAULT_DATE);
  const [returnDate, setReturnDate] = useState(DEFAULT_RETURN);
  const [tripType, setTripType] = useState('one-way');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cabinClass, setCabinClass] = useState('economy');

  // Search state & results
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');

  // Fare Tabs & Filters State
  const [activeTab, setActiveTab] = useState('cheapest'); // 'cheapest', 'best', 'fastest'
  const [selectedStops, setSelectedStops] = useState('all'); // 'all', 'nonstop', 'stop'
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('all'); // 'all', 'morning', 'afternoon', 'night'
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [maxPrice, setMaxPrice] = useState(50000);

  // Alerts & Notification states
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isActiveAlertsOpen, setIsActiveAlertsOpen] = useState(false);
  const [isNotifFeedOpen, setIsNotifFeedOpen] = useState(false);

  // Booking Cart State
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [selectedCartFlight, setSelectedCartFlight] = useState(null);

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

        let initialOrigin = DEFAULT_ORIGIN;
        let initialDest = DEFAULT_DEST;
        let initialDate = DEFAULT_DATE;

        if (festRes.success && festRes.festivals?.length > 0) {
          setFestivals(festRes.festivals);
          const diwali = festRes.festivals.find((f) => f.id === 'diwali-chhath') || festRes.festivals[0];
          setSelectedFestival(diwali);

          if (diwali) {
            const topRoute = diwali.topRoutes?.[0] || { origin: DEFAULT_ORIGIN, destination: DEFAULT_DEST };
            initialOrigin = topRoute.origin;
            initialDest = topRoute.destination;
            initialDate = diwali.peakDate;
            setOrigin(initialOrigin);
            setDestination(initialDest);
            setTravelDate(initialDate);
          }
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

        performSearch({
          origin: initialOrigin,
          destination: initialDest,
          date: initialDate,
          tripType: 'one-way',
          returnDate: DEFAULT_RETURN,
          adults: 1,
          children: 0,
          cabinClass: 'economy'
        });
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }

    loadInitialData();
  }, []);

  // Update airline choices & price limit when results change
  useEffect(() => {
    if (searchResults?.flights?.length > 0) {
      const allAirlines = Array.from(new Set(searchResults.flights.map((f) => f.airline)));
      setSelectedAirlines(allAirlines);
      const highestPrice = Math.max(...searchResults.flights.map((f) => f.price));
      setMaxPrice(highestPrice);
    }
  }, [searchResults]);

  // Perform flight search
  const performSearch = async (params = {}) => {
    const qOrigin = params.origin || origin;
    const qDest = params.destination || destination;
    const qDate = params.date || travelDate;
    const qTripType = params.tripType || tripType;
    const qReturnDate = params.returnDate || returnDate;
    const qAdults = params.adults !== undefined ? params.adults : adults;
    const qChildren = params.children !== undefined ? params.children : children;
    const qCabin = params.cabinClass || cabinClass;

    if (qOrigin === qDest) {
      setError('Departure and destination airports cannot be the same.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await searchFlights({
        origin: qOrigin,
        destination: qDest,
        date: qDate,
        tripType: qTripType,
        returnDate: qReturnDate,
        adults: qAdults,
        children: qChildren,
        cabinClass: qCabin
      });

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
    const topRoute = fest.topRoutes?.[0] || { origin: DEFAULT_ORIGIN, destination: DEFAULT_DEST };
    setOrigin(topRoute.origin);
    setDestination(topRoute.destination);
    setTravelDate(fest.peakDate);

    performSearch({
      origin: topRoute.origin,
      destination: topRoute.destination,
      date: fest.peakDate,
      tripType,
      returnDate,
      adults,
      children,
      cabinClass
    });
  };

  // Handle Date Strip Click
  const handleDateStripSelect = (newDate) => {
    setTravelDate(newDate);
    performSearch({
      origin,
      destination,
      date: newDate,
      tripType,
      returnDate,
      adults,
      children,
      cabinClass
    });
  };

  // Filter & Toggle Airlines
  const handleToggleAirline = (airline) => {
    setSelectedAirlines((prev) =>
      prev.includes(airline) ? prev.filter((a) => a !== airline) : [...prev, airline]
    );
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedStops('all');
    setSelectedTimeSlot('all');
    if (searchResults?.flights) {
      setSelectedAirlines(Array.from(new Set(searchResults.flights.map((f) => f.airline))));
      setMaxPrice(Math.max(...searchResults.flights.map((f) => f.price)));
    }
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

  // Filtered & Sorted Flights
  const filteredFlights = useMemo(() => {
    if (!searchResults?.flights) return [];
    let list = [...searchResults.flights];

    // 1. Filter by Stops
    if (selectedStops === 'nonstop') {
      list = list.filter((f) => f.stops.toLowerCase().includes('nonstop') || f.stops === 'Non-stop');
    } else if (selectedStops === 'stop') {
      list = list.filter((f) => f.stops.toLowerCase().includes('stop') && !f.stops.toLowerCase().includes('nonstop'));
    }

    // 2. Filter by Time of Day
    if (selectedTimeSlot !== 'all') {
      list = list.filter((f) => {
        const timeStr = f.departureTime || '';
        // Extract hour
        const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (!match) return true;
        let hour = parseInt(match[1], 10);
        const ampm = match[3]?.toUpperCase();
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;

        if (selectedTimeSlot === 'morning') return hour >= 0 && hour < 12;
        if (selectedTimeSlot === 'afternoon') return hour >= 12 && hour < 18;
        if (selectedTimeSlot === 'night') return hour >= 18 && hour < 24;
        return true;
      });
    }

    // 3. Filter by Airlines
    if (selectedAirlines.length > 0) {
      list = list.filter((f) => selectedAirlines.includes(f.airline));
    }

    // 4. Filter by Max Price
    if (maxPrice) {
      list = list.filter((f) => f.price <= maxPrice);
    }

    // 5. Sort by Metric Tabs (Cheapest, Fastest, Best)
    if (activeTab === 'cheapest') {
      list.sort((a, b) => a.price - b.price);
    } else if (activeTab === 'fastest') {
      list.sort((a, b) => (a.durationMinutes || 120) - (b.durationMinutes || 120));
    } else if (activeTab === 'best') {
      // Balance price and duration
      list.sort((a, b) => {
        const scoreA = a.price * 0.7 + (a.durationMinutes || 100) * 8;
        const scoreB = b.price * 0.7 + (b.durationMinutes || 100) * 8;
        return scoreA - scoreB;
      });
    }

    return list;
  }, [searchResults, selectedStops, selectedTimeSlot, selectedAirlines, maxPrice, activeTab]);

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

      {/* Hero Section */}
      <section className="bg-loot-yellow border-b-[3px] border-black py-10 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          <div className="inline-block px-4 py-1.5 rounded-full bg-black text-loot-yellow font-mono text-xs font-bold uppercase tracking-wider border-2 border-black mb-3 shadow-loot-sm">
            🪔 REAL-TIME AMADEUS GDS & AIRLINE RADAR
          </div>

          <h1 className="font-curved font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-black mb-3 leading-[1.05]">
            FIND CHEAPEST FLIGHTS <br className="hidden sm:block" />
            <span className="underline decoration-black decoration-[4px] sm:decoration-[7px] underline-offset-4">
              BEFORE HOLIDAY FARES SURGE
            </span>
          </h1>

          <p className="font-curved font-medium text-sm sm:text-lg text-black/90 max-w-2xl mx-auto mb-6 leading-relaxed">
            Live prices scanned via Amadeus GDS and Indian domestic carriers. Spot all-time low fares with our intelligent multi-carrier fare engine.
          </p>

        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Festival Selection Carousel */}
        <FestivalCarousel
          festivals={festivals}
          selectedFestival={selectedFestival}
          onSelectFestival={handleSelectFestival}
        />

        {/* Search Widget */}
        <SearchWidget
          airports={airports}
          origin={origin}
          destination={destination}
          travelDate={travelDate}
          returnDate={returnDate}
          tripType={tripType}
          adults={adults}
          children={children}
          cabinClass={cabinClass}
          onOriginChange={(val) => setOrigin(val)}
          onDestinationChange={(val) => setDestination(val)}
          onTravelDateChange={(val) => setTravelDate(val)}
          onReturnDateChange={(val) => setReturnDate(val)}
          onTripTypeChange={(val) => setTripType(val)}
          onPassengersChange={(vals) => {
            setAdults(vals.adults);
            setChildren(vals.children);
            setCabinClass(vals.cabinClass);
          }}
          onSearch={performSearch}
          loading={loading}
        />

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-loot-pink border-[3px] border-black font-curved font-bold text-black text-sm shadow-loot">
            {error}
          </div>
        )}

        {/* Flexible Date Strip */}
        {searchResults && searchResults.dateStrip && (
          <DateStrip
            dateStrip={searchResults.dateStrip}
            onSelectDate={handleDateStripSelect}
          />
        )}

        {/* Results Area */}
        {searchResults && searchResults.evaluation && (
          <>
            {/* Deal Meter & Surge Curve */}
            <DealMeter
              evaluation={searchResults.evaluation}
              lowestPrice={searchResults.lowestPrice}
              isLiveFare={searchResults.isLiveFare}
              fareSource={searchResults.fareSource}
              onOpenAlertModal={() => setIsAlertModalOpen(true)}
            />

            <PriceTrendChart
              surgeTimeline={searchResults.evaluation.surgeTimeline}
              daysUntilTrip={searchResults.evaluation.daysUntilTrip}
              origin={origin}
              destination={destination}
            />

            {/* 3-Tab Sorter: Cheapest | Best | Fastest */}
            <div className="mt-8">
              <FareTabs
                activeTab={activeTab}
                onSelectTab={(tab) => setActiveTab(tab)}
                tabsSummary={searchResults.fareTabs}
              />
            </div>

            {/* 2-Column Layout: Sidebar Filters + Flight Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Filter Sidebar (4 cols on lg) */}
              <div className="lg:col-span-4 sticky top-20">
                <FilterSidebar
                  flights={searchResults.flights || []}
                  selectedStops={selectedStops}
                  onStopsChange={setSelectedStops}
                  selectedTimeSlot={selectedTimeSlot}
                  onTimeSlotChange={setSelectedTimeSlot}
                  selectedAirlines={selectedAirlines}
                  onToggleAirline={handleToggleAirline}
                  maxPrice={maxPrice}
                  onMaxPriceChange={setMaxPrice}
                  onResetFilters={handleResetFilters}
                />
              </div>

              {/* Right Column: Flight Inventory Cards (8 cols on lg) */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between pb-2 mb-1">
                  <div className="font-curved font-bold text-xs uppercase text-gray-700">
                    Showing <strong>{filteredFlights.length}</strong> of <strong>{searchResults.flights?.length || 0}</strong> flights
                  </div>
                  <button
                    onClick={() => setIsAlertModalOpen(true)}
                    className="btn-loot px-3 py-1.5 rounded-xl text-xs font-curved font-black uppercase bg-loot-yellow text-black flex items-center space-x-1"
                  >
                    <span>+ TRACK ON WHATSAPP</span>
                  </button>
                </div>

                {filteredFlights.length === 0 ? (
                  <div className="text-center py-12 bg-white border-[3px] border-black rounded-2xl shadow-loot p-6 font-curved">
                    <p className="font-black text-base text-black mb-2">No flights match your filters.</p>
                    <p className="text-xs font-mono text-gray-500 mb-4">Try relaxing stop requirements or raising the max fare slider.</p>
                    <button
                      onClick={handleResetFilters}
                      className="btn-loot px-4 py-2 rounded-xl text-xs bg-loot-yellow text-black font-black uppercase"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  filteredFlights.map((flight, idx) => {
                    const tabs = searchResults.fareTabs;
                    return (
                      <FlightCard
                        key={flight.id || idx}
                        flight={flight}
                        isLowest={flight.price === searchResults.lowestPrice}
                        isBest={flight.id === tabs?.best?.flightId}
                        isFastest={flight.id === tabs?.fastest?.flightId}
                        onTrackRoute={() => setIsAlertModalOpen(true)}
                        onOpenCart={(f) => {
                          setSelectedCartFlight(f);
                          setIsCartModalOpen(true);
                        }}
                      />
                    );
                  })
                )}
              </div>

            </div>
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t-[3px] border-black bg-black text-white py-8 px-4 font-curved text-xs mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-black text-sm uppercase text-loot-yellow">FestiveFare</span>
            <span className="font-mono text-gray-400">// Real-Time GDS Flight Search & Festive Price Drop Alert Engine</span>
          </div>

          <div className="font-mono text-gray-400 text-center sm:text-right">
            <span>© 2026 FestiveFare • Built for Savvy Travelers</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <CreateAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        routeData={searchResults}
        onAlertCreated={(newAlert) => {
          setAlerts((prev) => [newAlert, ...prev]);
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

      {/* Pre-Filled Booking Cart Modal */}
      <BookingCartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        flight={selectedCartFlight}
        searchParams={{
          travelDate,
          returnDate,
          tripType,
          adults,
          children,
          cabinClass
        }}
      />

    </div>
  );
}
