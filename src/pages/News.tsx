import React from 'react';
import { NewsSection } from '../components/NewsSection';
import { EventFeed } from '../components/EventFeed';

export function News() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-6">News & Events</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewsSection />
        <EventFeed />
      </div>
    </div>
  );
}