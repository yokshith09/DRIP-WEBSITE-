'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, Sparkles, SlidersHorizontal, Share2, ArrowRight, UserCheck, ShieldAlert, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useStyleDNAStore } from '@/store/styleDNA';
import { getTopMatches } from '@/lib/productMatcher';
import { PRODUCTS } from '@/data/products';
import dynamic from 'next/dynamic';

const StyleDNAOnboarding = dynamic(() => import('@/components/StyleDNAOnboarding'), { 
  ssr: false,
  loading: () => (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-2 border-drip-navy/20 rounded-full animate-ping mb-4"></div>
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading DNA Scanner...</span>
    </div>
  )
});

export default function StyleDNAPage() {
  const { dna, resetDNA } = useStyleDNAStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-drip-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-drip-navy/20 border-t-drip-navy rounded-full animate-spin mb-4"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Blueprint...</span>
        </div>
      </main>
    );
  }

  // If onboarding is not completed, display the scanning wizard
  if (!dna.completedOnboarding) {
    return (
      <main className="min-h-screen bg-drip-white pb-20 pt-10 px-4 flex flex-col justify-center">
        {/* Header */}
        <header className="fixed top-0 w-full h-14 bg-white/95 backdrop-blur-md z-40 flex items-center justify-between px-4 border-b border-gray-100 shadow-sm">
          <Link href="/profile" className="p-2 -ml-2 text-gray-700 hover:text-drip-coral transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center space-x-2 text-gray-900">
            <Sparkles className="w-5 h-5 text-drip-coral animate-pulse" />
            <h1 className="text-sm font-black uppercase tracking-widest">DRIP DNA Scanner</h1>
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </header>

        <div className="pt-10">
          <StyleDNAOnboarding />
        </div>
      </main>
    );
  }

  // If completed onboarding, display their styling results
  const topMatches = getTopMatches(PRODUCTS, dna, 4);

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-32 overflow-x-hidden font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full h-14 bg-white/95 backdrop-blur-md z-40 flex items-center justify-between px-4 border-b border-gray-100 shadow-sm">
        <Link href="/profile" className="p-2 -ml-2 text-gray-700 hover:text-drip-coral transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center space-x-2 text-gray-900">
          <Sparkles className="w-5 h-5 text-drip-coral fill-drip-coral animate-pulse" />
          <h1 className="text-sm font-black uppercase tracking-widest">Style DNA Blueprint</h1>
        </div>
        <button 
          onClick={() => {
            if (typeof navigator !== 'undefined') {
              navigator.clipboard.writeText(window.location.href);
              alert('Style DNA Link copied to clipboard!');
            }
          }}
          className="p-2 -mr-2 text-gray-600 hover:text-black transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-20 space-y-6">
        
        {/* Editorial Splash */}
        <div className="text-center py-4">
           <h2 className="text-3xl font-display font-bold text-gray-900 leading-tight">Your Personal <br/>Fashion Blueprint</h2>
           <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">
             Calculated via on-device machine learning scans. Proportions and palettes are locked.
           </p>
        </div>

        {/* Dynamic Premium DNA Profile Card */}
        <div className="bg-gradient-to-br from-[#1E1E2F] to-[#0F0F1A] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-drip-green opacity-10 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-drip-green" />
              <span className="text-[10px] text-gray-300 uppercase tracking-widest font-black">AI Verified Blueprint</span>
            </div>
            <button 
              onClick={resetDNA}
              className="text-[10px] text-drip-green hover:underline font-bold uppercase tracking-wider flex items-center space-x-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Rescan Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
            <div className="space-y-1">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold block">Silhouette Type</span>
              <span className="text-base font-bold capitalize text-drip-green">{dna.bodyShape} Shape</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold block">Skin Undertone</span>
              <span className="text-base font-bold capitalize text-drip-coral flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: dna.skinTone }}></span>
                <span>{dna.skinToneCategory}</span>
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold block">Style Vibe</span>
              <span className="text-base font-bold capitalize text-white">{dna.styleVibe}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold block">User Height</span>
              <span className="text-base font-bold text-white">{dna.height} cm</span>
            </div>
          </div>

          <div className="border-t border-white/10 mt-6 pt-4 text-[11px] text-gray-300 leading-relaxed">
            <span className="font-bold text-drip-green uppercase tracking-widest block mb-1">Stylist Recommendation:</span>
            Favor products tailored for a <span className="text-white font-bold">{dna.bodyShape}</span> silhouette. Reframe outfits around the <span className="text-white font-bold">{dna.styleVibe}</span> aesthetic, selecting items in our dynamic skin tone recommendation colors.
          </div>
        </div>

        {/* Color Palette Display */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-drip-green" />
            <span>Recommended Color Seasons</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Best Matches</span>
              <div className="flex flex-wrap gap-1.5">
                {dna.colorPalette?.map(color => (
                  <span key={color} className="px-2 py-1 bg-drip-green/10 text-drip-green border border-drip-green/20 text-[10px] font-bold rounded-lg capitalize">
                    {color}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Colors to Avoid</span>
              <div className="flex flex-wrap gap-1.5">
                {dna.avoidColors?.map(color => (
                  <span key={color} className="px-2 py-1 bg-red-50 text-red-500 border border-red-100 text-[10px] font-bold rounded-lg capitalize">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Curated Catalog Row based on Style DNA matches */}
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-800">
              Personalized DNA Fits
            </h3>
            <Link 
              href="/shopper-ai" 
              className="text-[10px] font-black uppercase tracking-wider text-drip-navy hover:text-black flex items-center space-x-1"
            >
              <span>Consult Stylist</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar space-x-4 pb-2 px-1">
            {topMatches.map(product => (
              <Link 
                href={`/product/${product.id}`} 
                key={product.id} 
                className="w-[160px] bg-white border border-gray-150 rounded-2xl p-2.5 shrink-0 shadow-xs cursor-pointer hover:shadow-md hover:border-gray-200 transition-all group"
              >
                <div className="w-full h-32 bg-gray-50 rounded-xl relative overflow-hidden mb-2">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-1.5 left-1.5 bg-drip-green text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    {product.matchScore}% Match
                  </div>
                </div>
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{product.brand}</div>
                <div className="text-xs font-bold text-gray-800 truncate mb-0.5">{product.name}</div>
                <div className="text-xs font-black text-black">{product.price}</div>
              </Link>
            ))}
          </div>
        </div>

        <Link 
          href="/shopper-ai"
          className="w-full bg-drip-navy hover:bg-black text-white text-center py-4 rounded-2xl font-bold tracking-widest uppercase text-xs block transition-all shadow-md mt-4"
        >
          Consult AI Stylist on these matches
        </Link>

      </div>
    </main>
  );
}
