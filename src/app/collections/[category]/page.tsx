'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Star, Heart, SlidersHorizontal, ChevronRight, Scissors } from 'lucide-react';
import { useProductStore } from '../../../store/products';
import { Product } from '../../../components/ProductCard';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SECTION_MAP: Record<string, string[]> = {
  mens:        ['Shirts', 'Pants', 'Jeans', 'Polos'],
  womens:      ['Shirts', 'Pants', 'Jeans', 'Polos'],
  accessories: ['Watches', 'Bags', 'Sunglasses', 'Jewelry'],
};

const CATEGORY_LABELS: Record<string, string> = {
  mens:        "MEN'S COLLECTION",
  womens:      "WOMEN'S COLLECTION",
  accessories: 'ACCESSORIES',
};

function ProductCard({ product }: { product: Product & { subcategory?: string } }) {
  const [wished, setWished] = useState(false);

  return (
    <div className="group flex flex-col bg-white border border-gray-100 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-2xl overflow-hidden relative">
      {/* Image Area */}
      <div className="w-full aspect-[4/5] bg-gray-50 relative overflow-hidden">
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-black px-2.5 py-1 z-20 uppercase tracking-widest rounded-full">
            New
          </div>
        )}

        <button
          onClick={() => setWished(!wished)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center z-20 transition-all ${wished ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wished ? 'fill-red-500' : ''}`} />
        </button>

        {/* AI Match Badge */}
        <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full flex items-center space-x-1 z-20 text-[9px] font-bold">
          <Sparkles className="w-2.5 h-2.5 text-yellow-400" />
          <span>{product.matchPercentage ?? 90}% AI Match</span>
        </div>

        {/* Rating */}
        <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-full shadow-sm flex items-center space-x-1 z-20 text-[10px] border border-gray-100">
          <Star className="w-3 h-3 fill-black text-black" />
          <span className="font-bold text-gray-800">{product.rating}</span>
          <span className="text-gray-400">({product.reviews})</span>
        </div>

        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Info */}
      <div className="px-4 pt-4 pb-5 flex flex-col gap-1">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{product.brand}</span>
        <p className="text-[13px] font-semibold text-gray-800 leading-snug line-clamp-2">{product.name}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-black text-gray-900">{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
          )}
        </div>

        {/* Try On + Add to Cart */}
        <div className="flex gap-2 mt-4">
          <Link
            href="/avatar-studio"
            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl hover:bg-drip-coral transition-colors"
          >
            <Scissors className="w-3 h-3" />
            AI Try-On
          </Link>
          <Link
            href={`/product/${product.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl hover:border-black hover:text-black transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CollectionPage() {
  const params = useParams();
  const categoryParam = (params?.category as string) ?? 'mens';
  let category = categoryParam.toLowerCase();
  
  // Normalize singular/plural routing parameters
  if (category === 'men') category = 'mens';
  if (category === 'women') category = 'womens';

  const { products } = useProductStore();
  const allProducts: (Product & { subcategory?: string })[] = products.filter(
    (p) => p.category === category
  );

  const sections = SECTION_MAP[category] ?? ['Shirts', 'Pants', 'Jeans', 'Polos'];
  const [activeSection, setActiveSection] = useState<string>('All');

  const displayedProducts =
    activeSection === 'All'
      ? allProducts
      : allProducts.filter((p) => (p.subcategory ?? '').toLowerCase() === activeSection.toLowerCase());

  const label = CATEGORY_LABELS[category] ?? 'COLLECTION';

  return (
    <main className="min-h-screen bg-[#FAF9F7] font-sans text-gray-900">
      <Navbar />

      {/* ── AI FITTING ROOM BANNER ── */}
      <div className="bg-gray-950 text-white py-3 px-5 flex items-center justify-center gap-3 text-center">
        <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 animate-pulse" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em]">
          AI Fitting Room — Try any item on your virtual avatar instantly
        </p>
        <Link
          href="/avatar-studio"
          className="ml-2 bg-white text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full hover:bg-drip-coral hover:text-white transition-colors flex-shrink-0"
        >
          Try Now
        </Link>
      </div>

      {/* ── BREADCRUMB ── */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-6 pb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-black">{label}</span>
      </div>

      {/* ── HERO STRIP ── */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 pb-8 pt-2">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-gray-900 leading-[0.9]">
          {label}
        </h1>
        <p className="text-gray-500 text-sm mt-3 font-medium">{allProducts.length} styles available</p>
      </div>

      {/* ── SECTION FILTER TABS ── */}
      <div className="sticky top-[56px] z-40 bg-white/95 backdrop-blur border-y border-gray-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 flex items-center gap-2 overflow-x-auto hide-scrollbar py-3">
          {['All', ...sections].map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                activeSection === sec
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {sec}
            </button>
          ))}
          <div className="ml-auto flex-shrink-0 flex items-center gap-2 text-[11px] font-bold text-gray-500 cursor-pointer hover:text-black">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden md:inline">Filter</span>
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-10">
        {activeSection === 'All' ? (
          sections.map((sec) => {
            const sectionProducts = allProducts.filter(
              (p) => (p.subcategory ?? '').toLowerCase() === sec.toLowerCase()
            );
            if (sectionProducts.length === 0) return null;

            return (
              <div key={sec} className="mb-16">
                {/* Section heading with divider */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.35em] text-gray-400 mb-1">
                      {label}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900">
                      {sec}
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveSection(sec)}
                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
                  >
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                  {sectionProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.35em] text-gray-400 mb-1">
                  {label}
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900">
                  {activeSection}
                </h2>
              </div>
              <span className="text-[11px] font-bold text-gray-400">{displayedProducts.length} items</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {displayedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {displayedProducts.length === 0 && (
              <div className="text-center py-24 text-gray-400">
                <p className="text-xl font-black uppercase">No products in this section yet</p>
                <p className="text-sm mt-2">Check back soon or explore another category</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── AI FITTING ROOM CTA ── */}
      <section className="bg-gray-950 text-white py-20 px-5 text-center">
        <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-4 animate-pulse" />
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          AI FITTING ROOM
        </h2>
        <p className="text-gray-400 max-w-md mx-auto text-sm font-medium mb-8 leading-relaxed">
          Upload your photo and virtually try on any item from our collection — instantly, no guessing required.
        </p>
        <Link
          href="/avatar-studio"
          className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 rounded-full text-[12px] font-black uppercase tracking-[0.15em] hover:bg-drip-coral hover:text-white transition-all shadow-xl"
        >
          <Scissors className="w-4 h-4" />
          Open AI Fitting Room
        </Link>
      </section>

      <Footer />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}
