import React from 'react';
import { ArrowLeftRight, Calendar, Search, Sparkles, Check } from 'lucide-react';
import AirportAutocomplete from './AirportAutocomplete';
import PassengerSelector from './PassengerSelector';

export default function SearchWidget({
  airports = [],
  origin,
  destination,
  travelDate,
  returnDate,
  tripType = 'one-way',
  adults = 1,
  children = 0,
  cabinClass = 'economy',
  onOriginChange,
  onDestinationChange,
  onTravelDateChange,
  onReturnDateChange,
  onTripTypeChange,
  onPassengersChange,
  onSearch,
  loading = false
}) {
  const handleSwap = () => {
    const tempOrigin = origin;
    const tempDest = destination;
    onOriginChange(tempDest);
    onDestinationChange(tempOrigin);
    onSearch({
      origin: tempDest,
      destination: tempOrigin,
      date: travelDate,
      tripType,
      returnDate,
      adults,
      children,
      cabinClass
    });
  };

  const handleOriginSelect = (val) => {
    onOriginChange(val);
    if (val !== destination) {
      onSearch({
        origin: val,
        destination,
        date: travelDate,
        tripType,
        returnDate,
        adults,
        children,
        cabinClass
      });
    }
  };

  const handleDestinationSelect = (val) => {
    onDestinationChange(val);
    if (origin !== val) {
      onSearch({
        origin,
        destination: val,
        date: travelDate,
        tripType,
        returnDate,
        adults,
        children,
        cabinClass
      });
    }
  };

  const handleDateSelect = (val) => {
    onTravelDateChange(val);
    if (origin !== destination) {
      onSearch({
        origin,
        destination,
        date: val,
        tripType,
        returnDate,
        adults,
        children,
        cabinClass
      });
    }
  };

  const handleReturnDateSelect = (val) => {
    onReturnDateChange(val);
    if (origin !== destination) {
      onSearch({
        origin,
        destination,
        date: travelDate,
        tripType,
        returnDate: val,
        adults,
        children,
        cabinClass
      });
    }
  };

  const handleTripTypeToggle = (type) => {
    onTripTypeChange(type);
    let effectiveReturn = returnDate;
    if (type === 'round-trip' && !effectiveReturn) {
      // Default return date to travelDate + 4 days
      const d = new Date(travelDate);
      d.setDate(d.getDate() + 4);
      effectiveReturn = d.toISOString().split('T')[0];
      onReturnDateChange(effectiveReturn);
    }
    onSearch({
      origin,
      destination,
      date: travelDate,
      tripType: type,
      returnDate: effectiveReturn,
      adults,
      children,
      cabinClass
    });
  };

  const handlePassengersUpdate = (vals) => {
    onPassengersChange(vals);
    onSearch({
      origin,
      destination,
      date: travelDate,
      tripType,
      returnDate,
      adults: vals.adults,
      children: vals.children,
      cabinClass: vals.cabinClass
    });
  };

  return (
    <div className="card-loot p-5 sm:p-6 mb-8 bg-white">
      <form onSubmit={(e) => {
        e.preventDefault();
        onSearch({
          origin,
          destination,
          date: travelDate,
          tripType,
          returnDate,
          adults,
          children,
          cabinClass
        });
      }}>
        
        {/* Top Controls: Trip Type & Passenger Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-black/10">
          
          {/* Trip Type Tabs: One Way vs Round Trip */}
          <div className="inline-flex p-1 rounded-xl bg-[#FDFBF7] border-2 border-black">
            <button
              type="button"
              onClick={() => handleTripTypeToggle('one-way')}
              className={`px-3 py-1 rounded-lg text-xs font-curved font-bold transition-all ${
                tripType === 'one-way'
                  ? 'bg-black text-loot-yellow shadow-loot-xs font-black'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              One Way
            </button>
            <button
              type="button"
              onClick={() => handleTripTypeToggle('round-trip')}
              className={`px-3 py-1 rounded-lg text-xs font-curved font-bold transition-all ${
                tripType === 'round-trip'
                  ? 'bg-black text-loot-yellow shadow-loot-xs font-black'
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              Round Trip
            </button>
          </div>

          {/* Passenger & Cabin Selector */}
          <div className="w-full sm:w-auto">
            <PassengerSelector
              adults={adults}
              children={children}
              cabinClass={cabinClass}
              onChange={handlePassengersUpdate}
            />
          </div>

        </div>

        {/* Main Search Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          
          {/* Searchable Departure Airport */}
          <div className="lg:col-span-3">
            <AirportAutocomplete
              label="// DEPARTURE"
              value={origin}
              airports={airports}
              onChange={handleOriginSelect}
              placeholder="Search departure city/code..."
            />
          </div>

          {/* Swap Button */}
          <div className="hidden lg:flex lg:col-span-1 justify-center pb-1">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2.5 rounded-xl border-[3px] border-black bg-loot-yellow hover:bg-[#ffe135] text-black shadow-loot-sm active:translate-x-[1px] active:translate-y-[1px] transition-all"
              title="Swap Origin and Destination"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Searchable Arrival Airport */}
          <div className="lg:col-span-3">
            <AirportAutocomplete
              label="// DESTINATION"
              value={destination}
              airports={airports}
              onChange={handleDestinationSelect}
              placeholder="Search arrival city/code..."
            />
          </div>

          {/* Travel Dates */}
          <div className={tripType === 'round-trip' ? 'lg:col-span-3 grid grid-cols-2 gap-2' : 'lg:col-span-3'}>
            
            {/* Departure Date */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1.5 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{tripType === 'round-trip' ? '// DEPART' : '// TRAVEL DATE'}</span>
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => handleDateSelect(e.target.value)}
                className="w-full bg-[#FDFBF7] border-[3px] border-black rounded-xl px-3 py-2 text-sm font-curved font-bold text-black focus:outline-none focus:bg-white focus:shadow-loot-sm"
                required
              />
            </div>

            {/* Return Date (When Round Trip is selected) */}
            {tripType === 'round-trip' && (
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-black mb-1.5 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>// RETURN</span>
                </label>
                <input
                  type="date"
                  min={travelDate}
                  value={returnDate}
                  onChange={(e) => handleReturnDateSelect(e.target.value)}
                  className="w-full bg-[#FDFBF7] border-[3px] border-black rounded-xl px-3 py-2 text-sm font-curved font-bold text-black focus:outline-none focus:bg-white focus:shadow-loot-sm"
                  required
                />
              </div>
            )}

          </div>

          {/* Submit Search Button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-loot w-full py-2.5 px-4 rounded-xl text-sm font-curved font-black uppercase text-black bg-loot-yellow hover:bg-[#ffe135] flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span className="font-mono text-xs animate-pulse">FETCHING LIVE...</span>
              ) : (
                <>
                  <Search className="w-4 h-4 stroke-[3]" />
                  <span>LOOT LIVE</span>
                </>
              )}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
