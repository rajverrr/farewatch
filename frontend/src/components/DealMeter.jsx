import React from 'react';
import { MessageSquare, Flame, ShieldAlert, Sparkles, Zap, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function DealMeter({ evaluation, lowestPrice, isLiveFare, fareSource, onOpenAlertModal }) {
  if (!evaluation) return null;

  const {
    dealScore,
    verdict,
    badgeText,
    badgeColor,
    actionAdvice,
    matchedFestival,
    daysUntilTrip,
    benchmark
  } = evaluation;

  // Loot Drop Rarity styling
  const isLegendary = dealScore >= 80;
  const isSurgePanic = verdict === 'URGENT_BOOKING_RUSH' || dealScore < 45;

  const cardHeaderBg = isLegendary
    ? 'bg-loot-lime text-black'
    : isSurgePanic
    ? 'bg-loot-orange text-white'
    : 'bg-loot-yellow text-black';

  return (
    <div className="card-loot overflow-hidden mb-8 bg-white">
      
      {/* Top Banner: Loot Item Rarity Bar */}
      <div className={`px-5 py-2.5 border-b-[3px] border-black ${cardHeaderBg} flex flex-wrap items-center justify-between gap-2`}>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-black text-white rounded-md">
            {isLegendary ? '★ LEGENDARY DROP' : isSurgePanic ? '⚠️ SURGE WARNING' : '⚖️ FAIR DROP'}
          </span>
          <span className="font-curved font-black text-sm uppercase">
            {badgeText}
          </span>
          {isLiveFare && (
            <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-white text-emerald-800 border-2 border-black rounded-md flex items-center space-x-1 shadow-loot-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>VERIFIED LIVE GDS & AIRLINE FARES</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs font-bold">
          <span>DEAL SCORE:</span>
          <span className="px-2 py-0.5 bg-white text-black border-2 border-black rounded-md font-black">
            {dealScore}/100
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        
        {/* Price & Action Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b-[3px] border-black">
          
          {/* Price Block */}
          <div>
            <div className="text-xs font-mono font-bold uppercase text-gray-500 mb-1 flex items-center space-x-1.5">
              <span>// LOWEST REAL-TIME FARE</span>
              {isLiveFare && (
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-400">
                  VERIFIED
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-baseline gap-3">
              <div className="inline-block px-4 py-1.5 rounded-2xl bg-loot-yellow border-[3px] border-black shadow-loot-sm">
                <span className="font-curved font-black text-3xl sm:text-5xl text-black tracking-tight">
                  ₹{lowestPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {benchmark && benchmark.savingsVsPeak > 0 && (
                <div className="inline-block px-3 py-1 rounded-xl bg-loot-pink border-2 border-black text-black font-curved font-bold text-xs shadow-loot-sm">
                  SAVE ₹{benchmark.savingsVsPeak.toLocaleString('en-IN')} VS PEAK
                </div>
              )}
            </div>

            {matchedFestival && (
              <div className="text-xs font-curved font-bold text-black mt-2">
                {matchedFestival.icon} {matchedFestival.name} • {daysUntilTrip} days until flight
              </div>
            )}
          </div>

          {/* Big Loot WhatsApp CTA Button */}
          <div>
            <button
              onClick={onOpenAlertModal}
              className="btn-loot px-5 py-3 rounded-2xl text-sm font-curved font-black uppercase text-black bg-loot-lime hover:bg-[#86efac] flex items-center justify-center space-x-2 shadow-loot"
            >
              <MessageSquare className="w-4 h-4 stroke-[3]" />
              <span>LOOT ON WHATSAPP</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </button>
            <div className="text-[10px] font-mono text-gray-500 text-center mt-1.5">
              Instant alerts before price spikes
            </div>
          </div>

        </div>

        {/* Microcopy & Analysis */}
        <div className="py-4 font-curved text-sm font-semibold text-black leading-relaxed">
          {actionAdvice}
        </div>

        {/* Historical Loot Benchmark Stats */}
        {benchmark && (
          <div className="pt-4 border-t-[3px] border-black grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div className="p-3.5 rounded-xl border-2 border-black bg-[#FDFBF7]">
              <div className="text-[10px] font-mono font-bold uppercase text-gray-500">
                OFF-SEASON BASELINE
              </div>
              <div className="font-curved font-black text-lg text-black mt-0.5">
                ₹{benchmark.offSeasonMedian.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] font-mono text-gray-500">Normal non-festival rate</div>
            </div>

            <div className="p-3.5 rounded-xl border-2 border-black bg-loot-yellow/20">
              <div className="text-[10px] font-mono font-bold uppercase text-black">
                FESTIVE AVERAGE
              </div>
              <div className="font-curved font-black text-lg text-black mt-0.5">
                ₹{benchmark.festiveAverage.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] font-mono text-gray-600">Historical average surge</div>
            </div>

            <div className="p-3.5 rounded-xl border-2 border-black bg-loot-pink/20">
              <div className="text-[10px] font-mono font-bold uppercase text-red-700">
                LAST-MINUTE PANIC FARE
              </div>
              <div className="font-curved font-black text-lg text-red-600 mt-0.5">
                ₹{benchmark.historicalPeak.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] font-mono text-red-700">Peak extortion window (0-7d)</div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
