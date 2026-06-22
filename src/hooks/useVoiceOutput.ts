import { useState, useEffect, useRef } from 'react';

export function useVoiceOutput() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    synthRef.current = window.speechSynthesis;

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    // Clean up markdown formatting and recommendations so they are not read aloud literally
    const cleanText = text
      .replace(/\[RECOMMEND:\s*[^\]]+\]/gi, '') // Strip [RECOMMEND: m1, m2]
      .replace(/[*#_~`\-+]/g, '') // Strip markdown formatting
      .replace(/https?:\/\/\S+/gi, '') // Strip links
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Attempt to set an English voice (preferably Indian English, fallback to generic English)
    const voices = synthRef.current.getVoices();
    const targetVoice = 
      voices.find((v) => v.lang === 'en-IN') || 
      voices.find((v) => v.lang.startsWith('en-')) || 
      voices[0];

    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const stop = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  return {
    speak,
    stop,
    isSpeaking,
    isSupported: typeof window !== 'undefined' && !!window.speechSynthesis,
  };
}
