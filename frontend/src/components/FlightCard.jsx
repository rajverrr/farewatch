import React from 'react';
import { ExternalLink, Bell, ArrowRight, Plane, CheckCircle2, ShoppingCart } from 'lucide-react';

function formatDmy(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export default function FlightCard({ flight, isLowest, isBest, isFastest, onTrackRoute, onOpenCart }) {
  if (!flight) return null;

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
    date,
    returnDate,
    tripType,
    isLiveFare,
    bookingUrl,
    makeMyTripUrl,
    easeMyTripUrl,
    cleartripUrl,
    airlineUrl
  } = flight;

  const depSlash = formatDmy(date);
  const retSlash = formatDmy(returnDate);
  const isRoundTrip = tripType === 'round-trip' && Boolean(returnDate);

  const fallbackMmtUrl = isRoundTrip
    ? `https://www.makemytrip.com/flight/search?itinerary=${origin}-${destination}-${depSlash}_${destination}-${origin}-${retSlash}&tripType=R&paxType=A-1_C-0_I-0&intl=false&cabinClass=E&ccde=IN&lang=eng`
    : `https://www.makemytrip.com/flight/search?itinerary=${origin}-${destination}-${depSlash}&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E&ccde=IN&lang=eng`;

  const dealBookingUrl = bookingUrl || makeMyTripUrl || fallbackMmtUrl;

  return (
    <div
      className={`card-loot p-4 sm:p-5 mb-3 bg-white transition-all hover:shadow-loot-lg ${
        isLowest
          ? 'border-loot-orange ring-2 ring-loot-orange shadow-loot'
          : isBest
          ? 'border-loot-lime ring-2 ring-loot-lime shadow-loot'
          : ''
      }`}
    >
      {/* Top Tag Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-black/10 text-[10px] font-mono">
        <div className="flex items-center space-x-2">
          {isLowest && (
            <span className="px-2 py-0.5 rounded-full bg-loot-lime text-black border border-black font-black uppercase shadow-loot-xs">
              ★ CHEAPEST DEAL
            </span>
          )}
          {isBest && !isLowest && (
            <span className="px-2 py-0.5 rounded-full bg-loot-yellow text-black border border-black font-black uppercase shadow-loot-xs">
              ⚡ BEST VALUE
            </span>
          )}
          {isFastest && !isLowest && !isBest && (
            <span className="px-2 py-0.5 rounded-full bg-loot-pink text-black border border-black font-black uppercase shadow-loot-xs">
              ⏱️ FASTEST
            </span>
          )}
          {isLiveFare ? (
            <span className="flex items-center space-x-1 text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE AIRLINE FARE (VERIFIED)</span>
            </span>
          ) : (
            <span className="text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
              BENCHMARK ESTIMATE
            </span>
          )}
        </div>

        <div className="text-gray-500 font-mono">
          <span>Flight: <strong className="text-black">{flightNumber}</strong></span>
          <span className="mx-1.5">•</span>
          <span>{baggage || '15kg check-in'}</span>
        </div>
      </div>

      {/* Main Ticket Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Left: Airline & Itinerary Legs */}
        <div className="flex-1 space-y-3">
          
          {/* Outbound Leg */}
          <div className="flex items-center space-x-4">
            
            {/* Airline Logo */}
            <div
              className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-curved font-black text-xs shadow-loot-xs flex-shrink-0"
              style={{ backgroundColor: logoBg || '#0b2e84', color: textColor || '#ffffff' }}
            >
              {airline ? airline.slice(0, 2).toUpperCase() : 'FL'}
            </div>

            {/* Flight Timeline */}
            <div className="flex-1 flex items-center justify-between sm:justify-start sm:space-x-8">
              
              {/* Departure */}
              <div className="text-left w-20">
                <div className="font-curved font-black text-lg text-black leading-none">
                  {departureTime}
                </div>
                <div className="font-mono text-xs font-bold text-gray-500 mt-1">
                  {origin}
                </div>
              </div>

              {/* Progress Line */}
              <div className="flex flex-col items-center px-2 flex-1 max-w-[140px] sm:max-w-[180px]">
                <span className="text-[10px] font-mono font-bold text-gray-600 mb-0.5">
                  {duration}
                </span>
                <div className="w-full h-0.5 bg-black relative flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-loot-yellow border border-black absolute" />
                  <Plane className="w-3 h-3 text-black absolute right-0 -top-1.5 transform rotate-90" />
                </div>
                <span className={`text-[10px] font-mono mt-0.5 ${stops.toLowerCase().includes('nonstop') || stops === 'Non-stop' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}`}>
                  {stops}
                </span>
              </div>

              {/* Arrival */}
              <div className="text-right w-20">
                <div className="font-curved font-black text-lg text-black leading-none">
                  {arrivalTime}
                </div>
                <div className="font-mono text-xs font-bold text-gray-500 mt-1">
                  {destination}
                </div>
              </div>

            </div>

          </div>

          {/* Return Leg (When Round Trip) */}
          {tripType === 'round-trip' && returnDate && (
            <div className="flex items-center space-x-4 pt-2 border-t border-dashed border-black/15">
              <div
                className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-curved font-black text-xs shadow-loot-xs flex-shrink-0 opacity-70"
                style={{ backgroundColor: logoBg || '#0b2e84', color: textColor || '#ffffff' }}
              >
                {airline ? airline.slice(0, 2).toUpperCase() : 'FL'}
              </div>

              <div className="flex-1 flex items-center justify-between sm:justify-start sm:space-x-8">
                <div className="text-left w-20">
                  <div className="font-curved font-black text-base text-black leading-none">
                    Return
                  </div>
                  <div className="font-mono text-xs font-bold text-gray-500 mt-1">
                    {destination}
                  </div>
                </div>

                <div className="flex flex-col items-center px-2 flex-1 max-w-[140px] sm:max-w-[180px]">
                  <span className="text-[10px] font-mono text-gray-500 mb-0.5">
                    {returnDate}
                  </span>
                  <div className="w-full h-0.5 bg-black/40 relative flex items-center justify-center">
                    <Plane className="w-3 h-3 text-black absolute left-0 -top-1.5 transform -rotate-90" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 mt-0.5">
                    Return Leg Included
                  </span>
                </div>

                <div className="text-right w-20">
                  <div className="font-curved font-black text-base text-black leading-none">
                    Included
                  </div>
                  <div className="font-mono text-xs font-bold text-gray-500 mt-1">
                    {origin}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right: Price & CTA Booking Section */}
        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t-2 md:border-t-0 md:border-l-2 border-black/10 pt-3 md:pt-0 md:pl-5 min-w-[160px]">
          
          <div className="text-left md:text-right mb-2">
            <div className="font-curved font-black text-2xl sm:text-3xl text-black tracking-tight leading-none">
              ₹{price.toLocaleString('en-IN')}
            </div>
            <div className="font-mono text-[10px] text-gray-500 mt-1">
              {tripType === 'round-trip' ? 'Total round trip fare' : 'One way, per traveler'}
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {onOpenCart && (
              <button
                type="button"
                onClick={() => onOpenCart(flight)}
                className="p-2.5 rounded-xl border-2 border-black bg-white hover:bg-loot-yellow transition-colors shadow-loot-xs"
                title="Review Pre-Filled Cart & Fill Traveler Names"
              >
                <ShoppingCart className="w-4 h-4 text-black" />
              </button>
            )}

            <button
              onClick={() => onTrackRoute(flight)}
              className="p-2.5 rounded-xl border-2 border-black bg-white hover:bg-loot-yellow transition-colors shadow-loot-xs"
              title="Track price on WhatsApp"
            >
              <Bell className="w-4 h-4 text-black" />
            </button>

            <a
              href={dealBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-loot px-4 py-2.5 rounded-xl text-xs font-curved font-black uppercase text-black bg-loot-lime hover:bg-[#86efac] flex items-center space-x-1.5 shadow-loot-sm"
              title="Directly opens pre-filled booking cart with route, dates & passengers searched"
            >
              <span>Book Now</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>

          {/* Quick Pre-filled Portals */}
          <div className="flex items-center space-x-1.5 mt-2 text-[10px] font-mono text-gray-500">
            <span>Pre-filled Cart:</span>
            <a
              href={dealBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline hover:text-black font-bold"
            >
              MMT
            </a>
            {easeMyTripUrl && (
              <>
                <span>•</span>
                <a
                  href={easeMyTripUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-black font-bold"
                >
                  EaseMyTrip
                </a>
              </>
            )}
            {airlineUrl && airlineUrl !== dealBookingUrl && (
              <>
                <span>•</span>
                <a
                  href={airlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-black font-bold"
                >
                  {airline || 'Airline'}
                </a>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
