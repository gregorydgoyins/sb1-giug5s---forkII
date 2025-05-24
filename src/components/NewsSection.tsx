import React, { useState } from 'react';
import { Newspaper, TrendingUp, TrendingDown } from 'lucide-react';

export function NewsSection() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center space-x-2 mb-6">
        <Newspaper className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Latest News</h2>
      </div>

      <div className="space-y-4">
        {[
          {
            id: '1',
            title: 'Marvel Announces New Spider-Man Series',
            time: '2h ago',
            impact: 'positive',
            summary: 'Major creative team reveals plans for groundbreaking storyline'
          },
          {
            id: '2',
            title: 'DC Comics Reports Record Sales',
            time: '4h ago',
            impact: 'positive',
            summary: 'Q1 earnings exceed expectations with digital sales surge'
          },
          {
            id: '3',
            title: 'Major Creator Signs Exclusive Contract',
            time: '6h ago',
            impact: 'neutral',
            summary: 'Industry-shaking announcement expected to impact multiple titles'
          }
        ].map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedCard(selectedCard === item.id ? null : item.id)}
            className={`group relative bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-all hover:-translate-y-1 cursor-pointer
              hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]
              ${selectedCard === item.id ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.impact === 'positive' ? 'bg-green-900/50 text-green-200 border border-green-700/50' :
                item.impact === 'negative' ? 'bg-red-900/50 text-red-200 border border-red-700/50' :
                'bg-slate-700/50 text-gray-200 border border-slate-600/50'
              }`}>
                {item.impact}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-2">{item.summary}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{item.time}</span>
              {item.impact === 'positive' ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : item.impact === 'negative' ? (
                <TrendingDown className="h-4 w-4 text-red-400" />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}