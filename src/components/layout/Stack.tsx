import React from 'react';

interface StackProps {
  children: React.ReactNode;
  space?: number;
  className?: string;
}

export function Stack({ children, space = 4, className = '' }: StackProps) {
  return (
    <div className={`space-y-${space} ${className}`}>
      {children}
    </div>
  );
}