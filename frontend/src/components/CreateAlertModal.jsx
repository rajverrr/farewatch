import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle2, Zap } from 'lucide-react';
import { createAlert, testDirectWhatsApp } from '../services/api';

export default function CreateAlertModal({ isOpen, onClose, routeData, onAlertCreated }) {
  if (!isOpen || !routeData) return null;

  const { origin, destination, date, lowestPrice, evaluation } = routeData;
  const benchmark = evaluation?.benchmark;
  const recommendedTarget = benchmark?.strongBuyThreshold || Math.round(lowestPrice * 0.9);

  const [channel, setChannel] = useState('whatsapp');
  const [contactInfo, setContactInfo] = useState('+91 ');
  const [targetPrice, setTargetPrice] = useState(recommendedTarget);
  const [callMeBotApiKey, setCallMeBotApiKey] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!contactInfo || contactInfo.trim() === '+91') {
      setError('Please provide your WhatsApp phone number or contact handle.');
      return;
    }

    try {
      setLoading(true);
      const res = await createAlert({
        origin,
        destination,
        travelDate: date,
        festivalId: evaluation?.matchedFestival?.id || 'custom',
        festivalName: evaluation?.matchedFestival?.name || 'Festive Travel',
        targetPrice: Number(targetPrice),
        currentLowest: lowestPrice,
        historicalPeak: benchmark?.historicalPeak || 16000,
        channel,
        contactInfo,
        callMeBotApiKey,
        telegramChatId
      });

      if (res.success) {
        onAlertCreated(res.alert);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestWhatsApp = async () => {
    if (!contactInfo || contactInfo.trim() === '+91') {
      setError('Please enter a phone number first.');
      return;
    }
    setTestStatus('testing');
    try {
      await testDirectWhatsApp(
        contactInfo,
        `🔥 *FestiveFare Loot Alert Connected!*\nTracking ${origin} ➔ ${destination} for ${date}. We will ping your WhatsApp the moment fares dip to ₹${Number(targetPrice).toLocaleString('en-IN')}.`,
        callMeBotApiKey
      );
      setTestStatus('success');
      setTimeout(() => setTestStatus(null), 4000);
    } catch (err) {
      setTestStatus('error');
      setError('Could not dispatch test message: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border-[3px] border-black rounded-3xl w-full max-w-md shadow-loot-xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-loot-yellow p-4 border-b-[3px] border-black flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black text-white rounded-md">
              LOOT TRACKER
            </span>
            <h3 className="font-curved font-black text-black text-lg mt-1 uppercase">
              Set Price Alert ({origin} ➔ {destination})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-loot-sm"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-curved">
          
          {error && (
            <div className="p-3 rounded-xl bg-loot-pink border-2 border-black font-curved text-xs font-bold text-black">
              {error}
            </div>
          )}

          {/* Current & Target Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#FDFBF7] border-2 border-black">
              <span className="text-[10px] font-mono font-bold uppercase text-gray-500 block mb-0.5">
                Current Lowest
              </span>
              <span className="text-xl font-black text-black">
                ₹{lowestPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-black mb-1">
                Loot Below Target
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-mono font-bold text-black">₹</span>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full bg-[#FDFBF7] border-2 border-black rounded-xl pl-7 pr-3 py-2 text-sm font-black text-black focus:outline-none focus:bg-white focus:shadow-loot-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Recommended Button */}
          <div className="flex items-center justify-between text-xs bg-loot-yellow/30 border-2 border-black p-2.5 rounded-xl font-semibold">
            <span>Floor: <strong>₹{recommendedTarget.toLocaleString('en-IN')}</strong></span>
            <button
              type="button"
              onClick={() => setTargetPrice(recommendedTarget)}
              className="text-[11px] font-mono font-bold uppercase underline hover:text-loot-orange"
            >
              Use Floor
            </button>
          </div>

          {/* Notification Channel */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-black mb-1.5">
              // NOTIFICATION CHANNEL
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`py-2 px-3 rounded-xl font-bold text-xs border-2 border-black flex items-center justify-center space-x-1.5 transition-all ${
                  channel === 'whatsapp'
                    ? 'bg-loot-lime text-black shadow-loot-sm translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-[#FDFBF7] text-gray-600 hover:bg-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('telegram')}
                className={`py-2 px-3 rounded-xl font-bold text-xs border-2 border-black flex items-center justify-center space-x-1.5 transition-all ${
                  channel === 'telegram'
                    ? 'bg-loot-blue text-white shadow-loot-sm translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-[#FDFBF7] text-gray-600 hover:bg-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>
            </div>
          </div>

          {/* Contact Input */}
          {channel === 'whatsapp' ? (
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase text-black">
                WhatsApp Phone Number
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="flex-1 bg-[#FDFBF7] border-2 border-black rounded-xl px-3 py-2 text-xs font-mono font-bold text-black focus:outline-none focus:bg-white focus:shadow-loot-sm"
                  required
                />
                <button
                  type="button"
                  onClick={handleTestWhatsApp}
                  disabled={testStatus === 'testing'}
                  className="btn-loot px-3 py-2 rounded-xl text-xs bg-loot-yellow text-black font-black uppercase flex items-center space-x-1"
                >
                  <span>{testStatus === 'testing' ? '...' : 'TEST'}</span>
                </button>
              </div>

              {testStatus === 'success' && (
                <div className="text-[11px] font-mono text-black bg-loot-lime p-2 rounded-lg border border-black flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Test ping delivered! Check Alert Log.</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-black mb-1">
                Telegram Chat ID or Handle
              </label>
              <input
                type="text"
                placeholder="@username"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                className="w-full bg-[#FDFBF7] border-2 border-black rounded-xl px-3 py-2 text-xs font-mono font-bold text-black focus:outline-none focus:bg-white focus:shadow-loot-sm"
              />
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-loot w-full py-3 rounded-2xl font-black text-sm uppercase text-black bg-loot-yellow hover:bg-[#ffe135] disabled:opacity-50"
            >
              {loading ? 'ACTIVATING RADAR...' : 'ACTIVATE WHATSAPP RADAR'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
