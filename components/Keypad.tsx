import React from 'react';
import Button from './Button';
import { basicCalculatorButtons, scientificCalculatorButtons } from '../constants';
import { ButtonType, CalculatorButton } from '../types';
import clsx from 'clsx';

interface KeypadProps {
  expression: string;
  mode: 'basic' | 'scientific';
  isRad: boolean;
  onButtonClick: (button: CalculatorButton) => void;
}

const Keypad: React.FC<KeypadProps> = ({ expression, mode, isRad, onButtonClick }) => {
  const buttons = mode === 'scientific' ? scientificCalculatorButtons : basicCalculatorButtons;
  const keypadClasses = clsx(
    "grid p-4 bg-gray-100/70 dark:bg-slate-900/30 rounded-t-3xl transition-all duration-300 backdrop-blur-sm",
    {
      'grid-cols-4 gap-3': mode === 'basic',
      'grid-cols-5 gap-2': mode === 'scientific'
    }
  );
  
  return (
    <div className={keypadClasses}>
      {buttons.map((btn) => (
        <Button
          key={btn.label}
          label={btn.label}
          type={btn.type}
          onClick={() => onButtonClick(btn)}
          className={btn.gridClass}
          isActive={
            (btn.type === ButtonType.OPERATOR && expression.endsWith(btn.label)) || 
            (btn.label === 'Rad' && isRad)
          }
          mode={mode}
        />
      ))}
    </div>
  );
};

export default Keypad;