'use client';

import React, { memo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ChartProps {
  data: any[];
  tooltipContent: React.ComponentType<any>;
  yAxisFormatter: (value: number) => string;
  xAxisFormatter: (value: string) => string;
}

function ChartComponent({
  data,
  tooltipContent: TooltipContent,
  yAxisFormatter,
  xAxisFormatter
}: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="date"
          stroke="#94a3b8"
          tickFormatter={xAxisFormatter}
          minTickGap={50}
        />
        <YAxis
          stroke="#94a3b8"
          tickFormatter={yAxisFormatter}
          width={80}
        />
        <Tooltip
          content={<TooltipContent />}
          cursor={{ stroke: '#818cf8', strokeWidth: 1 }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#818cf8"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#818cf8' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Memoize the chart to prevent unnecessary rerenders
export default memo(ChartComponent);