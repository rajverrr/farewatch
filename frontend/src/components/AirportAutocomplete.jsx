import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, ChevronDown, Sparkles } from 'lucide-react';

export default function AirportAutocomplete({
  label,
  value,
  airports = [],
  onChange,
  placeholder = 'Search city or airport...'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Find currently selected airport object
  const selectedAirport = airports.find((a) => a.code === value);

  // Set initial display text
  useEffect(() => {
    if (selectedAirport) {
      setSearchTerm(`${selectedAirport.code} - ${selectedAirport.city}`);
    } else if (value) {
      setSearchTerm(value);
    }
  }, [value, selectedAirport]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Revert search term to current selected airport if closed without selecting
        if (selectedAirport) {
          setSearchTerm(`${selectedAirport.code} - ${selectedAirport.city}`);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedAirport]);

  // Filtered airports based on search term
  const filteredAirports = airports.filter((a) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.code.toLowerCase().includes(term) ||
      a.city.toLowerCase().includes(term) ||
      (a.name && a.name.toLowerCase().includes(term)) ||
      (a.state && a.state.toLowerCase().includes(term))
    );
  });

  const handleSelect = (airport) => {
    onChange(airport.code);
    setSearchTerm(`${airport.code} - ${airport.city}`);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchTerm('');
    setIsOpen(true);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-mono font-bold uppercase text-black mb-1.5 flex items-center justify-between">
        <span>{label}</span>
        {selectedAirport?.festiveHub && (
          <span className="text-[10px] text-amber-700 font-bold flex items-center space-x-0.5">
            <Sparkles className="w-3 h-3 fill-amber-500 text-amber-600" />
            <span>FESTIVE HUB</span>
          </span>
        )}
      </label>

      {/* Input Box */}
      <div className="relative">
        <div className="absolute left-3 top-3 text-gray-500 pointer-events-none">
          <MapPin className="w-4 h-4 text-black stroke-[2.5]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onFocus={() => {
            setIsOpen(true);
            // Select all text for easy re-typing
            if (inputRef.current) inputRef.current.select();
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full bg-[#FDFBF7] border-[3px] border-black rounded-xl pl-9 pr-14 py-2.5 text-sm font-curved font-bold text-black focus:outline-none focus:bg-white focus:shadow-loot-sm transition-all"
        />

        <div className="absolute right-2.5 top-2.5 flex items-center space-x-1">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
              title="Clear airport"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg hover:bg-gray-200 text-black transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-64 overflow-y-auto bg-white border-[3px] border-black rounded-2xl shadow-loot-xl py-1.5 animate-fade-in font-curved">
          {filteredAirports.length === 0 ? (
            <div className="p-4 text-center text-xs font-mono text-gray-500">
              No Indian airports matching "{searchTerm}"
            </div>
          ) : (
            filteredAirports.map((airport) => {
              const isSelected = airport.code === value;
              return (
                <button
                  key={airport.code}
                  type="button"
                  onClick={() => handleSelect(airport)}
                  className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-loot-yellow/30 transition-colors border-b border-black/5 last:border-0 ${
                    isSelected ? 'bg-loot-yellow text-black font-black' : 'text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-black text-loot-yellow border border-black shadow-loot-xs">
                      {airport.code}
                    </span>
                    <div>
                      <div className="font-curved font-bold text-sm leading-tight text-black">
                        {airport.city}
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 truncate max-w-[200px] sm:max-w-xs">
                        {airport.name}
                      </div>
                    </div>
                  </div>

                  {airport.festiveHub && (
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-loot-pink text-black border border-black">
                      ★ HUB
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
