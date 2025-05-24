import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LineChart, Wallet, TrendingUp, Building2, Users, Sparkles, Newspaper, ChevronDown, FileText } from 'lucide-react';

const navItems = [
  {
    path: '/markets',
    label: 'Markets',
    icon: <LineChart className="h-5 w-5" />,
    subItems: [
      { path: '/markets/stocks', label: 'Comic Stocks', icon: <TrendingUp className="h-4 w-4" /> },
      { path: '/markets/funds', label: 'Investment Funds', icon: <Wallet className="h-4 w-4" /> }
    ]
  },
  {
    path: '/portfolio',
    label: 'Portfolio',
    icon: <Wallet className="h-5 w-5" />
  },
  {
    path: '/trading',
    label: 'Trading',
    icon: <TrendingUp className="h-5 w-5" />,
    subItems: [
      { path: '/trading/creator-bonds', label: 'Creator Stocks', icon: <Users className="h-4 w-4" /> },
      { path: '/trading/publisher-bonds', label: 'Publisher Bonds', icon: <Building2 className="h-4 w-4" /> },
      { path: '/trading/options', label: 'Options Trading', icon: <Sparkles className="h-4 w-4" /> }
    ]
  },
  {
    path: '/news',
    label: 'News',
    icon: <Newspaper className="h-5 w-5" />
  },
  {
    path: '/learn',
    label: 'Learn',
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    path: '/research',
    label: 'Research',
    icon: <FileText className="h-5 w-5" />
  }
];

export function MainNavigation() {
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleItemClick = (item: any) => {
    if (item.subItems) {
      setExpandedItem(expandedItem === item.path ? null : item.path);
    }
  };

  return (
    <nav className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-400" />
              <span className="text-2xl font-medium text-white font-display">Panel Profits</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6 ml-10">
              {navItems.map((item) => (
                <div key={item.path} className="relative group">
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-slate-700'
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.subItems && (
                      <ChevronDown className={`h-4 w-4 transition-transform ${
                        expandedItem === item.path ? 'rotate-180' : ''
                      }`} />
                    )}
                  </Link>

                  {item.subItems && expandedItem === item.path && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700/50">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                            isActive(subItem.path)
                              ? 'bg-indigo-600 text-white'
                              : 'text-gray-300 hover:text-white hover:bg-slate-700'
                          }`}
                        >
                          {subItem.icon}
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm shadow-lg">
              CC 2,000,000
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}