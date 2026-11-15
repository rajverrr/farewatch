import React from 'react';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function PriceTrendChart({ surgeTimeline = [], daysUntilTrip = 45, origin, destination }) {
  if (!surgeTimeline || surgeTimeline.length === 0) return null;

  return (
    <div className="card-loot p-5 sm:p-6 mb-8 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-black bg-loot-pink px-2 py-0.5 border-2 border-black rounded-md">
              SURGE TIMELINE
            </span>
            <h3 className="font-curved font-black text-black text-sm uppercase">
              {origin} ➔ {destination} Price Trajectory
            </h3>
          </div>
          <p className="text-xs font-mono text-gray-500 mt-1">
            // Indian airline booking curves modeled across 5,000+ historical flights
          </p>
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl border-2 border-black bg-loot-yellow text-black text-xs font-mono font-bold shadow-loot-sm">
          <Clock className="w-3.5 h-3.5" />
          <span>T-{daysUntilTrip} DAYS REMAINING</span>
        </div>
      </div>

      {/* Step Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
        {surgeTimeline.map((item) => {
          const isCurrentWindow = Math.abs(daysUntilTrip - item.daysOut) <= 10;

          return (
            <div
              key={item.daysOut}
              className={`p-3 rounded-xl border-[3px] border-black flex flex-col justify-between transition-all ${
                isCurrentWindow
                  ? 'bg-loot-yellow shadow-loot translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-[#FDFBF7] shadow-loot-sm hover:shadow-loot'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs uppercase text-black">
                    {item.label}
                  </span>
                  {isCurrentWindow && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-black text-white">
                      NOW
                    </span>
                  )}
                </div>

                <div className="font-curved font-black text-base text-black mt-1">
                  ₹{item.projectedPrice.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-black/20 text-[10px] font-curved font-semibold text-gray-700 leading-tight">
                {item.note}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t-2 border-black/10 flex items-center space-x-2 text-xs font-mono text-gray-700">
        <AlertCircle className="w-4 h-4 text-loot-orange flex-shrink-0" />
        <span>
          <strong>Loot Tip:</strong> 30 days and 14 days before Diwali/Chhath are hard algorithmic cutoff points. Fares never drop during the final 14-day window.
        </span>
      </div>
    </div>
  );
}
