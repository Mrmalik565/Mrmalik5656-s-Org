import React, { useState, useMemo, useEffect } from 'react';
import { unitConversionConfig } from '../constants';
import type { UnitCategory, Unit } from '../types';

interface UnitConverterProps {
    onBack: () => void;
}

const UnitConverter: React.FC<UnitConverterProps> = ({ onBack }) => {
    const [selectedCategory, setSelectedCategory] = useState<UnitCategory>(unitConversionConfig[0]);
    const [fromUnit, setFromUnit] = useState<Unit>(selectedCategory.units[0]);
    const [toUnit, setToUnit] = useState<Unit>(selectedCategory.units[1]);
    const [fromValue, setFromValue] = useState<string>('1');
    const [toValue, setToValue] = useState<string>('');

    const convertValue = (value: string) => {
        if (!value) {
            return '';
        }
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return 'Error';
        }
        const valueInBase = fromUnit.toBase(numValue);
        const valueConverted = toUnit.fromBase(valueInBase);
        return Number(valueConverted.toPrecision(6)).toString();
    };
    
    useEffect(() => {
        const result = convertValue(fromValue);
        setToValue(result);
    }, [fromValue, fromUnit, toUnit]);
    
    const handleCategoryChange = (categoryName: string) => {
        const newCategory = unitConversionConfig.find(c => c.name === categoryName)!;
        setSelectedCategory(newCategory);
        setFromUnit(newCategory.units[0]);
        setToUnit(newCategory.units[1] || newCategory.units[0]);
        setFromValue('1');
    };
    
    const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFromValue(e.target.value);
    };

    const handleUnitChange = (type: 'from' | 'to', unitSymbol: string) => {
        const newUnit = selectedCategory.units.find(u => u.symbol === unitSymbol)!;
        if (type === 'from') {
           setFromUnit(newUnit);
        } else {
           setToUnit(newUnit);
        }
    }
    
    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-slate-900/30 text-slate-900 dark:text-white p-4">
            <header className="flex items-center justify-between pb-4">
                <button onClick={onBack} className="text-fuchsia-500 dark:text-fuchsia-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-semibold">Unit Converter</h1>
                <div className="w-6"></div>
            </header>
            
            <div className="mb-4">
                <select 
                    value={selectedCategory.name} 
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 p-3 rounded-lg text-slate-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 focus:outline-none focus:border-fuchsia-500 transition-colors"
                >
                    {unitConversionConfig.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                </select>
            </div>

            <div className="space-y-4">
                {/* From Unit */}
                <div className="bg-white/70 dark:bg-slate-800/70 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                         <label className="text-slate-500 dark:text-slate-400">From</label>
                         <select 
                            value={fromUnit.symbol}
                            onChange={(e) => handleUnitChange('from', e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white focus:outline-none text-right"
                         >
                            {selectedCategory.units.map(unit => <option key={unit.symbol} value={unit.symbol}>{unit.name}</option>)}
                         </select>
                    </div>
                    <input 
                        type="number"
                        value={fromValue}
                        onChange={handleFromValueChange}
                        className="w-full bg-transparent text-4xl font-bold focus:outline-none text-right"
                        aria-label="From value"
                    />
                </div>
                
                {/* To Unit */}
                <div className="bg-white/70 dark:bg-slate-800/70 p-4 rounded-lg">
                     <div className="flex justify-between items-center mb-2">
                         <label className="text-slate-500 dark:text-slate-400">To</label>
                         <select 
                            value={toUnit.symbol}
                            onChange={(e) => handleUnitChange('to', e.target.value)}
                            className="bg-transparent text-slate-900 dark:text-white focus:outline-none text-right"
                         >
                            {selectedCategory.units.map(unit => <option key={unit.symbol} value={unit.symbol}>{unit.name}</option>)}
                         </select>
                    </div>
                     <div key={toValue} className="animate-fade-in">
                        <input 
                            type="text"
                            value={toValue}
                            readOnly
                            className="w-full bg-transparent text-4xl font-bold focus:outline-none text-right"
                            aria-label="To value"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnitConverter;