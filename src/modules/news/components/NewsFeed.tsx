'use client';

import React, { useState } from 'react';
import { Newspaper, AlertCircle } from 'lucide-react';
import { useNewsData } from '../hooks/useNewsData';
import { NewsCard } from './NewsCard';
import { NewsFilter } from './NewsFilter';
import { LoadingState } from '@/app/loading-state';

export function NewsFeed() {
  const { data: news, isLoading, error } = useNewsData();
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="card">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center justify-center space-x-2 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span>Unable to load news feed. Please try again later.</span>
        </div>
      </div>
    );
  }

  const filteredNews = selectedSource
    ? news?.filter(item => item.source === selectedSource)
    : news;

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Newspaper className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Latest News</h2>
      </div>

      <NewsFilter 
        selectedSource={selectedSource}
        onSourceSelect={setSelectedSource}
      />

      <div className="space-y-4">
        {filteredNews?.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {filteredNews?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No news items available</p>
        </div>
      )}
    </div>
  );
}