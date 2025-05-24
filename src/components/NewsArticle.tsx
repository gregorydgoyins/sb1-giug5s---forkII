import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNewsData } from '@/hooks/useNewsData';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Breadcrumbs } from './common/Breadcrumbs';

export function NewsArticle() {
  const { id } = useParams<{ id: string }>();
  const { data: news } = useNewsData();
  const article = news?.find(item => item.id === id);

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-400">Article not found</p>
          <Link to="/news" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs overrides={[
        { name: 'News', path: '/news' },
        { name: article.title }
      ]} />

      <article className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">{article.title}</h1>
            <div className={`flex items-center space-x-2 ${
              article.impact === 'positive' ? 'text-green-400' :
              article.impact === 'negative' ? 'text-red-400' :
              'text-yellow-400'
            }`}>
              {article.impact === 'positive' ? (
                <TrendingUp className="h-6 w-6" />
              ) : article.impact === 'negative' ? (
                <TrendingDown className="h-6 w-6" />
              ) : null}
              <span className="text-lg capitalize">{article.impact}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-gray-400">
            <time dateTime={article.timestamp.toISOString()}>
              {new Date(article.timestamp).toLocaleString()}
            </time>
            {article.relatedSecurity && (
              <span className="text-indigo-400">
                {article.relatedSecurity.name}
              </span>
            )}
          </div>
        </header>

        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">
            Detailed article content would go here. This is a placeholder since our mock data doesn't include full article content.
          </p>
        </div>

        {article.relatedSecurity && (
          <div className="mt-8 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
            <h2 className="text-lg font-semibold text-white mb-2">Related Security</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">{article.relatedSecurity.name}</p>
                <p className="text-sm text-gray-400">{article.relatedSecurity.symbol}</p>
              </div>
              <Link
                to={`/${article.relatedSecurity.type}/${article.relatedSecurity.symbol}`}
                className="text-indigo-400 hover:text-indigo-300"
              >
                View Details →
              </Link>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}