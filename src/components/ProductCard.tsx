import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Sparkles } from 'lucide-react';

export interface Product {
  id: string | number;
  name: string;
  brand: string;
  price: string;
  category?: string;
  subcategory?: string;
  originalPrice?: string;
  rating: string | number;
  reviews: string | number;
  image: string;
  isNew?: boolean;
  matchPercentage?: number;
}

export default function ProductCard({ product, onTryOn }: { product: Product; onTryOn?: (product: Product) => void }) {
  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 h-full">
      {/* Image Area */}
      <div className="w-full aspect-[4/5] bg-gray-50 relative p-4 mb-2 overflow-hidden">
        {/* Link for the main image area */}
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-0">
          <Image src={product.image} alt={product.name} fill className="object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500" />
        </Link>
        
        {/* Wishlist Button (Top-Right) */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-drip-coral z-30 transition-colors" 
          aria-label="Add to wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded shadow-sm flex items-center space-x-1 z-20 font-sans text-[10px] border border-gray-100">
          <Star className="w-3 h-3 fill-black text-black" />
          <span className="font-bold text-gray-800">{product.rating}</span>
          <span className="text-gray-400">| {product.reviews}</span>
        </div>

        {product.isNew && (
          <div className="absolute top-0 left-0 bg-drip-navy text-white text-[9px] font-bold px-2 py-1 z-20 uppercase tracking-widest">
            New Arrival
          </div>
        )}

        {/* Try On Instant Button (overlay sliding up from bottom) */}
        {onTryOn && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTryOn(product);
            }}
            className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-md text-black py-3.5 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center space-x-2 z-20 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 duration-300 border-t border-gray-200/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-drip-coral fill-drip-coral animate-pulse" />
            <span>Try On Instantly</span>
          </button>
        )}
      </div>

      {/* Product Info */}
      <Link href={`/product/${product.id}`} className="px-4 pb-2 flex-grow flex flex-col z-10">
        <h4 className="text-[10px] font-black text-black uppercase tracking-widest mb-1">{product.brand}</h4>
        <p className="text-[13px] font-medium text-gray-600 leading-snug line-clamp-2 h-9 mb-2">{product.name}</p>
        
        <div className="mt-auto flex items-center space-x-2 pb-4">
          <span className="text-sm font-black text-black">{product.price}</span>
          {product.originalPrice && <span className="text-xs text-gray-400 line-through font-medium">{product.originalPrice}</span>}
        </div>
      </Link>

      {/* AI Fit Hint Overlay */}
      <div className="absolute top-3 right-14 z-20 pointer-events-none">
        <div className="bg-drip-green/90 backdrop-blur-sm text-white px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest shadow-sm">
          {product.matchPercentage || 92}% Match
        </div>
      </div>
    </div>
  );
}
