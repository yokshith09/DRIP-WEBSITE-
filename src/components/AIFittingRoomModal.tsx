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
  Lock,
  ArrowRight,
  ArrowLeft,
  Search,
  Globe,
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import { createClient } from '@/lib/supabase/client';
import { useTryOnStore } from '@/store/tryOn';
import { useCartStore } from '@/store/cart';
import { useProductStore } from '@/store/products';

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
  price = 1999 
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

  const { products } = useProductStore();
  const { addItem } = useCartStore();
  
  const router = useRouter();
  const supabase = createClient();
  
  const fileInputFaceRef = useRef<HTMLInputElement>(null);

  // Wizard Steps: GENDER -> GARMENT -> USER_PHOTO -> PROCESSING -> DONE
  const [wizardStep, setWizardStep] = useState<'GENDER' | 'GARMENT' | 'USER_PHOTO' | 'PROCESSING' | 'DONE'>('GENDER');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  
  // Selected garment for try-on (can be current product, a catalog product, or an imported product)
  const [selectedGarment, setSelectedGarment] = useState<{
    id: string;
    image: string;
    name: string;
    brand: string;
    price: number;
    priceString: string;
  }>({
    id: 'current',
    image: productImage,
    name,
    brand,
    price,
    priceString: `₹ ${price.toLocaleString('en-IN')}`
  });

  // Garment selection tab: 'CURRENT' | 'CATALOG' | 'IMPORT'
  const [garmentTab, setGarmentTab] = useState<'CURRENT' | 'CATALOG' | 'IMPORT'>('CURRENT');
  const [catalogSearch, setCatalogSearch] = useState('');
  
  // Import URL fields
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  // Free Try-On limits states
  const [tryOnCount, setTryOnCount] = useState<number>(0);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isPayingPremium, setIsPayingPremium] = useState<boolean>(false);
  const [premiumSuccess, setPremiumSuccess] = useState<boolean>(false);

  // Selected parameters for cart addition
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Default');

  // Progressive loading text state
  const [progressStepIdx, setProgressStepIdx] = useState(0);
  const [compareMode, setCompareMode] = useState<'after' | 'before'>('after');
  const [cartAdded, setCartAdded] = useState(false);

  // Reset states on open
  useEffect(() => {
    if (isOpen) {
      setWizardStep('GENDER');
      setSelectedGender(null);
      setSelectedGarment({
        id: 'current',
        image: productImage,
        name,
        brand,
        price,
        priceString: `₹ ${price.toLocaleString('en-IN')}`
      });
      setGarmentTab('CURRENT');
      setImportUrl('');
      setImportError('');
      reset();
      
      if (typeof window !== 'undefined') {
        const count = parseInt(localStorage.getItem('drip_tryon_count') || '0', 10);
        setTryOnCount(count);
        const premium = localStorage.getItem('drip_is_premium') === 'true';
        setIsPremium(premium);
      }
    }
  }, [isOpen, productImage, name, brand, price, reset]);

  // Rotate loading step messages during processing
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

  // Handle user photo selection
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    try {
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
      setError('Failed to process image. Please try another photo.');
      setStatus('idle');
    }
  };

  // Import product scraping handler
  const handleImportUrl = async () => {
    if (!importUrl) {
      setImportError('Please enter a valid product page URL.');
      return;
    }

    setImporting(true);
    setImportError('');

    try {
      const res = await fetch('/api/import-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to scan product page');
      }

      const imported = data.product;
      const parsedPriceNum = parseInt(imported.price.replace(/[^\d]/g, ''), 10) || 1999;

      setSelectedGarment({
        id: `imported-${Date.now()}`,
        image: imported.image,
        name: imported.name,
        brand: imported.brand,
        price: parsedPriceNum,
        priceString: imported.price
      });

      setGarmentTab('CURRENT'); // Toggle view to show newly imported item preview
      setImportUrl('');
    } catch (err: any) {
      console.error(err);
      setImportError(err.message || 'Scrape failed. Target site might be blocked.');
    } finally {
      setImporting(false);
    }
  };

  // Run AI Draping API trigger
  const triggerVirtualFitting = async () => {
    if (!userPhoto) return;

    // SECURITY: Enforce Authentication Before Proceeding
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login?redirect=tryon');
      return;
    }

    setStatus('processing');
    setWizardStep('PROCESSING');
    setCartAdded(false);
    setError(null);

    try {
      const res = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelImage: userPhoto,
          garmentImage: selectedGarment.image,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete virtual fitting');
      }

      setResult(data.resultUrl);
      setStatus('done');
      setWizardStep('DONE');

      // Increment try-on count
      if (!isPremium) {
        const nextCount = tryOnCount + 1;
        setTryOnCount(nextCount);
        localStorage.setItem('drip_tryon_count', nextCount.toString());
      }
    } catch (err: any) {
      console.error('[TRY-ON] API route error:', err);
      setError(err.message || 'GPU allocation error. Please retry.');
      setStatus('idle');
      setWizardStep('USER_PHOTO'); // Fallback back to upload screen so they can retry
    }
  };

  // Simulated premium checkout payments upgrade
  const handleUpgradeToPremium = async () => {
    setIsPayingPremium(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsPremium(true);
      setPremiumSuccess(true);
      localStorage.setItem('drip_is_premium', 'true');
      setIsPayingPremium(false);
    } catch (err: any) {
      console.error('[PREMIUM UPGRADE] Upgrade failed:', err);
      setError(err.message || 'Upgrade failed.');
      setIsPayingPremium(false);
    }
  };

  const handleAddToBagWithFit = () => {
    addItem({
      id: `fit-${Date.now()}`,
      brand: selectedGarment.brand,
      name: selectedGarment.name,
      price: selectedGarment.price,
      size: selectedSize,
      color: selectedColor,
      qty: 1,
      image: compareMode === 'after' && resultUrl ? resultUrl : selectedGarment.image,
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
    link.download = `drip-tryon-${selectedGarment.brand.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter products for catalog selector tab
  const filteredCatalog = products.filter(p => 
    p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  const isPaywallActive = !isPremium && tryOnCount >= 3 && !resultUrl;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 z-[70] backdrop-blur-md transition-opacity" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[850px] h-[90vh] md:h-[650px] bg-white rounded-3xl z-[80] overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-300 font-sans text-gray-900">
        
        {/* Left Side: Visualizer Display Screen */}
        <div className="relative w-full md:w-[420px] h-64 md:h-full bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 border-r border-gray-100">
          
          {/* GENDER Step Visual */}
          {wizardStep === 'GENDER' && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
              <UserIcon className="w-16 h-16 text-drip-coral opacity-40 animate-pulse" />
              <h3 className="text-xl font-display font-medium italic">Fit Calibration</h3>
              <p className="text-xs text-gray-400 max-w-[280px]">Select your target gender shape to calibrate structural clothing drapery mapping.</p>
            </div>
          )}

          {/* GARMENT Step Visual */}
          {wizardStep === 'GARMENT' && (
            <div className="w-full h-full relative flex items-center justify-center bg-[#0d0e15] p-6">
              {selectedGarment.image ? (
                <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image src={selectedGarment.image} alt={selectedGarment.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[9px] text-drip-coral font-black tracking-widest uppercase">{selectedGarment.brand}</span>
                    <h4 className="text-white text-sm font-bold truncate">{selectedGarment.name}</h4>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white space-y-2">
                  <ShoppingBag className="w-10 h-10 text-gray-600 mx-auto" />
                  <p className="text-xs text-gray-400">No garment selected.</p>
                </div>
              )}
            </div>
          )}

          {/* USER_PHOTO Step Visual */}
          {wizardStep === 'USER_PHOTO' && (
            <div className="w-full h-full relative bg-[#0a0b10] flex items-center justify-center">
              {userPhoto ? (
                <Image src={userPhoto} alt="User silhouette preview" fill className="object-cover" />
              ) : (
                <div className="text-center text-white p-8 space-y-3">
                  <Camera className="w-16 h-16 text-drip-coral/40 mx-auto animate-bounce" />
                  <h4 className="text-base font-display font-semibold italic">Upload Body Silhouette</h4>
                  <p className="text-[11px] text-gray-500 max-w-[280px]">Choose a clean, well-lit photograph. Keep your hands free and stand facing the camera.</p>
                </div>
              )}
            </div>
          )}

          {/* PROCESSING Step Visual */}
          {wizardStep === 'PROCESSING' && (
            <div className="absolute inset-0 bg-[#0A0B10] flex flex-col items-center justify-center p-8 text-center text-white space-y-6">
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 border border-drip-coral/30 rounded-full animate-ping"></div>
                <Loader2 className="w-10 h-10 text-drip-coral animate-spin absolute" />
              </div>
              <div className="space-y-3">
                <span className="text-[10px] text-drip-coral uppercase tracking-[0.3em] font-black block animate-pulse">
                  GPU DRAPING PIPELINE ACTIVE
                </span>
                <h4 className="text-sm font-bold text-gray-200 h-8 flex items-center justify-center px-4 leading-snug">
                  {STYLING_PROGRESS_STEPS[progressStepIdx]}
                </h4>
                <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                  <div 
                    className="h-full bg-drip-coral transition-all duration-1000"
                    style={{ width: `${((progressStepIdx + 1) / STYLING_PROGRESS_STEPS.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                  Step {progressStepIdx + 1} of {STYLING_PROGRESS_STEPS.length}
                </p>
              </div>
            </div>
          )}

          {/* DONE Step Visual (Toggle Results) */}
          {wizardStep === 'DONE' && resultUrl && (
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

              {/* Success badge */}
              <div className="absolute top-4 left-4 bg-drip-green text-white text-[9px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider shadow-md">
                Fitted perfectly
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Configurations Wizard and Paywalls */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative flex flex-col justify-between">
          
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors bg-gray-50 rounded-full z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {isPaywallActive ? (
            /* ========================================= */
            /*              PREMIUM PAYWALL RENDER       */
            /* ========================================= */
            <div className="flex flex-col justify-center h-full space-y-6 pt-4 animate-in fade-in duration-500 text-left">
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-drip-coral animate-bounce" />
                <span className="text-[10px] font-black tracking-widest uppercase text-drip-coral">Styling limit reached</span>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold text-gray-900 leading-tight">Style Limits Reached! 🌟</h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  You have consumed your **3 free try-on trials**. Unlock unlimited styling sessions, body caliper calibration tools, and priority GPU processing instantly!
                </p>
              </div>

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
                <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-xs">
                  <span>{error}</span>
                </div>
              )}

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
            /* ========================================= */
            /*         PREMIUM SUCCESS CELEBRATION       */
            /* ========================================= */
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
            /* ========================================= */
            /*              WIZARD ACTIVE FLOW           */
            /* ========================================= */
            <div className="flex flex-col justify-between h-full text-left">
              
              {/* STEP 1: GENDER SELECTION */}
              {wizardStep === 'GENDER' && (
                <div className="space-y-6 pt-4 animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black tracking-widest uppercase text-drip-coral">Step 1 of 3</span>
                    <h2 className="text-xl font-display font-medium text-black">Select Gender Profile</h2>
                    <p className="text-xs text-gray-500">We use this selection to calibrate the AI skeletal model boundaries for drape fit optimization.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button 
                      type="button"
                      onClick={() => { setSelectedGender('male'); setWizardStep('GARMENT'); }}
                      className="border border-gray-200 hover:border-black p-8 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all hover:shadow-md group bg-gray-50/50"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors">
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider">Male Profile</span>
                    </button>

                    <button 
                      type="button"
                      onClick={() => { setSelectedGender('female'); setWizardStep('GARMENT'); }}
                      className="border border-gray-200 hover:border-black p-8 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all hover:shadow-md group bg-gray-50/50"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors">
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider">Female Profile</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: GARMENT SELECTION */}
              {wizardStep === 'GARMENT' && (
                <div className="space-y-4 pt-2 animate-in fade-in duration-300 flex-1 flex flex-col">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black tracking-widest uppercase text-drip-coral">Step 2 of 3</span>
                    <h2 className="text-xl font-display font-medium text-black">Select Outfit to Try On</h2>
                  </div>

                  {/* Tabs Bar */}
                  <div className="flex border-b border-gray-100 text-[10px] font-black uppercase tracking-wider">
                    <button 
                      type="button"
                      onClick={() => setGarmentTab('CURRENT')}
                      className={`flex-1 pb-2 border-b-2 text-center transition-all ${garmentTab === 'CURRENT' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                    >
                      Selected Garment
                    </button>
                    <button 
                      type="button"
                      onClick={() => setGarmentTab('CATALOG')}
                      className={`flex-1 pb-2 border-b-2 text-center transition-all ${garmentTab === 'CATALOG' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                    >
                      Store Catalog
                    </button>
                    <button 
                      type="button"
                      onClick={() => setGarmentTab('IMPORT')}
                      className={`flex-1 pb-2 border-b-2 text-center transition-all ${garmentTab === 'IMPORT' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                    >
                      Import via URL Link
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="flex-1 overflow-y-auto max-h-[280px] pr-1 py-2">
                    
                    {/* Tab: CURRENT */}
                    {garmentTab === 'CURRENT' && (
                      <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center space-x-4">
                        <div className="w-14 h-16 bg-gray-200 rounded-lg relative overflow-hidden shrink-0 shadow-sm border border-gray-100">
                          <Image src={selectedGarment.image} alt={selectedGarment.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] text-gray-400 font-bold uppercase block tracking-wider">{selectedGarment.brand}</span>
                          <h4 className="text-xs font-bold text-gray-800 truncate">{selectedGarment.name}</h4>
                          <span className="text-xs font-black text-black block mt-0.5">{selectedGarment.priceString}</span>
                        </div>
                        <div className="text-drip-green bg-drip-green/10 p-1.5 rounded-full shrink-0">
                          <CheckCircle2 className="w-5 h-5 fill-drip-green text-white" />
                        </div>
                      </div>
                    )}

                    {/* Tab: CATALOG */}
                    {garmentTab === 'CATALOG' && (
                      <div className="space-y-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input 
                            type="text"
                            value={catalogSearch}
                            onChange={(e) => setCatalogSearch(e.target.value)}
                            placeholder="Filter by brand or name..."
                            className="w-full border border-gray-200 pl-8 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-black"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {filteredCatalog.slice(0, 10).map((prod) => (
                            <div 
                              key={prod.id}
                              onClick={() => setSelectedGarment({
                                id: prod.id,
                                image: prod.image,
                                name: prod.name,
                                brand: prod.brand,
                                price: prod.priceNumber,
                                priceString: prod.price
                              })}
                              className={`p-2.5 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-all ${
                                selectedGarment.image === prod.image ? 'border-black bg-gray-50 shadow-xs' : 'border-gray-155 hover:bg-gray-50/50'
                              }`}
                            >
                              <div className="w-8 h-10 bg-gray-200 rounded relative overflow-hidden shrink-0">
                                <Image src={prod.image} alt={prod.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[8px] text-gray-400 font-bold block uppercase truncate">{prod.brand}</span>
                                <span className="text-[10px] font-bold text-gray-700 truncate block">{prod.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab: IMPORT */}
                    {garmentTab === 'IMPORT' && (
                      <div className="space-y-4">
                        <div className="space-y-1 text-left">
                          <label className="text-[9px] font-bold text-gray-700 block uppercase tracking-wider">Paste Fast-Fashion Link:</label>
                          <p className="text-[10px] text-gray-400 leading-normal">Supports scraping garments from Snitch, Banana Club, and Myntra URLs.</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <input 
                            type="text" 
                            value={importUrl}
                            onChange={(e) => setImportUrl(e.target.value)}
                            placeholder="https://www.snitch.co.in/products/..."
                            className="flex-1 border border-gray-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-black"
                          />
                          <button 
                            type="button"
                            onClick={handleImportUrl}
                            disabled={importing}
                            className="bg-black hover:bg-drip-coral text-white px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center"
                          >
                            {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Import'}
                          </button>
                        </div>

                        {importError && (
                          <div className="bg-red-50 border border-red-100 text-red-700 p-2.5 rounded-xl text-[10px] font-medium leading-relaxed">
                            {importError}
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Actions segment */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-100 mt-auto">
                    <button 
                      type="button"
                      onClick={() => setWizardStep('GENDER')}
                      className="px-4 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> <span>Back</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setWizardStep('USER_PHOTO')}
                      disabled={!selectedGarment.image}
                      className="flex-1 bg-black hover:bg-drip-coral text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
                    >
                      <span>Proceed to Upload Photo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: UPLOAD USER PHOTO */}
              {wizardStep === 'USER_PHOTO' && (
                <div className="space-y-5 pt-4 animate-in fade-in duration-300 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black tracking-widest uppercase text-drip-coral">Step 3 of 3</span>
                    <h2 className="text-xl font-display font-medium text-black">Upload Silhouette</h2>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-xs flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  {!userPhoto ? (
                    <div 
                      onClick={() => fileInputFaceRef.current?.click()}
                      className="w-full h-36 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-drip-navy hover:bg-gray-50/50 transition-all group bg-gray-50"
                    >
                      <Upload className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform mb-1" />
                      <span className="text-xs font-bold text-gray-800">Select Full-Body Photo</span>
                      <span className="text-[9px] text-gray-400 mt-0.5">JPEG/PNG under 10MB</span>
                    </div>
                  ) : (
                    <div className="bg-drip-green/10 border border-drip-green/20 p-5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-drip-green text-white p-1 rounded-full">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Photo loaded successfully</p>
                          <p className="text-[9px] text-gray-400 uppercase mt-0.5">Caliper coordinates mapped</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => fileInputFaceRef.current?.click()}
                        className="text-[9px] font-black uppercase tracking-wider text-gray-400 hover:text-black border border-gray-200 hover:border-black px-3 py-1.5 rounded-lg bg-white transition-all"
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {/* Limit warnings */}
                  {!isPremium && (
                    <div className="inline-flex items-center space-x-1.5 bg-[#F0F7FF] text-[#0055A4] px-3.5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider border border-blue-100 self-start">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Free Trials Remaining: {Math.max(0, 3 - tryOnCount)} / 3</span>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4 border-t border-gray-100 mt-auto">
                    <button 
                      type="button"
                      onClick={() => setWizardStep('GARMENT')}
                      className="px-4 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> <span>Back</span>
                    </button>
                    
                    {userPhoto ? (
                      <button 
                        type="button"
                        onClick={triggerVirtualFitting}
                        className="flex-1 bg-drip-green text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex justify-center items-center space-x-2 shadow-md hover:scale-102 transition-all"
                      >
                        <Sparkles className="w-4 h-4 fill-white" />
                        <span>Begin AI Fitting Room</span>
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="flex-1 bg-gray-200 text-gray-400 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-not-allowed text-center"
                      >
                        Upload Photo to Fit Outfit
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: PROCESSING */}
              {wizardStep === 'PROCESSING' && (
                <div className="flex flex-col justify-center h-full space-y-5 py-8 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <h2 className="text-xl font-display font-medium text-gray-900 leading-tight">AI Draping Pipeline In Progress...</h2>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Our advanced graphics models are aligning the garment silhouettes, mapping fabric coordinates to your skeletal anchor points, and generating high-fidelity photorealistic renders.
                    </p>
                  </div>
                  
                  <div className="bg-[#FAF9F7] p-5 rounded-2xl border border-gray-150 space-y-2 text-xs font-medium text-gray-500 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-drip-coral rounded-full animate-ping shrink-0"></span>
                      <span>Targeting Model: IDM-VTON Edge (Tier 1 Replicate GPU Cluster)</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-normal pl-3.5 uppercase font-bold">
                      Estimated rendering time: 15 - 25 seconds. Please keep this screen open.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 5: COMPLETED RESULTS */}
              {wizardStep === 'DONE' && (
                <div className="space-y-4 pt-2 animate-in fade-in zoom-in-95 duration-500 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mt-2">
                      <Sparkles className="w-5 h-5 text-drip-coral fill-drip-coral" />
                      <span className="text-[10px] font-black tracking-widest uppercase text-drip-coral">AI Fitting Room Completed</span>
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{selectedGarment.brand}</span>
                      <h2 className="text-xl font-display font-medium text-black leading-snug">{selectedGarment.name}</h2>
                      <span className="text-base font-black text-black">{selectedGarment.priceString}</span>
                    </div>

                    {/* Size and Color Options selectors */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Select Fit Size</label>
                        <select 
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black bg-white"
                        >
                          <option>XS</option>
                          <option>S</option>
                          <option>M</option>
                          <option>L</option>
                          <option>XL</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Select Color</label>
                        <select 
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-black bg-white"
                        >
                          <option>Default</option>
                          <option>White</option>
                          <option>Navy Blue</option>
                          <option>Jet Black</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-6 border-t border-gray-100 flex flex-col space-y-2 mt-auto">
                    <button 
                      type="button"
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
                        type="button"
                        onClick={handleDownload}
                        className="flex-1 bg-gray-50 text-gray-700 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-100 flex items-center justify-center space-x-1.5 transition-colors border border-gray-200"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setWizardStep('GENDER');
                          setSelectedGender(null);
                          setUserPhoto(null);
                          reset();
                        }}
                        className="flex-1 bg-gray-50 text-red-500 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-50 flex items-center justify-center space-x-1.5 transition-colors border border-gray-200"
                      >
                        <span>Start Over</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
