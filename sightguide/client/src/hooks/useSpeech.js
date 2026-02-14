import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const synthesisRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;
        setTranscript(text.toLowerCase());
      };
    }
  }, []);

  const speak = useCallback((text, priority = false) => {
    if (!synthesisRef.current) return;

    if (priority) {
      synthesisRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Recognition already started", e);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return {
    speak,
    startListening,
    stopListening,
    isSpeaking,
    isListening,
    transcript,
    setTranscript // Export to allow clearing
  };
};

export default useSpeech;
