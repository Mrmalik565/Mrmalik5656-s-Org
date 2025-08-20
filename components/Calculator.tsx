import React, { useState } from 'react';
import Display from './Display';
import Keypad from './Keypad';
import History from './History';
import { CalculatorButton } from '../types';

interface CalculatorProps {
  displayValue: string;
  expression: string;
  mode: 'basic' | 'scientific';
  history: string[];
  isRad: boolean;
  onButtonClick: (button: CalculatorButton) => void;
  toggleMode: () => void;
  switchToConverter: () => void;
  switchToChatbot: () => void;
  switchToSettings: () => void;
}

// SVG Icon Components
const HistoryIcon = ({ onClick }: { onClick: () => void }) => (
    <svg onClick={onClick} className="h-6 w-6 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ConverterIcon = ({ onClick }: { onClick: () => void }) => (
    <svg onClick={onClick} className="h-6 w-6 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const ScientificIcon = ({ onClick, isActive }: { onClick: () => void, isActive: boolean }) => (
     <svg onClick={onClick} className={`h-6 w-6 ${isActive ? 'text-fuchsia-500 dark:text-fuchsia-400' : 'text-gray-400'} hover:text-gray-900 dark:hover:text-white cursor-pointer`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.8 3.49a1 1 0 0 1 1.37.37l2 3.46a1 1 0 0 1-.22 1.25l-2.67 2.67a1 1 0 0 1-1.3-.1L11 8.51a1 1 0 0 1 .1-1.3l2.7-2.7zM11 8.51l-2.6 2.6a1 1 0 0 1-1.4 0L3.48 7.59a1 1 0 0 1 0-1.4l2.6-2.6a1 1 0 0 1 1.4 0l3.52 3.52z"/>
        <path d="M2.26 15.34l3.41 3.41a1 1 0 0 0 1.41 0l3.42-3.42a1 1 0 0 0 0-1.41l-3.42-3.42a1 1 0 0 0-1.41 0L2.26 13.93a1 1 0 0 0 0 1.41z"/>
    </svg>
);
const ChatbotIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);
const SettingsIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const Calculator: React.FC<CalculatorProps> = (props) => {
    const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex flex-col h-full relative">
        <header className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
                <HistoryIcon onClick={() => setShowHistory(s => !s)} />
                <ConverterIcon onClick={props.switchToConverter} />
                <ScientificIcon onClick={props.toggleMode} isActive={props.mode === 'scientific'} />
                <ChatbotIcon onClick={props.switchToChatbot} />
            </div>
            <SettingsIcon onClick={props.switchToSettings} />
        </header>
      <Display displayValue={props.displayValue} expression={props.expression} />
      <div className="relative">
        {showHistory && <History history={props.history} onClose={() => setShowHistory(false)} />}
        <Keypad {...props} />
      </div>
    </div>
  );
};

export default Calculator;