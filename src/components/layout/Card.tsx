import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div 
      className={`
        bg-slate-800 rounded-xl 
        shadow-lg hover:shadow-xl
        border border-slate-700/50
        transition-all duration-200 ease-in-out
        p-4 sm:p-6
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}