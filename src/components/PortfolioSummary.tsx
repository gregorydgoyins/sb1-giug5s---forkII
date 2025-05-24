import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PieChart, BarChart2 } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PortfolioSummaryProps {
  userId?: string;
}

export function PortfolioSummary({ userId }: PortfolioSummaryProps) {
  const { userBalance } = useMarketStore();
  
  // In a real app, this would fetch data from the PortfolioTracker service
  // For now, we'll use mock data
  const portfolioData = {
    balance: userBalance,
    totalValue: userBalance + 850000, // Balance + positions value
    totalUnrealizedPnL: 75000,
    totalRealizedPnL: 25000,
    assetAllocation: {
      'Comic': 0.45,
      'Creator': 0.30,
      'Publisher': 0.15,
      'Options': 0.10
    },
    positionCount: 8,
    lastUpdated: new Date()
  };
  
  // Format allocation data for pie chart
  const allocationData = Object.entries(portfolioData.assetAllocation).map(([name, value]) => ({
    name,
    value: value * 100 // Convert to percentage
  }));
  
  // Colors for pie chart
  const COLORS = ['#818cf8', '#22c55e', '#eab308', '#ec4899'];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Portfolio Summary</h2>
        </div>
        <p className="text-sm text-gray-400">
          Last updated: {portfolioData.lastUpdated.toLocaleTimeString()}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm text-gray-400">Available Balance</p>
            <p className="text-xl font-bold text-white">CC {portfolioData.balance.toLocaleString()}</p>
          </div>
          
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <p className="text-sm text-gray-400">Total Portfolio Value</p>
            <p className="text-xl font-bold text-white">CC {portfolioData.totalValue.toLocaleString()}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${
              portfolioData.totalUnrealizedPnL >= 0 
                ? 'bg-green-900/30 border-green-700/30' 
                : 'bg-red-900/30 border-red-700/30'
            }`}>
              <p className="text-sm text-gray-400">Unrealized P&L</p>
              <div className="flex items-center">
                {portfolioData.totalUnrealizedPnL >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                )}
                <p className={`text-lg font-bold ${
                  portfolioData.totalUnrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {portfolioData.totalUnrealizedPnL >= 0 ? '+' : ''}
                  CC {portfolioData.totalUnrealizedPnL.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg border ${
              portfolioData.totalRealizedPnL >= 0 
                ? 'bg-green-900/30 border-green-700/30' 
                : 'bg-red-900/30 border-red-700/30'
            }`}>
              <p className="text-sm text-gray-400">Realized P&L</p>
              <div className="flex items-center">
                {portfolioData.totalRealizedPnL >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                )}
                <p className={`text-lg font-bold ${
                  portfolioData.totalRealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {portfolioData.totalRealizedPnL >= 0 ? '+' : ''}
                  CC {portfolioData.totalRealizedPnL.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Asset Allocation</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Allocation']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart2 className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Portfolio Metrics</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Open Positions</p>
            <p className="text-lg font-semibold text-white">{portfolioData.positionCount}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-400">Cash Allocation</p>
            <p className="text-lg font-semibold text-white">
              {((portfolioData.balance / portfolioData.totalValue) * 100).toFixed(1)}%
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-400">Invested Capital</p>
            <p className="text-lg font-semibold text-white">
              CC {(portfolioData.totalValue - portfolioData.balance).toLocaleString()}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-400">Return on Investment</p>
            <p className={`text-lg font-semibold ${
              (portfolioData.totalUnrealizedPnL + portfolioData.totalRealizedPnL) >= 0 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {(((portfolioData.totalUnrealizedPnL + portfolioData.totalRealizedPnL) / 
                (portfolioData.totalValue - portfolioData.balance - portfolioData.totalUnrealizedPnL)) * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}