import React from 'react';
import { X, MessageSquare, Send, Mail, CheckCheck, ExternalLink, Bell } from 'lucide-react';

export default function NotificationFeedModal({ isOpen, onClose, notifications = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border-[3px] border-black rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-loot-2xl flex flex-col overflow-hidden animate-fade-in font-curved">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-loot-lime border-b-[3px] border-black flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-loot-sm">
              <MessageSquare className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black text-white rounded-md">
                LIVE DISPATCH FEED
              </span>
              <h3 className="font-curved font-black text-black text-lg sm:text-xl uppercase leading-tight mt-0.5">
                Dispatched Alert Activity Log
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-loot-sm"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Message Feed */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 bg-[#FDFBF7]">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-black opacity-30" />
              <p className="font-curved font-bold text-base text-black">No alerts dispatched yet</p>
              <p className="text-xs font-mono text-gray-500 mt-1">When price drops are triggered or you click "Test Alert", messages appear here.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border-[3px] border-black shadow-loot space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-loot-lime text-black border border-black">
                      {item.channel.toUpperCase()} DISPATCH
                    </span>
                    <span className="font-mono text-gray-600">To: <strong className="text-black">{item.recipient}</strong></span>
                  </div>

                  <span className="text-[11px] font-mono text-gray-500">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {/* WhatsApp / Telegram Chat Preview Bubble */}
                <div className="p-4 rounded-xl bg-[#0b241b] text-emerald-100 font-mono text-xs whitespace-pre-wrap leading-relaxed border-2 border-black shadow-inner">
                  {item.previewText}
                  <div className="flex items-center justify-end space-x-1 mt-2 text-[10px] text-loot-lime font-bold">
                    <span>DISPATCHED</span>
                    <CheckCheck className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Direct Action Link */}
                {item.clickToChatUrl && (
                  <div className="flex justify-end pt-1">
                    <a
                      href={item.clickToChatUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-loot px-3 py-1.5 rounded-xl text-xs font-curved font-bold text-black bg-loot-yellow hover:bg-[#ffe135] inline-flex items-center space-x-1"
                    >
                      <span>OPEN IN WHATSAPP WEB / APP</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
