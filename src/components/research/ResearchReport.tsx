import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FileText, TrendingUp, BarChart2, AlertTriangle, Calendar } from 'lucide-react';

// Mock data for the research report
const marketImpactData = [
  { date: '2023-01', positive: 2.5, negative: -1.8, neutral: 0.3 },
  { date: '2023-02', positive: 3.1, negative: -2.2, neutral: 0.4 },
  { date: '2023-03', positive: 2.8, negative: -1.5, neutral: 0.2 },
  // ... more monthly data
];

const sectorCorrelation = [
  { sector: 'Golden Age', correlation: 0.85 },
  { sector: 'Silver Age', correlation: 0.78 },
  { sector: 'Bronze Age', correlation: 0.72 },
  { sector: 'Modern Age', correlation: 0.65 },
];

const tradingSignals = [
  { type: 'Buy', accuracy: 78, volume: 1250 },
  { type: 'Sell', accuracy: 72, volume: 980 },
  { type: 'Hold', accuracy: 65, volume: 1500 },
];

export function ResearchReport() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-8 w-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Market Research Report</h1>
        </div>
        <p className="text-white/90 text-lg">
          News Media Impact on Comic Book Market Movements (2023)
        </p>
        <div className="flex items-center space-x-4 mt-4 text-white/80">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>January 2023 - December 2023</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>95% Confidence Level</span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-4">Executive Summary</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            This research report analyzes the relationship between news media coverage and comic book market movements throughout 2023. Our findings indicate a strong correlation between media sentiment and price action, with significant variations across different market segments and time periods.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Correlation Coefficient</p>
              <p className="text-2xl font-bold text-white">0.78</p>
              <p className="text-sm text-indigo-400">Strong Positive</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Price Impact</p>
              <p className="text-2xl font-bold text-white">2.5%</p>
              <p className="text-sm text-indigo-400">Average Movement</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Signal Accuracy</p>
              <p className="text-2xl font-bold text-white">75%</p>
              <p className="text-sm text-indigo-400">Trading Signals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Impact Analysis */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Market Impact Analysis</h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marketImpactData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '0.5rem'
                }}
                itemStyle={{ color: '#e2e8f0' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="neutral" stroke="#818cf8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart2 className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Sector Correlation</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorCorrelation}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="sector" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="correlation" fill="#818cf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Trading Signals</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tradingSignals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="type" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="accuracy" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Key Findings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Market Impact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Positive news events drive 2.5% average price increase</li>
              <li>• Negative news impact is asymmetric (-1.8% average)</li>
              <li>• Impact duration averages 3-5 trading days</li>
              <li>• Higher correlation during high-volume periods</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Trading Implications</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Early news reaction provides alpha opportunity</li>
              <li>• Cross-asset effects create arbitrage potential</li>
              <li>• Sentiment indicators lead price movements</li>
              <li>• Volume surge precedes major price moves</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6">Trading Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/30">
            <h3 className="text-lg font-semibold text-white mb-2">Buy Signals</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Positive news with high social engagement</li>
              <li>• Cross-market confirmation</li>
              <li>• Volume surge with positive sentiment</li>
            </ul>
          </div>
          <div className="bg-red-900/30 p-4 rounded-lg border border-red-700/30">
            <h3 className="text-lg font-semibold text-white mb-2">Sell Signals</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Negative news cluster formation</li>
              <li>• Deteriorating market breadth</li>
              <li>• Sentiment divergence from price</li>
            </ul>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
            <h3 className="text-lg font-semibold text-white mb-2">Risk Management</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Position sizing based on impact score</li>
              <li>• Stop-loss at 2x average impact</li>
              <li>• Correlation-based hedging</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}