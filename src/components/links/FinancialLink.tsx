'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface FinancialLinkProps {
  type: 'stock' | 'bond' | 'option' | 'person';
  symbol: string;
  name: string;
  hasContent?: boolean;
  className?: string;
}

export function FinancialLink({ 
  type, 
  symbol, 
  name, 
  hasContent = false, 
  className = '' 
}: FinancialLinkProps) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (type === 'person') {
      const marvelUrl = await getMarvelUrl(symbol);
      const isbndbUrl = await getIsbndbUrl(symbol);
      
      if (marvelUrl || isbndbUrl) {
        window.open(marvelUrl || isbndbUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = `/creator/${symbol}`;
      }
    } else {
      const routes = {
        stock: `/stocks/${symbol}`,
        bond: `/bonds/${symbol}`,
        option: `/options/${symbol}`
      };
      window.location.href = routes[type];
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center space-x-2 ${
        hasContent ? 'text-indigo-400 hover:text-indigo-300' : 'text-gray-400 hover:text-gray-300'
      } transition-colors underline ${className}`}
    >
      <span>{name}</span>
      <ExternalLink className="h-4 w-4" />
    </button>
  );
}

async function getMarvelUrl(symbol: string): Promise<string | null> {
  const response = await fetch(`/api/marvel/${symbol}`);
  if (!response.ok) return null;
  const data = await response.json();
  return data.url;
}

async function getIsbndbUrl(symbol: string): Promise<string | null> {
  const response = await fetch(`/api/isbndb/${symbol}`);
  if (!response.ok) return null;
  const data = await response.json();
  return data.url;
}