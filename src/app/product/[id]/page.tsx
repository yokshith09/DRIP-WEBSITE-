'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { 
  Share2, 
  Heart, 
  Star, 
  CheckCircle2, 
  Ruler, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Box, 
  Eye 
} from 'lucide-react';
import AIFittingRoomModal from '@/components/AIFittingRoomModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCartStore } from '@/store/cart';
import { useStyleDNAStore } from '@/store/styleDNA';
import { PRODUCTS } from '@/data/products';

const COLOR_HEX_MAP: Record<string, string> = {
  white: '#FFFFFF',
  black: '#1A1A1A',
  navy: '#1A1A2E',
  blue: '#0055A4',
  'light blue': '#ADD8E6',
  red: '#FF4D4D',
  green: '#1DB954',
  'sage green': '#9CAF88',
  'sage': '#9CAF88',
  olive: '#556B2F',
  'olive drab': '#6B8E23',
  khaki: '#C3B091',
  'desert khaki': '#C3B091',
  sand: '#E6D7C3',
  'soft sand': '#E6D7C3',
  tan: '#D2B48C',
  'desert tan': '#D2B48C',
  charcoal: '#4A5568',
  taupe: '#B38F75',
  cream: '#FFFDD0',
  indigo: '#4B0082',
  'dark wash': '#1A202C',
  'light wash': '#718096',
  'medium wash': '#4A5568',
  'garden floral': '#FBBF24',
  'peach blush': '#FCA5A5',
  'mint green': '#A7F3D0',
  cocoa: '#78350F',
  burgundy: '#800020',
  mocca: '#8B5A2B',
  amber: '#FFBF00',
};

