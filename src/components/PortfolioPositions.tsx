import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Filter, Search } from 'lucide-react';

interface PortfolioPositionsProps {
  userId?: string;
}

export function PortfolioPositions({ userId }: PortfolioPositionsProps) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock positions data
  const mockPositions = [
    {
      id: '1',
      symbol: 'ASM300',
      name: 'Amazing Spider-Man #300',
      type: 'comic',
      quantity: 2,
      averagePrice: 2400,
      currentPrice: 2500,
      value: 5000,
      unrealizedPnL: 200,
      pnlPercentage: 4.17
    },
    {
      id: '2',
      symbol: 'TMFS',
      name: 'Todd McFarlane',
      type: 'creator',
      quantity: 50,
      averagePrice: 1800,
      currentPrice: 1850,
      value: 92500,
      unrealizedPnL: 2500,
      pnlPercentage: 2.78
    },
    {
      id: '3',
      symbol: 'DCCP',
      name: 'DC Comics',
      type: 'publisher',
      quantity: 25,
      averagePrice: 3400,
      currentPrice: 3500,
      value: 87500,
      unrealizedPnL: 2500,
      pnlPercentage: 2.94
    },
    {
      id: '4',
      symbol: 'BAT457',
      name: 'Batman #457',
      type: 'comic',
      quantity: 3,
      averagePrice: 1750,
      currentPrice: 1800,
      value: 5400,
      unrealizedPnL: 150,
      pnlPercentage: 2.86
    },
    {
      id: '5',
      symbol: 'MRVL',
      name: 'Marvel Entertainment',
      type: 'publisher',
      quantity: 20,
      averagePrice: 4100,
      currentPrice: 4200,
      value: 84000,
      unrealizedPnL: 2000,
      pnlPercentage: 2.44
    },
    {
      id: '6',
      symbol: 'JLES',
      name: 'Jim Lee',
      type: 'creator',
      quantity: 40,
      averagePrice: 2150,
      currentPrice: 2200,
      value: 88000,
      unrealizedPnL: 2000,
      pnlPercentage: 2.33
    },
    {
      id: '7',
      symbol: 'ASM300C2600',
      name: 'ASM #300 2600 Call',
      type: 'option',
      quantity: 10,
      averagePrice: 140,
      currentPrice: 150,
      value: 1500,
      unrealizedPnL: 100,
      pnlPercentage: 7.14
    },
    {
      id: '8',
      symbol: 'TMFSP1800',
      name: 'TMF 1800 Put',
      type: 'option',
      quantity: 5,
      averagePrice: 80,
      currentPrice: 75,
      value: 375,
      unrealizedPnL: -25,
      pnlPercentage: -6.25
    }
  ];
  
  // Filter positions based on selected filter and search query
  const filteredPositions = mockPositions.filter(position => {
    const matchesFilter = filter === 'all' || position.type === filter;
    const matchesSearch = position.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         position.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Calculate totals
  const totalValue = filteredPositions.reduce((sum, position) => sum + position.value, 0);
  const totalUnrealizedPnL = filteredPositions.reduce((sum, position) => sum + position.unrealizedPnL, 0);
  const totalPnlPercentage = totalValue > 0 ? (totalUnrealizedPnL / (totalValue - totalUnrealizedPnL)) * 100 : 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Portfolio Positions</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search positions..."
              className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
            >
              <option value="all">All Assets</option>
              <option value="comic">Comics</option>
              <option value="creator">Creators</option>
              <option value="publisher">Publishers</option>
              <option value="option">Options</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700/50">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Avg. Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Current Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Unrealized P&L</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredPositions.map((position) => (
              <tr key={position.id} className="hover:bg-slate-700/30">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      position.type === 'comic' ? 'bg-indigo-400' :
                      position.type === 'creator' ? 'bg-green-400' :
                      position.type === 'publisher' ? 'bg-yellow-400' :
                      'bg-pink-400'
                    }`}></span>
                    <span className="font-medium text-white">{position.symbol}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-300">{position.name}</td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-gray-300">{position.quantity}</td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-gray-300">CC {position.averagePrice.toLocaleString()}</td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-white">CC {position.currentPrice.toLocaleString()}</td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-white">CC {position.value.toLocaleString()}</td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className={position.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
                    <div className="flex items-center justify-end">
                      {position.unrealizedPnL >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span>
                        {position.unrealizedPnL >= 0 ? '+' : ''}CC {position.unrealizedPnL.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs">
                      ({position.unrealizedPnL >= 0 ? '+' : ''}{position.pnlPercentage.toFixed(2)}%)
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-2">
                    <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      Buy
                    </button>
                    <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      Sell
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredPositions.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  No positions found. Start trading to build your portfolio!
                </td>
              </tr>
            )}
          </tbody>
          
          {filteredPositions.length > 0 && (
            <tfoot>
              <tr className="bg-slate-800/50 border-t-2 border-slate-600/50">
                <td colSpan={5} className="px-4 py-3 text-right text-sm font-medium text-gray-400">Total:</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-white">CC {totalValue.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <div className={totalUnrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}>
                    <div className="flex items-center justify-end text-sm font-bold">
                      {totalUnrealizedPnL >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span>
                        {totalUnrealizedPnL >= 0 ? '+' : ''}CC {totalUnrealizedPnL.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs">
                      ({totalUnrealizedPnL >= 0 ? '+' : ''}{totalPnlPercentage.toFixed(2)}%)
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}