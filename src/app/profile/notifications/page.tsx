'use client';

import { useState } from 'react';
import { ChevronLeft, Bell, Shield, Tag, Package, Check } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Notifications() {
  const [orders, setOrders] = useState(true);
  const [drops, setDrops] = useState(true);
  const [dnaAlerts, setDnaAlerts] = useState(false);
  const [security, setSecurity] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <Navbar />

      <div className="max-w-[700px] mx-auto px-4 pt-10">
        
        {/* Back Link */}
        <Link href="/profile" className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>

        <h1 className="text-3xl font-display font-medium italic text-black mb-10">Notifications</h1>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 flex items-center space-x-2">
            <Bell className="w-4 h-4 text-drip-coral" />
            <span>Alert Preferences</span>
          </h3>

          <div className="space-y-6 divide-y divide-gray-50">
            {/* Toggles */}
            <div className="flex items-center justify-between py-4 first:pt-0">
              <div className="flex items-start space-x-4">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <Package className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Order &amp; Delivery Updates</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Get notifications when orders are confirmed, shipped, or delivered.</p>
                </div>
              </div>
              <button 
                onClick={() => setOrders(!orders)}
                className={`w-12 h-6 rounded-full p-1 transition-all ${orders ? 'bg-black' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${orders ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-start space-x-4">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <Tag className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Exclusive Style Drops</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Alerts on limited collections, seasonal price cuts, and member drops.</p>
                </div>
              </div>
              <button 
                onClick={() => setDrops(!drops)}
                className={`w-12 h-6 rounded-full p-1 transition-all ${drops ? 'bg-black' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${drops ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-start space-x-4">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <Bell className="w-4.5 h-4.5 text-drip-coral" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">AI Stylist DNA Matching</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Get custom notifications when clothes matching your precise Style DNA are cataloged.</p>
                </div>
              </div>
              <button 
                onClick={() => setDnaAlerts(!dnaAlerts)}
                className={`w-12 h-6 rounded-full p-1 transition-all ${dnaAlerts ? 'bg-black' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${dnaAlerts ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between py-4 last:pb-0">
              <div className="flex items-start space-x-4">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Security &amp; Device Alerts</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Get immediate emails or push updates for password resets and unrecognized logins.</p>
                </div>
              </div>
              <button 
                onClick={() => setSecurity(!security)}
                className={`w-12 h-6 rounded-full p-1 transition-all ${security ? 'bg-black' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${security ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-50">
            <div>
              {saved && (
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>Preferences Saved</span>
                </span>
              )}
            </div>
            <button 
              onClick={handleSave}
              className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
            >
              Save Preferences
            </button>
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}
