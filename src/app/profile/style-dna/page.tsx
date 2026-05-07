'use client';

import { ChevronLeft, Sparkles, SlidersHorizontal, Share2 } from 'lucide-react';
import Link from 'next/link';

// Mock values for the radar chart
const DNA_DATA = [
  { label: 'Minimalist', value: 85, color: '#1A1A2E' }, // Navy
  { label: 'Streetwear', value: 65, color: '#E94560' }, // Coral
  { label: 'Vintage', value: 30, color: '#C9A84C' }, // Gold
  { label: 'Avant-Garde', value: 20, color: '#9CA3AF' }, // Gray
  { label: 'Techwear', value: 45, color: '#4B5563' },
];

export default function StyleDNA() {
  // Simple CSS radar polygon approximation for demonstration (a hexagon shape)
  // In a real app, use a charting library like Recharts or Chart.js
  
  return (
    <main className="min-h-screen bg-drip-white pb-32 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full h-14 bg-white z-40 flex items-center justify-between px-4 border-b border-drip-grey shadow-sm">
        <Link href="/profile" className="p-2 -ml-2 text-drip-dark hover:text-drip-coral transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center space-x-2 text-drip-dark">
          <Sparkles className="w-5 h-5 text-drip-coral" />
          <h1 className="text-lg font-sans font-semibold">Style DNA</h1>
        </div>
        <button className="p-2 -mr-2 text-drip-dark">
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      <div className="hero-container !px-4 md:max-w-2xl mx-auto pt-20">
        
        <div className="text-center mb-8">
           <h2 className="text-3xl font-display text-drip-dark leading-tight">Your Unique <br/>Fashion Blueprint</h2>
           <p className="text-sm text-drip-muted mt-3 max-w-sm mx-auto">
             DRIP AI analyzes your browsing, likes, and purchases to build your personalized Style DNA profile.
           </p>
        </div>

        {/* Radar Chart Visual (Mock using SVG) */}
        <div className="bg-white rounded-[2rem] p-8 shadow-drip-card border border-drip-grey relative flex items-center justify-center mb-8 min-h-[340px]">
          
          <div className="absolute top-4 left-4">
             <span className="bg-drip-navy text-white text-[10px] font-bold px-2 py-1 tracking-wider rounded-sm uppercase">Auto-Updated</span>
          </div>

          <svg width="280" height="280" viewBox="0 0 100 100" className="overflow-visible">
            {/* Background Webbings */}
            {[20, 40, 60, 80, 100].map(radius => (
               <polygon 
                 key={radius}
                 points="50,0 97.5,34.5 79.3,90.4 20.6,90.4 2.4,34.5"
                 fill="none" 
                 stroke="#E8E8ED" 
                 strokeWidth="0.5"
                 transform={`scale(${radius/100})`}
                 transform-origin="50 50"
               />
            ))}
            
            {/* Axes */}
            <line x1="50" y1="50" x2="50" y2="0" stroke="#E8E8ED" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="97.5" y2="34.5" stroke="#E8E8ED" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="79.3" y2="90.4" stroke="#E8E8ED" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="20.6" y2="90.4" stroke="#E8E8ED" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="2.4" y2="34.5" stroke="#E8E8ED" strokeWidth="0.5" />

            {/* Data Polygon Shape mapped to attributes */}
            {/* Top(Minimalist:85), Right-Top(Streetwear:65), Right-Bot(Vintage:30), Left-Bot(Avant-Garde:20), Left-Top(Techwear:45) */}
            <polygon 
              points="50,7.5 80.8,40 58.8,62.1 40.1,58 28.5,33.5" 
              fill="rgba(233, 69, 96, 0.2)" 
              stroke="#E94560" 
              strokeWidth="1.5"
            />
            {/* Points */}
            <circle cx="50" cy="7.5" r="2" fill="#1A1A2E" />
            <circle cx="80.8" cy="40" r="2" fill="#E94560" />
            <circle cx="58.8" cy="62.1" r="2" fill="#C9A84C" />
            <circle cx="40.1" cy="58" r="2" fill="#9CA3AF" />
            <circle cx="28.5" cy="33.5" r="2" fill="#4B5563" />
          </svg>

          {/* Labels Absolute positioned around SVG */}
          <span className="absolute top-2 text-[10px] font-bold text-drip-navy uppercase tracking-widest bg-white/80 px-1 backdrop-blur-sm">Minimalist</span>
          <span className="absolute right-0 top-1/4 translate-x-2 text-[10px] font-bold text-drip-coral uppercase tracking-widest bg-white/80 px-1 backdrop-blur-sm">Streetwear</span>
          <span className="absolute right-8 bottom-6 text-[10px] font-bold text-drip-gold uppercase tracking-widest bg-white/80 px-1 backdrop-blur-sm">Vintage</span>
          <span className="absolute left-4 bottom-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/80 px-1 backdrop-blur-sm">Avant-Garde</span>
          <span className="absolute left-0 top-1/4 -translate-x-2 text-[10px] font-bold text-gray-700 uppercase tracking-widest bg-white/80 px-1 backdrop-blur-sm">Techwear</span>
        </div>

        {/* Breakdown List */}
        <div className="bg-white rounded-drip-card border border-drip-grey overflow-hidden shadow-sm mb-8">
           <div className="p-4 border-b border-drip-grey bg-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-drip-dark uppercase tracking-wider">DNA Breakdown</h3>
              <button className="text-xs text-drip-navy font-bold hover:underline flex items-center">
                 <SlidersHorizontal className="w-3 h-3 mr-1" /> Retake Quiz
              </button>
           </div>
           <div>
              {DNA_DATA.map((item, idx) => (
                 <div key={item.label} className={`p-4 flex items-center ${idx !== DNA_DATA.length - 1 ? 'border-b border-drip-grey' : ''}`}>
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="ml-3 text-sm font-semibold text-drip-dark flex-grow">{item.label}</span>
                    <span className="text-sm font-bold text-drip-muted">{item.value}%</span>
                 </div>
              ))}
           </div>
        </div>

        <button className="w-full bg-drip-navy text-white py-4 rounded-drip-btn font-semibold tracking-widest uppercase hover:bg-opacity-90 transition-opacity">
           Shop My DNA Matches
        </button>

      </div>
    </main>
  );
}
