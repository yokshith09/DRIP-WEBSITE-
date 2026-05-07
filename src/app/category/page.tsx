'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Heart, User, ShoppingBag, SlidersHorizontal, ChevronDown, X, Menu, MapPin, HeadphonesIcon, ShoppingCart, Star } from 'lucide-react';
import SmartFilter from '../../components/SmartFilter';

const NAV_LINKS = ['MEN', 'WOMEN', 'KIDS', 'BEAUTY', 'HOME & KITCHEN', 'ACCESSORIES'];

const CATALOG = [
  { id: 1, name: 'Minimalist Street Jacket', brand: 'Y-3', price: '₹ 4,299', original: '₹ 6,499', rating: '4.8', reviews: '12k', image: '/images/jacket.png', isNew: true },
  { id: 2, name: 'Premium Low Sneakers', brand: 'Common Projects', price: '₹ 8,999', original: '₹ 12,499', rating: '4.9', reviews: '8k', image: '/images/sneakers.png' },
  { id: 3, name: 'Oversized Knit Sweater', brand: 'Ami Paris', price: '₹ 5,499', original: '₹ 7,199', rating: '4.7', reviews: '3k', image: '/images/jacket.png' },
  { id: 4, name: 'Classic Leather Tote', brand: 'DRIP Exclusive', price: '₹ 3,299', original: '₹ 4,999', rating: '4.6', reviews: '1k', image: '/images/sneakers.png' },
  { id: 5, name: 'Nylon Cargo Pants', brand: 'Nike ACG', price: '₹ 6,499', original: '', rating: '4.8', reviews: '15k', image: '/images/jacket.png' },
  { id: 6, name: 'Signature Track Top', brand: 'Essentials', price: '₹ 7,199', original: '₹ 10,299', rating: '4.9', reviews: '22k', image: '/images/jacket.png' },
  { id: 7, name: 'Suede Chelsea Boots', brand: 'Saint Laurent', price: '₹ 22,999', original: '', rating: '4.9', reviews: '2k', image: '/images/sneakers.png' },
  { id: 8, name: 'Monogram Cardholder', brand: 'Goyard', price: '₹ 14,299', original: '₹ 20,499', rating: '4.8', reviews: '5k', image: '/images/sneakers.png' },
];

export default function CategoryPage() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <main className="min-h-screen pb-20 bg-white">
      {/* Optimized Header (Shared with Home) */}
      <header className="sticky top-0 w-full h-20 bg-white z-50 border-b border-gray-200 shadow-sm flex items-center px-4 md:px-8">
        <div className="flex items-center space-x-4">
          <button className="p-1 hover:bg-gray-100 rounded-md transition-colors">
             <Menu className="w-6 h-6 text-drip-dark" />
          </button>
          <Link href="/" className="text-2xl font-display font-black tracking-widest text-[#0055A4] flex items-center">
            DRIP
          </Link>
        </div>

        <nav className="hidden lg:flex items-center space-x-8 ml-10">
          {NAV_LINKS.map(link => (
            <button key={link} className="text-[12px] font-bold tracking-wide hover:text-[#0055A4] transition-colors">
              {link}
            </button>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm mx-10 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search for &quot;Jackets&quot;" 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-md text-sm text-drip-dark focus:outline-none focus:ring-1 focus:ring-[#0055A4]/10 transition-all font-medium"
          />
        </div>

        <div className="ml-auto flex items-center space-x-6 text-xs font-medium text-drip-dark">
          <Link href="/profile" className="flex flex-col items-center hover:text-[#0055A4] transition-colors">
            <User className="w-6 h-6 mb-1 text-gray-700" />
            Account
          </Link>
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

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-6">
        
        {/* Breadcrumb and Page Header */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-black">New Arrivals</span>
          </div>
          <h2 className="text-3xl font-display font-medium text-black italic">New Arrivals</h2>
        </div>

        {/* Filters Toolbar (AJIO/Nykaa Style) */}
        <div className="flex items-center justify-between py-3 border-y border-gray-100 sticky top-20 z-40 bg-white/95 backdrop-blur-md mb-8">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setFilterOpen(true)}
              className="flex items-center space-x-2 border rounded px-4 py-1.5 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest text-black">Filter</span>
              <span className="bg-[#0055A4] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">3</span>
            </button>
            <div className="hidden md:flex items-center space-x-3">
               <div className="text-[10px] font-bold text-gray-400 p-1 tracking-widest uppercase">Active:</div>
               <span className="text-[10px] font-bold px-3 py-1 bg-gray-100 rounded-full flex items-center">BLACK <X className="w-3 h-3 ml-2 cursor-pointer hover:text-black" /></span>
               <span className="text-[10px] font-bold px-3 py-1 bg-gray-100 rounded-full flex items-center">UK 9 <X className="w-3 h-3 ml-2 cursor-pointer hover:text-black" /></span>
            </div>
          </div>

          <div className="flex items-center space-x-2 cursor-pointer group">
             <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Sort By:</span>
             <span className="text-xs font-bold text-black group-hover:underline">Relevance</span>
             <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Product Grid (Matching Home page cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATALOG.map((item) => (
            <Link href={`/product/${item.id}`} key={item.id} className="group flex flex-col bg-white border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
               
               {/* Image Area */}
               <div className="w-full aspect-[4/5] bg-gray-50 relative p-4 mb-2">
                  <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-300 hover:text-drip-coral z-20 transition-colors">
                     <Heart className="w-4 h-4" />
                  </button>
                  
                  {/* Rating Badge */}
                  <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded shadow-sm flex items-center space-x-1 z-20 font-sans text-[10px] border border-gray-100">
                    <Star className="w-3 h-3 fill-black text-black" />
                    <span className="font-bold text-gray-800">{item.rating}</span>
                    <span className="text-gray-400">| {item.reviews}</span>
                  </div>

                  {item.isNew && (
                    <div className="absolute top-0 left-0 bg-drip-navy text-white text-[9px] font-bold px-2 py-1 z-20 uppercase tracking-widest">
                       New Arrival
                    </div>
                  )}

                  <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500" />
               </div>

               {/* Product Info */}
               <div className="px-4 pb-2 flex-grow flex flex-col">
                  <h4 className="text-[10px] font-black text-black uppercase tracking-widest mb-1">{item.brand}</h4>
                  <p className="text-[13px] font-medium text-gray-600 leading-snug line-clamp-2 h-9 mb-2">{item.name}</p>
                  
                  <div className="mt-auto flex items-center space-x-2 pb-4">
                     <span className="text-sm font-black text-black">{item.price}</span>
                     {item.original && <span className="text-xs text-gray-400 line-through font-medium">{item.original}</span>}
                  </div>
               </div>

               {/* AI Fit Hint Overlay (Visible on hover) */}
               <div className="absolute top-2 right-2 hidden group-hover:block transition-all z-30">
                  <div className="bg-drip-green/90 backdrop-blur-sm text-white px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest shadow-sm">
                     92% Match
                  </div>
               </div>
            </Link>
          ))}
        </div>
      </div>

      <SmartFilter isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
    </main>
  );
}
