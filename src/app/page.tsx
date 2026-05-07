'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Heart, User, ShoppingBag, Menu, Sparkles, Truck, ShieldCheck, Crown, ChevronLeft, ChevronRight, Scissors, Wind, Settings, Shield } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const HERO_SLIDES = [
  { id: 1, title: 'SHOP YOUR\nWARDROBE NOW!', sub: "You didn't come this far to stop", cta: 'START SHOPPING', img: '/images/hero/hero-clean.png' },
  { id: 2, title: 'AUTUMN\nCOLLECTION', sub: 'New season. New you. New drip.', cta: 'SHOP NOW', img: '/images/hero/collection-banner.png' },
  { id: 3, title: 'SUMMER\nESSENTIALS', sub: 'Light fabrics. Bold choices.', cta: 'EXPLORE', img: '/images/hero/mens_collection_scrollbar.jpeg' },
];

const MAIN_COLLECTIONS = [
  { name: "MEN'S COLLECTION", img: '/images/hero/mens-collection.png', href: '/category?g=men' },
  { name: "WOMEN'S COLLECTION", img: '/images/hero/womens-collection.png', href: '/category?g=women' },
  { name: 'ACCESSORIES', img: '/images/hero/accessories-collection.png', href: '/category?g=accessories' },
];

const MEN_COLLECTIONS = [
  { name: 'Oversized Tees', img: '/images/hero/cat-tshirts.png', href: '/category?c=oversized-tees', count: '48 Products' },
  { name: 'Formal Shirts', img: '/images/hero/cat-shirts.png', href: '/category?c=formal-shirts', count: '38 Products' },
  { name: 'Raw Denim', img: '/images/hero/cat-jeans.png', href: '/category?c=raw-denim', count: '24 Products' },
  { name: 'Cargo Pants', img: '/images/hero/cat-cargos.png', href: '/category?c=cargo-pants', count: '32 Products' },
  { name: 'Polo Classics', img: '/images/hero/cat-polos.png', href: '/category?c=polos', count: '28 Products' },
  { name: 'Chino Trousers', img: '/images/hero/cat-trousers.png', href: '/category?c=chinos', count: '20 Products' },
  { name: 'Casual Shorts', img: '/images/hero/cat-cargos.png', href: '/category?c=shorts', count: '18 Products' },
  { name: 'Jackets & Layers', img: '/images/hero/mens-collection.png', href: '/category?c=jackets', count: '14 Products' },
];

const WOMEN_COLLECTIONS = [
  { name: 'T-Shirts', img: '/images/hero/cat-tshirts.png', href: '/category?c=women-tshirts', count: '32 Products' },
  { name: 'Shirts', img: '/images/hero/womens-collection.png', href: '/category?c=women-shirts', count: '28 Products' },
  { name: 'Tops', img: '/images/hero/cat-women-dresses.png', href: '/category?c=tops', count: '45 Products' },
  { name: 'Midi Dresses', img: '/images/hero/cat-women-dresses.png', href: '/category?c=midi-dresses', count: '42 Products' },
  { name: 'Wide Leg Jeans', img: '/images/hero/cat-jeans.png', href: '/category?c=wide-leg', count: '22 Products' },
  { name: 'Ethnic Kurtas', img: '/images/hero/cat-women-dresses.png', href: '/category?c=kurtas', count: '34 Products' },
  { name: 'Palazzos', img: '/images/hero/womens-collection.png', href: '/category?c=palazzos', count: '26 Products' },
  { name: 'Bodysuits', img: '/images/hero/cat-women-dresses.png', href: '/category?c=bodysuits', count: '12 Products' },
];

const ACCESSORIES_COLLECTIONS = [
  { name: 'Designer Bags', img: '/images/hero/luxury-accessories.png', href: '/category?c=bags', count: '22 Products' },
  { name: 'Sunglasses', img: '/images/hero/accessories-collection.png', href: '/category?c=sunglasses', count: '18 Products' },
  { name: 'Hand Watches', img: '/images/hero/luxury-accessories.png', href: '/category?c=watches', count: '14 Products' },
  { name: 'Gold Jewellery', img: '/images/hero/accessories-collection.png', href: '/category?c=jewellery', count: '32 Products' },
];

