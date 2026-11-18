import React, { useState } from 'react';
import {
  X,
  Plane,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  User,
  Phone,
  Mail,
  Luggage,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function BookingCartModal({
  isOpen,
  onClose,
  flight,
  searchParams = {}
}) {
  if (!isOpen || !flight) return null;

  const {
    airline,
    flightNumber,
    logoBg,
    textColor,
    origin,
    destination,
    departureTime,
    arrivalTime,
    duration,
    stops,
    price,
    baggage,
    cabin,
    bookingUrl,
    makeMyTripUrl,
    easeMyTripUrl,
    cleartripUrl,
    airlineUrl
  } = flight;

  const {
    travelDate,
    returnDate,
    tripType = 'one-way',
    adults = 1,
    children = 0
  } = searchParams;

  const numAdults = Math.max(1, Number(adults) || 1);
  const numChildren = Math.max(0, Number(children) || 0);
  const totalPassengers = numAdults + numChildren;

  // Passenger state
  const [passengers, setPassengers] = useState(
    Array.from({ length: totalPassengers }, (_, i) => ({
      type: i < numAdults ? 'Adult' : 'Child',
      title: i < numAdults ? 'Mr' : 'Master',
      firstName: '',
      lastName: '',
      age: i < numAdults ? '28' : '8'
    }))
  );

  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [contactEmail, setContactEmail] = useState('');
  const [preferredGateway, setPreferredGateway] = useState('mmt'); // 'mmt', 'emt', 'airline'

  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Calculate fare breakdown
  const baseFare = Math.round(price * 0.78);
  const taxesAndFees = price - baseFare;

  // Target checkout URL based on gateway choice
  const getSelectedCheckoutUrl = () => {
    if (preferredGateway === 'airline' && airlineUrl) return airlineUrl;
    if (preferredGateway === 'emt' && easeMyTripUrl) return easeMyTripUrl;
    return bookingUrl || makeMyTripUrl;
  };

  const handleProceedToPayment = () => {
    const targetUrl = getSelectedCheckoutUrl();
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-[3px] border-black rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-loot-2xl flex flex-col overflow-hidden animate-fade-in font-curved my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-loot-yellow border-b-[3px] border-black flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-black text-loot-yellow border-2 border-black flex items-center justify-center shadow-loot-sm flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black text-white rounded-md">
                  PRE-FILLED BOOKING CART
                </span>
                <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-400 rounded flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>FLIGHT SEARCH LOCKED</span>
                </span>
              </div>
              <h3 className="font-curved font-black text-black text-lg sm:text-xl uppercase mt-0.5 leading-tight">
                Review Flight & Traveler Details
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-loot-sm flex-shrink-0"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#FDFBF7]">
          
          {/* Pre-filled Flight Summary Card */}
          <div className="card-loot p-4 sm:p-5 bg-white border-[3px] border-black space-y-3">
            <div className="flex items-center justify-between border-b border-black/10 pb-2">
              <div className="flex items-center space-x-2">
                <div
                  className="w-7 h-7 rounded-lg border border-black flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: logoBg || '#0b2e84', color: textColor || '#ffffff' }}
                >
                  {airline ? airline.slice(0, 2).toUpperCase() : 'FL'}
                </div>
                <span className="font-curved font-black text-sm text-black">
                  {airline} • {flightNumber}
                </span>
              </div>

              <div className="flex items-center space-x-2 font-mono text-[11px] text-gray-600">
                <span className="px-2 py-0.5 rounded-md bg-loot-yellow border border-black font-bold text-black uppercase">
                  {cabin || 'Economy'}
                </span>
                <span>{baggage || '15kg check-in'}</span>
              </div>
            </div>

            {/* Itinerary Times & Route */}
            <div className="flex items-center justify-between sm:justify-start sm:space-x-10 pt-1">
              <div>
                <div className="font-curved font-black text-xl text-black">
                  {departureTime}
                </div>
                <div className="font-mono text-xs font-bold text-gray-500">
                  {origin} ({travelDate})
                </div>
              </div>

              <div className="flex flex-col items-center flex-1 max-w-[120px] sm:max-w-[160px]">
                <span className="text-[10px] font-mono font-bold text-gray-600">
                  {duration}
                </span>
                <div className="w-full h-0.5 bg-black relative flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-loot-yellow border border-black absolute" />
                  <Plane className="w-3 h-3 text-black absolute right-0 -top-1.5 transform rotate-90" />
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                  {stops}
                </span>
              </div>

              <div className="text-right">
                <div className="font-curved font-black text-xl text-black">
                  {arrivalTime}
                </div>
                <div className="font-mono text-xs font-bold text-gray-500">
                  {destination}
                </div>
              </div>
            </div>

            {/* Return Flight Note if Round-Trip */}
            {tripType === 'round-trip' && returnDate && (
              <div className="pt-2 border-t border-dashed border-black/15 text-xs font-mono text-gray-600 flex items-center justify-between">
                <span>🔄 Return leg included from {destination} ➔ {origin}</span>
                <span className="font-bold text-black">{returnDate}</span>
              </div>
            )}
          </div>

          {/* Passenger Information Form */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-mono text-xs font-bold uppercase text-black">
                // TRAVELER DETAILS ({totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'})
              </label>
              <span className="text-[11px] font-mono text-gray-500">
                Only names & contact needed
              </span>
            </div>

            <div className="space-y-3">
              {passengers.map((pax, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 rounded-2xl border-2 border-black bg-white shadow-loot-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-curved font-black text-xs uppercase text-black flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>
                        Passenger {index + 1} ({pax.type})
                      </span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      Auto-Transferred to Airline
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-3 sm:col-span-2">
                      <select
                        value={pax.title}
                        onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                        className="w-full px-2 py-2 rounded-xl border-2 border-black font-curved text-xs font-bold bg-white focus:bg-loot-yellow focus:outline-none"
                      >
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Master">Master</option>
                      </select>
                    </div>

                    <div className="col-span-5 sm:col-span-6">
                      <input
                        type="text"
                        placeholder="First & Middle Name"
                        value={pax.firstName}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-black font-curved text-xs font-bold bg-white focus:bg-loot-yellow focus:outline-none"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-4">
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={pax.lastName}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-black font-curved text-xs font-bold bg-white focus:bg-loot-yellow focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-black mb-2">
              // CONTACT DETAILS (FOR INSTANT E-TICKET & PNR DISPATCH)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono font-bold text-gray-600 mb-1">
                  Mobile Number (WhatsApp Enabled)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-black absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-black font-mono text-xs font-bold bg-white focus:bg-loot-yellow focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-gray-600 mb-1">
                  Email Address (For Tax Invoice & PNR)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-black absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="traveler@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-black font-mono text-xs font-bold bg-white focus:bg-loot-yellow focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Provider Selector */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-black mb-2">
              // SELECT PRE-FILLED CHECKOUT CART PORTAL
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPreferredGateway('mmt')}
                className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                  preferredGateway === 'mmt'
                    ? 'border-black bg-loot-yellow text-black font-bold shadow-loot-sm'
                    : 'border-black/30 bg-white text-gray-700 hover:border-black'
                }`}
              >
                <div className="font-curved font-black text-xs uppercase">MakeMyTrip Cart</div>
                <div className="text-[10px] font-mono opacity-80 mt-0.5">Instant Flight Review</div>
              </button>

              <button
                type="button"
                onClick={() => setPreferredGateway('emt')}
                className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                  preferredGateway === 'emt'
                    ? 'border-black bg-loot-yellow text-black font-bold shadow-loot-sm'
                    : 'border-black/30 bg-white text-gray-700 hover:border-black'
                }`}
              >
                <div className="font-curved font-black text-xs uppercase">EaseMyTrip Cart</div>
                <div className="text-[10px] font-mono opacity-80 mt-0.5">Zero Convenience Fee</div>
              </button>

              <button
                type="button"
                onClick={() => setPreferredGateway('airline')}
                className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                  preferredGateway === 'airline'
                    ? 'border-black bg-loot-yellow text-black font-bold shadow-loot-sm'
                    : 'border-black/30 bg-white text-gray-700 hover:border-black'
                }`}
              >
                <div className="font-curved font-black text-xs uppercase">{airline} Portal</div>
                <div className="text-[10px] font-mono opacity-80 mt-0.5">Direct Airline Desk</div>
              </button>
            </div>
          </div>

          {/* Transparent Fare Summary */}
          <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-loot-sm space-y-2 font-mono text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Base Airfare ({totalPassengers} travelers)</span>
              <span>₹{baseFare.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxes, Security & Airport Surcharges</span>
              <span>₹{taxesAndFees.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>FestiveFare Pass (Instant Fare Lock)</span>
              <span>FREE</span>
            </div>
            <div className="border-t-2 border-black/10 pt-2 flex justify-between items-baseline font-curved font-black text-base text-black">
              <span>Total Payable</span>
              <span className="text-xl sm:text-2xl text-black">₹{price.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t-[3px] border-black flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Pre-filled GDS checkout • Secure 256-bit transfer</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleProceedToPayment}
              className="btn-loot w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-curved font-black uppercase text-black bg-loot-lime hover:bg-[#86efac] flex items-center justify-center space-x-2 shadow-loot"
            >
              <span>PROCEED TO PAYMENT & BOOKING</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
