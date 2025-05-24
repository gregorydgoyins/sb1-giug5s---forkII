import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

export function GraphTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/50 shadow-xl">
      <p className="text-sm text-gray-400 mb-1">
        {new Date(label || '').toLocaleDateString()}
      </p>
      <p className="text-lg font-semibold text-white">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}