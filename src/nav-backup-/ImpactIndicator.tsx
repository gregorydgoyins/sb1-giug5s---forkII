'use client';

import React from 'react';
import { Activity } from 'lucide-react';

export function ImpactIndicator() {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Activity className="h-5 w-5 text-green-400" />
        <div className="text-sm">
          <span className="text-gray-400">Market Impact:</span>
          <span className="ml-1 text-green-400">Stable</span>
        </div>
      </div>
      
      <div className="h-6 flex space-x-1">
        <div className="w-1 bg-green-500 rounded animate-pulse" style={{ height: '16px' }} />
        <div className="w-1 bg-green-500 rounded animate-pulse" style={{ height: '20px' }} />
        <div className="w-1 bg-green-500 rounded animate-pulse" style={{ height: '24px' }} />
        <div className="w-1 bg-green-500 rounded animate-pulse" style={{ height: '16px' }} />
      </div>
    </div>
  );
}