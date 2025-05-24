import React from 'react';
import { Link } from 'react-router-dom';

interface CreatorLinkProps {
  symbol: string;
  children: React.ReactNode;
  className?: string;
}

export const CreatorLink: React.FC<CreatorLinkProps> = ({ 
  symbol, 
  children, 
  className = ''
}) => {
  return (
    <Link
      to={`/creator/${symbol}`}
      className={`text-left hover:text-indigo-400 transition-colors ${className}`}
    >
      {children}
    </Link>
  );
};