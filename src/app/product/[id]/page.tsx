'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Share2, Heart, Star, CheckCircle2, Ruler, Truck, ShieldCheck, Sparkles, ShoppingBag, Menu, MapPin, HeadphonesIcon, ShoppingCart, Eye, Box } from 'lucide-react';
import AIFittingRoomModal from '@/components/AIFittingRoomModal';

const NAV_LINKS = ['MEN', 'WOMEN', 'KIDS', 'BEAUTY', 'HOME & KITCHEN', 'ACCESSORIES'];

const PRODUCT = {
  brand: 'Common Projects',
  name: 'Premium Low Sneakers',
  price: '₹ 8,999',
  originalPrice: '₹ 12,499',
  discount: '28% OFF',
  rating: 4.8,
  reviews: 142,
  images: ['/images/sneakers.png', '/images/jacket.png', '/images/sneakers.png'],
  colors: [
    { name: 'White/Gold', hex: '#FFFFFF' },
    { name: 'Navy', hex: '#1A1A2E' },
    { name: 'Khaki', hex: '#C3B091' }
  ],
  sizes: [
    { val: 'UK 6', available: true },
    { val: 'UK 7', available: true },
    { val: 'UK 8', available: false },
    { val: 'UK 9', available: true },
    { val: 'UK 10', available: true },
    { val: 'UK 11', available: false },
  ]
};

const CROSS_SELLS = [
  { id: 1, name: 'Minimalist Street Jacket', brand: 'Y-3', price: '₹ 4,299', image: '/images/jacket.png' },
  { id: 2, name: 'Classic Leather Tote', brand: 'DRIP Exclusive', price: '₹ 3,299', image: '/images/sneakers.png' },
];

