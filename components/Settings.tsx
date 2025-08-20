import React from 'react';
import type { Theme } from '../App';
import clsx from 'clsx';

interface SettingsProps {
    onBack: () => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack, theme, setTheme }) => {

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-slate-900/30 text-slate-900 dark:text-white p-4">
            <header className="flex items-center justify-between pb-4">
                <button onClick={onBack} className="text-fuchsia-500 dark:text-fuchsia-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-semibold">Settings</h1>
                <div className="w-6"></div>
            </header>
            
            <main className="flex-1 mt-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Theme</span>
                        <div className="flex items-center gap-2">
                           <span className="text-sm text-gray-500 dark:text-gray-400">{theme === 'light' ? 'Light' : 'Dark'}</span>
                           <button 
                                onClick={toggleTheme}
                                className={clsx(
                                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2",
                                    theme === 'dark' ? 'bg-fuchsia-600' : 'bg-gray-300'
                                )}
                                aria-label="Toggle theme"
                           >
                                <span className={clsx(
                                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                     theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                                )}>
                                </span>
                           </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
