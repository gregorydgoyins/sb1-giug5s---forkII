import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LineChart, 
  Wallet, 
  BookOpen, 
  TrendingUp, 
  Building2, 
  Users,
  Newspaper
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  {
    path: '/markets',
    label: 'Markets',
    icon: <LineChart className="h-5 w-5" />,
    subItems: [
      { path: '/markets/stocks', label: 'Stocks', icon: <TrendingUp className="h-4 w-4" /> },
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
      { path: '/trading/options', label: 'Options Trading', icon: <TrendingUp className="h-4 w-4" /> }
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
  }
];

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleItemClick = (item: NavItem) => {
    if (item.subItems) {
      setExpandedItem(expandedItem === item.path ? null : item.path);
    } else {
      navigate(item.path);
      setExpandedItem(null);
    }
  };

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <div key={item.path}>
          <button
            onClick={() => handleItemClick(item)}
            className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.subItems && (
              <svg
                className={`h-4 w-4 transition-transform ${
                  expandedItem === item.path ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>

          {item.subItems && expandedItem === item.path && (
            <div className="mt-1 ml-4 space-y-1">
              {item.subItems.map((subItem) => (
                <button
                  key={subItem.path}
                  onClick={() => navigate(subItem.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-sm rounded-lg transition-colors ${
                    isActive(subItem.path)
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  {subItem.icon}
                  <span>{subItem.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}