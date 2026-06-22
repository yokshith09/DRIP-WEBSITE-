'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Send, 
  ChevronLeft, 
  Sparkles, 
  Trash2, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { useChatStore } from '@/store/chat';
import { useStyleDNAStore } from '@/store/styleDNA';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useVoiceOutput } from '@/hooks/useVoiceOutput';
import { PRODUCTS } from '@/data/products';

const SUGGESTIONS = [
  "Suggest a summer street look for me.",
  "Which products fit my body shape best?",
  "Recommend casual outfits within my budget."
];

export default function ShopperAI() {
  const { 
    messages, 
    addMessage, 
    updateLastMessageText, 
    updateLastMessage, 
    clearHistory, 
    isStreaming, 
    setStreaming 
  } = useChatStore();
  
  const { dna } = useStyleDNAStore();
  const { startListening, stopListening, isListening, transcript, error: voiceInputError } = useVoiceInput();
  const { speak, stop: stopSpeaking, isSpeaking, isSupported: isTtsSupported } = useVoiceOutput();
  
  const [input, setInput] = useState('');
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Handle voice transcript updates
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Stop speaking if voice output toggle is turned off
  useEffect(() => {
    if (!voiceOutputEnabled) {
      stopSpeaking();
    }
  }, [voiceOutputEnabled, stopSpeaking]);

  const extractProductIds = (text: string): string[] => {
    const regex = /\[RECOMMEND:\s*([a-zA-Z0-9\s,]+)\]/i;
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1].split(',').map(id => id.trim());
    }
    return [];
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    
    setApiError(null);
    setInput('');
    stopSpeaking();

    // 1. Add user message
    addMessage({ sender: 'user', text });
    
    // 2. Setup Assistant streaming placeholder
    addMessage({ sender: 'assistant', text: '', isStreaming: true });
    setStreaming(true);

    try {
      // 3. Get message history in API compatible format
      // We read messages including the user message we just added
      const recentMessages = useChatStore.getState().messages;
      const apiMessages = recentMessages.slice(0, -1).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      // Append current message to payload
      apiMessages.push({ sender: 'user', text });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: apiMessages,
          styleDNA: dna 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect to styling engine');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Streaming response reader is not available');
      }

      const decoder = new TextDecoder();
      let assistantText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const rawData = line.slice(6).trim();
              if (!rawData) continue;
              
              const parsed = JSON.parse(rawData);
              if (parsed.text) {
                assistantText += parsed.text;
                updateLastMessageText(assistantText);
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (err) {
              // Ignore occasional partial json parse errors during transmission
            }
          }
        }
      }

      // Extract suggestions & finalize message state
      const suggestedProducts = extractProductIds(assistantText);
      
      // Clean display text by hiding the [RECOMMEND: ...] token visually
      const cleanedText = assistantText.replace(/\[RECOMMEND:\s*[^\]]+\]/gi, '').trim();

      updateLastMessage({
        text: cleanedText,
        isStreaming: false,
        suggestedProducts
      });
      
      setStreaming(false);

      // Trigger Speech synthesis if enabled
      if (voiceOutputEnabled) {
        speak(cleanedText);
      }

    } catch (error: any) {
      console.error('Chat routing error:', error);
      setStreaming(false);
      setApiError(error.message || 'Apologies, I encountered an issue. Please try again.');
      
      updateLastMessage({
        text: "I'm having trouble retrieving details from the styling database. Please check your internet connection or try again later.",
        isStreaming: false
      });
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <main className="h-[100dvh] bg-[#F4F6F8] flex flex-col relative overflow-hidden font-sans">
      
      {/* Premium Header */}
      <header className="w-full h-20 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 z-10 shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <Link href="/" className="p-2 text-gray-700 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center space-x-1.5 text-gray-900 font-display font-semibold text-base">
              <Sparkles className="w-4 h-4 text-drip-coral fill-drip-coral animate-pulse" />
              <span>DRIP AI Stylist</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-drip-green animate-ping"></span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Interactive Lounge</span>
            </div>
          </div>
        </div>

        {/* Header Tools */}
        <div className="flex items-center space-x-2">
          {/* TTS Speaker Toggle */}
          {isTtsSupported && (
            <button 
              onClick={() => setVoiceOutputEnabled(!voiceOutputEnabled)}
              className={`p-2 rounded-full transition-colors relative ${voiceOutputEnabled ? 'bg-drip-coral/10 text-drip-coral hover:bg-drip-coral/20' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}
              title={voiceOutputEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
            >
              {voiceOutputEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              {isSpeaking && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-drip-coral opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-drip-coral"></span>
                </span>
              )}
            </button>
          )}

          {/* Reset History */}
          <button 
            onClick={() => { stopSpeaking(); clearHistory(); setApiError(null); }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-full transition-colors"
            title="Clear Conversation"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Style DNA Banner */}
      <div className="bg-drip-navy text-white px-4 py-2 flex items-center justify-between text-xs tracking-wide shrink-0 shadow-md">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-drip-green fill-drip-green" />
          {dna.completedOnboarding ? (
            <span className="font-semibold text-gray-200">
              Style DNA Profile Loaded: <span className="text-drip-green font-bold uppercase">{dna.bodyShape}</span> shape &amp; <span className="text-drip-coral font-bold uppercase">{dna.styleVibe}</span> vibe.
            </span>
          ) : (
            <span className="text-gray-300">
              No custom DNA loaded. Recommendations will be generalized.
            </span>
          )}
        </div>
        {!dna.completedOnboarding && (
          <Link 
            href="/profile/style-dna" 
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider transition-colors"
          >
            Onboard Now
          </Link>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar flex flex-col">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          // Match recommended product objects
          const suggestedIds = msg.suggestedProducts || [];
          const matchedProducts = PRODUCTS.filter(p => suggestedIds.includes(p.id));

          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isUser ? 'items-end ml-auto' : 'items-start mr-auto'} max-w-[85%]`}
            >
              {/* Message Bubble */}
              <div 
                className={`p-4 rounded-2xl text-[13px] sm:text-sm leading-relaxed shadow-sm transition-all ${
                  isUser 
                    ? 'bg-[#1A1A2E] text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none font-medium'
                }`}
              >
                {/* Visual markdown styling handles basic paragraphs */}
                <div className="space-y-2 whitespace-pre-wrap">
                  {msg.text || (msg.isStreaming && <span className="inline-block w-1.5 h-4 bg-gray-400 animate-pulse align-middle"></span>)}
                </div>
              </div>

              {/* Product recommendation slider */}
              {matchedProducts.length > 0 && (
                <div className="mt-3 flex overflow-x-auto hide-scrollbar space-x-3 w-[85vw] sm:w-[460px] pb-3 pt-1 px-1">
                  {matchedProducts.map(product => {
                    // Check if fit matches body shape
                    const isShapeMatch = dna.bodyShape && product.bodyShapeSuitable?.includes(dna.bodyShape);
                    
                    return (
                      <Link 
                        href={`/product/${product.id}`} 
                        key={product.id} 
                        className="w-[180px] bg-white border border-gray-100 rounded-xl p-3 shrink-0 shadow-sm cursor-pointer hover:shadow-md hover:border-gray-200 transition-all group"
                      >
                        <div className="w-full h-36 bg-gray-50 rounded-lg relative overflow-hidden mb-2">
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill 
                            className="object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-300" 
                          />
                          {isShapeMatch ? (
                            <div className="absolute top-1.5 left-1.5 bg-drip-green text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center space-x-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5 fill-white text-drip-green" />
                              <span>DNA MATCH</span>
                            </div>
                          ) : (
                            <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm text-[8px] font-bold text-gray-700 px-1.5 py-0.5 rounded shadow-sm">
                              {product.matchPercentage}% Fit
                            </div>
                          )}
                        </div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{product.brand}</div>
                        <div className="text-xs font-semibold text-gray-800 truncate mb-1 leading-snug">{product.name}</div>
                        <div className="flex items-center space-x-1.5 mt-1">
                          <span className="text-xs font-black text-black">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through font-semibold">{product.originalPrice}</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
              
              <span className="text-[9px] text-gray-400 mt-1.5 uppercase font-black px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {/* Global Error Banner */}
        {apiError && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-xs flex items-start space-x-2 mr-auto max-w-[85%]">
            <Info className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input / Control Station */}
      <div className="w-full bg-white border-t border-gray-100 p-4 shrink-0 shadow-lg pb-safe">
        
        {/* Suggestion tags */}
        {messages.length === 1 && !isStreaming && (
          <div className="flex overflow-x-auto hide-scrollbar space-x-2 mb-3 px-1 pb-1">
            {SUGGESTIONS.map(sug => (
              <button 
                key={sug}
                onClick={() => handleSend(sug)}
                className="whitespace-nowrap bg-drip-navy/5 text-drip-navy border border-drip-navy/10 text-xs font-bold px-3 py-2 rounded-full hover:bg-drip-navy/10 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {isListening && (
          <div className="flex items-center justify-center space-x-1.5 py-2.5 mb-3 bg-red-50/40 border border-red-100/50 rounded-2xl shrink-0 animate-in fade-in duration-300">
            <span className="w-1 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
            <span className="w-1 h-5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-1 h-2.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            <span className="w-1 h-6 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            <span className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></span>
            <span className="text-[9px] text-red-600 font-black uppercase tracking-widest ml-3 font-mono">DRIP AI Voice Tunnel Open</span>
          </div>
        )}

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }} 
          className="flex items-center space-x-2"
        >
          {/* Microphone Voice Input Station */}
          <button 
            type="button" 
            onClick={handleMicToggle}
            className={`p-3 rounded-2xl shrink-0 transition-all ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse shadow-md' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
            title={isListening ? 'Stop Listening' : 'Speak to Stylist'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input Container */}
          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl flex items-center pr-2 focus-within:bg-white focus-within:border-gray-200 transition-all min-h-[50px] shadow-inner">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isStreaming}
              placeholder={isListening ? "Listening with intent... Speak now." : "Describe the aesthetic you want..."}
              className="flex-1 bg-transparent px-4 py-3 outline-none text-sm text-gray-800 placeholder-gray-400 font-medium"
            />
            
            {(input.trim() || isStreaming) && (
              <button 
                type="submit" 
                disabled={isStreaming || !input.trim()}
                className="w-8 h-8 bg-drip-navy text-white rounded-xl flex items-center justify-center shrink-0 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            )}
          </div>
        </form>
        
        {voiceInputError && (
          <div className="text-[10px] text-red-500 font-semibold mt-1 px-1">
            Voice Error: {voiceInputError}
          </div>
        )}
      </div>

    </main>
  );
}
