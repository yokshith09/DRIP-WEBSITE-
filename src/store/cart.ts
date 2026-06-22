import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../data/types';
import { createClient } from '@/lib/supabase/client';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  updateQty: (id: string | number, qty: number) => void;
  clearCart: () => void;
}

const syncToSupabase = async (items: CartItem[]) => {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('carts').upsert({ 
        user_id: session.user.id, 
        items, 
        updated_at: new Date().toISOString() 
      }, { onConflict: 'user_id' });
    }
  } catch (err) {
    console.error('Failed to sync cart to Supabase', err);
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [
        { 
          id: 'a5', // Retro White Leather Sneakers from our new products
          brand: 'DRIP Co.', 
          name: 'Retro White Leather Sneakers', 
          price: 5990, 
          originalPrice: 7990,
          size: 'UK 9', 
          color: 'Vintage White', 
          qty: 1, 
          image: '/images/hero/cat-sneakers.png',
          inStock: true
        },
        { 
          id: 'w4', // Ribbed Knit Polo from our new products
          brand: 'Reformation', 
          name: 'Ribbed Knit Polo', 
          price: 6200, 
          size: 'M', 
          color: 'Oatmeal', 
          qty: 1, 
          image: '/images/hero/cat-women-tops.png',
          inStock: true
        }
      ],
      
      addItem: (item) => set((state) => {
        let newItems;
        const existing = state.items.find(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color
        );
        if (existing) {
          newItems = state.items.map((i) =>
            i.id === item.id && i.size === item.size && i.color === item.color
              ? { ...i, qty: i.qty + item.qty }
              : i
          );
        } else {
          newItems = [...state.items, item];
        }
        syncToSupabase(newItems);
        return { items: newItems };
      }),
      
      removeItem: (id) => set((state) => {
        const newItems = state.items.filter((i) => i.id !== id);
        syncToSupabase(newItems);
        return { items: newItems };
      }),
      
      updateQty: (id, qty) => set((state) => {
        const newItems = state.items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
        syncToSupabase(newItems);
        return { items: newItems };
      }),
      
      clearCart: () => set((state) => {
        syncToSupabase([]);
        return { items: [] };
      }),
    }),
    {
      name: 'drip-cart-store', // key in localStorage
    }
  )
);
