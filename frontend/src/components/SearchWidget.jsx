import React from 'react';
import { ArrowLeftRight, Calendar, Search, Sparkles } from 'lucide-react';

export default function SearchWidget({
  airports = [],
  origin,
  destination,
  travelDate,
  onOriginChange,
  onDestinationChange,
  onTravelDateChange,
  onSearch,
  loading = false
}) {
  const handleSwap = () => {
    const temp = origin;
    onOriginChange(destination);
    onDestinationChange(temp);
  };

  return (
    <div className="card-loot p-5 sm:p-6 mb-8 bg-white">
      <form onSubmit={(e) => { e.preventDefault(); onSearch(); }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          
          {/* Origin */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-mono font-bold uppercase text-black mb-1.5 flex items-center space-x-1">
              <span>// DEPARTURE</span>
            </label>
            <div className="relative">
              <select
                value={origin}
                onChange={(e) => onOriginChange(e.target.value)}
                className="w-full bg-[#FDFBF7] border-[3px] border-black rounded-xl px-3.5 py-2.5 text-sm font-curved font-bold text-black focus:outline-none focus:bg-white focus:shadow-loot-sm cursor-pointer"
              >
                {airports.map((a) => (
                  <option key={`orig-${a.code}`} value={a.code}>
                    {a.code} - {a.city}
                  </option>
                ))}
              </select>
            </div>
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

          {/* Destination */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-mono font-bold uppercase text-black mb-1.5 flex items-center space-x-1">
              <span>// DESTINATION</span>
            </label>
            <div className="relative">
              <select
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="w-full bg-[#FDFBF7] border-[3px] border-black rounded-xl px-3.5 py-2.5 text-sm font-curved font-bold text-black focus:outline-none focus:bg-white focus:shadow-loot-sm cursor-pointer"
              >
                {airports.map((a) => (
                  <option key={`dest-${a.code}`} value={a.code}>
                    {a.code} - {a.city} {a.festiveHub ? '★' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Travel Date */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-mono font-bold uppercase text-black mb-1.5 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>// TRAVEL DATE</span>
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => onTravelDateChange(e.target.value)}
              className="w-full bg-[#FDFBF7] border-[3px] border-black rounded-xl px-3.5 py-2 text-sm font-curved font-bold text-black focus:outline-none focus:bg-white focus:shadow-loot-sm"
              required
            />
          </div>

          {/* Submit Search */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-loot w-full py-2.5 px-4 rounded-xl text-sm font-curved font-black uppercase text-black bg-loot-yellow hover:bg-[#ffe135] flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {loading ? (
                <span className="font-mono text-xs">LOOTING...</span>
              ) : (
                <>
                  <Search className="w-4 h-4 stroke-[3]" />
                  <span>LOOT FARES</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
