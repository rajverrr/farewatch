import React from 'react';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterSidebar({
  flights = [],
  selectedStops,
  onStopsChange,
  selectedTimeSlot,
  onTimeSlotChange,
  selectedAirlines,
  onToggleAirline,
  maxPrice,
  onMaxPriceChange,
  onResetFilters
}) {
  if (!flights || flights.length === 0) return null;

  // Calculate stop prices
  const directFlights = flights.filter(f => f.stops.toLowerCase().includes('nonstop') || f.stops === 'Non-stop');
  const stopFlights = flights.filter(f => f.stops.toLowerCase().includes('1-stop') || f.stops.toLowerCase().includes('1 stop'));
  const directMin = directFlights.length > 0 ? Math.min(...directFlights.map(f => f.price)) : null;
  const stopMin = stopFlights.length > 0 ? Math.min(...stopFlights.map(f => f.price)) : null;

  // Calculate unique airlines and their lowest prices
  const airlineStats = {};
  flights.forEach(f => {
    if (!airlineStats[f.airline]) {
      airlineStats[f.airline] = f.price;
    } else {
      airlineStats[f.airline] = Math.min(airlineStats[f.airline], f.price);
    }
  });
  const allAirlines = Object.keys(airlineStats);

  // Price boundaries
  const allPrices = flights.map(f => f.price);
  const minAvailablePrice = Math.min(...allPrices);
  const maxAvailablePrice = Math.max(...allPrices);

  return (
    <div className="card-loot p-4 sm:p-5 bg-white space-y-6 font-curved text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
        <div className="flex items-center space-x-1.5 font-curved font-black text-sm uppercase text-black">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Flight Filters</span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-[11px] font-mono font-bold text-gray-500 hover:text-black flex items-center space-x-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Stops Filter */}
      <div>
        <label className="block font-mono text-[11px] font-bold uppercase text-black mb-2">
          // STOPS
        </label>
        <div className="space-y-1.5">
          <label className="flex items-center justify-between p-2 rounded-xl border-2 border-black/10 hover:border-black cursor-pointer transition-colors bg-[#FDFBF7]">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="stops"
                checked={selectedStops === 'all'}
                onChange={() => onStopsChange('all')}
                className="accent-black w-4 h-4 cursor-pointer"
              />
              <span className="font-bold text-black">All Flights</span>
            </div>
            <span className="font-mono text-gray-500">({flights.length})</span>
          </label>

          <label className="flex items-center justify-between p-2 rounded-xl border-2 border-black/10 hover:border-black cursor-pointer transition-colors bg-[#FDFBF7]">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="stops"
                checked={selectedStops === 'nonstop'}
                onChange={() => onStopsChange('nonstop')}
                className="accent-black w-4 h-4 cursor-pointer"
              />
              <span className="font-bold text-black">Direct Only</span>
            </div>
            {directMin && (
              <span className="font-mono font-bold text-black">from ₹{directMin.toLocaleString('en-IN')}</span>
            )}
          </label>

          {stopMin && (
            <label className="flex items-center justify-between p-2 rounded-xl border-2 border-black/10 hover:border-black cursor-pointer transition-colors bg-[#FDFBF7]">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="stops"
                  checked={selectedStops === 'stop'}
                  onChange={() => onStopsChange('stop')}
                  className="accent-black w-4 h-4 cursor-pointer"
                />
                <span className="font-bold text-black">1 Stop</span>
              </div>
              <span className="font-mono font-bold text-black">from ₹{stopMin.toLocaleString('en-IN')}</span>
            </label>
          )}
        </div>
      </div>

      {/* Departure Times */}
      <div>
        <label className="block font-mono text-[11px] font-bold uppercase text-black mb-2">
          // DEPARTURE TIMES
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'All Times' },
            { id: 'morning', label: 'Morning (00-12)' },
            { id: 'afternoon', label: 'Noon (12-18)' },
            { id: 'night', label: 'Night (18-24)' }
          ].map(slot => (
            <button
              key={slot.id}
              type="button"
              onClick={() => onTimeSlotChange(slot.id)}
              className={`p-2 rounded-xl border-2 font-bold text-[11px] transition-all text-center ${
                selectedTimeSlot === slot.id
                  ? 'border-black bg-black text-loot-yellow shadow-loot-xs font-black'
                  : 'border-black/20 bg-[#FDFBF7] text-gray-800 hover:border-black'
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      {/* Airlines Filter */}
      <div>
        <label className="block font-mono text-[11px] font-bold uppercase text-black mb-2">
          // AIRLINES
        </label>
        <div className="space-y-1.5">
          {allAirlines.map(airline => {
            const isChecked = selectedAirlines.includes(airline);
            const lowest = airlineStats[airline];

            return (
              <label
                key={airline}
                className="flex items-center justify-between p-2 rounded-xl border-2 border-black/10 hover:border-black cursor-pointer transition-colors bg-[#FDFBF7]"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleAirline(airline)}
                    className="accent-black w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="font-bold text-black">{airline}</span>
                </div>
                <span className="font-mono text-gray-700 font-bold">
                  from ₹{lowest.toLocaleString('en-IN')}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Max Price Range Slider */}
      {maxAvailablePrice > minAvailablePrice && (
        <div>
          <div className="flex items-center justify-between font-mono text-[11px] font-bold text-black mb-1.5">
            <span>// MAX FARE</span>
            <span className="px-2 py-0.5 rounded bg-loot-yellow border border-black font-black">
              ₹{Number(maxPrice).toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min={minAvailablePrice}
            max={maxAvailablePrice}
            step={100}
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="w-full accent-black cursor-pointer"
          />
          <div className="flex justify-between font-mono text-[10px] text-gray-500 mt-1">
            <span>₹{minAvailablePrice.toLocaleString('en-IN')}</span>
            <span>₹{maxAvailablePrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

    </div>
  );
}
