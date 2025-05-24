import React from 'react';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { SecurityLink } from '@/components/links/SecurityLink';
import type { NewsItem } from '../types';

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <div className="border-b border-slate-700/50 last:border-0 pb-4 last:pb-0">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">
          {item.relatedSecurity ? (
            <SecurityLink
              type={item.relatedSecurity.type}
              symbol={item.relatedSecurity.symbol}
              name={item.title}
            />
          ) : (
            item.title
          )}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.impact === 'positive' ? 'bg-green-900 text-green-200' :
          item.impact === 'negative' ? 'bg-red-900 text-red-200' :
          'bg-slate-700 text-gray-200'
        }`}>
          {item.impact}
        </span>
      </div>
      <p className="text-sm text-gray-400 mt-1">{item.summary}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">{item.source}</span>
          {item.url && (
            <a 
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}