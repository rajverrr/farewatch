import React from 'react';
import { Sparkles } from 'lucide-react';

export default function FestivalCarousel({ festivals = [], selectedFestival, onSelectFestival }) {
  if (!festivals || festivals.length === 0) return null;

  // Custom loot-drop festive colors
  const festColorMap = {
    'diwali-chhath': 'hover:bg-loot-yellow',
    'durga-puja': 'hover:bg-loot-pink',
    'goa-new-year': 'hover:bg-loot-blue hover:text-white',
    'holi': 'hover:bg-loot-lime',
    'onam': 'hover:bg-loot-orange hover:text-white'
  };

  const selectedColorMap = {
    'diwali-chhath': 'bg-loot-yellow text-black ring-2 ring-black',
    'durga-puja': 'bg-loot-pink text-black ring-2 ring-black',
    'goa-new-year': 'bg-loot-blue text-white ring-2 ring-black',
    'holi': 'bg-loot-lime text-black ring-2 ring-black',
    'onam': 'bg-loot-orange text-white ring-2 ring-black'
  };

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-3">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-black bg-loot-yellow px-2 py-0.5 border-2 border-black rounded-md">
          SELECT LOOT TARGET
        </span>
        <span className="text-xs font-mono text-gray-500">
          // Historical surge multipliers calibrated
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {festivals.map((fest, idx) => {
          const isSelected = selectedFestival?.id === fest.id;
          const activeStyle = selectedColorMap[fest.id] || 'bg-loot-yellow text-black';
          const hoverStyle = festColorMap[fest.id] || 'hover:bg-loot-yellow';

          return (
            <button
              key={fest.id}
              onClick={() => onSelectFestival(fest)}
              className={`p-3.5 rounded-2xl border-[3px] border-black text-left transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? `${activeStyle} translate-x-[2px] translate-y-[2px] shadow-loot-sm`
                  : `bg-white text-black shadow-loot ${hoverStyle} hover:-translate-y-1 hover:shadow-loot-lg`
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{fest.icon}</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-black text-white border border-black">
                  {fest.surgeMultiplier}x SURGE
                </span>
              </div>

              <div>
                <div className="font-curved font-bold text-sm tracking-tight leading-snug">
                  {fest.name}
                </div>
                <div className="text-[11px] font-mono opacity-80 mt-1">
                  Peak: {new Date(fest.peakDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
