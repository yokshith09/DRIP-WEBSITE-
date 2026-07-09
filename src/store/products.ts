import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../data/types';
import { PRODUCTS as STATIC_PRODUCTS } from '../data/products';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: STATIC_PRODUCTS,
      
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      
      deleteProduct: (id) => set((state) => ({ products: state.products.filter(p => p.id !== id) })),
      
      resetProducts: () => set({ products: STATIC_PRODUCTS })
    }),
    {
      name: 'drip-products-catalog'
    }
  )
);
