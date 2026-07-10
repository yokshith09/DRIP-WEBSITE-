'use client';

import { useState } from 'react';
import { ChevronLeft, ArrowRight, Loader2, Lock, Mail, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Login() {
  const router = useRouter();
  const supabase = createClient();
  
  // LOGIN WIZARD STEPS
  const [step, setStep] = useState<'CREDENTIALS' | 'OTP'>('CREDENTIALS');
  
  // FORM STATES
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const [isRegistering, setIsRegistering] = useState(false);
  
  // UI STATES
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. STANDARD PASSWORD LOGIN
  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError(null);
    
    // SECURITY: Artificial delay to mitigate timing attacks / simple brute forcing
    await new Promise(res => setTimeout(res, 800));

    try {
      if (isRegistering) {
        // Handle Signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        if (!data.session) {
           throw new Error("Registration succeeded, but Supabase blocked login because 'Confirm Email' is still turned ON in your Supabase Dashboard. Please turn it off.");
        }

        setSuccessMsg('Account created successfully! Logging you in...');
        
        // Auto sign in after registration
        await supabase.auth.signInWithPassword({ email, password });
        
        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get('redirect');
        
        if (redirectPath) {
          router.push(`/${redirectPath}`);
        } else {
          router.push('/');
        }
        router.refresh();
      } else {
        // Handle Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get('redirect');
        
        if (redirectPath) {
          router.push(`/${redirectPath}`);
        } else {
          router.push('/');
        }
        router.refresh();
      }
    } catch (err: any) {
      console.error('[AUTH ERROR]', err);
      if (isRegistering) {
        // Show real errors during registration so users know what to fix
        setError(err.message || 'Registration failed. Please try again.');
      } else {
        // SECURITY: Generic error message (OWASP Best Practice) for logins
        setError('Invalid login credentials or account does not exist.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. FALLBACK OTP LOGIN
  const handleSendOtp = async () => {
    if (!email) return;
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true }
      });
      if (error) throw error;
      setStep('OTP');
    } catch (err: any) {
      console.error('[OTP ERROR]', err);
      setError('Failed to process request. Please try again.');
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
      
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get('redirect');
      
      if (redirectPath) {
        router.push(`/${redirectPath}`);
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err: any) {
      setError('Invalid verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
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
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-medium text-drip-dark tracking-wide">DRIP</h1>
          <p className="text-[10px] font-bold text-drip-muted uppercase tracking-[0.3em] mt-2">Secure Authentication</p>
        </div>

        {step === 'CREDENTIALS' ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display text-drip-dark mb-1">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-gray-500">
                {isRegistering ? 'Register to access the Virtual Try-On and save styles.' : 'Sign in to access your secure Vault.'}
              </p>
            </div>

            <form onSubmit={handlePasswordAuth} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-drip-muted uppercase tracking-wider mb-2">Email Address</label>
                <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden focus-within:border-black transition-colors px-4 py-3.5 items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    className="w-full text-sm focus:outline-none"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-drip-muted uppercase tracking-wider mb-2">Password</label>
                <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden focus-within:border-black transition-colors px-4 py-3.5 items-center">
                  <Lock className="w-4 h-4 text-gray-400 mr-3" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full text-sm focus:outline-none"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-xs font-medium flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-xs font-medium">
                  {successMsg}
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold tracking-widest uppercase text-xs flex justify-center items-center transition-all bg-black text-white hover:bg-drip-coral shadow-md disabled:opacity-50 mt-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{isRegistering ? 'Register Securely' : 'Sign In Securely'} <ArrowRight className="w-3.5 h-3.5 ml-2" /></>}
              </button>
            </form>

            <div className="flex items-center justify-between text-xs font-semibold px-1">
              <button 
                type="button" 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-drip-muted hover:text-black transition-colors"
              >
                {isRegistering ? 'Already have an account?' : 'Need an account?'}
              </button>
              <button 
                type="button" 
                onClick={handleSendOtp}
                disabled={!email || isLoading}
                className={`transition-colors ${email ? 'text-drip-coral hover:text-black' : 'text-gray-300 cursor-not-allowed'}`}
              >
                Login via OTP
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-display text-drip-dark mb-2">Verify Security OTP</h2>
            <p className="text-sm text-drip-muted mb-6">Enter the 6-digit code sent to {email} <button onClick={() => setStep('CREDENTIALS')} className="text-drip-coral font-bold underline ml-1">Go Back</button></p>
            
            <div className="grid grid-cols-6 gap-2">
              {otp.map((digit, idx) => (
                <input 
                  key={idx}
                  id={`otp-${idx}`}
                  type="text" 
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-full h-12 text-center text-lg font-bold bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-black"
                />
              ))}
            </div>

            {error && <p className="text-xs text-red-500 font-medium text-center">{error}</p>}

            <button 
              onClick={handleVerifyOtp}
              disabled={otp.join('').length < 6 || isLoading}
              className="w-full bg-black text-white py-4 rounded-xl font-bold tracking-widest uppercase text-xs mt-4 hover:bg-drip-coral transition-all disabled:opacity-50 flex justify-center items-center shadow-md"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Login'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
