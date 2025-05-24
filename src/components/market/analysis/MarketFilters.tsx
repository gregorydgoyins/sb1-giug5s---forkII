```typescript
'use client';

import React from 'react';
import { Filter, Search, Calendar } from 'lucide-react';

export function MarketFilters() {
  return (
    <div className="card">
      <div className="flex flex-wrap gap-4">
        {/* Age Period Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-400 mb-2">Comic Age</label>
          <select className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white">
            <option value="all">All Ages</option>
            <option value="golden">Golden Age</option>
            <option value="silver">Silver Age</option>
            <option value="bronze">Bronze Age</option>
            <option value="copper">Copper Age</option>
            <option value="modern">Modern Age</option>
          </select>
        </div>

        {/* Grade Range Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-400 mb-2">Grade Range</label>
          <div className="flex items-center space-x-2">
            <input 
              type="number" 
              min="4.0" 
              max="10.0" 
              step="0.1"
              placeholder="Min"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white"
            />
            <span className="text-gray-400">to</span>
            <input 
              type="number" 
              min="4.0" 
              max="10.0" 
              step="0.1"
              placeholder="Max"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Publisher Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-400 mb-2">Publisher</label>
          <select className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white">
            <option value="all">All Publishers</option>
            <option value="marvel">Marvel Comics</option>
            <option value="dc">DC Comics</option>
            <option value="image">Image Comics</option>
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[300px]">
          <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by character or series..."
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="mt-4 flex items-center justify-between">
        <button className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors">
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
        </button>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
```