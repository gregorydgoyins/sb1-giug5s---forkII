import React, { useState } from 'react';
import { Calendar, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import type { EventReport } from '../types';

const mockEvents: EventReport[] = [
  {
    id: '1',
    title: 'San Diego Comic-Con 2024',
    type: 'convention',
    date: new Date('2024-07-18'),
    publisher: 'Multiple',
    summary: 'Major announcements expected from Marvel and DC',
    marketImpact: {
      id: 'impact1',
      eventType: 'convention',
      publisher: 'Multiple',
      magnitude: 0.8,
      sentiment: 0.6,
      duration: 14,
      affectedAssets: ['Marvel', 'DC', 'Image'],
      marketSegments: ['comics', 'movies', 'collectibles']
    },
    keyHighlights: [
      'Marvel Phase 5 announcements',
      'DC Universe updates',
      'Major crossover events revealed'
    ],
    relatedAssets: ['Marvel', 'DC', 'Image'],
    tradingRecommendations: [
      'Consider long positions in major publisher assets',
      'Watch for speculative opportunities in announced titles'
    ]
  },
  {
    id: '2',
    title: 'Image Comics Announces New Spawn Universe',
    type: 'announcement',
    date: new Date('2024-04-15'),
    publisher: 'Image',
    summary: 'Major expansion of Spawn franchise with multiple new titles',
    marketImpact: {
      id: 'impact2',
      eventType: 'announcement',
      publisher: 'Image',
      magnitude: 0.6,
      sentiment: 0.8,
      duration: 30,
      affectedAssets: ['Spawn', 'Image'],
      marketSegments: ['comics', 'collectibles']
    },
    keyHighlights: [
      'Multiple new ongoing series',
      'New creative teams announced',
      'Expanded universe roadmap'
    ],
    relatedAssets: ['Spawn', 'Image Comics'],
    tradingRecommendations: [
      'Consider long positions in Image Comics',
      'Watch for new Spawn-related derivatives'
    ]
  }
];

export function EventFeed() {
  const [selectedType, setSelectedType] = useState<string>('all');

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Event Tracker</h2>
        </div>
        <select 
          className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Events</option>
          <option value="convention">Conventions</option>
          <option value="announcement">Announcements</option>
          <option value="release">Releases</option>
        </select>
      </div>

      <div className="space-y-6">
        {mockEvents
          .filter(event => selectedType === 'all' || event.type === selectedType)
          .map((event) => (
          <div key={event.id} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg text-white">{event.title}</h3>
                <p className="text-sm text-gray-400">
                  {event.type.toUpperCase()} • {event.publisher}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {event.marketImpact.sentiment > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-400" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.marketImpact.magnitude > 0.7 ? 'bg-red-900 text-red-200' :
                  event.marketImpact.magnitude > 0.4 ? 'bg-yellow-900 text-yellow-200' :
                  'bg-green-900 text-green-200'
                }`}>
                  Impact: {Math.round(event.marketImpact.magnitude * 100)}%
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4">{event.summary}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="font-semibold text-white">{event.date.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="font-semibold text-white">{event.marketImpact.duration} days</p>
              </div>
            </div>

            <div className="border-t border-slate-600/50 pt-4">
              <p className="text-sm font-medium text-white mb-2">Key Highlights</p>
              <ul className="space-y-1">
                {event.keyHighlights.map((highlight, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-center">
                    <AlertCircle className="h-4 w-4 text-indigo-400 mr-2" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-slate-600/50 mt-4 pt-4">
              <p className="text-sm font-medium text-white mb-2">Trading Recommendations</p>
              <ul className="space-y-1">
                {event.tradingRecommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}