export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [pinCode, setPinCode] = useState('');
  const [showAIFit, setShowAIFit] = useState(false);

  return (
    <main className="min-h-screen bg-white pb-32">
      {/* Consistent Luxury Header */}
      <header className="sticky top-0 w-full h-20 bg-white z-50 border-b border-gray-200 shadow-sm flex items-center px-4 md:px-8">
        <div className="flex items-center space-x-4">
          <Link href="/category" className="p-1 hover:bg-gray-100 rounded-md transition-colors">
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
          <Link href="/profile/style-dna" className="flex flex-col items-center hover:text-[#0055A4] transition-colors">
            <Heart className="w-6 h-6 mb-1 text-gray-700" />
            Wishlist
          </Link>
          <Link href="/cart" className="flex flex-col items-center hover:text-[#0055A4] transition-colors relative">
            <ShoppingCart className="w-6 h-6 mb-1 text-gray-700" />
            Cart
            <span className="absolute -top-1 right-0 w-4 h-4 bg-drip-coral text-white text-[9px] rounded-full flex items-center justify-center font-bold">2</span>
          </Link>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 pt-8 flex flex-col lg:flex-row gap-12">
        
        {/* Gallery Section */}
        <div className="flex-1">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRODUCT.images.map((img, i) => (
                <div key={i} className={`relative aspect-[3/4] bg-gray-50 overflow-hidden ${i === 0 ? 'md:col-span-2 aspect-video' : ''}`}>
                   <Image src={img} alt="Product view" fill className="object-cover mix-blend-multiply opacity-95" priority={i === 0} />
                </div>
              ))}
           </div>
        </div>

        {/* Product Details Section */}
        <div className="lg:w-[450px]">
           <div className="sticky top-28">
              <div className="mb-8">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 italic">{PRODUCT.brand}</h2>
                <h1 className="text-3xl font-display font-medium text-black italic mb-4">{PRODUCT.name}</h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-black text-black">{PRODUCT.price}</span>
                  <span className="text-lg text-gray-400 line-through font-medium">{PRODUCT.originalPrice}</span>
                  <span className="text-[10px] font-bold text-drip-coral bg-drip-coral/5 px-2 py-1 rounded tracking-widest uppercase">{PRODUCT.discount}</span>
                </div>

                <div className="flex items-center space-x-2 text-xs font-bold text-gray-800 mb-4">
                  <div className="flex text-black">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'fill-current' : ''}`} />)}
                  </div>
                  <span className="underline cursor-pointer">{PRODUCT.rating} | {PRODUCT.reviews} Reviews</span>
                </div>
                
                {/* Scarcity Messaging */}
                <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-3 py-1.5 border border-red-100 rounded-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Only 2 left in stock!</span>
                </div>
              </div>

              {/* Selection Options */}
              <div className="space-y-8">
                {/* Color */}
                <div>
                   <h3 className="text-[10px] font-black tracking-widest uppercase mb-4 text-gray-400">Color Variant: <span className="text-black ml-2">{selectedColor.name}</span></h3>
                   <div className="flex space-x-3">
                      {PRODUCT.colors.map(color => (
                        <button 
                          key={color.name}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center p-0.5 transition-all ${selectedColor.name === color.name ? 'ring-2 ring-black' : ''}`}
                        >
                          <div className="w-full h-full rounded-full border border-gray-100 shadow-inner" style={{ backgroundColor: color.hex }}></div>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Size */}
                <div>
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-black tracking-widest uppercase text-gray-400">Select Size</h3>
                      <button className="text-[10px] font-bold text-[#0055A4] flex items-center underline tracking-widest uppercase">
                         <Ruler className="w-3.5 h-3.5 mr-1" /> Size Guide
                      </button>
                   </div>
                   <div className="grid grid-cols-4 gap-2">
                      {PRODUCT.sizes.map(size => (
                        <button 
                          key={size.val}
                          disabled={!size.available}
                          onClick={() => setSelectedSize(size.val)}
                          className={`h-11 border text-xs font-bold transition-all uppercase tracking-widest ${!size.available ? 'opacity-30 line-through bg-gray-50' : selectedSize === size.val ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}`}
                        >
                          {size.val}
                        </button>
                      ))}
                   </div>
                </div>

                {/* AI Recommendation Overlay */}
                <div className="p-4 bg-[#F0F7FF] border border-blue-100 rounded-lg flex items-start space-x-4 shadow-sm">
                   <Sparkles className="w-6 h-6 text-[#0055A4] shrink-0 mt-0.5" />
                   <div>
                      <h4 className="text-[10px] font-black uppercase text-[#0055A4] tracking-widest mb-1">DRIP AI Suggestion</h4>
                      <p className="text-xs font-medium text-[#1A1A2E] leading-relaxed">
                        Based on your profile, <strong className="font-bold">UK 9</strong> is predicted as the best fit.
                      </p>
                   </div>
                </div>

                {/* Main Action Buttons */}
                <div className="flex gap-3 pt-6">
                   <button className="flex-1 bg-black text-white py-4 text-xs font-black tracking-[0.2em] uppercase hover:bg-gray-800 transition-all shadow-xl">
                      Add to Bag
                   </button>
                   <button className="w-16 border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Heart className="w-6 h-6 text-gray-400" />
                   </button>
                </div>

                {/* Secondary Discovery Button */}
                <button 
                  onClick={() => setShowAIFit(true)}
                  className="w-full py-4 border border-black text-black text-xs font-black tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-3"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Virtual Try-On</span>
                </button>
              </div>

              {/* Product Info List */}
              <div className="mt-12 space-y-6">
                 <div className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <Truck className="w-6 h-6 text-gray-400" />
                    <div>
                       <h5 className="text-[10px] font-bold text-black uppercase tracking-widest">Free Express Shipping</h5>
                       <p className="text-[10px] text-gray-400 font-medium">Delivered within 48 hours for Elite Members.</p>
                    </div>
                 </div>
                 <div className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <ShieldCheck className="w-6 h-6 text-gray-400" />
                    <div>
                       <h5 className="text-[10px] font-bold text-black uppercase tracking-widest">DRIP Authenticity Shield</h5>
                       <p className="text-[10px] text-gray-400 font-medium">Authenticity certificate included with every purchase.</p>
                    </div>
                 </div>
                 
                 {/* Fabric Details & 3D Viewer Mock */}
                 <div className="p-5 border border-gray-100 rounded-xl bg-gray-50/50">
                    <h5 className="text-[10px] font-black text-black uppercase tracking-widest mb-3 flex items-center space-x-2">
                      <Box className="w-4 h-4" /> <span>Materials & Construction</span>
                    </h5>
                    <ul className="text-xs text-gray-500 font-medium space-y-2 mb-4 leading-relaxed">
                       <li>• 100% Premium Italian Leather</li>
                       <li>• Semi-transparent Rubber Cupsole</li>
                       <li>• Margom sole construction for durability</li>
                       <li>• Clean minimal branding (gold foil serial number)</li>
                       <li>• Includes dust bag and extra laces</li>
                    </ul>
                    <button className="w-full py-3 bg-white border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:border-black transition-colors flex items-center justify-center space-x-2 shadow-sm">
                       <Eye className="w-4 h-4 text-drip-coral" />
                       <span>Open 3D Fabric Viewer</span>
                    </button>
                 </div>

                 {/* FAQs for SEO/AI Context */}
                 <div className="p-5 border border-gray-100 rounded-xl bg-white">
                    <h5 className="text-[10px] font-black text-black uppercase tracking-widest mb-4">Product FAQs</h5>
                    <div className="text-xs text-gray-500 font-medium space-y-4">
                       <p><strong className="text-black block mb-1">How does the sizing run?</strong>True to size. However, if you are between sizes, we recommend sizing down.</p>
                       <p><strong className="text-black block mb-1">Are they waterproof?</strong>They are highly water-resistant but not fully waterproof. We recommend a leather protector spray.</p>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </div>

      {/* Cross Sells (Bottom) */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-12 py-24">
         <h3 className="text-2xl font-display font-medium italic mb-10">Complete The Look</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {CROSS_SELLS.map(item => (
              <Link href={`/product/${item.id}`} key={item.id} className="group flex flex-col cursor-pointer">
                <div className="w-full aspect-[4/5] bg-gray-50 relative p-4 mb-3 border border-gray-50 group-hover:shadow-md transition-all">
                   <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-gray-400">{item.brand}</h4>
                <p className="text-xs font-medium text-black truncate">{item.name}</p>
                <p className="text-xs font-bold text-black mt-1">{item.price}</p>
              </Link>
            ))}
         </div>
      </section>

      <AIFittingRoomModal 
        isOpen={showAIFit} 
        onClose={() => setShowAIFit(false)} 
        productImage={PRODUCT.images[0]} 
      />
    </main>
  );
}
