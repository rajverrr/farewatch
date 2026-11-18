import React from 'react';
import { Tag, Sparkles, Zap, Clock } from 'lucide-react';

export default function FareTabs({ activeTab = 'cheapest', onSelectTab, tabsSummary }) {
  if (!tabsSummary) return null;

  const tabs = [
    {
      id: 'cheapest',
      name: 'Cheapest',
      icon: Tag,
      price: tabsSummary.cheapest?.price,
      duration: tabsSummary.cheapest?.duration || '1 hr 45 min',
      subtext: 'Lowest fare found'
    },
    {
      id: 'best',
      name: 'Best',
      icon: Sparkles,
      price: tabsSummary.best?.price,
      duration: tabsSummary.best?.duration || '1 hr 35 min',
      subtext: 'Optimal speed & value'
    },
    {
      id: 'fastest',
      name: 'Fastest',
      icon: Zap,
      price: tabsSummary.fastest?.price,
      duration: tabsSummary.fastest?.duration || '1 hr 35 min',
      subtext: 'Shortest flight time'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`p-3 sm:p-4 rounded-2xl border-[3px] text-left transition-all ${
              isActive
                ? 'border-black bg-loot-yellow text-black shadow-loot translate-x-[-1px] translate-y-[-1px]'
                : 'border-black/30 bg-white hover:border-black hover:bg-[#FDFBF7] text-gray-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-curved font-black text-sm uppercase flex items-center space-x-1.5">
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </span>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-black"></span>
              )}
            </div>

            <div className="font-curved font-black text-lg sm:text-xl text-black">
              ₹{tab.price ? tab.price.toLocaleString('en-IN') : '—'}
            </div>

            <div className="flex items-center space-x-1 text-[11px] font-mono text-gray-600 mt-1">
              <Clock className="w-3 h-3" />
              <span>{tab.duration}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
