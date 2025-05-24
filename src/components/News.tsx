import React, { useState } from 'react';
import { useNewsData } from '@/hooks/useNewsData';
import { Newspaper, TrendingUp, TrendingDown, Filter, Calendar, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from './common/Breadcrumbs';

export function News() {
  const { data: news, isLoading, error } = useNewsData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Failed to load news. Please try again later.</p>
      </div>
    );
  }

  const filteredNews = news?.filter(item => {
    if (selectedCategory !== 'all' && item.relatedSecurity?.type !== selectedCategory) return false;
    if (selectedImpact !== 'all' && item.impact !== selectedImpact) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Newspaper className="h-8 w-8 text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Market News</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="comic">Comics</option>
              <option value="creator">Creators</option>
              <option value="publisher">Publishers</option>
              <option value="option">Options</option>
            </select>
          </div>

          <select 
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2"
          >
            <option value="all">All Impact</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredNews?.map((item) => (
          <Link
            key={item.id}
            to={`/news/${item.id}`}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {item.relatedSecurity && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Related:</span>
                      <span className="text-sm text-indigo-400">
                        {item.relatedSecurity.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.impact === 'positive' ? 'bg-green-900/50 text-green-200 border border-green-700/50' :
                  item.impact === 'negative' ? 'bg-red-900/50 text-red-200 border border-red-700/50' :
                  'bg-yellow-900/50 text-yellow-200 border border-yellow-700/50'
                }`}>
                  <div className="flex items-center space-x-1">
                    {item.impact === 'positive' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : item.impact === 'negative' ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="capitalize">{item.impact}</span>
                  </div>
                </div>

                {item.relatedSecurity && (
                  <div className={`px-3 py-1 rounded-full text-sm font-medium bg-slate-700/50 text-gray-200 border border-slate-600/50`}>
                    {item.relatedSecurity.type}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-300">
                This is a mock article summary that would contain the first few lines of the news story. The full article would be available when clicking through to the detail page.
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <span className="text-indigo-400 hover:text-indigo-300 text-sm">
                Read More →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}