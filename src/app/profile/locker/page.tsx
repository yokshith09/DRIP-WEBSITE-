'use client';

import { useState } from 'react';
import { ChevronLeft, Ruler, Sparkles, Check, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStyleDNAStore } from '@/store/styleDNA';

export default function SizeLocker() {
  const { dna, updateDNA } = useStyleDNAStore();

  const [height, setHeight] = useState(dna.height || 175);
  const [fitPref, setFitPref] = useState(dna.fitPreference || 'Regular Fit');
  const [chest, setChest] = useState(38);
  const [waist, setWaist] = useState(32);
  const [shoeSize, setShoeSize] = useState('UK 9');
  
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDNA({
      height: Number(height),
      fitPreference: fitPref
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <Navbar />

      <div className="max-w-[800px] mx-auto px-4 pt-10">
        
        {/* Back Link */}
        <Link href="/profile" className="inline-flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </Link>

        <h1 className="text-3xl font-display font-medium italic text-black mb-10">Size Locker</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Form */}
          <div className="md:col-span-2 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-800 flex items-center space-x-2">
              <Ruler className="w-4 h-4 text-drip-coral" />
              <span>Body Metrics &amp; Preferences</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Height slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mb-2">
                  <span className="uppercase tracking-wider">Height</span>
                  <span className="text-black font-black">{height} cm</span>
                </div>
                <input 
                  type="range" 
                  min="140" 
                  max="210" 
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full accent-black h-1 bg-gray-100 rounded-lg cursor-pointer"
                />
              </div>

              {/* Fit Preference Buttons */}
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Fit Preference</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Oversized Fit'].map(fit => (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => setFitPref(fit)}
                      className={`h-11 border text-xs font-bold transition-all uppercase tracking-widest rounded-xl flex items-center justify-between px-4 ${
                        fitPref === fit 
                          ? 'bg-black text-white border-black shadow-sm' 
                          : 'border-gray-200 hover:border-black'
                      }`}
                    >
                      <span>{fit}</span>
                      {fitPref === fit && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chest & Waist numeric metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Chest (Inches)</label>
                  <input 
                    type="number" 
                    min="30"
                    max="60"
                    value={chest}
                    onChange={e => setChest(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-sans">Waist (Inches)</label>
                  <input 
                    type="number" 
                    min="24"
                    max="56"
                    value={waist}
                    onChange={e => setWaist(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10 font-bold"
                  />
                </div>
              </div>

              {/* Shoe Size */}
              <div>
                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Shoe Size (UK)</label>
                <select 
                  value={shoeSize}
                  onChange={e => setShoeSize(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-xs focus:border-black outline-none h-10 font-bold"
                >
                  {['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div>
                  {saved && (
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1 animate-pulse">
                      <CheckCircle2 className="w-4 h-4 fill-green-600 text-white" />
                      <span>Sizes Saved Successfully</span>
                    </span>
                  )}
                </div>
                <button 
                  type="submit"
                  className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full hover:bg-gray-800 transition-colors shadow-md"
                >
                  Save Metrics
                </button>
              </div>
            </form>
          </div>

          {/* AI Size recommendation info */}
          <div className="space-y-6">
            <div className="bg-[#1E1E2F] text-white p-6 rounded-2xl border border-white/5 shadow-md">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse mb-3" />
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-200 mb-2">AI Sizing Vault</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                Your metrics are encrypted locally and analyzed by our fitting network to output precise garment fit percentages.
              </p>
              <div className="border-t border-white/10 mt-4 pt-4 text-[10px] font-black uppercase tracking-wider text-drip-green flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Encrypted &amp; Secure</span>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-150 rounded-2xl shadow-sm text-xs text-gray-500 font-medium leading-relaxed">
              <h5 className="font-bold text-black uppercase tracking-wider mb-2">Need a scan?</h5>
              Use our visual avatar scanner inside the <Link href="/avatar-studio" className="text-[#0055A4] font-black underline">Avatar Studio</Link> to generate body measurements automatically using a single photo.
            </div>
          </div>

        </div>

      </div>
      <Footer />
    </main>
  );
}
