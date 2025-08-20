import React from 'react';
import { ButtonType } from '../types';
import clsx from 'clsx';

interface ButtonProps {
  label: string;
  type: ButtonType;
  onClick: () => void;
  className?: string;
  isActive?: boolean;
  mode: 'basic' | 'scientific';
}

const Button: React.FC<ButtonProps> = ({ label, type, onClick, className, isActive = false, mode }) => {
  const typeClasses = () => {
    switch (type) {
      case ButtonType.NUMBER:
        return 'bg-slate-200/50 dark:bg-slate-700/50 text-slate-900 dark:text-white hover:bg-slate-300/80 dark:hover:bg-slate-700/80';
      case ButtonType.OPERATOR:
        return isActive 
            ? 'bg-white text-fuchsia-600 ring-2 ring-fuchsia-600' 
            : 'bg-fuchsia-600 text-white hover:bg-fuchsia-700';
      case ButtonType.FUNCTION:
        return 'bg-indigo-500 text-white hover:bg-indigo-600';
      case ButtonType.SCIENTIFIC:
        return isActive 
            ? 'bg-fuchsia-600 text-white' 
            : 'bg-indigo-500 text-white hover:bg-indigo-600';
      case ButtonType.EQUALS:
        return 'bg-fuchsia-600 text-white hover:bg-fuchsia-700';
      default:
        return 'bg-gray-300 dark:bg-gray-700 text-slate-900 dark:text-white';
    }
  };

  const fontSizeClass = label.length > 2 ? 'text-xl' : 'text-3xl';
  const heightClass = mode === 'scientific' ? 'h-14' : 'h-20';


  const classes = clsx(
    "flex items-center justify-center font-medium rounded-2xl focus:outline-none transition-all duration-150 active:scale-95",
    typeClasses(),
    fontSizeClass,
    className,
    heightClass
  );
  

  return (
    <button
      onClick={onClick}
      className={classes}
    >
      {label}
    </button>
  );
};

export default Button;