import React, { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon } from '../Icons';

// Fix: Add types for the Web Speech API to prevent TypeScript errors.
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}


interface VoiceInputProps {
  onFinalTranscript: (transcript: string) => void;
  targetId?: string;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onFinalTranscript, targetId, className }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      const targetElement = targetId ? document.getElementById(targetId) as HTMLInputElement | HTMLTextAreaElement : null;

      if (finalTranscript) {
        const finalValue = finalTranscript.trim();
        if (targetElement) {
          targetElement.value = finalValue;
        }
        onFinalTranscript(finalValue);
        stopListening();
      } else if (targetElement) {
        targetElement.value = interimTranscript;
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      stopListening();
    };
    
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onFinalTranscript, targetId]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
        setIsListening(false);
        recognitionRef.current.stop();
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // This effect handles the case where the component unmounts while listening
  useEffect(() => {
    return () => {
        stopListening();
    }
  }, []);

  return (
    <button
      type="button"
      onClick={handleToggleListening}
      className={`p-3 rounded-full transition-colors shrink-0 ${
        isListening 
          ? 'bg-red-500/90 text-white animate-pulse' 
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      } ${className}`}
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
    >
      <MicrophoneIcon className="h-5 w-5" />
    </button>
  );
};

export default VoiceInput;