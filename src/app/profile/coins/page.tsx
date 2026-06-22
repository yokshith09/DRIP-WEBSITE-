'use client';

import { ChevronLeft, Coins, Award, HelpCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TRANSACTIONS = [
  { id: 'tx-1', type: 'Credit', desc: 'Onboarding Style DNA Reward', date: 'June 10, 2026', amount: '+100 Coins', color: 'text-green-600' },
  { id: 'tx-2', type: 'Credit', desc: 'Product Review (Oxford Cotton Shirt)', date: 'June 14, 2026', amount: '+40 Coins', color: 'text-green-600' },
  { id: 'tx-3', type: 'Credit', desc: 'First Order Bonus Credit', date: 'May 14, 2026', amount: '+100 Coins', color: 'text-green-600' }
];

const REWARDS = [
  { title: '₹ 500 Gift Voucher', price: '200 Coins', code: 'DRIP500', active: true },
  { title: 'Free Express Delivery', price: '100 Coins', code: 'EXPRESSFREE', active: true },
  { title: '15% Off Cart Discount', price: '300 Coins', code: 'DRIP15', active: false }
];

export default function DripCoins() {
  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <Navbar />

      <div className="max-w-[800px] mx-auto px-4 pt-10">
        
        {/* Back Link */}
        <Link href="/profile" className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>

        <h1 className="text-3xl font-display font-medium italic text-black mb-10">DRIP Coins</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Balance Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-black to-gray-800 text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-drip-gold opacity-10 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black flex items-center gap-1">
                <Award className="w-4 h-4 text-drip-gold" />
                <span>Rewards Balance</span>
              </span>
              <span className="text-[10px] bg-drip-gold text-black font-black uppercase px-2 py-0.5 rounded tracking-widest">
                Gold Tier
              </span>
            </div>
            <div>
              <span className="text-5xl font-display font-black text-white flex items-baseline">
                240
                <span className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-widest font-sans">Coins</span>
              </span>
              <p className="text-[10px] text-gray-400 mt-2 font-medium">Equates to ₹ 240 cashback credits. Ready to spend.</p>
            </div>
          </div>

          {/* Quick tips */}
          <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-drip-green" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-black">Earn More Coins</h4>
            </div>
            <ul className="text-[10px] text-gray-500 font-medium space-y-2 mt-4 leading-relaxed">
              <li>• Review purchases (+40 Coins)</li>
              <li>• Upload fitting photos (+50 Coins)</li>
              <li>• Earn 1% back on every checkout</li>
            </ul>
          </div>
        </div>

        {/* Claim Rewards */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm mb-10">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 mb-6 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-drip-gold" />
            <span>Redeem Coupons</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {REWARDS.map(reward => (
              <div 
                key={reward.title} 
                className={`border rounded-2xl p-4 flex flex-col justify-between min-h-[140px] transition-all ${
                  reward.active ? 'border-gray-150 bg-white hover:border-black' : 'border-gray-100 bg-gray-50/50 opacity-60'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-black leading-snug">{reward.title}</h4>
                  <span className="text-[9px] font-black uppercase tracking-widest text-drip-gold mt-1 block">
                    {reward.price}
                  </span>
                </div>
                <button 
                  disabled={!reward.active}
                  onClick={() => alert(`Unlocked coupon! Use code: ${reward.code}`)}
                  className={`w-full py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    reward.active 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {reward.active ? 'Unlock Code' : 'Insufficient Coins'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ledger */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 mb-6">Transaction History</h3>
          <div className="space-y-4">
            {TRANSACTIONS.map(tx => (
              <div key={tx.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{tx.desc}</h4>
                  <span className="text-[9px] text-gray-400 font-bold block uppercase mt-0.5">{tx.date}</span>
                </div>
                <span className={`text-xs font-black ${tx.color}`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}
