'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Send, ChevronLeft, Sparkles, MoreVertical, Search, Paperclip } from 'lucide-react';

const SUGGESTIONS = [
  "Find me an outfit for a beach wedding",
  "What shoes go well with cargo pants?",
  "Show me the latest streetwear drops under ₹5000"
];

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  image: string;
  match: string;
}

interface Message {
  id: number;
  type: 'ai' | 'user';
  text: string;
  products?: Product[];
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, type: 'ai', text: 'Hey Yoo Jae-Suk! I am your DRIP AI Stylist. How can I elevate your look today?' }
];

export default function ShopperAI() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMsg: Message = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
       setIsTyping(false);
       
       if (text.toLowerCase().includes('wedding') || text.toLowerCase().includes('summer') || text.toLowerCase().includes('streetwear')) {
         const aiMsg: Message = { 
           id: Date.now() + 1, 
           type: 'ai', 
           text: 'I curated a perfect look based on your Style DNA (Minimalist + Streetwear). Here are some matches with high fit confidence from your Size Locker.',
           products: [
             { id: 1, name: 'Minimalist Street Jacket', brand: 'Y-3', price: '₹4,299', image: '/images/jacket.png', match: '94%' },
             { id: 2, name: 'Premium Low Sneakers', brand: 'Common Projects', price: '₹8,999', image: '/images/sneakers.png', match: '98%' }
           ]
         };
         setMessages(prev => [...prev, aiMsg]);
       } else {
         const aiMsg: Message = { id: Date.now() + 1, type: 'ai', text: 'That sounds great! I can help you find exactly what you need. Are you looking for any specific colors or brands?' };
         setMessages(prev => [...prev, aiMsg]);
       }
    }, 1500);
  };

  return (
    <main className="h-[100dvh] bg-[#F8F9FA] flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shrink-0">
        <Link href="/" className="p-2 -ml-2 text-drip-dark hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
        <div className="flex flex-col items-center">
           <div className="flex items-center space-x-1.5 text-drip-dark font-display font-medium">
              <Sparkles className="w-4 h-4 text-drip-coral" />
              <span>DRIP Stylist</span>
           </div>
           <span className="text-[10px] text-drip-green uppercase tracking-widest font-bold">Online</span>
        </div>
        <button className="p-2 -mr-2 text-drip-dark hover:bg-gray-100 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar flex flex-col">
         {/* Welcome Date */}
         <div className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest my-2">Today</div>

         {messages.map((msg) => (
           <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'} max-w-[85%] ${msg.type === 'user' ? 'ml-auto' : 'mr-auto'}`}>
             
             {/* Message Bubble */}
             <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.type === 'user' ? 'bg-[#1A1A2E] text-white rounded-tr-sm' : 'bg-white border text-gray-800 border-gray-200 rounded-tl-sm'}`}>
                {msg.text}
             </div>

             {/* Product Cards Payload */}
             {msg.products && (
               <div className="mt-3 flex overflow-x-auto hide-scrollbar space-x-3 w-[85vw] md:w-[400px] pb-2 px-1">
                 {msg.products.map(product => (
                    <Link href={`/product/${product.id}`} key={product.id} className="min-w-[160px] bg-white border border-gray-200 rounded-xl p-2 shrink-0 shadow-sm cursor-pointer hover:border-gray-300 transition-colors">
                       <div className="w-full h-32 bg-gray-100 rounded-lg relative overflow-hidden mb-2">
                           <Image src={product.image} alt={product.name} fill className="object-cover mix-blend-multiply" />
                           <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm text-[9px] font-bold text-drip-green px-1.5 py-0.5 rounded shadow-sm">
                              {product.match} Fit
                           </div>
                       </div>
                       <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.brand}</div>
                       <div className="text-xs font-semibold text-gray-800 truncate mb-1">{product.name}</div>
                       <div className="text-xs font-bold text-black">{product.price}</div>
                    </Link>
                 ))}
               </div>
             )}
             
             <span className="text-[10px] text-gray-400 mt-1 uppercase font-medium px-1">Just now</span>
           </div>
         ))}

         {isTyping && (
           <div className="flex mr-auto max-w-[85%] items-start">
             <div className="p-4 bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
             </div>
           </div>
         )}
      </div>

      {/* Input Area */}
      <div className="w-full bg-white border-t border-gray-200 p-3 pt-4 shrink-0 pb-safe">
         
         {/* Suggestions Row */}
         {messages.length === 1 && (
           <div className="flex overflow-x-auto hide-scrollbar space-x-2 mb-3 px-1 pb-1">
             {SUGGESTIONS.map(sug => (
                <button 
                  key={sug}
                  onClick={() => handleSend(sug)}
                  className="whitespace-nowrap bg-blue-50/50 text-[#0055A4] border border-blue-100 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors"
                >
                  {sug}
                </button>
             ))}
           </div>
         )}

         <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex items-end space-x-2">
            <button type="button" className="p-3 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full shrink-0">
               <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-gray-100 rounded-2xl flex items-center pr-2 border border-transparent focus-within:border-gray-300 transition-colors min-h-[50px]">
               <input 
                 type="text" 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 placeholder="Message DRIP Stylist..."
                 className="flex-1 bg-transparent px-4 py-3 outline-none text-sm text-gray-800"
               />
               {input.trim() && (
                 <button type="submit" className="w-8 h-8 bg-drip-navy text-white rounded-full flex items-center justify-center shrink-0 hover:bg-black transition-colors">
                   <Send className="w-4 h-4 ml-0.5" />
                 </button>
               )}
            </div>
         </form>
      </div>

    </main>
  );
}
