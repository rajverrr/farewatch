import React from 'react';
import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react';

export default function DateStrip({ dateStrip = [], onSelectDate }) {
  if (!dateStrip || dateStrip.length === 0) return null;

  return (
    <div className="mb-6 card-loot p-3.5 bg-white">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center space-x-1.5 text-xs font-mono font-bold uppercase text-black">
          <Calendar className="w-3.5 h-3.5" />
          <span>FLEXIBLE DATES: CHEAPEST DAYS TO FLY</span>
        </div>
        <span className="text-[11px] font-mono text-gray-500 hidden sm:inline">
          // Click any day to view fares
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
        {dateStrip.map((item) => {
          const isSelected = item.isSelected;
          const isLowest = item.isLowest;

          return (
            <button
              key={item.date}
              type="button"
              onClick={() => onSelectDate(item.date)}
              className={`p-2 sm:p-2.5 rounded-xl border-2 text-center transition-all ${
                isSelected
                  ? 'border-black bg-loot-yellow text-black font-black shadow-loot-sm ring-2 ring-black -translate-y-0.5'
                  : 'border-black/20 bg-[#FDFBF7] hover:border-black hover:bg-white text-gray-900'
              }`}
            >
              <div className="text-[11px] font-mono uppercase text-gray-600">
                {item.dayName}, {item.dateFormatted}
              </div>

              <div className="font-curved font-black text-sm text-black mt-1">
                ₹{item.price.toLocaleString('en-IN')}
              </div>

              {isLowest && (
                <div className="mt-1">
                  <span className="inline-block text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-loot-lime text-black border border-black leading-tight">
                    CHEAPEST
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
