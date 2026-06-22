import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StyleDNA, BodyShape, StyleVibe, Occasion } from '../data/types';
import { createClient } from '@/lib/supabase/client';

interface StyleDNAStore {
  dna: StyleDNA;
  updateDNA: (updatedFields: Partial<StyleDNA>) => void;
  addLikedProduct: (id: string) => void;
  addDislikedProduct: (id: string) => void;
  resetDNA: () => void;
}

const syncToSupabase = async (dna: StyleDNA) => {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('style_dna').upsert({ 
        user_id: session.user.id,
        body_shape: dna.bodyShape,
        height_cm: dna.height,
        fit_preference: dna.fitPreference,
        skin_tone: dna.skinTone,
        color_palette: dna.colorPalette,
        avoid_colors: dna.avoidColors,
        style_vibe: dna.styleVibe,
        occasions: dna.occasions,
        budget_range: dna.budgetRange?.join('-'),
        liked_products: dna.likedProducts,
        disliked_products: dna.dislikedProducts,
        completed_onboarding: dna.completedOnboarding,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    }
  } catch (err) {
    console.error('Failed to sync Style DNA to Supabase', err);
  }
};

const DEFAULT_DNA: StyleDNA = {
  bodyShape: undefined,
  height: undefined,
  fitPreference: 'Regular Fit',
  skinTone: undefined,
  skinToneCategory: undefined,
  colorPalette: [],
  avoidColors: [],
  styleVibe: undefined,
  occasions: [],
  budgetRange: [1000, 15000],
  likedProducts: [],
  dislikedProducts: [],
  completedOnboarding: false,
};

export const useStyleDNAStore = create<StyleDNAStore>()(
  persist(
    (set) => ({
      dna: DEFAULT_DNA,
      
      updateDNA: (updatedFields) =>
        set((state) => {
          const newDna = { ...state.dna, ...updatedFields };
          syncToSupabase(newDna);
          return { dna: newDna };
        }),
        
      addLikedProduct: (id) =>
        set((state) => {
          const liked = state.dna.likedProducts || [];
          if (liked.includes(id)) return {};
          const newDna = {
            ...state.dna,
            likedProducts: [...liked, id],
            dislikedProducts: (state.dna.dislikedProducts || []).filter((item) => item !== id),
          };
          syncToSupabase(newDna);
          return { dna: newDna };
        }),
        
      addDislikedProduct: (id) =>
        set((state) => {
          const disliked = state.dna.dislikedProducts || [];
          if (disliked.includes(id)) return {};
          const newDna = {
            ...state.dna,
            dislikedProducts: [...disliked, id],
            likedProducts: (state.dna.likedProducts || []).filter((item) => item !== id),
          };
          syncToSupabase(newDna);
          return { dna: newDna };
        }),
        
      resetDNA: () => set((state) => {
        syncToSupabase(DEFAULT_DNA);
        return { dna: DEFAULT_DNA };
      }),
    }),
    {
      name: 'drip-style-dna', // key in localStorage
    }
  )
);
