'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu } from 'lucide-react';
import { useCartStore } from '../store/cart';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-[60] transition-all duration-300 flex items-center justify-between px-5 md:px-10 h-[72px] bg-white/95 backdrop-blur-md ${scrolled ? 'shadow-md border-b border-gray-100' : 'border-b border-gray-100'}`}>
      <div className="flex items-center space-x-5">
        <button className="p-1.5 hover:bg-gray-50 rounded-md lg:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="text-2xl font-display font-black tracking-tight text-drip-navy">
          DRIP
        </Link>
      </div>
      
      <nav className="hidden lg:flex items-center space-x-7">
        {['MEN', 'WOMEN', 'ACCESSORIES', 'AI STUDIO'].map((item) => (
          <Link 
            key={item} 
            href={
              item === 'AI STUDIO' ? '/avatar-studio' : 
              item === 'MEN' ? '/collections/mens' :
              item === 'WOMEN' ? '/collections/womens' :
              item === 'ACCESSORIES' ? '/collections/accessories' :
              '/category'
            } 
            className="text-[14px] font-sans font-medium text-gray-800 hover:text-black transition-colors"
          >
            {item}
          </Link>
        ))}
      </nav>
      
      <div className="flex items-center space-x-3">
        <button className="p-2 hover:bg-gray-50 rounded-md hidden md:block">
          <Search className="w-[18px] h-[18px] text-gray-500" />
        </button>
        <Link href="/profile" className="p-2 hover:bg-gray-50 rounded-md">
          <User className="w-[18px] h-[18px] text-gray-500" />
        </Link>
        <Link href="/cart" className="relative p-2 hover:bg-gray-50 rounded-md">
          <ShoppingBag className="w-[18px] h-[18px] text-gray-500" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-drip-coral text-white text-[8px] rounded-full flex items-center justify-center font-bold">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
