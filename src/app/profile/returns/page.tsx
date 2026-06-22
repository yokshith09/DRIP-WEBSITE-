'use client';

import { ChevronLeft, RefreshCcw, CheckCircle2, ShieldAlert, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MOCK_RETURNS = [
  {
    id: 'RET-8842',
    orderId: 'DRIP-5542C',
    date: 'June 18, 2026',
    status: 'Refund Approved',
    statusColor: 'text-green-600 bg-green-50 border-green-100',
    item: { id: 'm2', name: 'Tailored Chinos', brand: 'Hugo Boss', price: '₹ 5,200', image: '/images/hero/cat-trousers.png', size: '32', color: 'Khaki' },
    refundAmount: '₹ 5,200',
    refundMethod: 'Original Payment Method (Visa ****4321)',
    completed: true,
  },
  {
    id: 'RET-3109',
    orderId: 'DRIP-7621B',
    date: 'June 21, 2026',
    status: 'Item Picked Up',
    statusColor: 'text-blue-500 bg-blue-50 border-blue-100',
    item: { id: 'm10', name: 'Distressed Denim Jacket', brand: 'Levi\'s', price: '₹ 4,990', image: '/images/hero/cat-men-jackets.png', size: 'L', color: 'Light Wash' },
    refundAmount: '₹ 4,990',
    refundMethod: 'DRIP Wallet Coins (Credits locked)',
    completed: false,
  }
];

export default function ReturnsRefunds() {
  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <Navbar />

      <div className="max-w-[1000px] mx-auto px-4 pt-10">
        
        {/* Back Link */}
        <Link href="/profile" className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>

        <h1 className="text-3xl font-display font-medium italic text-black mb-10">Returns &amp; Refunds</h1>

        <div className="space-y-10">
          {MOCK_RETURNS.map((ret) => (
            <div key={ret.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
              
              {/* Header */}
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex space-x-8 text-xs font-semibold text-gray-500">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400">Return Request ID</span>
                    <span className="text-black font-black">{ret.id}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400">Order ID</span>
                    <span className="text-black font-black">{ret.orderId}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400">Requested On</span>
                    <span className="text-black">{ret.date}</span>
                  </div>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border rounded-full ${ret.statusColor}`}>
                  {ret.status}
                </div>
              </div>

              {/* Item details */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-20 bg-gray-50 relative rounded-lg border border-gray-100 overflow-hidden shrink-0">
                      <img src={ret.item.image} alt={ret.item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{ret.item.brand}</span>
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug">{ret.item.name}</h3>
                      <p className="text-[10px] text-gray-500 font-medium mt-1">Size: {ret.item.size} | Color: {ret.item.color}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">Refund Amount</span>
                    <span className="text-base font-black text-black">{ret.refundAmount}</span>
                  </div>
                </div>
              </div>

              {/* Refund Tracking Information */}
              <div className="bg-gray-50/20 p-6 border-t border-gray-150 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">Refund Destination</span>
                  <p className="text-xs font-semibold text-gray-800">{ret.refundMethod}</p>
                </div>
                
                <div className="flex items-center space-x-2 bg-white px-4 py-2 border border-gray-100 rounded-xl shadow-xs shrink-0">
                  {ret.completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Refund Transferred</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-drip-coral animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-drip-coral">Processing (2-3 Business Days)</span>
                    </>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Helpful Tips Block */}
        <div className="mt-12 bg-[#F0F7FF] border border-blue-100 rounded-2xl p-6 flex items-start space-x-4">
          <Clock className="w-6 h-6 text-[#0055A4] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[10px] font-black uppercase text-[#0055A4] tracking-widest mb-1.5">DRIP Refund Policy Guarantee</h4>
            <p className="text-xs font-semibold text-[#1A1A2E] leading-relaxed max-w-2xl">
              We process refunds instantly once the courier pickup is verified on our network. Elite members enjoy zero-deduction refund processing direct to bank cards, or 100% value credits to DRIP Coins.
            </p>
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
}
