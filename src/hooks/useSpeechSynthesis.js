import { useState, useEffect, useCallback, useRef } from 'react';

const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthesisRef = useRef(window.speechSynthesis);

  useEffect(() => {
    // Pre-load voices
    if (synthesisRef.current) {
      const loadVoices = () => {
        synthesisRef.current.getVoices();
      };
      synthesisRef.current.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  const speak = useCallback((text, onEnd) => {
    if (!synthesisRef.current) return;

    // Cancel any existing speech
    synthesisRef.current.cancel();

    const cleanText = text.replace(/[*_#]/g, ''); // strip markdown
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const voices = synthesisRef.current.getVoices();
    // Try to find a natural-sounding English voice
    const preferredVoice = voices.find(v => 
      (v.name.includes("Natural") || v.name.includes("Google")) && v.lang.startsWith('en')
    ) || voices.find(v => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = (err) => {
      console.error('Speech Synthesis Error:', err);
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };

    synthesisRef.current.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { isSpeaking, speak, cancel };
};

export default useSpeechSynthesis;
