import React from 'react';

interface HistoryProps {
    history: string[];
    onClose: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onClose }) => {
    return (
        <div className="absolute bottom-full left-0 right-0 h-64 bg-zinc-200/95 dark:bg-zinc-800/95 backdrop-blur-sm rounded-t-3xl p-4 flex flex-col shadow-lg z-20 text-slate-900 dark:text-white">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">History</h2>
                <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {history.length === 0 ? (
                    <p className="text-gray-500 text-center mt-8">No history yet.</p>
                ) : (
                    <ul className="text-right">
                        {history.map((item, index) => (
                            <li key={index} className="p-2 border-b border-zinc-300 dark:border-zinc-700 text-xl">
                                <span className="text-gray-600 dark:text-gray-300">{item.split('=')[0]}</span>
                                <span className="block text-2xl font-semibold">
                                    = {item.split('=')[1]}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default History;