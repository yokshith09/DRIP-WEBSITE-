'use client';

import { useState } from 'react';
import { ChevronLeft, Check, MapPin, CreditCard, Landmark, Truck, ShieldCheck, Wallet, ShoppingBag, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STEPS = ['Shipping', 'Payment', 'Confirmation'];

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('upi');

  const total = 8999; 
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else router.push('/');
  };

  return (
    <main className="min-h-screen bg-white pb-32">
      {/* Simplified Luxury Header (Checkout focus) */}
      <header className="sticky top-0 w-full h-20 bg-white z-50 border-b border-gray-100 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center space-x-4">
          <button onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
             <ChevronLeft className="w-6 h-6 text-drip-dark" />
          </button>
          <Link href="/" className="text-2xl font-display font-black tracking-widest text-black">
            DRIP
          </Link>
        </div>
        
        <div className="flex flex-col items-end space-y-1 text-right">
           <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <Lock className="w-4 h-4 text-green-500" />
              <span>100% Secure Checkout</span>
           </div>
           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0055A4] bg-blue-50 px-2 py-0.5 rounded">Guest Checkout Active</span>
        </div>
      </header>

      {/* Modern High-End Progress Stepper */}
      <div className="w-full bg-gray-50/50 pt-10 pb-10 border-b border-gray-100">
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
                          isActive ? 'bg-black text-white border-black scale-110 shadow-lg' : 
                          isDone ? 'bg-black text-white border-black' : 
                          'bg-white text-gray-300 border-gray-200'
                       }`}>
                          {isDone ? <Check className="w-4 h-4" /> : stepNum}
                       </div>
                       <span className={`absolute -bottom-8 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${isActive || isDone ? 'text-black' : 'text-gray-300'}`}>
                          {step}
                       </span>
                    </div>
                 );
              })}
           </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 pt-16 flex flex-col lg:flex-row gap-16">
        
        {/* Main Form Area */}
        <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
           
           {/* Step 1: Shipping */}
           {currentStep === 1 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-2xl font-display font-medium text-black italic mb-8">Shipping Experience</h2>
                 
                 <div className="space-y-4 mb-10">
                    <div 
                      onClick={() => setSelectedAddress(1)}
                      className={`p-6 border transition-all cursor-pointer relative ${selectedAddress === 1 ? 'border-black bg-white shadow-md' : 'border-gray-100 bg-gray-50 hover:border-gray-300'}`}
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

                    <button className="w-full py-5 border border-dashed border-gray-300 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-50 transition-all">
                       + Add Custom Delivery Location
                    </button>
                 </div>

                 <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 pl-1">Shipping Speed</h3>
                 <div className="p-6 border border-gray-900 bg-white flex items-center gap-6 shadow-sm">
                    <Truck className="w-8 h-8 text-black" />
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-black">Express Air Delivery</h4>
                        <p className="text-[10px] font-medium text-gray-400 mt-1 italic">Expected: Thursday, 18 March</p>
                    </div>
                    <span className="ml-auto text-xs font-black text-green-600 uppercase tracking-widest">Complimentary</span>
                 </div>
              </section>
           )}

           {/* Step 2: Payment */}
           {currentStep === 2 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-2xl font-display font-medium text-black italic mb-8">Payment Architecture</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'upi', label: 'UPI (G-Pay/PhonePe)', icon: <Landmark className="w-5 h-5" /> },
                      { id: 'card', label: 'Debit / Credit Card', icon: <CreditCard className="w-5 h-5" /> },
                      { id: 'wallet', label: 'DRIP Credits', icon: <Wallet className="w-5 h-5" /> },
                      { id: 'cod', label: 'Cash / Card on Delivery', icon: <ShoppingBag className="w-5 h-5" /> }
                    ].map(method => (
                      <div 
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-6 border transition-all cursor-pointer flex flex-col justify-between aspect-square md:aspect-auto md:h-32 ${selectedPayment === method.id ? 'border-black bg-white shadow-lg' : 'border-gray-100 bg-gray-50 hover:border-gray-300'}`}
                      >
                         <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-md ${selectedPayment === method.id ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                               {method.icon}
                            </div>
                            {selectedPayment === method.id && <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center text-white"><Check className="w-2.5 h-2.5" /></div>}
                         </div>
                         <span className="text-[11px] font-black uppercase tracking-widest leading-none">{method.label}</span>
                      </div>
                    ))}
                 </div>
              </section>
           )}

           {/* Step 3: Review */}
           {currentStep === 3 && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-2xl font-display font-medium text-black italic mb-2">Final Review</h2>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Please verify your details one last time.</p>
                 
                 <div className="space-y-6">
                    <div className="p-6 bg-white border border-gray-100 shadow-sm">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">DELIVERY TO</h4>
                       <p className="text-xs font-bold text-black uppercase tracking-widest">Yoo Jae-Suk</p>
                       <p className="text-xs text-gray-400 mt-1 italic">A-201, Infinity Towers, Mumbai</p>
                    </div>
                    <div className="p-6 bg-white border border-gray-100 shadow-sm">
                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">PAYMENT METHOD</h4>
                       <div className="flex items-center space-x-3">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-xs font-bold text-black uppercase tracking-widest">UPI / Razorpay Secured</span>
                       </div>
                    </div>
                 </div>
              </section>
           )}

        </div>

        {/* Sidebar Summary */}
        <div className="lg:w-[400px]">
           <div className="sticky top-28 bg-black text-white p-8 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 border-b border-gray-800 pb-5 opacity-80">Bag Summary</h3>
              
              <div className="space-y-5 text-xs font-medium opacity-70">
                 <div className="flex justify-between uppercase tracking-widest"><span>Subtotal (1 item)</span><span>₹ 12,499</span></div>
                 <div className="flex justify-between uppercase tracking-widest text-[#FF4D4D] font-bold"><span>Discount Applied</span><span>-₹ 3,500</span></div>
                 <div className="flex justify-between uppercase tracking-widest text-green-400 font-black"><span>Express Delivery</span><span>FREE</span></div>
              </div>

              <div className="my-8 h-[1px] bg-gray-800"></div>

              <div className="flex justify-between items-center mb-10">
                 <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">Total Payable</span>
                 <span className="text-3xl font-black">₹ 8,999</span>
              </div>

              <button 
                onClick={handleNext}
                className="w-full bg-white text-black py-5 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-gray-100 transition-all shadow-xl"
              >
                {currentStep === 3 ? 'INITIATE PURCHASE' : 'NEXT STEP'}
              </button>

              <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col items-center gap-5">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-50 text-center">Certified Luxury Authentication Included</span>
                 </div>
                 <Link href="#" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors border-b border-gray-600 pb-1">
                    Easy 14-Day Return Policy
                 </Link>
              </div>
           </div>
        </div>

      </div>
    </main>
  );
}
