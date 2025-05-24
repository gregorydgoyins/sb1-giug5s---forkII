import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbLabels: Record<string, string> = {
    markets: 'Markets',
    portfolio: 'Portfolio',
    trading: 'Trading',
    news: 'News',
    learn: 'Learn',
    'creator-bonds': 'Creator Stocks',
    'publisher-bonds': 'Publisher Bonds',
    options: 'Options Trading',
    creator: 'Creator Profile'
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
      <Link to="/" className="hover:text-indigo-400 transition-colors">
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={name}>
            <ChevronRight className="h-4 w-4" />
            <Link
              to={routeTo}
              className={`${
                isLast ? 'text-indigo-400' : 'hover:text-indigo-400 transition-colors'
              }`}
            >
              {breadcrumbLabels[name] || name}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}