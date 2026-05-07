'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Trash2, Heart, Plus, Minus, Tag, ShieldCheck, ShoppingCart, User, Menu, Search, HeadphonesIcon, MapPin, ChevronDown } from 'lucide-react';

const NAV_LINKS = ['MEN', 'WOMEN', 'KIDS', 'BEAUTY', 'HOME & KITCHEN', 'ACCESSORIES'];

const CART_ITEMS = [
  { 
    id: 1, 
    brand: 'Common Projects', 
    name: 'Premium Low Sneakers', 
    price: 8999, 
    originalPrice: 12499,
    size: 'UK 9', 
    color: 'White/Gold', 
    qty: 1, 
    image: '/images/sneakers.png',
    inStock: true
  },
  { 
    id: 2, 
    brand: 'Y-3', 
    name: 'Minimalist Street Jacket', 
    price: 4299, 
    originalPrice: 5999,
    size: 'M', 
    color: 'Navy', 
    qty: 1, 
    image: '/images/jacket.png',
    inStock: false // Out of stock example
  }
];

export default function Cart() {
  const itemTotal = CART_ITEMS.reduce((sum, item) => sum + (item.inStock ? item.originalPrice * item.qty : 0), 0);
  const discount = CART_ITEMS.reduce((sum, item) => sum + (item.inStock ? (item.originalPrice - item.price) * item.qty : 0), 0);
  const total = itemTotal - discount;

  return (
    <main className="min-h-screen bg-white pb-32">
      {/* Consistent Luxury Header */}
      <header className="sticky top-0 w-full h-20 bg-white z-50 border-b border-gray-200 shadow-sm flex items-center px-4 md:px-8">
        <div className="flex items-center space-x-4">
          <Link href="/" className="p-1 hover:bg-gray-100 rounded-md transition-colors">
             <ChevronLeft className="w-6 h-6 text-drip-dark" />
          </Link>
          <Link href="/" className="text-2xl font-display font-black tracking-widest text-black flex items-center">
            DRIP
          </Link>
        </div>

        <nav className="hidden lg:flex items-center space-x-8 ml-10 flex-1">
          {NAV_LINKS.map(link => (
            <button key={link} className="text-[12px] font-bold tracking-wide hover:text-[#0055A4] transition-colors">
              {link}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-6 text-xs font-medium text-drip-dark">
          <Link href="/profile" className="flex flex-col items-center hover:text-[#0055A4] transition-colors">
            <User className="w-6 h-6 mb-1 text-gray-700" />
            Account
          </Link>
          <Link href="/profile/style-dna" className="flex flex-col items-center hover:text-[#0055A4] transition-colors">
            <Heart className="w-6 h-6 mb-1 text-gray-700" />
            Wishlist
          </Link>
          <div className="flex flex-col items-center text-[#0055A4] relative">
            <ShoppingCart className="w-6 h-6 mb-1" />
            Cart
            <span className="absolute -top-1 right-0 w-4 h-4 bg-drip-coral text-white text-[9px] rounded-full flex items-center justify-center font-bold">2</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 pt-10 flex flex-col lg:flex-row gap-12">
        
        {/* Cart Items List */}
        <div className="flex-1">
           <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <h1 className="text-2xl font-display font-medium text-black italic">Shopping Bag (2 Items)</h1>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Free Shipping Active</span>
           </div>

          <div className="space-y-6">
            {CART_ITEMS.map((item) => (
              <div key={item.id} className={`p-6 bg-white border border-gray-100 shadow-sm flex gap-6 relative ${!item.inStock ? 'opacity-50 grayscale' : ''}`}>
                
                {/* Image */}
                <div className="w-32 h-44 bg-gray-50 rounded-sm relative shrink-0 overflow-hidden border border-gray-50">
                  <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-multiply opacity-90" />
                  {!item.inStock && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-1.5 flex items-center justify-center">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">OUT OF STOCK</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                     <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{item.brand}</h3>
                     <button className="text-gray-300 hover:text-drip-coral transition-colors">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                  <Link href={`/product/${item.id}`} className="text-lg font-medium text-black hover:underline decoration-1 cursor-pointer">{item.name}</Link>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Size: {item.size} | Color: {item.color}</p>
                  
                  <div className="mt-4 flex items-center space-x-3">
                     <span className="text-xl font-black text-black">₹{item.price}</span>
                     <span className="text-sm text-gray-400 line-through font-medium">₹{item.originalPrice}</span>
                  </div>

                  {/* Qty & Save */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded">
                      <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="w-10 text-center text-xs font-black">{item.qty}</span>
                      <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>

                    <button className="flex items-center text-[10px] font-black text-gray-400 hover:text-black transition-colors uppercase tracking-widest">
                       <Heart className="w-3 h-3 mr-1.5" /> Save for later
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="mt-12 p-5 bg-[#F9F7EF] border border-[#F4EFC7] rounded-xl flex items-center space-x-4 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-drip-gold shrink-0" />
            <div>
               <h4 className="text-xs font-black text-black uppercase tracking-widest mb-1">DRIP SECURE & AUTHENTIC</h4>
               <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
                  Every item in your bag is verified for quality and authenticity by our in-house experts before shipment.
               </p>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-[400px]">
           <div className="sticky top-28 space-y-6">
              
              {/* Promo Tool */}
              <div className="p-5 bg-white border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-black transition-all">
                <div className="flex items-center text-black">
                  <Tag className="w-5 h-5 mr-3 text-drip-coral" />
                  <span className="text-xs font-black uppercase tracking-widest">Redeem Coupons / Points</span>
                </div>
                <ChevronDown className="w-5 h-5 -rotate-90 text-gray-300 group-hover:text-black transition-colors" />
              </div>

              {/* Breakdown */}
              <div className="p-8 bg-white border border-gray-100 shadow-sm">
                 <h3 className="text-xs font-black text-black uppercase tracking-[0.2em] border-b border-gray-100 pb-5 mb-5">Order Summary</h3>
                 
                 <div className="space-y-4 text-xs font-medium text-gray-500">
                    <div className="flex justify-between uppercase tracking-widest"><span>Item Total</span><span className="text-black font-bold">₹{itemTotal}</span></div>
                    <div className="flex justify-between uppercase tracking-widest text-drip-coral"><span>Bag Discount</span><span className="font-bold">-₹{discount}</span></div>
                    <div className="flex justify-between uppercase tracking-widest text-[#0055A4]"><span>Delivery</span><span className="font-black text-[10px]">FREE</span></div>
                 </div>

                 <div className="my-8 h-[1px] bg-gray-100"></div>

                 <div className="flex justify-between items-center mb-8">
                    <span className="text-xs font-black text-black uppercase tracking-[0.2em]">Total Payable</span>
                    <span className="text-2xl font-black text-black">₹{total}</span>
                 </div>

                 <Link href="/checkout" className="w-full bg-black text-white py-4 text-xs font-black tracking-[0.2em] uppercase hover:bg-gray-800 transition-all flex justify-center items-center shadow-xl">
                    Proceed to Delivery
                 </Link>

                 <div className="mt-6 flex flex-col items-center text-center space-y-2">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Secure Checkout Powered by Razorpay</p>
                    <div className="flex space-x-3 opacity-20 grayscale">
                       {/* Placeholder for card icons */}
                       <div className="w-8 h-4 bg-gray-400 rounded-sm"></div>
                       <div className="w-8 h-4 bg-gray-400 rounded-sm"></div>
                       <div className="w-8 h-4 bg-gray-400 rounded-sm"></div>
                    </div>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </main>
  );
}
