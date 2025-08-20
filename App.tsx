import React, { useState, useCallback, useEffect } from 'react';
import Calculator from './components/Calculator';
import Vault from './components/Vault';
import UnitConverter from './components/UnitConverter';
import Chatbot from './components/Chatbot';
import Settings from './components/Settings';
import { SECRET_CODE } from './constants';
import { ButtonType, CalculatorButton } from './types';
import { create, all } from 'mathjs';

type View = 'calculator' | 'vault' | 'unitConverter' | 'chatbot' | 'settings';
type CalculatorMode = 'basic' | 'scientific';
export type Theme = 'light' | 'dark';


// --- Math.js setup ---
const mathRad = create(all, {
    number: 'BigNumber',
    precision: 64
});

const mathDeg = create(all, {
    number: 'BigNumber',
    precision: 64
});
const originalSin = mathDeg.sin;
const originalCos = mathDeg.cos;
const originalTan = mathDeg.tan;
mathDeg.import({
  sin: (x: any) => originalSin(mathDeg.unit(x, 'deg')),
  cos: (x: any) => originalCos(mathDeg.unit(x, 'deg')),
  tan: (x: any) => originalTan(mathDeg.unit(x, 'deg')),
}, { override: true });


// --- Helper Functions ---
const evaluateExpression = (expr: string, isRad: boolean): string => {
    if (!expr) return '0';
    
    const math = isRad ? mathRad : mathDeg;
    
    try {
        const expressionToEvaluate = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π/g, 'pi')
            .replace(/√\(/g, 'sqrt(')
            .replace(/log\(/g, 'log10(')
            .replace(/ln\(/g, 'log(')
            .replace(/\^/g, '^');
            
        const result = math.evaluate(expressionToEvaluate);
        
        return math.format(result, { notation: 'auto', precision: 16 });
    } catch (e) {
        return 'Error';
    }
};

// --- App Component ---
const App: React.FC = () => {
    const [view, setView] = useState<View>('calculator');
    const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>('basic');
    const [theme, setTheme] = useState<Theme>('dark');
    const [expression, setExpression] = useState<string>('');
    const [displayValue, setDisplayValue] = useState<string>('0');
    const [history, setHistory] = useState<string[]>([]);
    const [isRad, setIsRad] = useState(false);
    const [isResult, setIsResult] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const handleButtonClick = useCallback((btn: CalculatorButton) => {
        const { label, type } = btn;
        
        if (isResult && type !== ButtonType.OPERATOR && type !== ButtonType.SCIENTIFIC && label !== '%') {
             setExpression('');
             setDisplayValue('0');
        }
        setIsResult(false);

        switch (type) {
            case ButtonType.NUMBER:
                if (label === 'π' || label === 'e') {
                    setExpression(prev => prev + label);
                } else {
                     setExpression(prev => (prev === '0' && label !== '.') ? label : prev + label);
                }
                break;
            case ButtonType.OPERATOR:
                setExpression(prev => prev + label);
                break;
            case ButtonType.EQUALS:
                if (displayValue === SECRET_CODE && expression === SECRET_CODE) {
                  setView('vault');
                  setExpression('');
                  setDisplayValue('0');
                  return;
                }
                const fullExpression = expression;
                const result = evaluateExpression(fullExpression, isRad);
                setDisplayValue(result);
                setHistory(prev => [`${fullExpression} = ${result}`, ...prev].slice(0, 20));
                setExpression(result === 'Error' ? '' : result);
                setIsResult(true);
                break;
            case ButtonType.FUNCTION:
            case ButtonType.SCIENTIFIC:
                handleFunctionClick(label);
                break;
        }
    }, [expression, displayValue, isRad, isResult]);

    const handleFunctionClick = useCallback((func: string) => {
        switch (func) {
            case 'C':
                setExpression('');
                setDisplayValue('0');
                break;
            case '+/-':
                // Toggles the sign of the last number entry
                setExpression(prev => {
                    const match = prev.match(/(-?\d+\.?\d*)$/);
                    if (!match) return prev;
                    const lastNum = match[0];
                    const num = parseFloat(lastNum);
                    const start = prev.substring(0, match.index);
                    return start + (num * -1).toString();
                });
                break;
            case '%':
                setExpression(prev => `(${prev})/100`);
                break;
            case 'Rad':
                setIsRad(prev => !prev);
                break;
            case 'xʸ':
                setExpression(prev => prev + '^');
                break;
            // Functions that need parentheses
            case '√':
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
                setExpression(prev => prev + `${func}(`);
                break;
            // Simple parentheses
            case '(':
            case ')':
                setExpression(prev => prev + func);
                break;
        }
    }, []);

    useEffect(() => {
        if (expression === '') {
            setDisplayValue('0');
        } else if (!isResult) {
            setDisplayValue(expression);
        }
    }, [expression, isResult]);


    const backToCalculator = () => setView('calculator');

    const mainContent = () => {
        switch (view) {
            case 'calculator':
                return (
                    <Calculator
                        displayValue={displayValue}
                        expression={expression}
                        mode={calculatorMode}
                        history={history}
                        isRad={isRad}
                        onButtonClick={handleButtonClick}
                        toggleMode={() => setCalculatorMode(m => m === 'basic' ? 'scientific' : 'basic')}
                        switchToConverter={() => setView('unitConverter')}
                        switchToChatbot={() => setView('chatbot')}
                        switchToSettings={() => setView('settings')}
                    />
                );
            case 'vault':
                return <Vault onBack={backToCalculator} />;
            case 'unitConverter':
                return <UnitConverter onBack={backToCalculator} />;
            case 'chatbot':
                return <Chatbot onBack={backToCalculator} />;
             case 'settings':
                return <Settings onBack={backToCalculator} theme={theme} setTheme={setTheme} />;
            default:
                return null;
        }
    }

    const heightClass = calculatorMode === 'scientific' && view === 'calculator' ? 'h-[720px]' : 'h-[640px]';

    return (
        <div className={`w-[340px] bg-white dark:bg-gradient-to-br dark:from-indigo-900 dark:via-slate-900 dark:to-black rounded-3xl shadow-2xl overflow-hidden font-sans flex flex-col transition-all duration-300 ${heightClass}`}>
            {mainContent()}
        </div>
    );
};

export default App;