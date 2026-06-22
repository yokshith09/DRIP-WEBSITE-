import { create } from 'zustand';
import { ChatMessage } from '../data/types';

interface ChatStore {
  messages: ChatMessage[];
  isStreaming: boolean;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateLastMessageText: (text: string) => void;
  updateLastMessage: (fields: Partial<ChatMessage>) => void;
  clearHistory: () => void;
  setStreaming: (isStreaming: boolean) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    sender: 'assistant',
    text: "Hey! I'm your DRIP AI Stylist. 🌟 Tell me what look you're going for today, or let's find the perfect outfit for an upcoming occasion! Let me know if you want me to analyze your Style DNA first.",
    timestamp: new Date().toISOString(),
  },
];

export const useChatStore = create<ChatStore>((set) => ({
  messages: INITIAL_MESSAGES,
  isStreaming: false,
  
  addMessage: (msg) =>
    set((state) => {
      const newMsg: ChatMessage = {
        ...msg,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
      };
      return {
        messages: [...state.messages, newMsg],
      };
    }),
    
  updateLastMessageText: (text) =>
    set((state) => {
      const updatedMessages = [...state.messages];
      if (updatedMessages.length > 0) {
        const lastIndex = updatedMessages.length - 1;
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          text,
        };
      }
      return { messages: updatedMessages };
    }),

  updateLastMessage: (fields) =>
    set((state) => {
      const updatedMessages = [...state.messages];
      if (updatedMessages.length > 0) {
        const lastIndex = updatedMessages.length - 1;
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          ...fields,
        };
      }
      return { messages: updatedMessages };
    }),
    
  clearHistory: () => set({ messages: INITIAL_MESSAGES, isStreaming: false }),
  
  setStreaming: (isStreaming) => set({ isStreaming }),
}));