const FOOTWEAR_COLLECTIONS = [
  { name: 'Sneakers', img: '/images/hero/footwear-showcase.png', href: '/category?c=sneakers', count: '46 Products' },
  { name: 'Chelsea Boots', img: '/images/hero/future-sneaker.png', href: '/category?c=boots', count: '12 Products' },
  { name: 'Loafers', img: '/images/hero/footwear-showcase.png', href: '/category?c=loafers', count: '16 Products' },
  { name: 'Slides', img: '/images/hero/future-sneaker.png', href: '/category?c=slides', count: '24 Products' },
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

const NewLaunchedContainer = ({ title, desc, img, href }: { title: string, desc: string, img: string, href: string }) => (
  <div className="relative w-full aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden group bg-black shadow-2xl">
    <Image src={img} alt={title} fill className="object-cover object-top opacity-70 group-hover:opacity-90 transition-opacity duration-700 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-8 md:p-12">
      <div className="max-w-xl">
        <span className="inline-flex items-center space-x-2 text-drip-coral text-[10px] font-black uppercase tracking-[0.3em] mb-4 bg-drip-coral/10 py-1.5 px-3 rounded-full border border-drip-coral/20">
          <Sparkles className="w-3.5 h-3.5" /> <span>Just Dropped</span>
        </span>
        <h3 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">{title}</h3>
        <p className="text-gray-300 text-sm md:text-base font-medium mb-8 leading-relaxed drop-shadow-md">{desc}</p>
        <Link href={href} className="inline-block bg-white text-black px-8 py-3.5 text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-drip-coral hover:text-white transition-all shadow-xl">
          Explore Drop
        </Link>
      </div>
    </div>
  </div>
);

const CollectionGrid = ({ collections, dark = false }: { collections: any[], dark?: boolean }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8 max-w-[1400px] mx-auto px-5 md:px-12">
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
  const [scrolled, setScrolled] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = HERO_SLIDES[heroSlide];

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-900">

      {/* ══════ TOP MARQUEE BAR ══════ */}
      <div className="bg-gray-950 text-white h-9 flex items-center overflow-hidden relative z-[71]">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="mx-8 text-[10px] font-semibold uppercase tracking-[0.2em] flex items-center space-x-2 text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5" /><span>100% Authentic Products</span>
              <span className="text-drip-coral mx-3">✦</span>
              <Truck className="w-3.5 h-3.5" /><span>Free Shipping &amp; Returns</span>
              <span className="text-drip-coral mx-3">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════ HEADER ══════ */}
      <header className={`sticky top-0 z-[60] transition-all duration-300 flex items-center justify-between px-5 md:px-10 h-14 bg-white ${scrolled ? 'shadow-md border-b border-gray-100' : 'border-b border-gray-100'}`}>
        <div className="flex items-center space-x-5">
          <button className="p-1.5 hover:bg-gray-50 rounded-md lg:hidden"><Menu className="w-5 h-5" /></button>
          <Link href="/" className="text-xl font-black tracking-tight">DRIP</Link>
        </div>
        <nav className="hidden lg:flex items-center space-x-7">
          {['MEN', 'WOMEN', 'ACCESSORIES', 'FOOTWEAR', 'AI STUDIO'].map((item) => (
            <Link key={item} href={item === 'AI STUDIO' ? '/avatar-studio' : '/category'} className="text-[11px] font-bold tracking-[0.15em] text-gray-600 hover:text-black transition-colors">{item}</Link>
          ))}
        </nav>
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-50 rounded-md hidden md:block"><Search className="w-[18px] h-[18px] text-gray-500" /></button>
          <Link href="/profile" className="p-2 hover:bg-gray-50 rounded-md"><User className="w-[18px] h-[18px] text-gray-500" /></Link>
          <Link href="/cart" className="relative p-2 hover:bg-gray-50 rounded-md">
            <ShoppingBag className="w-[18px] h-[18px] text-gray-500" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-drip-coral text-white text-[8px] rounded-full flex items-center justify-center font-bold">2</span>
          </Link>
        </div>
      </header>

      {/* ══════ HERO CAROUSEL ══════ */}
      <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-gray-100">
        {HERO_SLIDES.map((s, i) => (
          <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroSlide ? 'opacity-100' : 'opacity-0'}`}>
            <Image src={s.img} alt={s.title} fill className="object-cover object-top" priority={i === 0} />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10">
          <h1 key={heroSlide} className="text-white text-4xl md:text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase mb-6 whitespace-pre-line animate-text-reveal drop-shadow-2xl">
            {slide.title}
          </h1>
          <p className="text-white/90 text-sm md:text-base font-bold tracking-widest uppercase mb-10 animate-fade-in-up drop-shadow-md">{slide.sub}</p>
          <Link href="/category" className="bg-white text-black px-12 py-4 text-[12px] font-black uppercase tracking-[0.2em] hover:bg-drip-coral hover:text-white transition-all rounded-full animate-fade-in-up shadow-xl">
            {slide.cta}
          </Link>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setHeroSlide(i)} className={`h-[4px] rounded-full transition-all duration-500 ${i === heroSlide ? 'w-12 bg-white' : 'w-6 bg-white/40 hover:bg-white/60'}`} />
          ))}
        </div>
        <button onClick={() => setHeroSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/20"><ChevronLeft className="w-6 h-6" /></button>
        <button onClick={() => setHeroSlide((p) => (p + 1) % HERO_SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all border border-white/20"><ChevronRight className="w-6 h-6" /></button>
      </section>

      {/* ══════ MAIN COLLECTIONS — 3-up ══════ */}
      <section className="py-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MAIN_COLLECTIONS.map((cat, i) => (
              <Link key={i} href={cat.href} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100">
                <Image src={cat.img} alt={cat.name} fill className="object-cover object-top group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 w-full p-8 text-center translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white text-xl md:text-2xl font-black uppercase tracking-[0.1em]">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FREE SHIPPING STRIP ══════ */}
      <div className="bg-gray-100 border-y border-gray-200 py-4 text-center">
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">FREE SHIPPING AND RETURNS ON ALL ORDERS</span>
      </div>

      {/* ══════ LATEST DROPS ══════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <SectionHeading title="LATEST DROPS" subtitle="Fresh Arrivals" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <NewLaunchedContainer
              title="URBAN UTILITY"
              desc="Technical fabrics and unapologetic street aesthetic. Designed for the relentless city dweller."
              img="/images/hero/streetwear-jacket.png"
              href="/category?c=new-men"
            />
            <NewLaunchedContainer
              title="MODERN MINIMALIST"
              desc="Clean lines and versatile silhouettes. Setting the new standard for everyday elegance."
              img="/images/hero/cat-women-dresses.png"
              href="/category?c=new-women"
            />
          </div>
        </div>
      </section>

      {/* ══════ CAMPAIGN SECTION ══════ */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-black flex items-center justify-center group cursor-pointer border-y border-gray-900 shadow-xl">
        <Image src="/images/hero/hero-clean.png" alt="Drip Fashion Campaign" fill className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-transform duration-[2000ms] group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-1000"></div>
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-8 border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500 shadow-2xl">
            <div className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[24px] border-l-white border-b-[14px] border-b-transparent ml-2"></div>
          </div>
          <h2 className="text-white text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-none mb-4 opacity-95 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            DRIP<br />FASHION
          </h2>
        </div>
      </section>

      {/* ══════ MEN'S CATEGORY GRID ══════ */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <SectionHeading title="SHOP MEN'S" align="center" />
        </div>
        <CollectionGrid collections={MEN_COLLECTIONS} />
      </section>

      {/* ══════ WOMEN'S CATEGORY GRID ══════ */}
      <section className="py-16 md:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <SectionHeading title="SHOP WOMEN'S" align="center" />
        </div>
        <CollectionGrid collections={WOMEN_COLLECTIONS} />
      </section>

      {/* ══════ ACCESSORIES CATEGORY GRID ══════ */}
      <section className="py-16 md:py-24 bg-gray-950 text-white">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12 mb-10 md:mb-12 text-center">
          <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-2">The Vault</span>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.1em] text-white">ACCESSORIES</h2>
        </div>
        <CollectionGrid collections={ACCESSORIES_COLLECTIONS} dark={true} />
      </section>

      {/* ══════ FOOTWEAR CATEGORY GRID ══════ */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <SectionHeading title="FOOTWEAR" align="center" />
        </div>
        <CollectionGrid collections={FOOTWEAR_COLLECTIONS} />
      </section>

      {/* ══════ THE DRIP STANDARD (ABOUT US) ══════ */}
      <section className="py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 text-center">

          <span className="inline-block text-gray-400 text-[10px] font-black uppercase tracking-[0.5em] mb-6 border border-gray-200 px-4 py-1.5 rounded-full">About The Brand</span>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-8 text-gray-900 leading-[0.9]">
            TRUSTED BY 1 MILLION.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">DEFINED BY DETAILS.</span>
          </h2>

          <p className="text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto mb-20 text-sm md:text-[15px]">
            We've created over 6,000 unique styles, maintaining 100% in-house quality checks. Operating through 20+ stores globally, every single piece we craft is engineered around four uncompromising pillars.
          </p>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Scissors strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">Precision Fits</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Engineered to drape perfectly and rigorously tested to enhance your natural silhouette.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Wind strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">Breathable</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Premium, climate-responsive materials that breathe with your body throughout the day.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Settings strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">Functional</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Every stitch, subtle pocket, and hidden zipper serves a dedicated, practical purpose.</p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-500 shadow-sm">
                <Shield strokeWidth={1.5} className="w-6 h-6" />
              </div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 mb-3">Durable Build</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">Constructed to outlast trends. Consistently holding form wash after wash.</p>
            </div>

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
              <Sparkles className="w-5 h-5" /><span>Try On Now</span>
            </Link>
            <Link href="/shopper-ai" className="border-2 border-white/20 hover:border-white px-10 py-4 text-[12px] font-black uppercase tracking-[0.15em] transition-all rounded-full flex justify-center text-white/90 hover:text-white">
              Talk to AI Stylist
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ NEWSLETTER ══════ */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-5 md:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-gray-900 rounded-[2rem] p-10 md:p-16 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-drip-coral/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 max-w-lg">
              <h3 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">JOIN THE INNER CIRCLE</h3>
              <p className="text-gray-400 font-medium">Be the first to know about new drops, exclusive events, and the future of digital fashion. No spam, just drip.</p>
            </div>
            <div className="relative z-10 w-full lg:w-auto">
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full w-full lg:w-80 backdrop-blur-md focus:outline-none focus:border-drip-coral transition-colors font-medium"
                />
                <button className="bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-[12px] hover:bg-drip-coral hover:text-white transition-all whitespace-nowrap">
                  Subscribe
                </button>
              </form>
              <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest text-center lg:text-left">By subscribing, you agree to our Privacy Policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="bg-white py-20 px-5 md:px-12 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <Link href="/" className="text-2xl font-black tracking-tight mb-6 block">DRIP</Link>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs">
                The pinnacle of digital fashion and urban utility. Redefining style through AI and premium craftsmanship.
              </p>
              <div className="flex space-x-4">
                {['Instagram', 'Twitter', 'TikTok'].map(s => (
                  <Link key={s} href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all">
                    <span className="sr-only">{s}</span>
                    <div className="w-5 h-5 bg-current mask-icon" /> {/* Placeholder for social icons */}
                  </Link>
                ))}
              </div>
            </div>

            {[
              { title: 'SHOP', links: ['Men', 'Women', 'Accessories', 'Footwear', 'New Arrivals'] },
              { title: 'EXPERIENCE', links: ['AI Studio', 'AI Stylist', 'Try-On Guide', 'Sizing', 'Care'] },
              { title: 'COMPANY', links: ['About Us', 'Careers', 'Sustainability', 'Stores', 'Contact'] },
              { title: 'SUPPORT', links: ['Shipping', 'Returns', 'Payments', 'Order Tracking', 'FAQ'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900 mb-6">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-gray-500 text-sm hover:text-black transition-colors font-medium">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest text-center md:text-left">
              &copy; 2026 DRIP FASHION INC. ALL RIGHTS RESERVED.
            </p>
            <div className="flex space-x-10">
              {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(link => (
                <Link key={link} href="#" className="text-gray-400 text-[10px] font-medium uppercase tracking-widest hover:text-black transition-colors">{link}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

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
