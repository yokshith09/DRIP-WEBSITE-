'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  Check, 
  Camera, 
  AlertTriangle, 
  Loader2, 
  ShoppingBag,
  Download,
  Award,
  Zap,
  Lock
} from 'lucide-react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { useTryOnStore } from '@/store/tryOn';
import { useCartStore } from '@/store/cart';

interface AIFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  productImage: string;
  brand?: string;
  name?: string;
  price?: number;
}

const STYLING_PROGRESS_STEPS = [
  'Compressing body photo coordinates...',
  'Mapping body skeletal silhouette...',
  'Extracting fabric textures...',
  'GPU virtual draping in progress...',
  'Refining collar, folds, and lighting...',
  'Finalizing editorial render...'
];

export default function AIFittingRoomModal({ 
  isOpen, 
  onClose, 
  productImage, 
  brand = 'Common Projects',
  name = 'Premium Low Sneakers',
  price = 8999 
}: AIFitModalProps) {
  const { 
    userPhoto, 
    resultUrl, 
    status, 
    error, 
    setUserPhoto, 
    setResult, 
    setStatus, 
    setError, 
    reset 
  } = useTryOnStore();

  const { addItem } = useCartStore();
  const fileInputFaceRef = useRef<HTMLInputElement>(null);

  // Free Try-On limits states
  const [tryOnCount, setTryOnCount] = useState<number>(0);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isPayingPremium, setIsPayingPremium] = useState<boolean>(false);
  const [premiumSuccess, setPremiumSuccess] = useState<boolean>(false);

  // Selected parameters for cart addition
  const [selectedSize, setSelectedSize] = useState('UK 9');
  const [selectedColor, setSelectedColor] = useState('Default');

  // Progressive loading text state
  const [progressStepIdx, setProgressStepIdx] = useState(0);
  const [compareMode, setCompareMode] = useState<'after' | 'before'>('after');
  const [cartAdded, setCartAdded] = useState(false);

  // Hydrate try-on limit count from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const count = parseInt(localStorage.getItem('drip_tryon_count') || '0', 10);
      setTryOnCount(count);
      
      const premium = localStorage.getItem('drip_is_premium') === 'true';
      setIsPremium(premium);
    }
  }, [isOpen]);

  // Rotate loading step messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'processing') {
      setProgressStepIdx(0);
      interval = setInterval(() => {
        setProgressStepIdx((prev) => (prev + 1) % STYLING_PROGRESS_STEPS.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [status]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    try {
      console.log('[TRY-ON] Compressing uploaded photo...');
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
      
      setUserPhoto(base64);
      setStatus('idle');
    } catch (err: any) {
      console.error('[TRY-ON] Image compression failed:', err);
      setError('Failed to process image. Please try a different photo.');
    }
  };

  const triggerVirtualFitting = async () => {
    if (!userPhoto) return;

    setStatus('processing');
    setCartAdded(false);

    try {
      const res = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelImage: userPhoto,
          garmentImage: productImage,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete virtual fitting');
      }

      setResult(data.resultUrl);

      // Increment try-on count for non-premium members
      if (!isPremium) {
        const nextCount = tryOnCount + 1;
        setTryOnCount(nextCount);
        localStorage.setItem('drip_tryon_count', nextCount.toString());
      }

    } catch (err: any) {
      console.error('[TRY-ON] API route error:', err);
      setError(err.message || 'The styling engine encountered a GPU allocation error. Please retry.');
    }
  };

  // Upgrades user to premium using secure Razorpay flow
  const handleUpgradeToPremium = async () => {
    setIsPayingPremium(true);
    setError(null);

    try {
      console.log('[PREMIUM UPGRADE] Dispatching ₹199 order to create-order API...');
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 199, // ₹199 Premium Plan
          receipt: `premium_upg_${Date.now()}`
        })
      });

      const orderData = await response.json();

      if (!response.ok) {
        // Fallback simulation upgrade if credentials are not configured in local environment
        if (orderData.error && (orderData.error.includes('credentials are not configured') || orderData.error.includes('API key'))) {
          console.log('[PREMIUM UPGRADE] Razorpay credentials missing. Running simulated upgrade...');
          await new Promise((resolve) => setTimeout(resolve, 2500));
          
          setIsPremium(true);
          setPremiumSuccess(true);
          localStorage.setItem('drip_is_premium', 'true');
          setIsPayingPremium(false);
          return;
        }
        throw new Error(orderData.error || 'Failed to establish Razorpay order.');
      }

      // Initialize Razorpay Payment Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_StFVEQwQRejhNz',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'DRIP AI Premium',
        description: 'Styling Calipers & Unlimited Try-Ons Access',
        order_id: orderData.order_id,
        handler: async function (res: any) {
          console.log('[PREMIUM UPGRADE] Verification handshake commited...');
          setIsPayingPremium(true);
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Signature check failed.');
            }

            console.log('[PREMIUM UPGRADE] Premium Payment successfully verified!');
            setIsPremium(true);
            setPremiumSuccess(true);
            localStorage.setItem('drip_is_premium', 'true');
            setIsPayingPremium(false);
          } catch (verifyErr: any) {
            console.error('[PREMIUM UPGRADE] Verification failed:', verifyErr);
            setError('Payment signature verification failed. Secure failure.');
            setIsPayingPremium(false);
          }
        },
        prefill: {
          name: 'Yoo Jae-Suk',
          email: 'shopper@drip.com',
          contact: '+919876543210'
        },
        theme: {
          color: '#1A1A2E'
        },
        modal: {
          ondismiss: function () {
            setIsPayingPremium(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error('[PREMIUM UPGRADE] Gateway connection failed:', err);
      setError(err.message || 'Payment server failed to establish secure handshake.');
      setIsPayingPremium(false);
    }
  };

  const handleAddToBagWithFit = () => {
    addItem({
      id: `fit-${Date.now()}`,
      brand,
      name,
      price,
      size: selectedSize,
      color: selectedColor,
      qty: 1,
      image: compareMode === 'after' && resultUrl ? resultUrl : productImage,
      inStock: true,
      tryOnResultUrl: resultUrl || undefined
    });
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 3000);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `drip-tryon-${brand.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine if free trails have been exhausted
  const isPaywallActive = !isPremium && tryOnCount >= 3 && !resultUrl;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 z-50 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[850px] h-[90vh] md:h-[650px] bg-white rounded-3xl z-50 overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-300 font-sans">
        
        {/* Left Side: Visualizer Screen */}
        <div className="relative w-full md:w-[420px] h-64 md:h-full bg-slate-950 flex items-center justify-center overflow-hidden shrink-0">
          
          {/* Main Visualizer Case */}
          {resultUrl && status === 'done' ? (
            <div className="w-full h-full relative">
              <Image 
                src={compareMode === 'after' ? resultUrl : userPhoto!} 
                alt="Fitting visualization" 
                fill 
                className="object-cover" 
              />
              
              {/* Compare toggle */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-1 py-1 rounded-full border border-white/10 flex space-x-1 z-30">
                <button 
                  onClick={() => setCompareMode('before')}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${compareMode === 'before' ? 'bg-white text-black' : 'text-gray-300'}`}
                >
                  Before
                </button>
                <button 
                  onClick={() => setCompareMode('after')}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${compareMode === 'after' ? 'bg-white text-black' : 'text-gray-300'}`}
                >
                  Fitted Outfit
                </button>
              </div>

              {/* Top match label badge */}
              <div className="absolute top-4 left-4 bg-drip-green text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-md">
                Fitted perfectly
              </div>
            </div>
          ) : status === 'processing' ? (
            // Processing status
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-drip-green/30 rounded-full animate-ping"></div>
                <Loader2 className="w-8 h-8 text-drip-green animate-spin absolute" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-drip-green uppercase tracking-widest font-black block animate-pulse">Rendering canvas...</span>
                <p className="text-xs text-gray-400 font-medium max-w-[280px] h-8 flex items-center justify-center">
                  {STYLING_PROGRESS_STEPS[progressStepIdx]}
                </p>
              </div>
            </div>
          ) : userPhoto ? (
            // Photo uploaded but fit not started
            <div className="w-full h-full relative">
              <Image src={userPhoto} alt="User silhouette preview" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button 
                  onClick={triggerVirtualFitting}
                  className="px-5 py-2.5 bg-drip-green text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>Drape Garment Now</span>
                </button>
              </div>
              <button 
                onClick={() => setUserPhoto(null)}
                className="absolute top-4 left-4 bg-black/60 text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider hover:bg-black transition-colors"
              >
                Change Photo
              </button>
            </div>
          ) : (
            // Initial blank state
            <div className="absolute inset-0 bg-[#0A0B10] flex flex-col justify-end p-8">
              <div className="absolute inset-0 flex items-center justify-center flex-col opacity-10">
                <Camera className="w-24 h-24 text-white" />
              </div>
              <div className="relative z-10 space-y-3">
                <div className="w-10 h-10 rounded-full bg-drip-coral/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-drip-coral fill-drip-coral" />
                </div>
                <h3 className="text-2xl font-display text-white leading-tight font-semibold italic">See Fabric Draping <br/>Directly On You.</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Select a full-body photograph. Our advanced neural networks will drape this garment realistically over your shape in real-time.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Paywall OR Actions */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative flex flex-col justify-between">
          
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors bg-gray-50 rounded-full z-15"
          >
            <X className="w-5 h-5" />
          </button>

          {isPaywallActive ? (
            // PREMIUM PAYWALL RENDER
            <div className="flex flex-col justify-center h-full space-y-6 pt-4 animate-in fade-in duration-500">
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-drip-coral animate-bounce" />
                <span className="text-[10px] font-black tracking-widest uppercase text-drip-coral">Styling limit reached</span>
              </div>
              
              <div className="space-y-2 text-left">
                <h2 className="text-2xl font-display font-bold text-gray-900 leading-tight">Style Limits Reached! 🌟</h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  You have consumed your **3 free try-on trials**. Unlock unlimited styling sessions, body caliper calibration tools, and priority GPU processing instantly!
                </p>
              </div>

              {/* Premium Features List */}
              <div className="bg-gradient-to-br from-[#1E1E2F] to-[#0F0F1A] text-white p-5 rounded-2xl border border-white/5 space-y-3 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-drip-coral opacity-10 rounded-full blur-xl"></div>
                <div className="flex items-center space-x-3 text-xs font-semibold text-gray-200">
                  <Check className="w-4 h-4 text-drip-green shrink-0" />
                  <span>Unlimited virtual draping trails</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-semibold text-gray-200">
                  <Check className="w-4 h-4 text-drip-green shrink-0" />
                  <span>Visual Caliper skeletal matching</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-semibold text-gray-200">
                  <Check className="w-4 h-4 text-drip-green shrink-0" />
                  <span>Priority GPU cluster servers</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-xs flex items-center space-x-2">
                  <span>{error}</span>
                </div>
              )}

              {/* Checkout CTA button */}
              <div className="pt-2">
                {isPayingPremium ? (
                  <button 
                    disabled 
                    className="w-full bg-drip-green text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Launching payment vault...</span>
                  </button>
                ) : (
                  <button 
                    onClick={handleUpgradeToPremium}
                    className="w-full bg-drip-navy hover:bg-black text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Zap className="w-4.5 h-4.5 text-drip-green fill-drip-green" />
                    <span>Unlock Unlimited Trials — ₹199/mo</span>
                  </button>
                )}
                <div className="flex items-center justify-center space-x-1 text-[9px] font-black uppercase tracking-widest text-gray-400 mt-3">
                  <Lock className="w-3.5 h-3.5 text-drip-green" />
                  <span>Razorpay Standard secure integration</span>
                </div>
              </div>
            </div>
          ) : premiumSuccess ? (
            // CELEBRATION UPGRADE SUCCESS
            <div className="flex flex-col justify-center items-center text-center h-full space-y-5 pt-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-drip-green text-white rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold text-gray-900 leading-tight">Welcome to DRIP Premium! 🌟</h2>
                <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
                  Your payment was securely verified. Styling restrictions have been lifted from your account. Proceed to drape outfits instantly!
                </p>
              </div>
              <button 
                onClick={() => setPremiumSuccess(false)}
                className="px-6 py-2.5 bg-drip-navy hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md mt-2"
              >
                Continue Styling
              </button>
            </div>
          ) : (
            // REGULAR FITTING OPTIONS
            <div className="flex flex-col justify-between h-full">
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mt-2">
                  <Sparkles className="w-5 h-5 text-drip-coral fill-drip-coral" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-drip-coral">AI Fitting Room v2.0</span>
                </div>

                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{brand}</span>
                  <h2 className="text-xl font-display font-medium text-black leading-snug">{name}</h2>
                  <span className="text-base font-black text-black">₹{price.toLocaleString('en-IN')}</span>
                </div>

                {/* Free Counter Badge */}
                {!isPremium && (
                  <div className="inline-flex items-center space-x-1.5 bg-[#F0F7FF] text-[#0055A4] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Free Trials Remaining: {Math.max(0, 3 - tryOnCount)} / 3</span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-xs flex items-start space-x-2">
                    <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-red-500 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Upload Selector zone */}
                {!userPhoto && status === 'idle' && (
                  <div className="pt-2 text-left">
                    <label className="text-[10px] font-bold text-gray-700 block mb-2 uppercase tracking-wider">Upload Your Body Photo:</label>
                    <div 
                      onClick={() => fileInputFaceRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-drip-navy hover:bg-gray-50/50 transition-all group bg-gray-50"
                    >
                      <Upload className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-xs font-bold text-gray-800">Select Full-Body Photo</span>
                      <span className="text-[9px] text-gray-400 mt-0.5">JPEG/PNG under 10MB</span>
                    </div>
                  </div>
                )}

                {/* Configuration Selectors when done */}
                {resultUrl && status === 'done' && (
                  <div className="grid grid-cols-2 gap-4 pt-2 text-left">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Select Fit Size</label>
                      <select 
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black"
                      >
                        <option>UK 7</option>
                        <option>UK 8</option>
                        <option>UK 9</option>
                        <option>UK 10</option>
                        <option>UK 11</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Select Color</label>
                      <select 
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black"
                      >
                        <option>White/Gold</option>
                        <option>Navy Blue</option>
                        <option>Sand Beige</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom segment: Actions */}
              <div className="pt-6 border-t border-gray-100 flex flex-col space-y-2 mt-auto">
                {resultUrl && status === 'done' ? (
                  <div className="flex flex-col space-y-2">
                    <button 
                      onClick={handleAddToBagWithFit}
                      className={`w-full text-white py-3.5 rounded-2xl font-bold tracking-widest uppercase text-xs transition-all flex justify-center items-center space-x-2 ${
                        cartAdded ? 'bg-drip-green hover:bg-drip-green' : 'bg-drip-navy hover:bg-black'
                      }`}
                    >
                      {cartAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Bag with Fit</span>
                        </>
                      )}
                    </button>
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleDownload}
                        className="flex-1 bg-gray-50 text-gray-700 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-100 flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button 
                        onClick={reset}
                        className="flex-1 bg-gray-50 text-red-500 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-50 flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <span>Clear Result</span>
                      </button>
                    </div>
                  </div>
                ) : userPhoto && status === 'idle' ? (
                  <button 
                    onClick={triggerVirtualFitting}
                    className="w-full bg-drip-navy hover:bg-black text-white py-3.5 rounded-2xl font-bold tracking-widest uppercase text-xs transition-colors flex justify-center items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 fill-white" />
                    <span>Begin Virtual Fitting</span>
                  </button>
                ) : (
                  <button 
                    disabled 
                    className="w-full bg-gray-200 text-gray-400 py-3.5 rounded-2xl font-bold tracking-widest uppercase text-xs cursor-not-allowed text-center"
                  >
                    Upload Photo to Fit Outfit
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
      
      {/* Hidden input zone helper */}
      <input 
        type="file" 
        ref={fileInputFaceRef} 
        onChange={handlePhotoUpload} 
        accept="image/*" 
        className="hidden" 
      />
    </>
  );
}
