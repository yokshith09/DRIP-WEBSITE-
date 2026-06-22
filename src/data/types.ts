export type BodyShape = 'inverted-triangle' | 'pear' | 'rectangle' | 'hourglass' | 'apple';
export type StyleVibe = 'minimalist' | 'streetwear' | 'formal' | 'bohemian' | 'athleisure' | 'ethnic' | 'luxury';
export type Occasion = 'casual' | 'work' | 'party' | 'wedding' | 'sport' | 'travel' | 'festive';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string; // 'mens' | 'womens' | 'accessories'
  subcategory: string;
  price: string; // e.g. "₹ 4,500"
  originalPrice?: string; // e.g. "₹ 6,000"
  priceNumber: number; // e.g. 4500
  originalPriceNumber?: number; // e.g. 6000
  rating: string | number;
  reviews: string | number;
  image: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  fit?: string;
  material?: string;
  tags?: string[];
  bodyShapeSuitable?: BodyShape[];
  skinToneSuitable?: string[]; // e.g. ["warm", "cool", "neutral"]
  stock?: number;
  isNew?: boolean;
  matchPercentage?: number;
}

export interface StyleDNA {
  bodyShape?: BodyShape;
  height?: number;
  fitPreference?: string;
  skinTone?: string; // hex color or classification
  skinToneCategory?: 'warm' | 'cool' | 'neutral';
  colorPalette?: string[];
  avoidColors?: string[];
  styleVibe?: StyleVibe;
  occasions?: Occasion[];
  budgetRange?: [number, number];
  likedProducts?: string[];
  dislikedProducts?: string[];
  completedOnboarding: boolean;
}

export interface CartItem {
  id: string | number;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  size: string;
  color: string;
  qty: number;
  image: string;
  inStock: boolean;
  tryOnResultUrl?: string; // Try-on result url
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string; // Store serialized ISO string for easier hydration
  isStreaming?: boolean;
  suggestedProducts?: string[]; // IDs of products from catalog
}
