import React, { useState } from 'react';
import { History, TrendingUp, TrendingDown, Filter, Search, Calendar } from 'lucide-react';

interface PortfolioTransactionsProps {
  userId?: string;
}

export function PortfolioTransactions({ userId }: PortfolioTransactionsProps) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  
  // Mock transactions data
  const mockTransactions = [
    {
      id: '1',
      symbol: 'ASM300',
      name: 'Amazing Spider-Man #300',
      type: 'market',
      side: 'buy',
      quantity: 2,
      price: 2400,
      total: 4800,
      fees: 4.8,
      timestamp: new Date('2024-05-15T10:30:00')
    },
    {
      id: '2',
      symbol: 'TMFS',
      name: 'Todd McFarlane',
      type: 'limit',
      side: 'buy',
      quantity: 50,
      price: 1800,
      total: 90000,
      fees: 90,
      timestamp: new Date('2024-05-14T15:45:00')
    },
    {
      id: '3',
      symbol: 'DCCP',
      name: 'DC Comics',
      type: 'market',
      side: 'buy',
      quantity: 25,
      price: 3400,
      total: 85000,
      fees: 85,
      timestamp: new Date('2024-05-12T09:15:00')
    },
    {
      id: '4',
      symbol: 'BAT457',
      name: 'Batman #457',
      type: 'limit',
      side: 'sell',
      quantity: 1,
      price: 1850,
      total: 1850,
      fees: 1.85,
      timestamp: new Date('2024-05-10T14:20:00')
    },
    {
      id: '5',
      symbol: 'TMFSP1800',
      name: 'TMF 1800 Put',
      type: 'market',
      side: 'buy',
      quantity: 5,
      price: 80,
      total: 400,
      fees: 0.4,
      timestamp: new Date('2024-05-08T11:30:00')
    },
    {
      id: '6',
      symbol: 'JLES',
      name: 'Jim Lee',
      type: 'limit',
      side: 'buy',
      quantity: 40,
      price: 2150,
      total: 86000,
      fees: 86,
      timestamp: new Date('2024-05-05T16:45:00')
    },
    {
      id: '7',
      symbol: 'MRVL',
      name: 'Marvel Entertainment',
      type: 'market',
      side: 'buy',
      quantity: 20,
      price: 4100,
      total: 82000,
      fees: 82,
      timestamp: new Date('2024-05-03T10:15:00')
    },
    {
      id: '8',
      symbol: 'ASM300C2600',
      name: 'ASM #300 2600 Call',
      type: 'limit',
      side: 'buy',
      quantity: 10,
      price: 140,
      total: 1400,
      fees: 1.4,
      timestamp: new Date('2024-05-01T13:30:00')
    }
  ];
  
  // Filter transactions based on selected filters and search query
  const getFilteredTransactions = () => {
    return mockTransactions.filter(transaction => {
      // Filter by type
      const matchesFilter = filter === 'all' || 
                           (filter === 'buy' && transaction.side === 'buy') ||
                           (filter === 'sell' && transaction.side === 'sell');
      
      // Filter by search query
      const matchesSearch = transaction.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           transaction.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by date range
      let matchesDateRange = true;
      const now = new Date();
      if (dateRange === '1d') {
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        matchesDateRange = transaction.timestamp >= oneDayAgo;
      } else if (dateRange === '7d') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDateRange = transaction.timestamp >= sevenDaysAgo;
      } else if (dateRange === '30d') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDateRange = transaction.timestamp >= thirtyDaysAgo;
      }
      
      return matchesFilter && matchesSearch && matchesDateRange;
    });
  };
  
  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <History className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
            >
              <option value="all">All Time</option>
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-700/50 text-white text-sm border-slate-600/50 rounded-lg px-3 py-2"
            >
              <option value="all">All Transactions</option>
              <option value="buy">Buy Orders</option>
              <option value="sell">Sell Orders</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700/70 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  transaction.side === 'buy' 
                    ? 'bg-green-900/50 border border-green-700/50' 
                    : 'bg-red-900/50 border border-red-700/50'
                }`}>
                  {transaction.side === 'buy' ? (
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{transaction.name}</h3>
                  <p className="text-sm text-gray-400">
                    {transaction.symbol} • {transaction.type.toUpperCase()} • {transaction.side.toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">CC {transaction.total.toLocaleString()}</p>
                <p className="text-sm text-gray-400">
                  {transaction.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Quantity</p>
                <p className="text-white">{transaction.quantity}</p>
              </div>
              <div>
                <p className="text-gray-400">Price</p>
                <p className="text-white">CC {transaction.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Fees</p>
                <p className="text-white">CC {transaction.fees.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
        
        {filteredTransactions.length === 0 && (
          <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-8 text-center">
            <p className="text-gray-400">No transactions found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}