const getHexColor = (colorName: string): string => {
  const clean = colorName.toLowerCase().trim();
  return COLOR_HEX_MAP[clean] || '#A0AEC0'; // default gray
};

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || 'm1';
  
  // Find product from dataset
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];

  const { addItem } = useCartStore();
  const { dna } = useStyleDNAStore();

  const colors = product.colors || ['Default'];
  const sizes = product.sizes || ['One Size'];

  const mappedColors = colors.map(c => ({
    name: c,
    hex: getHexColor(c)
  }));

  const mappedSizes = sizes.map((s, idx) => ({
    val: s,
    available: idx !== 2 && idx !== 5 // simulate availability
  }));

  const [selectedColor, setSelectedColor] = useState(mappedColors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showAIFit, setShowAIFit] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  // Dynamic AI Size recommendation logic
  const [recommendedSize, setRecommendedSize] = useState(sizes[0]);

  // Sync state when product ID changes
  useEffect(() => {
    const updatedColors = (product.colors || ['Default']).map(c => ({
      name: c,
      hex: getHexColor(c)
    }));
    setSelectedColor(updatedColors[0]);
    
    const updatedSizes = product.sizes || ['One Size'];
    if (dna.completedOnboarding && dna.height) {
      if (updatedSizes.length > 1) {
        if (dna.height >= 180) {
          setRecommendedSize(updatedSizes[Math.min(updatedSizes.length - 1, 3)]);
        } else if (dna.height < 170) {
          setRecommendedSize(updatedSizes[0]);
        } else {
          setRecommendedSize(updatedSizes[Math.min(updatedSizes.length - 1, 1)]);
        }
      } else {
        setRecommendedSize(updatedSizes[0]);
      }
    } else {
      setRecommendedSize(updatedSizes[0]);
    }
  }, [id, product, dna]);

  // Pre-select recommended size if DNA is loaded
  useEffect(() => {
    if (dna.completedOnboarding) {
      setSelectedSize(recommendedSize);
    }
  }, [dna, recommendedSize]);

  // Calculate discount percentage
  const hasDiscount = !!product.originalPrice && !!product.originalPriceNumber && !!product.priceNumber;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPriceNumber! - product.priceNumber) / product.originalPriceNumber!) * 100)
    : 0;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  // Dynamic cross sells
  const crossSells = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  const handleAddToBag = () => {
    addItem({
      id: `${product.id}-${selectedSize || 'OneSize'}-${selectedColor.name}`,
      brand: product.brand,
      name: product.name,
      price: product.priceNumber,
      originalPrice: product.originalPriceNumber,
      size: selectedSize || 'One Size',
      color: selectedColor.name,
      qty: 1,
      image: images[0],
      inStock: (product.stock ?? 10) > 0
    });
    
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 3000);
  };

  return (
    <main className="min-h-screen bg-white pb-32 font-sans">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 pt-8 flex flex-col lg:flex-row gap-12">
        
        {/* Gallery Section */}
        <div className="flex-grow max-w-[700px] mx-auto w-full lg:sticky lg:top-28 h-fit">
           <div className="flex flex-col gap-6">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-[3/4] max-h-[650px] bg-gray-50 overflow-hidden rounded-2xl border border-gray-100 shadow-xs">
                   <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover mix-blend-multiply opacity-95 hover:scale-102 transition-transform duration-700" priority={i === 0} />
                </div>
              ))}
           </div>
        </div>

        {/* Product Details Section */}
        <div className="lg:w-[450px] shrink-0">
           <div className="sticky top-28">
              <div className="mb-8">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{product.brand}</h2>
                <h1 className="text-3xl font-display font-bold text-black mb-4">{product.name}</h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-black text-black">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through font-medium">{product.originalPrice}</span>
                  )}
                  {hasDiscount && (
                    <span className="text-[10px] font-bold text-drip-coral bg-drip-coral/5 px-2 py-1 rounded tracking-widest uppercase">{discountPercent}% OFF</span>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-xs font-bold text-gray-800 mb-4">
                  <div className="flex text-black">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(Number(product.rating || 4.5)) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="underline cursor-pointer">{product.rating} | {product.reviews} Reviews</span>
                </div>
                
                {/* Scarcity Messaging */}
                <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-3 py-1.5 border border-red-100 rounded-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Only {product.stock ?? 4} left in stock!</span>
                </div>
              </div>

              {/* Selection Options */}
              <div className="space-y-8">
                {/* Color */}
                <div>
                   <h3 className="text-[10px] font-black tracking-widest uppercase mb-3 text-gray-400">Color Variant: <span className="text-black ml-2 font-bold">{selectedColor?.name || 'Default'}</span></h3>
                   <div className="flex space-x-3">
                      {mappedColors.map(color => (
                        <button 
                          key={color.name}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border border-gray-150 flex items-center justify-center p-0.5 transition-all ${selectedColor?.name === color.name ? 'ring-2 ring-black' : ''}`}
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
                      <button className="text-[9px] font-bold text-[#0055A4] flex items-center underline tracking-widest uppercase">
                         <Ruler className="w-3.5 h-3.5 mr-1" /> Size Guide
                      </button>
                   </div>
                   <div className="grid grid-cols-4 gap-2">
                      {mappedSizes.map(size => (
                        <button 
                          key={size.val}
                          disabled={!size.available}
                          onClick={() => setSelectedSize(size.val)}
                          className={`h-11 border text-xs font-bold transition-all uppercase tracking-widest rounded-xl ${!size.available ? 'opacity-30 line-through bg-gray-50' : selectedSize === size.val ? 'bg-black text-white border-black shadow-md' : 'border-gray-200 hover:border-black'}`}
                        >
                          {size.val}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Personalized AI Recommendation Overlay */}
                <div className="p-4 bg-[#F0F7FF] border border-blue-100 rounded-2xl flex items-start space-x-4 shadow-xs">
                   <Sparkles className="w-5 h-5 text-[#0055A4] shrink-0 mt-0.5 animate-pulse" />
                   <div>
                      <h4 className="text-[9px] font-black uppercase text-[#0055A4] tracking-widest mb-1">DRIP AI Styling Advice</h4>
                      {dna.completedOnboarding ? (
                        <p className="text-xs font-semibold text-[#1A1A2E] leading-relaxed">
                          Based on your <strong className="font-bold uppercase text-drip-coral">{dna.bodyShape}</strong> shape and <strong className="font-bold">{dna.height}cm</strong> height, we mathematically recommend <span className="underline font-black text-[#0055A4]">{recommendedSize}</span> as the ultimate flattering drape for your frame.
                        </p>
                      ) : (
                        <p className="text-xs font-semibold text-[#1A1A2E] leading-relaxed">
                          Uncover secure, personalized fit matching. <Link href="/profile/style-dna" className="text-[#0055A4] font-black underline">Scan Style DNA Now</Link>
                        </p>
                      )}
                   </div>
                </div>

                {/* Main Action Buttons */}
                <div className="flex gap-3 pt-4">
                   <button 
                     onClick={handleAddToBag}
                     className={`flex-grow py-4 text-xs font-black tracking-widest uppercase transition-all rounded-2xl shadow-lg ${
                       cartAdded ? 'bg-drip-green text-white' : 'bg-black text-white hover:bg-gray-800'
                     }`}
                   >
                     {cartAdded ? 'Added to Bag!' : 'Add to Bag'}
                   </button>
                   <button className="w-14 border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-2xl">
                      <Heart className="w-5 h-5 text-gray-400 hover:text-drip-coral" />
                   </button>
                </div>

                {/* Secondary Discovery Button */}
                <button 
                  onClick={() => setShowAIFit(true)}
                  className="w-full py-4 border border-black text-black text-xs font-black tracking-widest uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-2.5 rounded-2xl"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Virtual Try-On</span>
                </button>
              </div>

            </div>
         </div>
      </div>

      {/* Remaining Info Section (Full-width below the split) */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-16 font-sans">
        {/* Materials & Construction */}
        <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50">
           <h5 className="text-[11px] font-black text-black uppercase tracking-widest mb-4 flex items-center space-x-2">
             <Box className="w-4 h-4 text-drip-coral" /> <span>Materials & Details</span>
           </h5>
           <ul className="text-xs text-gray-500 font-medium space-y-2.5 leading-relaxed">
              <li>• Material: {product.material || 'Premium Fabrics'}</li>
              <li>• Fit Type: {product.fit || 'Regular fit'}</li>
              <li>• Curated Tags: {product.tags?.join(', ') || 'Premium curation'}</li>
              <li>• Double needle stitching for long-lasting durability</li>
              <li>• Premium dust bag and special packaging included</li>
           </ul>
           <button className="w-full mt-6 py-3 bg-white border border-gray-200 text-[10px] font-black uppercase tracking-widest hover:border-black transition-colors flex items-center justify-center space-x-2 shadow-sm rounded-xl">
              <Eye className="w-4 h-4 text-drip-coral" />
              <span>Open 3D Fabric Viewer</span>
           </button>
        </div>

        {/* Delivery & Authentication */}
        <div className="space-y-6">
           <div className="flex items-start space-x-4 p-5 border border-gray-100 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <Truck className="w-6 h-6 text-drip-coral shrink-0 mt-0.5" />
              <div>
                 <h5 className="text-[11px] font-bold text-black uppercase tracking-widest mb-1">Free Express Shipping</h5>
                 <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Delivered within 48 hours for Elite Members. Standard shipping 3-5 business days.</p>
              </div>
           </div>
           <div className="flex items-start space-x-4 p-5 border border-gray-100 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <ShieldCheck className="w-6 h-6 text-drip-coral shrink-0 mt-0.5" />
              <div>
                 <h5 className="text-[11px] font-bold text-black uppercase tracking-widest mb-1">Authenticity Shield</h5>
                 <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Authenticity certificate included with every purchase. Checked by in-house fashion curators.</p>
              </div>
           </div>
        </div>

        {/* FAQs */}
        <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
           <h5 className="text-[11px] font-black text-black uppercase tracking-widest mb-4">Product FAQs</h5>
           <div className="text-xs text-gray-500 font-medium space-y-4">
              <div>
                 <strong className="text-black block mb-1 text-[10px] uppercase tracking-wider font-bold">How does the sizing run?</strong>
                 <p className="leading-relaxed">This brand runs true to size. If you are in between sizes, consult your Style DNA recommendation.</p>
              </div>
              <div>
                 <strong className="text-black block mb-1 text-[10px] uppercase tracking-wider font-bold">How do I care for this garment?</strong>
                 <p className="leading-relaxed">We recommend washing in cold water with similar colors and hanging to dry. Dry clean optional.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Cross Sells (Bottom) */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-12 py-24 border-t border-gray-100 mt-20">
         <h3 className="text-2xl font-display font-medium italic mb-10">Complete The Look</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {crossSells.map(item => (
              <a href={`/product/${item.id}`} key={item.id} className="group flex flex-col cursor-pointer">
                <div className="w-full aspect-[4/5] bg-gray-50 relative p-4 mb-3 border border-gray-50 group-hover:shadow-md transition-all rounded-2xl">
                   <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-gray-400">{item.brand}</h4>
                <p className="text-xs font-semibold text-black truncate">{item.name}</p>
                <p className="text-xs font-bold text-black mt-1">{item.price}</p>
              </a>
            ))}
         </div>
      </section>

      <Footer />

      <AIFittingRoomModal 
        isOpen={showAIFit} 
        onClose={() => setShowAIFit(false)} 
        productImage={images[0]} 
        brand={product.brand}
        name={product.name}
        price={product.priceNumber}
      />
    </main>
  );
}
