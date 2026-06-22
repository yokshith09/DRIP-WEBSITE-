import { create } from 'zustand';

export type TryOnStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

interface TryOnStore {
  userPhoto: string | null; // base64 representation of the user photo
  resultUrl: string | null; // URL returned by virtual try-on API
  status: TryOnStatus;
  error: string | null;
  setUserPhoto: (photo: string | null) => void;
  setResult: (url: string | null) => void;
  setStatus: (status: TryOnStatus) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTryOnStore = create<TryOnStore>((set) => ({
  userPhoto: null,
  resultUrl: null,
  status: 'idle',
  error: null,
  
  setUserPhoto: (userPhoto) => set({ userPhoto, error: null }),
  setResult: (resultUrl) => set({ resultUrl, status: 'done', error: null }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: 'error' }),
  
  reset: () => set({ userPhoto: null, resultUrl: null, status: 'idle', error: null }),
}));
