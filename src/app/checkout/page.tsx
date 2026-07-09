'use client';

import { useState } from 'react';
import { 
  ChevronLeft, 
  Check, 
  MapPin, 
  CreditCard, 
  Landmark, 
  Truck, 
  ShieldCheck, 
  ShoppingBag, 
  Lock,
  Loader2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import Footer from '@/components/Footer';

const STEPS = ['Shipping', 'Payment', 'Confirmation'];

export default function Checkout() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('upi');

  // Checkout Loading States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Cart pricing calculation
  const totalItemCount = items.reduce((acc, item) => acc + item.qty, 0);
  const rawSubtotal = items.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.qty, 0);
  const rawDiscount = items.reduce((acc, item) => acc + ((item.originalPrice || item.price) - item.price) * item.qty, 0);
  const finalTotalPayable = rawSubtotal - rawDiscount;

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleInitiatePurchase = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      console.log('[CHECKOUT] Running in Portfolio Showcase Mode. Simulating checkout processing...');
      // 1.5 second high-end spinner delay to simulate transaction verification
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setPaymentSuccess(true);
      setIsProcessingPayment(false);
      clearCart();
    } catch (err: any) {
      console.error('[CHECKOUT] Payment processing failed:', err);
      setPaymentError(err.message || 'Failed to establish connection.');
      setIsProcessingPayment(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-32 font-sans relative">
      
      {/* Razorpay SDK loading */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Simplified Luxury Header */}
      <header className="sticky top-0 w-full h-20 bg-white z-40 border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shadow-sm">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()} 
            disabled={isProcessingPayment}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50"
          >
             <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <Link href="/" className="text-2xl font-display font-black tracking-widest text-black italic">
            DRIP
          </Link>
        </div>
        
        <div className="flex flex-col items-end space-y-0.5 text-right">
           <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <Lock className="w-4 h-4 text-drip-green" />
              <span>100% Secured Vault</span>
           </div>
           <span className="text-[9px] font-black uppercase tracking-widest text-[#0055A4] bg-blue-50 px-2 py-0.5 rounded">Fast Checkout</span>
        </div>
      </header>

      {/* Stepper progress */}
      <div className="w-full bg-[#F8F9FA] py-8 border-b border-gray-100 shrink-0">
        <div className="max-w-xl mx-auto px-4">
           <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-gray-200"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-black transition-all duration-500" style={{ width: `${(currentStep - 1) * 50}%` }}></div>
              
              {STEPS.map((step, idx) => {
                 const stepNum = idx + 1;
                 const isActive = currentStep === stepNum;
                 const isDone = currentStep > stepNum;
                 return (
                    <div key={idx} className="relative z-10 flex flex-col items-center">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all border-2 ${
                          isActive ? 'bg-black text-white border-black scale-110 shadow-md' : 
                          isDone ? 'bg-black text-white border-black' : 
                          'bg-white text-gray-300 border-gray-200'
                       }`}>
                          {isDone ? <Check className="w-4 h-4" /> : stepNum}
                       </div>
                       <span className={`absolute -bottom-7 text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${isActive || isDone ? 'text-black' : 'text-gray-300'}`}>
                          {step}
                       </span>
                    </div>
                 );
              })}
           </div>
        </div>
      </div>

      {paymentSuccess ? (
        // SUCCESS CHECKOUT PANEL
        <div className="max-w-md mx-auto px-4 pt-20 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500 font-sans">
          <div className="w-16 h-16 bg-drip-green text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <Check className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold text-black italic">Showcase Order Placed!</h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
              This website is a **Portfolio Showcase**. Real payment transaction APIs and shipping logistics are disabled. Your simulated checkout has been processed successfully!
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl text-left border border-gray-100 text-xs font-semibold text-gray-700 space-y-2 max-w-sm mx-auto">
            <div className="flex justify-between"><span>Payment Mode</span><span className="font-bold text-drip-green uppercase">Demo Mode (No Charge)</span></div>
            <div className="flex justify-between"><span>Showcase Status</span><span className="font-bold text-black uppercase">Portfolio Live</span></div>
            <div className="flex justify-between"><span>Order Status</span><span className="font-bold text-drip-coral uppercase">Logged (Simulated)</span></div>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-drip-navy hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md inline-block"
          >
            Return to Catalogue
          </button>
        </div>
      ) : (
        // ACTIVE FORM FUNNEL
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 pt-16 flex flex-col lg:flex-row gap-16">
          
          {/* Main forms segment */}
          <div className="flex-grow max-w-2xl mx-auto lg:mx-0">
             
             {/* Shipping */}
             {currentStep === 1 && (
                <section className="space-y-8 animate-in fade-in duration-300">
                   <h2 className="text-2xl font-display font-medium text-black italic mb-6">Shipping Destination</h2>
                   
                   <div className="space-y-4">
                      <div 
                        onClick={() => setSelectedAddress(1)}
                        className={`p-6 border transition-all cursor-pointer relative rounded-2xl ${
                          selectedAddress === 1 ? 'border-black bg-white shadow-md' : 'border-gray-100 bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                         <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">DEFAULT ADDRESS</span>
                            {selectedAddress === 1 && <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>}
                         </div>
                         <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-1">Yoo Jae-Suk</h3>
                         <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-sm">
                            A-201, Infinity Towers, Mindspace, Malad West, Mumbai - 400064<br/>Phone: +91 9876543210
                         </p>
                      </div>

                      <button className="w-full py-5 border border-dashed border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:border-gray-400 rounded-2xl transition-all">
                         + Add Custom Delivery Location
                      </button>
                   </div>

                   <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 pl-1 pt-4">Shipping Speed</h3>
                   <div className="p-6 border border-gray-900 bg-white flex items-center gap-6 shadow-sm rounded-2xl">
                      <Truck className="w-8 h-8 text-black" />
                      <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-black">Express Air Delivery</h4>
                          <p className="text-[10px] font-medium text-gray-400 mt-1 italic">Expected Delivery: 2 Days via Air Cargo</p>
                      </div>
                      <span className="ml-auto text-xs font-black text-green-600 uppercase tracking-widest">Complimentary</span>
                   </div>
                </section>
             )}

             {/* Payment Selection */}
             {currentStep === 2 && (
                <section className="space-y-8 animate-in fade-in duration-300">
                   <h2 className="text-2xl font-display font-medium text-black italic mb-6">Payment Gateway</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'upi', label: 'UPI / Card (Razorpay Secured)', icon: <Landmark className="w-5 h-5" /> },
                        { id: 'cod', label: 'Cash / Card on Delivery', icon: <ShoppingBag className="w-5 h-5" /> }
                      ].map(method => (
                        <div 
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`p-6 border transition-all cursor-pointer flex flex-col justify-between rounded-2xl h-32 ${
                            selectedPayment === method.id ? 'border-black bg-white shadow-md' : 'border-gray-150 bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                           <div className="flex justify-between items-start">
                              <div className={`p-3 rounded-xl ${selectedPayment === method.id ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                 {method.icon}
                              </div>
                              {selectedPayment === method.id && <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center text-white"><Check className="w-2.5 h-2.5" /></div>}
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest leading-none">{method.label}</span>
                        </div>
                      ))}
                   </div>
                </section>
             )}

             {/* Review */}
             {currentStep === 3 && (
                <section className="space-y-8 animate-in fade-in duration-300">
                   <div className="space-y-1">
                     <h2 className="text-2xl font-display font-medium text-black italic">Final Verification</h2>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Please review your logistics and billing details.</p>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="p-6 bg-white border border-gray-155 shadow-xs rounded-2xl">
                         <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">DELIVERY DETAILS</h4>
                         <p className="text-xs font-bold text-black uppercase tracking-widest">Yoo Jae-Suk</p>
                         <p className="text-[11px] text-gray-400 mt-1 italic">A-201, Infinity Towers, Mindspace, Malad West, Mumbai</p>
                      </div>
                      <div className="p-6 bg-white border border-gray-155 shadow-xs rounded-2xl">
                         <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">PAYMENT CONFIGURATION</h4>
                         <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-drip-green" />
                            <span className="text-xs font-bold text-black uppercase tracking-widest">
                              {selectedPayment === 'cod' ? 'Cash on Delivery' : 'Razorpay Secure Web Standard'}
                            </span>
                         </div>
                      </div>
                   </div>

                   {paymentError && (
                     <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-xs flex items-center space-x-2">
                       <span>{paymentError}</span>
                     </div>
                   )}
                </section>
             )}

          </div>

          {/* Sidebar checkout summary */}
          <div className="lg:w-[400px] shrink-0">
             <div className="sticky top-28 bg-[#1A1A2E] text-white p-8 rounded-3xl shadow-xl border border-white/5">
                <h3 className="text-xs font-black uppercase tracking-[0.25em] mb-6 border-b border-white/10 pb-4 opacity-80 flex items-center justify-between">
                  <span>Checkout Invoice</span>
                  <ShoppingBag className="w-4 h-4 text-drip-green" />
                </h3>
                
                {/* Dynamically list items */}
                <div className="max-h-[140px] overflow-y-auto mb-6 pr-1 space-y-3 border-b border-white/5 pb-4 hide-scrollbar">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex justify-between items-center text-[11px] text-gray-300">
                      <div className="truncate max-w-[180px]">
                        <span className="font-bold text-white block truncate">{item.name}</span>
                        <span className="text-[9px] text-gray-400 font-mono uppercase">{item.size} • {item.qty} qty</span>
                      </div>
                      <span className="font-bold text-white shrink-0">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="text-[11px] text-gray-400 text-center py-4">No active items in bag.</div>
                  )}
                </div>

                <div className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                   <div className="flex justify-between"><span>Retail Subtotal</span><span className="text-white">₹{rawSubtotal.toLocaleString('en-IN')}</span></div>
                   <div className="flex justify-between text-drip-coral"><span>Stylist Discount</span><span>-₹{rawDiscount.toLocaleString('en-IN')}</span></div>
                   <div className="flex justify-between text-drip-green"><span>Express Delivery</span><span>Complimentary</span></div>
                </div>

                <div className="my-6 h-[1px] bg-white/10"></div>

                <div className="flex justify-between items-center mb-8">
                   <span className="text-xs font-black uppercase tracking-widest text-gray-300">Total Payable</span>
                   <span className="text-2xl font-black text-white">₹{finalTotalPayable.toLocaleString('en-IN')}</span>
                </div>

                {isProcessingPayment ? (
                  <button 
                    disabled
                    className="w-full bg-drip-green text-white py-4.5 rounded-2xl text-[10px] font-black tracking-widest uppercase flex justify-center items-center space-x-2 shadow-lg"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Establishing Vault Hook...</span>
                  </button>
                ) : (
                  <button 
                    onClick={currentStep === 3 ? handleInitiatePurchase : handleNext}
                    disabled={items.length === 0}
                    className="w-full bg-white text-black py-4.5 rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-gray-100 transition-colors shadow-lg disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    {currentStep === 3 ? 'INITIATE PURCHASE' : 'NEXT STEP'}
                  </button>
                )}

                <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center gap-4">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4.5 h-4.5 text-drip-green" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 text-center">Certified Authenticity Handshake</span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      )}

      {/* Dynamic scan simulator gate */}
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white z-50 p-6 text-center space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-drip-coral/30 rounded-full animate-ping"></div>
            <Sparkles className="w-8 h-8 text-drip-coral animate-pulse absolute" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-drip-coral uppercase tracking-widest font-black block animate-pulse">Initializing Secure UPI Tunnel...</span>
            <p className="text-xs text-gray-400 font-medium">Encrypting signature handshakes...</p>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
