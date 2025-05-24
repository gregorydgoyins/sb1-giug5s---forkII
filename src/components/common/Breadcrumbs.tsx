import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  overrides?: Array<{
    name: string;
    path?: string;
  }>;
}

export function Breadcrumbs({ overrides }: BreadcrumbsProps) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbLabels: Record<string, string> = {
    markets: 'Markets',
    portfolio: 'Portfolio',
    trading: 'Trading',
    news: 'News',
    learn: 'Learn',
    research: 'Research',
    'market-index': 'Market Index',
    'price-trends': 'Price Trends'
  };

  const crumbs = overrides || pathnames.map((name, index) => ({
    name: breadcrumbLabels[name] || name,
    path: '/' + pathnames.slice(0, index + 1).join('/')
  }));

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <Link to="/" className="hover:text-indigo-400 transition-colors">
        Home
      </Link>
      {crumbs.map((crumb, index) => (
        <React.Fragment key={crumb.name}>
          <ChevronRight className="h-4 w-4" />
          {index === crumbs.length - 1 ? (
            <span className="text-indigo-400">{crumb.name}</span>
          ) : (
            <Link
              to={crumb.path || '#'}
              className="hover:text-indigo-400 transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}