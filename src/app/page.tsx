'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Heart, User, ShoppingBag, Menu, Sparkles, Truck, ShieldCheck, Crown, ChevronLeft, ChevronRight, Scissors, Wind, Settings, Shield } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIFittingRoomModal from '../components/AIFittingRoomModal';
import { useProductStore } from '../store/products';

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const HERO_SLIDES = [
  { id: 1, title: 'THE NEW ERA\nOF FITTING', sub: 'VIRTUAL DRAPING AND BODY MAPPING AT THE SPEED OF LIGHT', cta: 'ENTER ATELIER', img: '/images/hero/luxury_hero_vton_v2.png' },
  { id: 2, title: 'ATELIER ANATOMY\nAND SUITING', sub: 'PREMIUM TAILORED SHIRTS AND SUITS CURATED FOR YOUR ANATOMY', cta: 'TRY ON THE EDIT', img: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/TBH-SAPOL-CR_1.jpg?v=1768995505' },
  { id: 3, title: 'STYLE DNA\nFORMULATION', sub: 'CALIBRATE SIZING PROFILE & DISCOVER BESPOKE RESORTWEAR', cta: 'CALIBRATE SIZE', img: 'https://cdn.shopify.com/s/files/1/0596/1164/3997/files/PurpleFloralJacquardShirt.jpg?v=1781256701' },
];

const MAIN_COLLECTIONS = [
  { name: "SHIRTS & CASUAL TOPS", img: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/TBH-CLUB-CR-1.webp?v=1780643129', href: '/collections/mens?sub=Shirts' },
  { name: "JEANS & DENIMS", img: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/DNM-SERENE-MB_1.webp?v=1781855065', href: '/collections/mens?sub=Jeans' },
  { name: "CARGO PANTS", img: 'https://cdn.shopify.com/s/files/1/0517/2939/9964/files/CAR-EVERLYS-OL_1.webp?v=1781682098', href: '/collections/mens?sub=Pants' },
  { name: "ACCESSORIES & WATCHES", img: 'https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_75,w_1080/v1/assets/images/2025/FEBRUARY/26/zsn4qxU9_f2557c67ad884b24a01b6110c0398d0c.jpg', href: '/collections/accessories' },
];

const ACCESSORIES_COLLECTIONS = [
  { name: 'Chronograph Watches', img: 'https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_75,w_1080/v1/assets/images/2025/FEBRUARY/26/zsn4qxU9_f2557c67ad884b24a01b6110c0398d0c.jpg', href: '/collections/accessories', count: '14 Products' },
  { name: 'Premium Belts', img: 'https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_75,w_1080/v1/assets/images/17825602/2022/4/8/f0be4780-5a8d-4ea3-b6cd-106b1ed0aaad1649432036525CalvadossMenBlackBelts1.jpg', href: '/collections/accessories', count: '6 Products' },
  { name: 'Sneakers Shoes', img: 'https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_75,w_1080/v1/assets/images/2026/MARCH/18/EB22bKlK_e84195a0622440c99ac393cc74763958.jpg', href: '/collections/mens?sub=Sneakers', count: '16 Products' },
  { name: 'Utility Gear', img: 'https://assets.myntassets.com/h_200,w_200,c_fill,g_auto/h_1440,q_75,w_1080/v1/assets/images/2026/MARCH/17/hWzfSQPb_8aa80dd881104defa615b380ac66bf43.jpg', href: '/collections/accessories', count: '2 Products' },
];



// ═══════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════

const SectionHeading = ({ title, subtitle, align = 'left' }: { title: string, subtitle?: string, align?: 'left' | 'center' }) => (
  <div className={`mb-8 md:mb-12 ${align === 'center' ? 'text-center' : ''}`}>
    {subtitle && <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">{subtitle}</span>}
    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.1em] text-gray-900 leading-tight">{title}</h2>
  </div>
);

const NewLaunchedContainer = ({ title, desc, img, href, category }: { title: string, desc: string, img: string, href: string, category?: string }) => (
  <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-xl overflow-hidden group bg-black shadow-lg">
    <Image src={img} alt={title} fill className="object-cover object-top opacity-60 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center p-6 md:p-10">
      <div className="max-w-md">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center space-x-2 text-drip-coral text-[10px] font-black uppercase tracking-[0.3em] bg-drip-coral/10 py-1.5 px-3 rounded-full border border-drip-coral/20">
            <Sparkles className="w-3 h-3" /> <span>Just Dropped</span>
          </span>
          {category && (
            <span className="bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] py-1.5 px-4 rounded-full shadow-lg">
              {category}
            </span>
          )}
        </div>
        <h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight leading-none mb-3">{title}</h3>
        <p className="text-gray-300 text-[11px] md:text-xs font-medium mb-6 leading-relaxed drop-shadow-md line-clamp-2">{desc}</p>
        <Link href={href} className="inline-block bg-white text-black px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-drip-coral hover:text-white transition-all shadow-lg">
          Explore Drop
        </Link>
      </div>
    </div>
  </div>
);

const CollectionGrid = ({ collections, dark = false }: { collections: any[], dark?: boolean }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 md:gap-10 max-w-[1400px] mx-auto px-5 md:px-12">
    {collections.map((col, idx) => (
      <Link href={col.href} key={idx} className="group flex flex-col items-center text-center">
        <div className={`w-full aspect-[4/5] overflow-hidden relative rounded-2xl mb-5 shadow-sm ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <Image src={col.img} alt={col.name} fill className={`object-cover object-top group-hover:scale-105 transition-transform duration-500 ${dark ? 'opacity-80 group-hover:opacity-100' : ''}`} />
        </div>
        <h4 className={`${dark ? 'text-white' : 'text-gray-900'} text-xs md:text-sm font-black uppercase tracking-[0.15em] leading-tight`}>{col.name}</h4>
        {col.count && <span className={`${dark ? 'text-gray-400' : 'text-gray-500'} text-[9px] font-bold mt-2 block tracking-[0.2em] uppercase`}>{col.count}</span>}
      </Link>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function Home() {
  const { products } = useProductStore();
  const [heroSlide, setHeroSlide] = useState(0);
  const [tryOnProduct, setTryOnProduct] = useState<any>(null);

  // Dynamic filter lists from store
  const MENS_PRODUCTS = products.filter(p => p.category === 'mens' && p.subcategory !== 'Sneakers').slice(0, 4);
  const WOMENS_PRODUCTS = products.filter(p => p.category === 'womens').slice(0, 4);
  const SNEAKER_PRODUCTS = products.filter(p => p.subcategory === 'Sneakers').slice(0, 4);

  useEffect(() => {
    const t = setInterval(() => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = HERO_SLIDES[heroSlide];

  // Helper to open default try-on or target flow
  const handleHeroCTA = (slideId: number) => {
    if (slideId === 3) {
      window.location.href = '/avatar-studio';
    } else {
      // Open fitting room with a popular product (e.g. bh-buck-bk)
      const defaultProduct = products.find(p => p.id === 'bh-buck-bk') || products[0];
      setTryOnProduct(defaultProduct);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F7] font-sans text-gray-900">



      <Navbar />

      {/* ══════ HERO CAROUSEL ══════ */}
      <section className="relative w-full h-[calc(100vh-56px)] overflow-hidden bg-gray-900">
        {HERO_SLIDES.map((s, i) => (
          <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroSlide ? 'opacity-100' : 'opacity-0'}`}>
            <Image src={s.img} alt={s.title} fill className="object-cover object-top" priority={i === 0} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75"></div>
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10">
          <h1 key={heroSlide} className="text-white text-5xl md:text-7xl lg:text-[100px] xl:text-[120px] font-black leading-[0.85] tracking-tighter uppercase mb-8 whitespace-pre-line animate-text-reveal font-display" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.4)' }}>
            {slide.title}
          </h1>
          <p className="text-white/80 text-xs md:text-sm font-bold tracking-[0.35em] uppercase mb-12 animate-fade-in-up" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.4)' }}>{slide.sub}</p>
          <button 
            onClick={() => handleHeroCTA(slide.id)} 
            className="bg-white text-black px-14 py-4 text-[11px] font-black uppercase tracking-[0.25em] hover:bg-drip-coral hover:text-white transition-all rounded-full animate-fade-in-up shadow-xl cursor-pointer"
          >
            {slide.cta}
          </button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setHeroSlide(i)} className={`h-[3px] rounded-full transition-all duration-500 ${i === heroSlide ? 'w-14 bg-white' : 'w-7 bg-white/30 hover:bg-white/50'}`} />
          ))}
        </div>
        <button onClick={() => setHeroSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all border border-white/15"><ChevronLeft className="w-5 h-5" /></button>
        <button onClick={() => setHeroSlide((p) => (p + 1) % HERO_SLIDES.length)} className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/25 transition-all border border-white/15"><ChevronRight className="w-5 h-5" /></button>
      </section>

      {/* ══════ MAIN COLLECTIONS ══════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {MAIN_COLLECTIONS.map((cat, i) => (
              <Link key={i} href={cat.href} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100">
                <Image src={cat.img} alt={cat.name} fill className="object-cover object-top group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 w-full p-8 text-center translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-xl md:text-2xl font-black uppercase tracking-[0.1em]">{cat.name}</h3>
                </div>
                <div className="absolute top-4 right-4 bg-black/65 backdrop-blur-md text-white border border-white/15 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest z-10 shadow-sm">
                  Interactive Try-On
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FREE SHIPPING STRIP ══════ */}
      <div className="bg-[#F5F3F0] border-y border-[#EDE9E3] py-4 text-center">
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">FREE SHIPPING AND RETURNS ON ALL ORDERS</span>
      </div>

      {/* ══════ LATEST DROPS ══════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <SectionHeading title="LATEST DROPS" subtitle="Fresh Arrivals" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <NewLaunchedContainer
              category="MEN"
              title="URBAN UTILITY"
              desc="Technical fabrics and unapologetic street aesthetic. Designed for the relentless city dweller."
              img="/images/hero/cat-men-jackets.png"
              href="/category?c=new-men"
            />
            <NewLaunchedContainer
              category="WOMEN"
              title="MODERN MINIMALIST"
              desc="Clean lines and versatile silhouettes. Setting the new standard for everyday elegance."
              img="/images/hero/latest-women-drop.png"
              href="/category?c=new-women"
            />
          </div>
        </div>
      </section>

      {/* ══════ BRAND STORY SECTION ══════ */}
      <section className="py-24 md:py-32 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(233,69,96,0.05),_transparent_50%)]"></div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="inline-block text-drip-coral text-[10px] font-black uppercase tracking-[0.5em] mb-8 border border-drip-coral/30 px-5 py-2 rounded-full bg-drip-coral/5">Our Identity</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-10">
                100% VIRTUAL TRY-ON.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">AI COLOR MATCHING.</span>
              </h2>
              <div className="space-y-6 text-gray-400 font-medium leading-relaxed max-w-xl text-base md:text-lg">
                <p>
                  DRIP is a premier contemporary fast-fashion brand. We design and manufacture high-fidelity modern apparel, engineered around premium cuts, clean lines, and responsive fabrics.
                </p>
                <p>
                  Experience the future of fashion shopping with our built-in virtual fitting room, allowing you to drape any look over your silhouette and match colors to your style DNA instantly.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden border border-white/10">
                <Image src="/images/hero/brand-materials.png" alt="Craftsmanship" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Virtual Fitting</p>
                </div>
              </div>
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden translate-y-12 border border-white/10">
                <Image src="/images/hero/cat-sneakers.png" alt="Innovation" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">DNA Styling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ MEN'S CATEGORY GRID ══════ */}
      <section className="py-20 md:py-28 bg-white border-t border-[#EDE9E3]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <SectionHeading title="SHOP MEN'S" align="center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {MENS_PRODUCTS.map(p => <ProductCard key={p.id} product={p as any} onTryOn={setTryOnProduct} />)}
          </div>
          <div className="mt-12 text-center">
            <Link href="/collections/mens" className="inline-block bg-black text-white px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-drip-coral transition-colors shadow-lg">View All Men's</Link>
          </div>
        </div>
      </section>

      {/* ══════ WOMEN'S CATEGORY GRID ══════ */}
      <section className="py-20 md:py-28 bg-[#FAF9F7] border-t border-[#EDE9E3]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <SectionHeading title="SHOP WOMEN'S" align="center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {WOMENS_PRODUCTS.map(p => <ProductCard key={p.id} product={p as any} onTryOn={setTryOnProduct} />)}
          </div>
          <div className="mt-12 text-center">
            <Link href="/collections/womens" className="inline-block bg-black text-white px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-drip-coral transition-colors shadow-lg">View All Women's</Link>
          </div>
        </div>
      </section>

      {/* ══════ TRENDING FOOTWEAR GRID ══════ */}
      <section className="py-20 md:py-28 bg-white border-t border-[#EDE9E3]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <SectionHeading title="TRENDING FOOTWEAR" align="center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {SNEAKER_PRODUCTS.map(p => <ProductCard key={p.id} product={p as any} onTryOn={setTryOnProduct} />)}
          </div>
          <div className="mt-12 text-center">
            <Link href="/collections/mens?sub=Sneakers" className="inline-block bg-black text-white px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-drip-coral transition-colors shadow-lg">View All Footwear</Link>
          </div>
        </div>
      </section>

      {/* ══════ ACCESSORIES CATEGORY GRID ══════ */}
      <section className="py-16 md:py-24 bg-gray-950 text-white border-t border-gray-900">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12 mb-10 md:mb-12 text-center">
          <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-2">The Vault</span>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.1em] text-white">ACCESSORIES</h2>
        </div>
        <CollectionGrid collections={ACCESSORIES_COLLECTIONS} dark={true} />
      </section>

      {/* ══════ THE DRIP STANDARD (ABOUT US) ══════ */}
      <section className="py-24 md:py-32 bg-[#FAF9F7] border-t border-[#EDE9E3]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 text-center">

          <span className="inline-block text-gray-400 text-[10px] font-black uppercase tracking-[0.5em] mb-6 border border-gray-200 px-4 py-1.5 rounded-full">About The Brand</span>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-8 text-gray-900 leading-[0.9]">
            WE DESIGN FOR DRIP.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">WE MANUFACTURE FIT.</span>
          </h2>

          <p className="text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto mb-20 text-sm md:text-[15px]">
            We build and catalog our own collections with precise 3D structural data. Every piece is modeled to coordinate perfectly and drape realistically in your personal virtual fitting room.
          </p>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Settings strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">AI Fitting Room</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Optimized to seamlessly change outfits and mix-and-match across categories instantly.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Sparkles strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">AI Chatbot Stylist</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Get personalized DNA-based color suggestions and outfit recommendations from our AI.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Shield strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">Secured System</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Your photos, data, and DNA styling profiles are protected with enterprise-grade security.</p>
            </div>

          </div>
        </div>
      </section>




      {/* ══════ FLASH SALE BANNER ══════ */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-12 py-12">
        <div className="relative w-full aspect-[16/9] md:aspect-[3.2/1] rounded-[2rem] overflow-hidden bg-drip-maroon flex flex-col md:flex-row items-center shadow-xl border border-white/5">
          {/* Left Side: Bold Text details */}
          <div className="w-full md:w-[35%] p-8 md:p-14 flex flex-col justify-center text-left z-10 select-none">
            <span className="text-drip-cream text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] mb-4 block opacity-85">7 PM - 12 AM</span>
            <h2 className="text-drip-cream text-5xl md:text-7xl lg:text-[85px] font-black uppercase tracking-tighter leading-[0.8] font-sans">
              FLASH
            </h2>
            <h2 className="text-drip-cream text-5xl md:text-7xl lg:text-[85px] font-black uppercase tracking-tighter leading-[0.8] font-sans mt-1">
              SALE
            </h2>
          </div>

          {/* Right Side: Image with translucent gradient overlay */}
          <div className="w-full md:w-[65%] h-full relative self-stretch min-h-[240px] md:min-h-0">
            <Image 
              src="/images/hero/luxury_hero_vton_v2.png" 
              alt="Flash Sale Model" 
              fill 
              className="object-cover object-top" 
            />
            {/* Smooth transition from solid maroon to transparent */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-drip-maroon via-drip-maroon/75 to-transparent"></div>
          </div>
        </div>
      </section>




      {/* ══════ AI TRY-ON CTA ══════ */}
      <section className="py-24 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(233,69,96,0.06),_transparent_70%)]"></div></div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
          <span className="text-drip-coral text-[10px] font-black uppercase tracking-[0.5em] mb-6">AI Virtual Try-On</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">DREAM IT. DRIP IT.</h2>
          <p className="text-base font-medium text-gray-400 max-w-lg mb-10 leading-relaxed">
            Upload your photo and instantly see how any product looks on you — clothes, accessories, footwear. Experience fashion like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/avatar-studio" className="bg-white text-black px-10 py-4 text-[12px] font-black uppercase tracking-[0.15em] hover:bg-drip-coral hover:text-white transition-all flex items-center justify-center space-x-2 rounded-full shadow-xl">
              <Sparkles className="w-5 h-5" /><span>Calibrate Digital Double</span>
            </Link>
            <Link href="/avatar-studio" className="border-2 border-white/20 hover:border-white px-10 py-4 text-[12px] font-black uppercase tracking-[0.15em] transition-all rounded-full flex justify-center text-white/90 hover:text-white">
              Upload Body Selfie
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* ══════ VIRTUAL FITTING ROOM MODAL ══════ */}
      {tryOnProduct && (
        <AIFittingRoomModal
          isOpen={!!tryOnProduct}
          onClose={() => setTryOnProduct(null)}
          productImage={tryOnProduct.image}
          brand={tryOnProduct.brand}
          name={tryOnProduct.name}
          price={tryOnProduct.price ? parseInt(tryOnProduct.price.replace(/[^\d]/g, ''), 10) : undefined}
        />
      )}

      {/* ══════ FLOATING AI ══════ */}
      <div className="fixed bottom-6 right-6 z-[70]">
        <Link href="/shopper-ai" className="group bg-black text-white px-6 h-14 rounded-full flex items-center shadow-2xl hover:scale-105 hover:bg-drip-coral transition-all border border-white/10">
          <Sparkles className="w-5 h-5 animate-pulse mr-3" />
          <span className="text-[10px] font-black uppercase tracking-widest">AI Vision</span>
        </Link>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes text-reveal {
          from { clip-path: inset(100% 0 0 0); transform: translateY(20px); opacity: 0; }
          to { clip-path: inset(0 0 0 0); transform: translateY(0); opacity: 1; }
        }
        .animate-text-reveal { animation: text-reveal 0.7s cubic-bezier(0.77, 0, 0.175, 1) forwards; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; animation-delay: 0.2s; opacity: 0; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 25s linear infinite; }
      `}</style>
    </main>
  );
}
