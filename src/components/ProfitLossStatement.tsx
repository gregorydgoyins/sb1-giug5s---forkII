import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface PLMetrics {
  currentPeriod: number;
  previousPeriod: number;
  percentageChange: number;
}

interface PLData {
  revenue: {
    trading: PLMetrics;
    options: PLMetrics;
    bonds: PLMetrics;
    other: PLMetrics;
    total: PLMetrics;
  };
  expenses: {
    commissions: PLMetrics;
    fees: PLMetrics;
    margin: PLMetrics;
    administrative: PLMetrics;
    total: PLMetrics;
  };
  profits: {
    gross: PLMetrics;
    operating: PLMetrics;
    net: PLMetrics;
  };
}

const mockData: PLData = {
  revenue: {
    trading: {
      currentPeriod: 1250000,
      previousPeriod: 1000000,
      percentageChange: 25
    },
    options: {
      currentPeriod: 450000,
      previousPeriod: 350000,
      percentageChange: 28.57
    },
    bonds: {
      currentPeriod: 300000,
      previousPeriod: 250000,
      percentageChange: 20
    },
    other: {
      currentPeriod: 50000,
      previousPeriod: 40000,
      percentageChange: 25
    },
    total: {
      currentPeriod: 2050000,
      previousPeriod: 1640000,
      percentageChange: 25
    }
  },
  expenses: {
    commissions: {
      currentPeriod: 102500,
      previousPeriod: 82000,
      percentageChange: 25
    },
    fees: {
      currentPeriod: 41000,
      previousPeriod: 32800,
      percentageChange: 25
    },
    margin: {
      currentPeriod: 30750,
      previousPeriod: 24600,
      percentageChange: 25
    },
    administrative: {
      currentPeriod: 20500,
      previousPeriod: 16400,
      percentageChange: 25
    },
    total: {
      currentPeriod: 194750,
      previousPeriod: 155800,
      percentageChange: 25
    }
  },
  profits: {
    gross: {
      currentPeriod: 1855250,
      previousPeriod: 1484200,
      percentageChange: 25
    },
    operating: {
      currentPeriod: 1834750,
      previousPeriod: 1467800,
      percentageChange: 25
    },
    net: {
      currentPeriod: 1834750,
      previousPeriod: 1467800,
      percentageChange: 25
    }
  }
};

function MetricRow({ 
  label, 
  metrics, 
  isTotal = false,
  indented = false 
}: { 
  label: string;
  metrics: PLMetrics;
  isTotal?: boolean;
  indented?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-2 ${
      isTotal ? 'border-t border-slate-700/50 mt-2 pt-4' : ''
    }`}>
      <span className={`text-sm ${
        isTotal ? 'font-bold text-white' : 'text-gray-300'
      } ${indented ? 'ml-4' : ''}`}>
        {label}
      </span>
      <div className="flex items-center space-x-6">
        <span className={`text-sm ${isTotal ? 'font-bold text-white' : 'text-gray-300'}`}>
          CC {metrics.currentPeriod.toLocaleString()}
        </span>
        <div className={`flex items-center space-x-1 ${
          metrics.percentageChange >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {metrics.percentageChange >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="text-sm">
            {metrics.percentageChange >= 0 ? '+' : ''}{metrics.percentageChange.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function ProfitLossStatement() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Profit & Loss Statement</h2>
        </div>
        <select className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2">
          <option>Last 30 Days</option>
          <option>Last Quarter</option>
          <option>Year to Date</option>
          <option>Last Year</option>
        </select>
      </div>

      <div className="space-y-6">
        {/* Revenue Section */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Revenue</h3>
          <div className="space-y-2">
            <MetricRow label="Trading Revenue" metrics={mockData.revenue.trading} indented />
            <MetricRow label="Options Revenue" metrics={mockData.revenue.options} indented />
            <MetricRow label="Bond Revenue" metrics={mockData.revenue.bonds} indented />
            <MetricRow label="Other Revenue" metrics={mockData.revenue.other} indented />
            <MetricRow label="Total Revenue" metrics={mockData.revenue.total} isTotal />
          </div>
        </div>

        {/* Expenses Section */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Expenses</h3>
          <div className="space-y-2">
            <MetricRow label="Trading Commissions" metrics={mockData.expenses.commissions} indented />
            <MetricRow label="Platform Fees" metrics={mockData.expenses.fees} indented />
            <MetricRow label="Margin Interest" metrics={mockData.expenses.margin} indented />
            <MetricRow label="Administrative" metrics={mockData.expenses.administrative} indented />
            <MetricRow label="Total Expenses" metrics={mockData.expenses.total} isTotal />
          </div>
        </div>

        {/* Profit Section */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <h3 className="text-lg font-bold text-white mb-4">Profit Summary</h3>
          <div className="space-y-2">
            <MetricRow label="Gross Profit" metrics={mockData.profits.gross} />
            <MetricRow label="Operating Profit" metrics={mockData.profits.operating} />
            <MetricRow label="Net Profit" metrics={mockData.profits.net} isTotal />
          </div>
        </div>
      </div>
    </div>
  );
}