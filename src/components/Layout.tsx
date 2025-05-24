import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Bell, User } from 'lucide-react';
import { useMarketStore } from '../store/marketStore';
import { NewsTicker } from './NewsTicker';

export function Layout({ children }: { children: React.ReactNode }) {
  const { userBalance } = useMarketStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 interactive-icon">
                <BookOpen className="h-8 w-8 text-indigo-400" />
                <span className="text-2xl font-medium text-white font-display">Panel Profits</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/markets" 
                  className={`nav-link ${isActive('/markets') ? 'nav-link-active' : ''}`}
                >
                  Markets
                </Link>
                <Link 
                  to="/portfolio" 
                  className={`nav-link ${isActive('/portfolio') ? 'nav-link-active' : ''}`}
                >
                  Portfolio
                </Link>
                <Link 
                  to="/trading" 
                  className={`nav-link ${isActive('/trading') ? 'nav-link-active' : ''}`}
                >
                  Trading
                </Link>
                <Link 
                  to="/news" 
                  className={`nav-link ${isActive('/news') ? 'nav-link-active' : ''}`}
                >
                  News
                </Link>
                <Link 
                  to="/learn" 
                  className={`nav-link ${isActive('/learn') ? 'nav-link-active' : ''}`}
                >
                  Learn
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm shadow-lg">
                CC {userBalance.toLocaleString()}
              </span>
              <button className="interactive-icon p-2 text-indigo-400 hover:text-white">
                <Search className="h-5 w-5" />
              </button>
              <button className="interactive-icon p-2 text-indigo-400 hover:text-white">
                <Bell className="h-5 w-5" />
              </button>
              <button className="interactive-icon p-2 text-indigo-400 hover:text-white">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <NewsTicker />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}