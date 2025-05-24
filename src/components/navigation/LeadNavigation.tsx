'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BookOpen, BarChart2, ChevronDown } from 'lucide-react';

export function LeadNavigation() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[200px]">
        {/* Start Trading Component */}
        <div className="relative group">
          <div className="absolute -inset-[2px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 to-yellow-300/20 blur-sm" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 to-yellow-300/20 blur-md" />
            <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-yellow-500/80 to-yellow-300/80 opacity-30 blur-sm" />
            <div className="absolute -inset-[1.5px] rounded-lg bg-gradient-to-r from-yellow-500/50 to-yellow-300/50 opacity-40 blur-[2px]" />
            <div className="absolute -inset-[0.5px] rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-300 opacity-20" />
          </div>
          <Link 
            to="/trading"
            className={`relative flex flex-col justify-between p-6 bg-[#00B140] hover:bg-[#009935] transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
              openDropdown === 'trading' ? 'shadow-[0_0_30px_rgba(255,255,0,0.5)]' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown('trading');
            }}
            aria-label="Start Trading"
          >
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Start Trading</h2>
                <ChevronDown className={`h-5 w-5 text-white transition-transform ${openDropdown === 'trading' ? 'rotate-180' : ''}`} />
              </div>
              <p className="text-white/90">Buy, sell, and trade comic books, creator stocks, and publisher bonds with our advanced trading platform.</p>
            </div>
          </Link>
          
          {openDropdown === 'trading' && (
            <div className="absolute z-10 w-full mt-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700/50 overflow-hidden">
              <Link to="/trading" className="block px-4 py-3 text-white hover:bg-slate-700/50 transition-colors">Trading Dashboard</Link>
              <Link to="/trading/stocks" className="block px-4 py-3 text-white hover:bg-slate-700/50 transition-colors">Comic Stocks</Link>
              <Link to="/trading/bonds" className="block px-4 py-3 text-white hover:bg-slate-700/50 transition-colors">Creator Bonds</Link>
              <Link to="/trading/options" className="block px-4 py-3 text-white hover:bg-slate-700/50 transition-colors">Options Trading</Link>
            </div>
          )}
        </div>

        {/* Learn More Component */}
        <div className="relative group">
          <div className="absolute -inset-[2px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 to-yellow-300/20 blur-sm" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 to-yellow-300/20 blur-md" />
            <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-yellow-500/80 to-yellow-300/80 opacity-30 blur-sm" />
            <div className="absolute -inset-[1.5px] rounded-lg bg-gradient-to-r from-yellow-500/50 to-yellow-300/50 opacity-40 blur-[2px]" />
            <div className="absolute -inset-[0.5px] rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-300 opacity-20" />
          </div>
          <Link 
            to="/learn"
            className={`relative flex flex-col justify-between p-6 bg-[#FF6B00] hover:bg-[#E66000] transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
              openDropdown === 'learn' ? 'shadow-[0_0_30px_rgba(255,255,0,0.5)]' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown('learn');
            }}
            aria-label="Learn More"
          >
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="h-8 w-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Learn More</h2>
                <ChevronDown className={`h-5 w-5 text-white transition-transform ${openDropdown === 'learn' ? 'rotate-180' : ''}`} />
              </div>
              <p className="text-white/90">Master comic book investing with comprehensive educational resources, market analysis, and expert guides.</p>
            </div>
          </Link>

          {openDropdown === 'learn' && (
            <div className="absolute z-10 w-full mt-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700/50 overflow-hidden">
              <Link to="/learn/basics" className="block px-4 py-3 text-white hover:bg-slate-700/50 transition-colors">Market Basics</Link>
              <Link to="/learn/strategies" className="block px-4 py-3 text-white hover:bg-slate-700/50 transition-colors">Trading Strategies</Link>
              <Link to="/learn/analysis" className="block px-4 py-3 text-white hover:bg-slate-700/50 transition-colors">Technical Analysis</Link>
            </div>
          )}
        </div>

        {/* View Portfolio Component */}
        <div className="relative group">
          <div className="absolute -inset-[2px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 to-yellow-300/20 blur-sm" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 to-yellow-300/20 blur-md" />
            <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-yellow-500/80 to-yellow-300/80 opacity-30 blur-sm" />
            <div className="absolute -inset-[1.5px] rounded-lg bg-gradient-to-r from-yellow-500/50 to-yellow-300/50 opacity-40 blur-[2px]" />
            <div className="absolute -inset-[0.5px] rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-300 opacity-20" />
          </div>
          <Link 
            to="/portfolio"
            className={`relative flex flex-col justify-between p-6 bg-[#512DA8] hover:bg-[#4527A0] transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
              openDropdown === 'portfolio' ? 'shadow-[0_0_30px_rgba(255,255,0,0.5)]' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown('portfolio');
            }}
            aria-label="View Portfolio"
          >
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <BarChart2 className="h-8 w-8 text-white" />
                <h2 className="text-2xl font-bold text-white">View Portfolio</h2>
                <ChevronDown className={`h-5 w-5 text-white transition-transform ${openDropdown === 'portfolio' ? 'rotate-180' : ''}`} />
              </div>
              <p className="text-white/90">Track your investments, analyze performance metrics, and manage your comic book portfolio.</p>
            </div>
            <div className="mt-4 bg-white/10 p-3 rounded-lg">
              <div className="flex justify-between items-center text-sm text-white">
                <span>Portfolio Value</span>
                <span className="font-semibold">CC 2,000,000</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-green-400 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+5.2% today</span>
              </div>
            </div>
          </Link>

          {openDropdown === 'portfolio' && (
            <div className="absolute z-10 w-full mt-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700/50 overflow-hidden">
              <Link to="/portfolio/overview" className="block px-4 py-3 text-white hover:bg-slate-700/50 transition-colors">Portfolio Overview</Link>
              <Link to="/portfolio/positions" className="block px-4 py-3 text-white hover:bg-slate-700/50 transition-colors">Open Positions</Link>
              <Link to="/portfolio/analytics" className="block px-4 py-3 text-white hover:bg-slate-700/50 transition-colors">Analytics</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}