import React from 'react';
import { Plane, Bell, MessageSquare, Zap } from 'lucide-react';

export default function Navbar({ onOpenAlerts, onOpenNotifications, alertsCount = 0 }) {
  return (
    <header className="border-b-[3px] border-black bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-loot-yellow border-[3px] border-black flex items-center justify-center shadow-loot-sm transform -rotate-2 hover:rotate-0 transition-transform">
            <Plane className="w-5 h-5 text-black transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-curved font-black text-xl tracking-tight text-black uppercase">
                FestiveFare
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-black text-loot-yellow border-2 border-black">
                LOOT DROP v2
              </span>
            </div>
            <p className="text-[11px] font-mono text-gray-500 hidden sm:block">
              // Steal the lowest festive flight fares before algorithms surge
            </p>
          </div>
        </div>

        {/* Live Status & Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Live Radar Pill */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-loot-pink border-2 border-black text-black text-xs font-mono font-bold shadow-loot-sm">
            <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
            <span>24/7 WHATSAPP RADAR</span>
          </div>

          {/* Alert Log */}
          <button
            onClick={onOpenNotifications}
            className="btn-loot px-3 py-1.5 text-xs bg-white text-black rounded-xl hover:bg-gray-100 flex items-center space-x-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Alert Log</span>
          </button>

          {/* Tracked Alerts Button */}
          <button
            onClick={onOpenAlerts}
            className="btn-loot px-3.5 py-1.5 text-xs bg-loot-yellow text-black rounded-xl hover:bg-[#ffe135] flex items-center space-x-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Tracked Flights</span>
            {alertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-black text-loot-yellow rounded-full font-mono font-bold">
                {alertsCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
