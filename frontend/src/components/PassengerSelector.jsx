import React, { useState, useRef, useEffect } from 'react';
import { Users, ChevronDown, Plus, Minus, Check } from 'lucide-react';

export default function PassengerSelector({
  adults = 1,
  children = 0,
  cabinClass = 'economy',
  onChange
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalPassengers = adults + children;
  const cabinLabel =
    cabinClass === 'business'
      ? 'Business'
      : cabinClass === 'premium-economy'
      ? 'Premium Econ'
      : 'Economy';

  const updateAdults = (delta) => {
    const next = Math.max(1, Math.min(9, adults + delta));
    onChange({ adults: next, children, cabinClass });
  };

  const updateChildren = (delta) => {
    const next = Math.max(0, Math.min(9, children + delta));
    onChange({ adults, children: next, cabinClass });
  };

  const updateCabin = (newCabin) => {
    onChange({ adults, children, cabinClass: newCabin });
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-mono font-bold uppercase text-black mb-1.5 flex items-center space-x-1">
        <Users className="w-3.5 h-3.5" />
        <span>// TRAVELERS & CLASS</span>
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#FDFBF7] border-[3px] border-black rounded-xl px-3.5 py-2.5 text-sm font-curved font-bold text-black flex items-center justify-between hover:bg-white focus:outline-none focus:shadow-loot-sm transition-all"
      >
        <div className="flex items-center space-x-2 truncate">
          <span className="font-curved font-bold">
            {totalPassengers} {totalPassengers === 1 ? 'Traveler' : 'Travelers'}
          </span>
          <span className="text-gray-400">•</span>
          <span className="font-mono text-xs text-gray-700">{cabinLabel}</span>
        </div>
        <ChevronDown className={`w-4 h-4 ml-1 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border-[3px] border-black rounded-2xl shadow-loot-2xl p-4 z-50 animate-fade-in font-curved">
          <div className="space-y-4">
            
            {/* Adults Counter */}
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <div>
                <div className="font-curved font-black text-sm text-black">Adults</div>
                <div className="font-mono text-[10px] text-gray-500">Age 12+ years</div>
              </div>
              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => updateAdults(-1)}
                  disabled={adults <= 1}
                  className="w-8 h-8 rounded-lg border-2 border-black bg-[#FDFBF7] flex items-center justify-center hover:bg-loot-yellow disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-black text-base w-5 text-center">{adults}</span>
                <button
                  type="button"
                  onClick={() => updateAdults(1)}
                  disabled={adults >= 9}
                  className="w-8 h-8 rounded-lg border-2 border-black bg-[#FDFBF7] flex items-center justify-center hover:bg-loot-yellow disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Children Counter */}
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <div>
                <div className="font-curved font-black text-sm text-black">Children</div>
                <div className="font-mono text-[10px] text-gray-500">Age 2–11 years</div>
              </div>
              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => updateChildren(-1)}
                  disabled={children <= 0}
                  className="w-8 h-8 rounded-lg border-2 border-black bg-[#FDFBF7] flex items-center justify-center hover:bg-loot-yellow disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-black text-base w-5 text-center">{children}</span>
                <button
                  type="button"
                  onClick={() => updateChildren(1)}
                  disabled={children >= 9}
                  className="w-8 h-8 rounded-lg border-2 border-black bg-[#FDFBF7] flex items-center justify-center hover:bg-loot-yellow disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cabin Class Selection */}
            <div>
              <div className="font-mono text-[10px] font-bold uppercase text-gray-500 mb-1.5">
                Cabin Class
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'economy', label: 'Economy' },
                  { id: 'premium-economy', label: 'Prem Econ' },
                  { id: 'business', label: 'Business' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => updateCabin(c.id)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border-2 border-black transition-all ${
                      cabinClass === c.id
                        ? 'bg-black text-loot-yellow shadow-loot-xs'
                        : 'bg-[#FDFBF7] text-black hover:bg-gray-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Done Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-loot w-full py-2 rounded-xl text-xs font-black uppercase text-black bg-loot-yellow hover:bg-[#ffe135]"
            >
              Done
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
