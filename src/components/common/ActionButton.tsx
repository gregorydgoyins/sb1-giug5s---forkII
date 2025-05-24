'use client';

import React from 'react';
import { ArrowRight, BarChart2, Folder } from 'lucide-react';

interface ActionButtonProps {
  variant: 'learn' | 'trade' | 'portfolio';
  onClick?: () => void;
  className?: string;
}

export function ActionButton({ variant, onClick, className = '' }: ActionButtonProps) {
  const getButtonStyles = () => {
    switch (variant) {
      case 'learn':
        return {
          bg: 'bg-[#FF6B00] hover:bg-[#E65C00]',
          icon: <ArrowRight className="h-5 w-5 ml-2" />,
          text: 'Learn More',
          iconPosition: 'right'
        };
      case 'trade':
        return {
          bg: 'bg-[#00B140] hover:bg-[#009E3A]',
          icon: <BarChart2 className="h-5 w-5 mr-2" />,
          text: 'Start Trading',
          iconPosition: 'left'
        };
      case 'portfolio':
        return {
          bg: 'bg-[#FFD700] hover:bg-[#E6C200]',
          icon: <Folder className="h-5 w-5 mr-2" />,
          text: 'View Portfolio',
          iconPosition: 'left',
          textColor: 'text-[#333333]'
        };
      default:
        return {
          bg: 'bg-indigo-600 hover:bg-indigo-700',
          text: 'Click Me'
        };
    }
  };

  const styles = getButtonStyles();

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        px-4 py-3 rounded-lg
        ${styles.bg}
        ${styles.textColor || 'text-white'}
        text-base font-medium
        transition-all duration-200
        transform hover:scale-105 active:scale-100
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
        ${variant === 'learn' ? 'focus:ring-orange-500' : 
          variant === 'trade' ? 'focus:ring-green-500' : 
          'focus:ring-yellow-500'}
        ${className}
      `}
    >
      {styles.iconPosition === 'left' && styles.icon}
      <span>{styles.text}</span>
      {styles.iconPosition === 'right' && styles.icon}
    </button>
  );
}