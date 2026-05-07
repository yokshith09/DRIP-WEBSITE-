'use client';

import { useState } from 'react';
import { X, Sparkles, MoveRight, Camera, Mail } from 'lucide-react';
import Image from 'next/image';

interface AIFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  productImage: string;
}

export default function AIFittingRoomModal({ isOpen, onClose, productImage }: AIFitModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[800px] h-[85vh] md:h-[600px] bg-white rounded-2xl z-50 overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left visually rich side */}
        <div className="relative w-full md:w-1/2 h-48 md:h-full bg-drip-navy flex items-center justify-center overflow-hidden shrink-0 block">
          {/* Mock split screen effect */}
          <div className="absolute inset-0 flex">
             <div className="w-1/2 h-full bg-gray-200 relative opacity-40">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <Camera className="w-8 h-8 text-drip-navy mb-2" />
                </div>
             </div>
             <div className="w-1/2 h-full relative">
                <Image src={productImage} alt="try on result" fill className="object-cover opacity-80 mix-blend-screen mix-blend-luminosity mix-blend-multiply" />
             </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-drip-navy via-drip-navy/60 to-transparent flex flex-col justify-end p-8">
            <h3 className="text-3xl font-display text-white mb-2 leading-tight">See It On You <br/>Before You Buy.</h3>
            <p className="text-drip-grey text-sm">Upload a photo. Our AI drapes the garment perfectly. No more guessing your size or fit.</p>
          </div>
        </div>

        {/* Right content side */}
        <div className="flex-1 overflow-y-auto p-8 relative flex flex-col">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-drip-muted hover:text-drip-dark transition-colors bg-gray-50 rounded-full">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 mb-6 mt-4">
             <Sparkles className="w-6 h-6 text-drip-coral" />
             <span className="text-sm font-bold tracking-widest uppercase text-drip-coral">AI Fitting Room</span>
          </div>

          <h2 className="text-3xl font-display text-drip-dark mb-4">Coming Soon</h2>
          <p className="text-drip-muted text-sm mb-8 leading-relaxed">
            We are building the most advanced Virtual Try-On experience in fashion. Soon, you'll be able to create a persistent 3D avatar from a single photo and try on thousands of styles instantly.
          </p>

          {!submitted ? (
            <div className="mt-auto">
              <h4 className="text-sm font-semibold text-drip-dark mb-4 uppercase tracking-wider">Join The Exclusive Waitlist</h4>
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-drip-muted" />
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-drip-input border border-drip-grey focus:outline-none focus:border-drip-navy text-drip-dark"
                  />
                </div>
                <button type="submit" className="w-full bg-drip-navy text-white py-4 rounded-drip-btn font-semibold tracking-widest uppercase hover:bg-opacity-90 transition-opacity flex justify-center items-center">
                  Get Early Access <MoveRight className="w-4 h-4 ml-2" />
                </button>
              </form>
            </div>
          ) : (
             <div className="mt-auto p-6 bg-green-50 rounded-xl border border-green-100 flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-drip-green text-white rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
               </div>
               <h4 className="text-xl font-display text-drip-dark mb-2">You're on the list!</h4>
               <p className="text-sm text-drip-muted">Keep an eye on <strong>{email}</strong>. We'll invite you to beta test the AI Fitting Room soon.</p>
             </div>
          )}

        </div>
      </div>
    </>
  );
}
