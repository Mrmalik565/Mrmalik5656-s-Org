export enum ButtonType {
  NUMBER,
  OPERATOR,
  FUNCTION,
  EQUALS,
  SCIENTIFIC,
}

export interface CalculatorButton {
  label: string;
  type: ButtonType;
  gridClass?: string;
}

// Types for Unit Converter
export interface Unit {
  name: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

export interface UnitCategory {
  name: string;
  baseUnit: string;
  units: Unit[];
}

export type ConversionConfig = UnitCategory[];

// Type for Chatbot
export interface ChatMessage {
    sender: 'user' | 'assistant';
    text: string;
}

// This will augment the global scope to add types for the Web Speech API,
// which are not included in standard TypeScript DOM library typings.
declare global {
    // Interfaces for the Web Speech API
    interface SpeechRecognitionAlternative {
        readonly transcript: string;
        readonly confidence: number;
    }

    interface SpeechRecognitionResult {
        readonly isFinal: boolean;
        readonly length: number;
        item(index: number): SpeechRecognitionAlternative;
        [index: number]: SpeechRecognitionAlternative;
    }

    interface SpeechRecognitionResultList {
        readonly length: number;
        item(index: number): SpeechRecognitionResult;
        [index: number]: SpeechRecognitionResult;
    }
    
    interface SpeechRecognitionEvent extends Event {
        readonly resultIndex: number;
        readonly results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionErrorEvent extends Event {
        readonly error: string;
        readonly message: string;
    }

    interface SpeechRecognition extends EventTarget {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onend: ((this: SpeechRecognition, ev: Event) => any) | null;
        onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
        onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
        start(): void;
        stop(): void;
    }

    interface SpeechRecognitionStatic {
        new(): SpeechRecognition;
    }

    interface Window {
        SpeechRecognition: SpeechRecognitionStatic;
        webkitSpeechRecognition: SpeechRecognitionStatic;
    }
}
