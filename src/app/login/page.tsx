'use client';

import { useState } from 'react';
import { ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Login() {
  const router = useRouter();
  const supabase = createClient();
  
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP from Supabase
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        }
      });
      if (error) throw error;
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = otp.join('');
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });
      
      if (error) throw error;
      
      router.push('/');
      router.refresh(); // Refresh layout to grab new session
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

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

        {step === 'EMAIL' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-display text-drip-dark mb-4">Welcome Back</h2>
            <div>
              <label className="block text-xs font-semibold text-drip-muted uppercase tracking-wider mb-2">Email Address</label>
              <div className="flex bg-white rounded-drip-input border border-drip-grey overflow-hidden focus-within:border-drip-navy transition-colors">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-4 py-4 text-base focus:outline-none"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <button 
              onClick={handleSendOtp}
              disabled={!email.includes('@') || isLoading}
              className={`w-full py-4 rounded-drip-btn font-semibold tracking-widest uppercase flex justify-center items-center transition-opacity ${email.includes('@') ? 'bg-drip-navy text-white hover:bg-opacity-90' : 'bg-drip-grey text-drip-muted cursor-not-allowed'}`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get OTP <ArrowRight className="w-4 h-4 ml-2" /></>}
            </button>

            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-drip-grey"></div>
              <span className="shrink-0 px-4 text-xs font-semibold text-drip-muted uppercase tracking-wider">Or continue securely</span>
              <div className="flex-grow border-t border-drip-grey"></div>
            </div>

            <p className="text-center text-xs text-drip-muted">
              By using Email authentication, we secure your Style DNA and Cart directly to your secure Supabase Vault.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-display text-drip-dark mb-2">Verify OTP</h2>
            <p className="text-sm text-drip-muted mb-6">Enter the 6-digit code sent to {email} <button onClick={() => setStep('EMAIL')} className="text-drip-coral underline ml-1">Edit</button></p>
            
            <div className="grid grid-cols-6 gap-2">
              {otp.map((digit, idx) => (
                <input 
                  key={idx}
                  id={`otp-${idx}`}
                  type="text" 
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-full h-12 text-center text-lg font-bold bg-white rounded-xl border border-drip-grey focus:outline-none focus:border-drip-navy"
                />
              ))}
            </div>

            {error && <p className="text-xs text-red-500 font-medium text-center">{error}</p>}

            <button 
              onClick={handleVerifyOtp}
              disabled={otp.join('').length < 6 || isLoading}
              className="w-full bg-drip-navy text-white py-4 rounded-drip-btn font-semibold tracking-widest uppercase mt-4 hover:bg-opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
            </button>
            <p onClick={handleSendOtp} className="text-center text-sm font-semibold text-drip-muted underline mt-4 cursor-pointer hover:text-drip-dark">Resend OTP</p>
          </div>
        )}
      </div>

      <p className="absolute bottom-6 w-full text-center text-[10px] text-drip-muted uppercase tracking-wider">By continuing, you agree to our Terms & Privacy Policy.</p>
    </main>
  );
}

