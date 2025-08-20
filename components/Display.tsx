import React from 'react';

interface DisplayProps {
  displayValue: string;
  expression: string;
}

const Display: React.FC<DisplayProps> = ({ displayValue, expression }) => {
  const formattedValue = displayValue.length > 9 ? parseFloat(displayValue).toExponential(3) : displayValue;
  
  return (
    <div className="flex-1 flex flex-col justify-end p-6 items-end text-slate-900 dark:text-white overflow-hidden">
      <div className="h-8 text-xl text-gray-500 dark:text-gray-400 font-light truncate max-w-full" title={expression}>
        {expression}
      </div>
      <div 
        key={displayValue} 
        className="text-6xl font-normal tracking-tight truncate max-w-full animate-fade-in" 
        style={{ minHeight: '64px' }}
        title={displayValue}
        >
        {formattedValue}
      </div>
    </div>
  );
};

export default Display;