'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, MoreVertical, Search, CheckCircle2, SlidersHorizontal, ChevronLeft } from 'lucide-react';

const FEED_DATA = [
  {
    id: 1,
    user: 'krishna.styles',
    verified: true,
    avatar: 'K',
    caption: 'Obsessed with these new Common Projects lows. Worth every penny. #streetwear #minimal',
    image: '/images/sneakers.png', // Using the sneakers image as full bleed mockup
    likes: '14.2K',
    comments: '234',
    productDetail: { id: 2, name: 'Premium Low Sneakers', brand: 'Common Projects', price: '₹8,999' }
  },
  {
    id: 2,
    user: 'vogue_yoksh',
    verified: true,
    avatar: 'Y',
    caption: 'Layering szn is here. Rate this fit 1-10 🔥',
    image: '/images/jacket.png', // Using the jacket image
    likes: '8.9K',
    comments: '112',
    productDetail: { id: 1, name: 'Minimalist Street Jacket', brand: 'Y-3', price: '₹4,299' }
  }
];

export default function CommunityFeed() {
  const [activeTab, setActiveTab] = useState<'FOR_YOU' | 'FOLLOWING'>('FOR_YOU');

  return (
    <main className="h-screen bg-black overflow-hidden relative">
      
      {/* Ghost Overlay Header */}
      <header className="absolute top-0 w-full z-40 p-4 pt-[safe-top] pb-6 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white">
        <Link href="/" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
        <div className="flex space-x-6 text-sm font-bold tracking-widest uppercase">
          <button 
            onClick={() => setActiveTab('FOLLOWING')} 
            className={`transition-colors ${activeTab === 'FOLLOWING' ? 'text-white' : 'text-white/50'}`}
          >
            Following
          </button>
          <button 
            onClick={() => setActiveTab('FOR_YOU')} 
            className={`relative transition-colors ${activeTab === 'FOR_YOU' ? 'text-white' : 'text-white/50'}`}
          >
            For You
            {activeTab === 'FOR_YOU' && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>}
          </button>
        </div>
        <button className="p-2 -mr-2 hover:bg-white/10 rounded-full transition-colors"><Search className="w-5 h-5" /></button>
      </header>

      {/* Infinite Scroll Container (Mock) */}
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
        {FEED_DATA.map((post) => (
          <div key={post.id} className="w-full h-full snap-start relative bg-drip-navy flex items-center justify-center">
            
            <Image 
              src={post.image} 
              alt="Style post" 
              fill 
              className="object-cover opacity-90 transition-opacity mix-blend-luminosity" 
              priority 
            />

            {/* Gradient Mask for bottom text legibility */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"></div>

            {/* Right Action Bar */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 z-30">
               <div className="relative cursor-pointer hover:scale-105 transition-transform">
                 <div className="w-12 h-12 rounded-full border-2 border-white bg-drip-coral flex items-center justify-center text-white font-display text-xl font-bold">
                   {post.avatar}
                 </div>
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-drip-coral rounded-full flex items-center justify-center border border-white text-white text-xs">+</div>
               </div>

               <button className="flex flex-col items-center text-white group">
                 <div className="p-3 bg-black/20 backdrop-blur-md rounded-full mb-1 group-hover:bg-drip-coral/20 transition-colors">
                    <Heart className="w-7 h-7" />
                 </div>
                 <span className="text-xs font-semibold">{post.likes}</span>
               </button>

               <button className="flex flex-col items-center text-white group">
                 <div className="p-3 bg-black/20 backdrop-blur-md rounded-full mb-1 group-hover:bg-white/20 transition-colors">
                    <MessageCircle className="w-7 h-7" />
                 </div>
                 <span className="text-xs font-semibold">{post.comments}</span>
               </button>

               <button className="flex flex-col items-center text-white group">
                 <div className="p-3 bg-black/20 backdrop-blur-md rounded-full mb-1 group-hover:bg-white/20 transition-colors">
                    <Share2 className="w-7 h-7" />
                 </div>
                 <span className="text-xs font-semibold">Share</span>
               </button>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-6 left-4 right-20 z-30 flex flex-col justify-end text-white pb-safe">
               <div className="flex items-center space-x-2 mb-2">
                 <span className="font-bold text-[15px] hover:underline cursor-pointer">@{post.user}</span>
                 {post.verified && <CheckCircle2 className="w-4 h-4 text-drip-coral fill-current" />}
               </div>
               
               <p className="text-sm mb-4 leading-snug font-medium line-clamp-3 w-[90%]">
                 {post.caption}
               </p>

               {/* Product Tag To Buy (The Core Conversion Flow) */}
               <Link href={`/product/${post.productDetail.id}`} className="bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-xl flex items-center space-x-3 w-max max-w-full cursor-pointer hover:bg-white/20 transition-colors group">
                 <div className="w-10 h-10 bg-white rounded-md overflow-hidden relative shrink-0">
                    <Image src={post.image} alt="tag" fill className="object-cover" />
                 </div>
                 <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center text-[10px] text-white/70 font-bold uppercase tracking-widest mb-0.5">
                       Shop Exact Fit <SlidersHorizontal className="w-3 h-3 ml-1" />
                    </div>
                    <div className="text-sm font-semibold truncate group-hover:underline">{post.productDetail.name}</div>
                 </div>
               </Link>
            </div>

          </div>
        ))}
      </div>
    </main>
  );
}
