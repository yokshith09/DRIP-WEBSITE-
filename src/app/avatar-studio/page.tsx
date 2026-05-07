'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, RefreshCw, Box, ScanLine, X, ChevronLeft, SlidersHorizontal, CheckCircle2, User } from 'lucide-react';

export default function AvatarStudio() {
  const [step, setStep] = useState<'INTRO' | 'SCANNING' | 'STUDIO'>('INTRO');
  const [progress, setProgress] = useState(0);

  // Simulate scanning progress
  useEffect(() => {
    if (step === 'SCANNING') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('STUDIO'), 500);
            return 100;
          }
          return p + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <main className="min-h-screen bg-drip-navy text-white overflow-hidden relative">
      {/* Header */}
      <header className="absolute top-0 w-full z-40 p-4 pt-[safe-top] flex items-center justify-between">
        <Link href="/" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft className="w-6 h-6 text-white" /></Link>
        <span className="text-sm font-bold tracking-widest uppercase text-white/80">Avatar Engine Beta</span>
        <button className="p-2 -mr-2"><Box className="w-5 h-5 text-white" /></button>
      </header>

      {step === 'INTRO' && (
        <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
           <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20">
             <ScanLine className="w-10 h-10 text-drip-coral" />
           </div>
           <h1 className="text-4xl md:text-5xl font-display leading-tight mb-4">Create Your <br/>Digital Double.</h1>
           <p className="text-white/60 text-sm max-w-sm mb-8 leading-relaxed">
             Using advanced spatial mapping, DRIP AI generates a centimeter-accurate 3D avatar. Try on clothes exactly how they would fit in real life.
           </p>

           {/* 2-Photo Requirement Flow */}
           <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-white">Required Inputs</h3>
              
              <div className="flex items-center mb-4">
                 <div className="w-10 h-10 rounded-full bg-black/40 border border-white/20 flex flex-col items-center justify-center mr-4">
                    <User className="w-4 h-4 text-white/70" />
                 </div>
                 <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white">1. Front-Facing Selfie</h4>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">For facial mapping & skin tone</p>
                 </div>
              </div>

              <div className="flex items-center">
                 <div className="w-10 h-10 rounded-full bg-black/40 border border-white/20 flex flex-col items-center justify-center mr-4">
                    <Camera className="w-4 h-4 text-white/70" />
                 </div>
                 <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white">2. Full-Body Image</h4>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">In form-fitting clothes</p>
                 </div>
              </div>
           </div>

           <button 
             onClick={() => setStep('SCANNING')}
             className="w-full max-w-md bg-white text-drip-navy py-4 rounded-drip-btn font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors flex justify-center items-center shadow-lg mb-4"
           >
             <Camera className="w-5 h-5 mr-3" />
             Start Camera Flow
           </button>
           
           <div className="max-w-xs text-[9px] text-white/40 uppercase tracking-wider leading-relaxed">
              <p>PRIVACY GUARANTEED. Photos are securely processed on-the-fly and immediately deleted. We do not store your images.</p>
           </div>
        </div>
      )}

      {step === 'SCANNING' && (
        <div className="h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          {/* Neural Network mapping visual effect */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #E94560 0%, transparent 50%)', backgroundSize: '200% 200%', backgroundPosition: 'center', animation: 'pulse 3s infinite' }}></div>
          
          <div className="relative w-48 h-64 mb-12">
             {/* Mock body wireframe */}
             <div className="absolute inset-0 border-2 border-drip-coral/30 rounded-3xl z-0"></div>
             <div className="absolute bottom-0 w-full bg-drip-coral/20 backdrop-blur-sm z-10 transition-all duration-300 rounded-b-3xl" style={{ height: `${progress}%` }}>
                <div className="absolute top-0 w-full h-[1px] bg-drip-coral shadow-[0_0_15px_#E94560]"></div>
             </div>
             
             {/* Floating UI Elements */}
             <div className="absolute top-1/4 -right-20 bg-black/50 border border-white/10 backdrop-blur text-[10px] px-2 py-1 rounded-sm text-white/80 font-mono">
               Extracting topology...
             </div>
             <div className="absolute bottom-1/4 -left-16 bg-black/50 border border-white/10 backdrop-blur text-[10px] px-2 py-1 rounded-sm text-white/80 font-mono">
               Matching skeleton...
             </div>
          </div>

          <h2 className="text-xl font-display mb-2">Generating Avatar</h2>
          <p className="text-white/50 text-xs font-mono mb-8">Processing neural mesh ({progress}%)</p>

          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-drip-coral transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {step === 'STUDIO' && (
        <div className="h-screen flex flex-col md:flex-row relative">
          
          {/* Main 3D Canvas Area (Mock) */}
          <div className="flex-1 bg-gradient-to-b from-[#111] to-[#222] relative flex items-center justify-center w-full h-full">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            {/* The Avatar Mock - represented by a silhouette or mannequin for now */}
            <div className="w-56 h-[70vh] max-h-[600px] border border-white/5 bg-white/5 rounded-[3rem] relative shadow-[0_0_50px_rgba(255,255,255,0.05)] backdrop-blur-sm flex items-center justify-center group">
               {/* Stand point */}
               <div className="absolute bottom-[-20px] w-32 h-4 bg-white/20 rounded-full blur-md"></div>
               
               {/* Try On Visual */}
               <div className="relative w-full h-full">
                 <Image src="/images/jacket.png" alt="3D try on" fill className="object-cover mix-blend-screen opacity-90 drop-shadow-2xl z-20" />
                 {/* Mannequin underlay */}
                 <div className="absolute inset-4 bg-white/5 rounded-[2rem] z-10 filter blur-[2px]"></div>
               </div>

               {/* Interaction hints */}
               <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col space-y-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="bg-black/80 backdrop-blur text-white p-2 rounded-full border border-white/20"><RefreshCw className="w-4 h-4" /></div>
               </div>
            </div>

            {/* Studio Tools overlay */}
            <div className="absolute top-20 right-4 flex flex-col space-y-3 z-10">
               <button className="bg-black/60 backdrop-blur border border-white/10 p-3 rounded-full hover:bg-white/10 transition-colors"><Box className="w-5 h-5 text-white" /></button>
               <button className="bg-black/60 backdrop-blur border border-white/10 p-3 rounded-full hover:bg-white/10 transition-colors"><SlidersHorizontal className="w-5 h-5 text-white" /></button>
            </div>
            
            {/* Fit Confidence Badge */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-drip-green/90 backdrop-blur-md px-4 py-2 rounded-full border border-green-400 flex items-center shadow-[0_0_20px_rgba(0,255,0,0.2)] z-10">
               <CheckCircle2 className="w-4 h-4 text-white mr-2" />
               <span className="text-xs font-bold uppercase tracking-wider text-white">98% Fit Match (Size M)</span>
            </div>
          </div>

          {/* Wardrobe Selection Bottom Sheet (Mobile) / Sidebar (Desktop) */}
          <div className="absolute bottom-0 w-full h-28 bg-black/90 backdrop-blur-xl border-t border-white/10 z-20 md:relative md:w-80 md:h-full md:border-l flex flex-col">
            <div className="hidden md:block p-4 border-b border-white/10">
               <h3 className="text-sm font-bold tracking-widest uppercase text-white/80">Your Wardrobe</h3>
            </div>
            <div className="flex-1 overflow-x-auto md:overflow-y-auto p-4 flex md:flex-col md:space-y-4 gap-4 md:gap-0 hide-scrollbar items-center md:items-stretch">
               
               {[1, 2, 3, 4].map((item) => (
                  <div key={item} className={`w-20 h-20 md:w-full md:h-auto bg-white/5 border ${item === 1 ? 'border-drip-coral' : 'border-white/10'} rounded-xl p-2 cursor-pointer hover:bg-white/10 transition-colors flex-shrink-0 flex items-center justify-center relative overflow-hidden group`}>
                     <Image src={item % 2 === 0 ? '/images/sneakers.png' : '/images/jacket.png'} alt="item" fill className="object-cover mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity" />
                     {item === 1 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-drip-coral rounded-full border border-black"></div>}
                  </div>
               ))}
               
            </div>
          </div>

        </div>
      )}
    </main>
  );
}
