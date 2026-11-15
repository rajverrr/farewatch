import React from 'react';
import { ExternalLink, Bell, Luggage, Clock } from 'lucide-react';

export default function FlightCard({ flight, isLowest, onTrackRoute }) {
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
    baggage
  } = flight;

  const bookingUrl = `https://www.google.com/travel/flights?q=flights+from+${origin}+to+${destination}`;

  return (
    <div className={`card-loot p-4 sm:p-5 mb-3 transition-all ${
      isLowest ? 'border-loot-orange bg-white ring-2 ring-loot-orange shadow-loot-lg' : 'bg-white'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Airline Info */}
        <div className="flex items-center space-x-3 md:w-1/4">
          <div
            className="w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center font-curved font-black text-sm shadow-loot-sm flex-shrink-0"
            style={{ backgroundColor: logoBg, color: textColor }}
          >
            {airline.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-curved font-black text-base text-black">{airline}</span>
              {isLowest && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-loot-lime text-black border border-black">
                  CHEAPEST
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-gray-500">{flightNumber}</span>
          </div>
        </div>

        {/* Schedule & Duration */}
        <div className="flex items-center justify-between md:justify-center space-x-6 md:w-2/4">
          <div className="text-left md:text-right">
            <div className="text-xl font-curved font-black text-black tracking-tight">{departureTime}</div>
            <div className="text-xs font-mono font-bold text-gray-500">{origin}</div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono font-bold text-gray-600 mb-0.5">{duration}</span>
            <div className="w-24 sm:w-28 h-1 bg-black relative flex items-center justify-center rounded-full">
              <span className="w-2 h-2 rounded-full bg-loot-yellow border border-black absolute" />
            </div>
            <span className="text-[10px] font-mono text-gray-500 mt-1">{stops}</span>
          </div>

          <div className="text-right md:text-left">
            <div className="text-xl font-curved font-black text-black tracking-tight">{arrivalTime}</div>
            <div className="text-xs font-mono font-bold text-gray-500">{destination}</div>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="flex items-center justify-between md:justify-end space-x-4 md:w-1/4 pt-3 md:pt-0 border-t-2 md:border-t-0 border-black/10">
          <div className="text-left md:text-right">
            <div className="inline-block px-3 py-1 rounded-xl bg-loot-yellow border-2 border-black font-curved font-black text-xl text-black shadow-loot-sm">
              ₹{price.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] font-mono text-gray-500 mt-0.5">{baggage}</div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onTrackRoute(flight)}
              className="p-2 rounded-xl border-2 border-black bg-white hover:bg-loot-yellow transition-colors shadow-loot-sm active:translate-x-[1px] active:translate-y-[1px]"
              title="Track this flight on WhatsApp"
            >
              <Bell className="w-4 h-4 text-black" />
            </button>

            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-loot px-4 py-2 rounded-xl text-xs font-curved font-black uppercase text-black bg-white hover:bg-black hover:text-white transition-colors flex items-center space-x-1"
            >
              <span>BOOK</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
