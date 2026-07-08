'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, RefreshCw, Box, ScanLine, X, ChevronLeft, SlidersHorizontal, CheckCircle2, User, Upload, Loader2, Sparkles, ShoppingBag } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/cart';

const BASE_MODELS = [
  {
    id: 'male',
    name: 'Male Model (Alex)',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'female',
    name: 'Female Model (Sophia)',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop'
  }
];

export default function AvatarStudio() {
  const [step, setStep] = useState<'INTRO' | 'SCANNING' | 'STUDIO'>('INTRO');
  const [progress, setProgress] = useState(0);
  
  // Custom Studio States
  const [baseImage, setBaseImage] = useState<string>(BASE_MODELS[0].img);
  const [fittedResult, setFittedResult] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<any>(null);
  const [fittingStatus, setFittingStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [fitError, setFitError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'mens' | 'womens' | 'accessories'>('all');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCartStore();
  const [cartAdded, setCartAdded] = useState(false);

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
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Handle local selfie upload as base model
  const handleBaseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
      setBaseImage(base64);
      setFittedResult(null);
      setActiveProduct(null);
      setStep('STUDIO'); // Jump straight into Studio with the custom photo
    } catch (err) {
      console.error('Base image processing failed:', err);
    }
  };

  // Run Real VTON draping process
  const triggerFitting = async (product: any) => {
    setActiveProduct(product);
    setFittingStatus('processing');
    setFitError(null);

    try {
      const res = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelImage: baseImage,
          garmentImage: product.image,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to drape garment');
      }

      setFittedResult(data.resultUrl);
      setFittingStatus('done');
    } catch (err: any) {
      console.error(err);
      setFitError(err.message || 'GPU allocation timeout. Please try again.');
      setFittingStatus('error');
    }
  };

  const handleAddToBag = () => {
    if (!activeProduct) return;
    addItem({
      id: `studio-${Date.now()}`,
      brand: activeProduct.brand,
      name: activeProduct.name,
      price: parseInt(activeProduct.price.replace(/[^\d]/g, ''), 10) || 5999,
      size: 'UK 9',
      color: 'Default',
      qty: 1,
      image: fittedResult || activeProduct.image,
      inStock: true
    });
    setCartAdded(true);
    setTimeout(() => {
      setCartAdded(false);
    }, 3000);
  };

  // Filter products matching category
  const filteredProducts = PRODUCTS.filter(p => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  return (
    <main className="min-h-screen bg-drip-navy text-white overflow-hidden relative">
      {/* Header */}
      <header className="absolute top-0 w-full z-40 p-4 pt-[safe-top] flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <Link href="/" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft className="w-6 h-6 text-white" /></Link>
        <span className="text-sm font-bold tracking-widest uppercase text-white/80">3D Trial Studio v2.0</span>
        <button className="p-2 -mr-2" onClick={() => fileInputRef.current?.click()} title="Upload custom photo"><Upload className="w-5 h-5 text-white" /></button>
      </header>

      {step === 'INTRO' && (
        <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20">
              <ScanLine className="w-10 h-10 text-drip-coral animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display leading-tight mb-4">Create Your <br/>Digital Double.</h1>
            <p className="text-white/60 text-sm max-w-sm mb-8 leading-relaxed">
              Using advanced spatial mapping, DRIP AI generates a centimeter-accurate 3D avatar. Try on clothes exactly how they would fit in real life.
            </p>

            {/* Photo Selection Flow */}
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
               <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-white">Choose Model Base</h3>
               
               <div className="grid grid-cols-2 gap-4">
                 {BASE_MODELS.map(m => (
                   <button
                     key={m.id}
                     onClick={() => {
                       setBaseImage(m.img);
                       setStep('SCANNING');
                     }}
                     className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 hover:border-drip-coral transition-colors bg-white/5 flex flex-col items-center justify-end p-3 text-center"
                   >
                     <Image src={m.img} alt={m.name} fill className="object-cover opacity-60 hover:opacity-100 transition-opacity" />
                     <span className="relative z-10 text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 px-2 py-1 rounded w-full">{m.name.split(' ')[0]}</span>
                   </button>
                 ))}
               </div>
            </div>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-md bg-white text-drip-navy py-4 rounded-drip-btn font-bold tracking-widest uppercase hover:bg-gray-100 transition-colors flex justify-center items-center shadow-lg mb-4"
            >
              <Camera className="w-5 h-5 mr-3" />
              Upload Your Own Photo
            </button>
            
            <div className="max-w-xs text-[9px] text-white/40 uppercase tracking-wider leading-relaxed">
               <p>PRIVACY GUARANTEED. Photos are securely processed on-the-fly and immediately deleted. We do not store your images.</p>
            </div>
        </div>
      )}

      {step === 'SCANNING' && (
        <div className="h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #E94560 0%, transparent 50%)', backgroundSize: '200% 200%', backgroundPosition: 'center', animation: 'pulse 3s infinite' }}></div>
          
          <div className="relative w-48 h-64 mb-12">
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
        <div className="h-screen flex flex-col md:flex-row relative pt-16">
          
          {/* Main 3D Canvas Area */}
          <div className="flex-1 bg-gradient-to-b from-[#0A0B10] to-[#121420] relative flex items-center justify-center w-full h-[calc(100vh-220px)] md:h-full">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            {/* The Avatar Display */}
            <div className="w-[85%] md:w-[75%] h-[80%] max-h-[580px] aspect-[3/4] border border-white/10 bg-white/5 rounded-3xl relative shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-sm overflow-hidden flex items-center justify-center">
              
               <Image 
                 src={fittedResult && fittingStatus === 'done' ? fittedResult : baseImage} 
                 alt="Fitting room model" 
                 fill 
                 className="object-cover" 
               />

               {/* Fitting Room Loader */}
               {fittingStatus === 'processing' && (
                 <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-30">
                   <Loader2 className="w-8 h-8 text-drip-coral animate-spin mb-4" />
                   <h4 className="text-sm font-bold uppercase tracking-widest text-white">Draping Outfit...</h4>
                   <p className="text-[10px] text-white/50 font-mono mt-1">GPU server processing canvas</p>
                 </div>
               )}

               {/* Fit Confidence Badge */}
               {fittingStatus === 'done' && (
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-drip-green/90 backdrop-blur-md px-4 py-2 rounded-full border border-green-400 flex items-center shadow-[0_0_20px_rgba(0,255,0,0.2)] z-10 animate-fade-in-up">
                    <CheckCircle2 className="w-4 h-4 text-white mr-2" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">98% Fit Match (Size M)</span>
                 </div>
               )}

               {/* Change Base Button overlay */}
               <div className="absolute bottom-6 right-6 z-10 flex space-x-2">
                 <button 
                   onClick={() => setStep('INTRO')}
                   className="bg-black/60 backdrop-blur border border-white/10 p-2.5 rounded-full hover:bg-white/10 transition-colors"
                   title="Switch base model"
                 >
                   <User className="w-4 h-4 text-white" />
                 </button>
               </div>
            </div>

            {/* Actions for fitted items */}
            {fittingStatus === 'done' && activeProduct && (
              <div className="absolute bottom-8 left-8 right-8 md:left-1/2 md:right-auto md:-translate-x-1/2 z-20 max-w-sm w-full bg-black/85 backdrop-blur border border-white/10 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
                <div>
                  <h4 className="text-xs font-bold text-white/60 uppercase">{activeProduct.brand}</h4>
                  <p className="text-xs font-black truncate max-w-[150px]">{activeProduct.name}</p>
                </div>
                <button 
                  onClick={handleAddToBag}
                  className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center ${
                    cartAdded ? 'bg-drip-green text-white' : 'bg-white text-black hover:bg-drip-coral hover:text-white'
                  }`}
                >
                  {cartAdded ? 'Added!' : 'Add to Bag'}
                </button>
              </div>
            )}
          </div>

          {/* Wardrobe Selection Sidebar */}
          <div className="w-full h-[220px] md:w-80 md:h-full bg-black/90 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 z-20 flex flex-col">
            <div className="hidden md:flex p-4 border-b border-white/10 justify-between items-center">
               <h3 className="text-sm font-bold tracking-widest uppercase text-white/80 flex items-center"><Sparkles className="w-4 h-4 mr-2 text-drip-coral" />Wardrobe</h3>
               <span className="text-[10px] text-white/40">{filteredProducts.length} Items</span>
            </div>
            
            {/* Category tabs */}
            <div className="flex border-b border-white/10 text-[9px] font-bold uppercase tracking-widest overflow-x-auto hide-scrollbar shrink-0">
              {['all', 'mens', 'womens', 'accessories'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat as any)}
                  className={`flex-1 py-3 px-4 text-center border-b-2 whitespace-nowrap transition-all ${
                    filterCategory === cat ? 'border-drip-coral text-white' : 'border-transparent text-white/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Interactive Grid */}
            <div className="flex-1 overflow-x-auto md:overflow-y-auto p-4 flex md:grid md:grid-cols-2 md:gap-4 md:space-y-0 gap-4 hide-scrollbar items-center md:items-start">
               {filteredProducts.map((prod) => (
                  <div 
                    key={prod.id} 
                    onClick={() => triggerFitting(prod)}
                    className={`w-20 h-20 md:w-full md:h-28 bg-white/5 border ${
                      activeProduct?.id === prod.id ? 'border-drip-coral ring-1 ring-drip-coral' : 'border-white/10'
                    } rounded-xl p-2 cursor-pointer hover:bg-white/10 transition-all flex-shrink-0 flex items-center justify-center relative overflow-hidden group`}
                  >
                     <Image src={prod.image} alt={prod.name} fill className="object-cover mix-blend-screen opacity-80 group-hover:scale-105 transition-transform" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-[8px] font-black uppercase tracking-wider text-white">Drape</span>
                     </div>
                  </div>
               ))}
            </div>
          </div>

        </div>
      )}

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleBaseUpload} 
        accept="image/*" 
        className="hidden" 
      />
    </main>
  );
}
