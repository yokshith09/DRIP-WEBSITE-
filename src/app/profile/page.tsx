'use client';

import { ChevronRight, Package, Heart, RefreshCcw, Bell, Settings, Ruler, Sparkles, MapPin, Coins, LogOut, ChevronLeft, User, MessageCircle, ShoppingBag, Menu, Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MENU_ITEMS = [
  { group: 'Shopping Overview', items: [
    { id: 'orders', label: 'My Orders', desc: 'Track, return, or buy things again', icon: <Package className="w-5 h-5" />, href: '/profile/orders' },
    { id: 'wishlist', label: 'Wishlist & Drops', desc: 'View your saved styles', icon: <Heart className="w-5 h-5" />, href: '/profile/wishlist' },
    { id: 'returns', label: 'Returns & Refunds', desc: 'Manage your active returns', icon: <RefreshCcw className="w-5 h-5" />, href: '/profile/returns' },
    { id: 'address', label: 'Saved Addresses', desc: 'Manage delivery addresses', icon: <MapPin className="w-5 h-5" />, href: '/profile/address' },
  ]},
  { group: 'Style & AI Insights', items: [
    { id: 'locker', label: 'Size Locker', desc: 'Manage body measurements for AI Fit', icon: <Ruler className="w-5 h-5 text-drip-coral" />, href: '/profile/locker' },
    { id: 'style', label: 'Style DNA', desc: 'Edit your visual style preferences', icon: <Sparkles className="w-5 h-5 text-[#0055A4]" />, href: '/profile/style-dna' },
    { id: 'avatar', label: 'Avatar Studio', desc: 'Create your 3D digital double', icon: <User className="w-5 h-5 text-[#0055A4]" />, href: '/avatar-studio' },
    { id: 'shopper', label: 'AI Personal Shopper', desc: 'Chat with your dedicated AI stylist', icon: <MessageCircle className="w-5 h-5 text-drip-coral" />, href: '/shopper-ai' },
  ]},
  { group: 'Account Management', items: [
    { id: 'coins', label: 'DRIP Coins', desc: 'Loyalty points balance: 240', icon: <Coins className="w-5 h-5 text-drip-gold" />, href: '/profile/coins' },
    { id: 'noti', label: 'Notifications', desc: 'Manage alerts & marketing', icon: <Bell className="w-5 h-5" />, href: '/profile/notifications' },
    { id: 'account', label: 'Security Settings', desc: 'Passwords, privacy, devices', icon: <Settings className="w-5 h-5" />, href: '/profile/security' },
  ]},
  { group: 'Atelier Administrator Controls', items: [
    { id: 'admin', label: 'Database Admin Dashboard', desc: 'List or delete catalog products', icon: <Settings className="w-5 h-5 text-[#7A0C16]" />, href: '/admin' }
  ]}
];

export default function Profile() {
  return (
    <main className="min-h-screen bg-gray-50 pb-32">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 pt-10">
        
        {/* Profile Card Header */}
        <div className="bg-white border border-gray-100 p-8 flex flex-col md:flex-row items-center md:justify-between shadow-sm mb-12">
           <div className="flex items-center mb-6 md:mb-0">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl font-display font-black text-black border-4 border-gray-50 shadow-inner">
                 YJ
              </div>
              <div className="ml-8">
                 <h1 className="text-3xl font-display font-medium text-black italic">Yoo Jae-Suk</h1>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">ELITE MEMBER • 240 COINS</p>
                 <div className="mt-4 flex space-x-4">
                    <button className="text-[10px] font-black text-[#0055A4] uppercase tracking-widest hover:underline decoration-2">Edit Profile</button>
                    <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:underline decoration-2">Privacy Policy</button>
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col items-center md:items-end space-y-2">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">REGISTERED SINCE: MAR 2026</div>
              <button className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all">
                 MEMBERSHIP STATUS
              </button>
           </div>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          {MENU_ITEMS.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 pl-2">{group.group}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.items.map((item) => (
                  <Link 
                    key={item.id}
                    href={item.href}
                    className="flex items-center p-6 bg-white border border-gray-100 hover:border-black transition-all group shadow-sm"
                  >
                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-black group-hover:text-white transition-colors">
                       {item.icon}
                    </div>
                    <div className="ml-6 flex-1">
                       <p className="text-[14px] font-bold text-black uppercase tracking-widest leading-none mb-1.5">{item.label}</p>
                       <p className="text-[10px] font-medium text-gray-400 italic mb-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-black transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <button className="mt-12 w-full py-5 border-y border-gray-200 text-xs font-black text-[#FF4D4D] uppercase tracking-[0.3em] hover:bg-[#FFF5F5] transition-all flex items-center justify-center space-x-3">
             <LogOut className="w-5 h-5" />
             <span>Secure Sign Out</span>
          </button>
        </div>

      </div>
      <Footer />
    </main>
  );
}
