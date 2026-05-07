'use client';

import { useState } from 'react';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');

  return (
    <main className="min-h-screen bg-drip-white flex flex-col justify-center relative">
      <header className="absolute top-0 w-full h-14 z-40 flex items-center px-4">
        <Link href="/" className="p-2 -ml-2 text-drip-dark hover:text-drip-coral transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
        <Link href="/" className="absolute right-4 text-sm font-semibold text-drip-muted uppercase tracking-widest cursor-pointer hover:text-drip-dark transition-colors">Skip (Guest)</Link>
      </header>

      <div className="hero-container !px-6 md:max-w-md mx-auto w-full pt-14 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-medium text-drip-dark tracking-wide">DRIP</h1>
          <p className="text-sm font-medium text-drip-muted uppercase tracking-widest mt-2">Wear Your World</p>
        </div>

        {step === 'PHONE' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-display text-drip-dark mb-4">Welcome Back</h2>
            <div>
              <label className="block text-xs font-semibold text-drip-muted uppercase tracking-wider mb-2">Mobile Number</label>
              <div className="flex bg-white rounded-drip-input border border-drip-grey overflow-hidden focus-within:border-drip-navy transition-colors">
                <span className="flex items-center justify-center px-4 font-semibold text-drip-dark border-r border-drip-grey bg-gray-50">+91</span>
                <input 
                  type="tel" 
                  maxLength={10}
                  placeholder="Enter your 10-digit number"
                  className="w-full px-4 py-4 text-base focus:outline-none"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={() => setStep('OTP')}
              disabled={phone.length < 10}
              className={`w-full py-4 rounded-drip-btn font-semibold tracking-widest uppercase flex justify-center items-center transition-opacity ${phone.length === 10 ? 'bg-drip-navy text-white hover:bg-opacity-90' : 'bg-drip-grey text-drip-muted cursor-not-allowed'}`}
            >
              Get OTP <ArrowRight className="w-4 h-4 ml-2" />
            </button>

            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-drip-grey"></div>
              <span className="shrink-0 px-4 text-xs font-semibold text-drip-muted uppercase tracking-wider">Or continue with</span>
              <div className="flex-grow border-t border-drip-grey"></div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-white border border-drip-grey text-drip-dark py-4 rounded-drip-btn font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center">
                <span className="mr-3">🍎</span> Continue with Apple
              </button>
              <button className="w-full bg-white border border-drip-grey text-drip-dark py-4 rounded-drip-btn font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center">
                <span className="mr-3">🇬</span> Continue with Google
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-display text-drip-dark mb-2">Verify OTP</h2>
            <p className="text-sm text-drip-muted mb-6">Enter the 4-digit code sent to +91 {phone} <button onClick={() => setStep('PHONE')} className="text-drip-coral underline ml-1">Edit</button></p>
            
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(idx => (
                <input 
                  key={idx}
                  type="text" 
                  maxLength={1}
                  className="w-full h-14 text-center text-xl font-bold bg-white rounded-drip-input border border-drip-grey focus:outline-none focus:border-drip-navy"
                />
              ))}
            </div>

            <button onClick={() => router.push('/')} className="w-full bg-drip-navy text-white py-4 rounded-drip-btn font-semibold tracking-widest uppercase mt-4 hover:bg-opacity-90 transition-opacity">
              Verify & Login
            </button>
            <p className="text-center text-sm font-semibold text-drip-muted underline mt-4 cursor-pointer hover:text-drip-dark">Resend OTP</p>
          </div>
        )}
      </div>

      <p className="absolute bottom-6 w-full text-center text-[10px] text-drip-muted uppercase tracking-wider">By continuing, you agree to our Terms & Privacy Policy.</p>
    </main>
  );
}
