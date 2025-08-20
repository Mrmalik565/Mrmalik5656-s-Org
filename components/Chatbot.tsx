import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Chat } from '@google/genai';
import type { ChatMessage } from '../types';
import clsx from 'clsx';

interface ChatbotProps {
    onBack: () => void;
}

// --- SVG Icons ---
const SpeakerOnIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const SpeakerOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l-4-4m0 4l4-4" />
    </svg>
);

const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const Chatbot: React.FC<ChatbotProps> = ({ onBack }) => {
    const [stage, setStage] = useState<'language' | 'name' | 'chat'>('language');
    const [language, setLanguage] = useState<'English' | 'Hindi' | null>(null);
    const [userName, setUserName] = useState<string>('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [isTtsEnabled, setIsTtsEnabled] = useState(true);
    const [isListening, setIsListening] = useState(false);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Speech Synthesis (TTS) ---
    const speak = useCallback((text: string, lang: string) => {
        window.speechSynthesis.cancel(); // Stop any previous speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
    }, []);

    useEffect(() => {
        if (!isTtsEnabled) return;
        
        const lastMessage = messages[messages.length - 1];
        const isReadyToSpeak = lastMessage && lastMessage.sender === 'assistant' && lastMessage.text && !isLoading;

        if (isReadyToSpeak) {
            speak(lastMessage.text, language === 'English' ? 'en-US' : 'hi-IN');
        }
    }, [messages, isLoading, isTtsEnabled, language, speak]);

    // --- Speech Recognition (STT) ---
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition not supported in this browser.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            setInput(prev => (prev ? prev + ' ' : '') + transcript);
        };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };
        
        recognitionRef.current = recognition;
    }, []);

    useEffect(() => {
        if (recognitionRef.current && language) {
            recognitionRef.current.lang = language === 'English' ? 'en-US' : 'hi-IN';
        }
    }, [language]);

    const toggleListen = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // --- Core Chat Logic ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);
    
    const handleBack = () => {
        window.speechSynthesis.cancel(); // Stop speaking on exit
        onBack();
    };

    const handleLanguageSelect = (lang: 'English' | 'Hindi') => {
        setLanguage(lang);
        setStage('name');
        const prompt = lang === 'English' 
            ? "What's your name?" 
            : "आपका नाम क्या है?";
        setMessages([{ sender: 'assistant', text: prompt }]);
    };
    
    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!userName.trim()) return;
        const greeting = language === 'English'
            ? `Hello ${userName}! I'm your math assistant. How can I help you today? You can also upload a photo of a problem.`
            : `नमस्ते ${userName}! मैं आपका गणित सहायक हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ? आप किसी समस्या की तस्वीर भी अपलोड कर सकते हैं।`;

        const systemInstruction = language === 'English'
            ? 'You are a friendly and expert math tutor. Your name is Geo. Explain concepts clearly and provide step-by-step solutions. Always respond in English.'
            : 'तुम एक मिलनसार और विशेषज्ञ गणित के शिक्षक हो। तुम्हारा नाम जियो है। अवधारणाओं को स्पष्ट रूप से समझाओ और कदम-दर-कदम समाधान प्रदान करो। हमेशा हिंदी में जवाब दो।';

        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });

        setChat(newChat);
        setMessages(prev => [...prev, { sender: 'assistant', text: greeting }]);
        setStage('chat');
    };
    
    const handleSendMessage = async (e: React.FormEvent, messageText = input) => {
        e.preventDefault();
        if (!messageText.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { sender: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        const assistantMessage: ChatMessage = { sender: 'assistant', text: '' };
        setMessages(prev => [...prev, assistantMessage]);

        try {
             const result = await chat.sendMessageStream({ message: messageText });
             for await (const chunk of result) {
                const chunkText = chunk.text;
                setMessages(prev => prev.map((msg, index) => 
                    index === prev.length - 1 
                        ? { ...msg, text: msg.text + chunkText } 
                        : msg
                ));
             }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = language === 'English' ? 'Sorry, I ran into an error.' : 'क्षमा करें, मुझे एक त्रुटि हुई।';
            setMessages(prev => prev.map((msg, index) => 
                    index === prev.length - 1 
                        ? { ...msg, text: errorMessage } 
                        : msg
                ));
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            const imagePart = {
                inlineData: {
                    mimeType: file.type,
                    data: base64Data,
                },
            };

            const promptText = language === 'English'
                ? "Solve the math problem in this image. Explain the steps clearly."
                : "इस तस्वीर में गणित की समस्या को हल करें। चरणों को स्पष्ट रूप से समझाएं।";

            const userMessage: ChatMessage = { sender: 'user', text: `[${language === 'English' ? 'Image Uploaded' : 'छवि अपलोड की गई'}]` };
            setMessages(prev => [...prev, userMessage]);
            setIsLoading(true);
            
            const assistantMessage: ChatMessage = { sender: 'assistant', text: '' };
            setMessages(prev => [...prev, assistantMessage]);

            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [imagePart, { text: promptText }] },
                });
                const resultText = response.text;
                setMessages(prev => prev.map((msg, index) => 
                    index === prev.length - 1 ? { ...msg, text: resultText } : msg
                ));

            } catch (error) {
                console.error("Error with image upload:", error);
                const errorMessage = language === 'English' ? 'Sorry, I couldn\'t process the image.' : 'क्षमा करें, मैं छवि को संसाधित नहीं कर सका।';
                 setMessages(prev => prev.map((msg, index) => 
                    index === prev.length - 1 ? { ...msg, text: errorMessage } : msg
                ));
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-slate-900/30 text-slate-900 dark:text-white">
             <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                <button onClick={handleBack} className="text-fuchsia-500 dark:text-fuchsia-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h1 className="text-xl font-semibold">AI Assistant</h1>
                <button onClick={() => setIsTtsEnabled(prev => !prev)} className="text-slate-500 dark:text-slate-400 hover:text-fuchsia-500 transition-colors">
                    {isTtsEnabled ? <SpeakerOnIcon className="h-6 w-6" /> : <SpeakerOffIcon className="h-6 w-6" />}
                </button>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-fuchsia-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-700 rounded-bl-none'}`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-xs rounded-2xl px-4 py-3 bg-white dark:bg-slate-700 rounded-bl-none">
                            <div className="flex items-center space-x-2">
                               <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                               <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                               <div className="w-2 h-2 bg-fuchsia-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 border-t border-gray-200 dark:border-slate-700">
                {stage === 'language' && (
                    <div className="flex justify-center gap-4">
                        <button onClick={() => handleLanguageSelect('English')} className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg">English</button>
                        <button onClick={() => handleLanguageSelect('Hindi')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">हिन्दी</button>
                    </div>
                )}
                {stage === 'name' && (
                    <form onSubmit={handleNameSubmit} className="flex gap-2">
                         <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder={language === 'English' ? 'Enter your name...' : 'अपना नाम दर्ज करें...'} className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:outline-none focus:border-fuchsia-500" />
                         <button type="submit" className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg">Go</button>
                    </form>
                )}
                 {stage === 'chat' && (
                     <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                         <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                         <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                         </button>
                         <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={language === 'English' ? 'Ask or speak...' : 'पूछें या बोलें...'} className="flex-1 p-3 rounded-full bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:outline-none focus:border-fuchsia-500" />
                         <button 
                            type="button" 
                            onClick={toggleListen}
                            className={clsx(
                                "p-3 text-white rounded-full transition-colors",
                                isListening ? "bg-red-500 animate-pulse" : "bg-indigo-500 hover:bg-indigo-600"
                            )}>
                           <MicrophoneIcon className="h-6 w-6" />
                         </button>
                         <button type="submit" disabled={isLoading || !input.trim()} className="p-3 bg-fuchsia-600 text-white rounded-full hover:bg-fuchsia-700 disabled:bg-fuchsia-400 disabled:cursor-not-allowed">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                         </button>
                    </form>
                 )}
            </footer>
        </div>
    );
};

export default Chatbot;