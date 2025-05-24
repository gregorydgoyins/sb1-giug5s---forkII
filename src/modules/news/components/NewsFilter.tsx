'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface NewsFilterProps {
  selectedSource: string | null;
  onSourceSelect: (source: string | null) => void;
}

export function NewsFilter({ selectedSource, onSourceSelect }: NewsFilterProps) {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-5 w-5 text-indigo-400" />
        <span className="text-sm text-gray-400">Filter by source:</span>
      </div>
      <select 
        value={selectedSource || ''}
        onChange={(e) => onSourceSelect(e.target.value || null)}
        className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2"
      >
        <option value="">All Sources</option>
        <option value="market">Market News</option>
        <option value="publisher">Publisher News</option>
        <option value="creator">Creator News</option>
        <option value="events">Events</option>
      </select>
    </div>
  );
}