import React, { useState } from 'react';
import { X, Trash2, Zap, CheckCircle2, MessageSquare, Send, RefreshCw, Bell } from 'lucide-react';
import { deleteAlert, triggerAlertTest, runAllChecks } from '../services/api';

export default function ActiveAlertsList({ isOpen, onClose, alerts = [], onRefresh, onAlertTriggered }) {
  if (!isOpen) return null;

  const [triggeringId, setTriggeringId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [checkingAll, setCheckingAll] = useState(false);

  const handleDelete = async (id) => {
    try {
      await deleteAlert(id);
      onRefresh();
    } catch (err) {
      console.error('Delete alert failed:', err);
    }
  };

  const handleTestTrigger = async (alert) => {
    try {
      setTriggeringId(alert.id);
      setSuccessMsg('');
      const res = await triggerAlertTest(alert.id);
      setSuccessMsg(`🚀 Test WhatsApp alert dispatched for ${alert.origin} ➔ ${alert.destination}!`);
      if (onAlertTriggered) onAlertTriggered(res.result);
      onRefresh();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Trigger test failed:', err);
    } finally {
      setTriggeringId(null);
    }
  };

  const handleRunAll = async () => {
    try {
      setCheckingAll(true);
      await runAllChecks();
      setSuccessMsg('Price check ran across all tracked routes!');
      onRefresh();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Run all checks failed:', err);
    } finally {
      setCheckingAll(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white border-[3px] border-black rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-loot-2xl flex flex-col overflow-hidden animate-fade-in font-curved">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-loot-yellow border-b-[3px] border-black flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center shadow-loot-sm">
              <Bell className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-black text-loot-yellow rounded-md">
                ACTIVE RADAR
              </span>
              <h3 className="font-curved font-black text-black text-lg sm:text-xl uppercase leading-tight mt-0.5">
                Tracked Flight Loot Watchers
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRunAll}
              disabled={checkingAll}
              className="btn-loot px-3 py-1.5 rounded-xl text-xs bg-white text-black font-bold flex items-center space-x-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingAll ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Check Now</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-loot-sm"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-loot-lime border-2 border-black text-black text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Alerts Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-[#FDFBF7]">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-black opacity-30" />
              <p className="font-curved font-bold text-base text-black">No active loot alerts yet</p>
              <p className="text-xs font-mono text-gray-500 mt-1">Search for a route above and click "Loot on WhatsApp" to track one.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-white border-[3px] border-black shadow-loot hover:shadow-loot-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-curved font-black text-black text-lg">
                      {alert.origin} ➔ {alert.destination}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-loot-yellow text-black border border-black">
                      {alert.festivalName}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-gray-700 space-x-3 mb-2">
                    <span>📅 {alert.travelDate}</span>
                    <span>🎯 Target: <strong className="text-black">₹{alert.targetPrice.toLocaleString('en-IN')}</strong></span>
                    {alert.currentLowest && (
                      <span>Current: <strong className="text-loot-orange font-bold">₹{alert.currentLowest.toLocaleString('en-IN')}</strong></span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-600">
                    <span className="flex items-center space-x-1 text-black font-bold">
                      <MessageSquare className="w-3.5 h-3.5 text-loot-green" />
                      <span>{alert.contactInfo}</span>
                    </span>
                    <span>•</span>
                    <span>Last checked: {new Date(alert.lastCheckedAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => handleTestTrigger(alert)}
                    disabled={triggeringId === alert.id}
                    className="btn-loot px-3.5 py-2 rounded-xl text-xs font-curved font-black uppercase text-black bg-loot-yellow hover:bg-[#ffe135] flex items-center space-x-1.5 disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{triggeringId === alert.id ? 'SENDING...' : 'TEST ALERT'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="p-2 rounded-xl border-2 border-black bg-white hover:bg-red-100 text-black transition-colors shadow-loot-sm"
                    title="Delete Tracker"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
