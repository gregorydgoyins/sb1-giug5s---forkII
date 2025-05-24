import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface SecurityLinkProps {
  type: 'comic' | 'creator' | 'publisher' | 'option';
  symbol: string;
  name: string;
  className?: string;
}

export function SecurityLink({ type, symbol, name, className = '' }: SecurityLinkProps) {
  const getHref = () => {
    switch (type) {
      case 'comic':
        return `/comic/${symbol}`;
      case 'creator':
        return `/creator/${symbol}`;
      case 'publisher':
        return `/publisher/${symbol}`;
      case 'option':
        return `/options/${symbol}`;
      default:
        return '#';
    }
  };

  return (
    <Link
      to={getHref()}
      className={`inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors ${className}`}
    >
      <span>{name}</span>
      <ExternalLink className="h-4 w-4" />
    </Link>
  );
}