'use client';

import { useState } from 'react';
import { ChevronLeft, ShieldAlert, Key, Smartphone, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  const [saved, setSaved] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill out all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSaved(false), 3000);
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

        <h1 className="text-3xl font-display font-medium italic text-black mb-10">Security Settings</h1>

        <div className="space-y-8">
          
          {/* Change Password Block */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 mb-6 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-drip-coral" />
              <span>Change Password</span>
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Current Password *</label>
                <input 
                  type="password" 
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">New Password *</label>
                <input 
                  type="password" 
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Confirm New Password *</label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10"
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  {saved && (
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>Password Updated</span>
                    </span>
                  )}
                </div>
                <button 
                  type="submit"
                  className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* 2FA Block */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                <ShieldAlert className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Two-Factor Authentication (2FA)</h4>
                <p className="text-[10px] text-gray-400 font-medium mt-1">Secure logins by requiring a verification code sent to your phone/email.</p>
              </div>
            </div>
            <button 
              onClick={() => setTwoFactor(!twoFactor)}
              className="text-gray-400 hover:text-black transition-colors"
            >
              {twoFactor ? <ToggleRight className="w-10 h-10 text-black" /> : <ToggleLeft className="w-10 h-10" />}
            </button>
          </div>

          {/* Active Sessions */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 mb-6 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-gray-400" />
              <span>Active Device Sessions</span>
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Windows PC • Gurugram, India</h4>
                  <span className="text-[9px] text-drip-green font-bold block uppercase mt-0.5">Active Session (Current Device)</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Browser: Chrome
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Apple iPhone 15 Pro • Seoul, South Korea</h4>
                  <span className="text-[9px] text-gray-400 font-bold block uppercase mt-0.5">Last active: 2 hours ago</span>
                </div>
                <button 
                  onClick={() => alert('Device session terminated')}
                  className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                >
                  Revoke Access
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
      <Footer />
    </main>
  );
}
