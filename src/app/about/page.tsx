'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Scissors, Wind, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">


      <Navbar />

      {/* ══════ PAGE HEADER ══════ */}
      <section className="bg-gray-100 py-16 md:py-24 text-center border-b border-gray-200">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-gray-900 mb-4">About Us</h1>
        <p className="text-gray-500 font-medium tracking-widest uppercase text-[11px]">The Drip Standard</p>
      </section>

      {/* ══════ THE DRIP STANDARD (ABOUT US) ══════ */}
      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 text-center">
          <span className="inline-block text-gray-400 text-[10px] font-black uppercase tracking-[0.5em] mb-6 border border-gray-200 px-4 py-1.5 rounded-full">Our Story</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-8 text-gray-900 leading-[0.9]">
            TRUSTED BY 1 MILLION.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">DEFINED BY DETAILS.</span>
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto mb-20 text-sm md:text-[15px]">
            We've created over 6,000 unique styles, maintaining 100% in-house quality checks. Operating through 20+ stores globally, every single piece we craft is engineered around three uncompromising pillars.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Scissors strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">Precision Fits</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Engineered to drape perfectly and rigorously tested to enhance your natural silhouette.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Wind strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">Breathable</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Premium, climate-responsive materials that breathe with your body throughout the day.</p>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Shield strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">Durable Build</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Constructed to outlast trends. Consistently holding form wash after wash.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ ABOUT NEWSLETTER ══════ */}
      <section className="py-24 bg-white border-t border-gray-100 overflow-hidden relative">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <div className="bg-gray-950 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(233,69,96,0.15),_transparent_70%)]"></div>
             <div className="relative z-10">
                <span className="text-drip-coral text-[10px] font-black uppercase tracking-[0.5em] mb-8 block">Join The Collective</span>
                <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10 leading-none">THE FUTURE IS<br />DROPPING SOON.</h2>
                <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4 mb-8">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow bg-white/5 border border-white/10 text-white px-8 py-5 rounded-full focus:outline-none focus:border-drip-coral transition-colors font-bold text-sm"
                  />
                  <button className="bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest text-[12px] hover:bg-drip-coral hover:text-white transition-all">
                    Subscribe
                  </button>
                </form>
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.2em]">Early access. Exclusive drops. 100% Signal.</p>
             </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 25s linear infinite; }
      `}</style>
    </main>
  );
}
