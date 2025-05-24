```typescript
'use client';

import React from 'react';
import { Users, Zap, BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
import type { SuperheroCharacter } from '../types';

interface CharacterDetailsProps {
  character: SuperheroCharacter;
}

export function CharacterDetails({ character }: CharacterDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex space-x-6">
        <img
          src={character.images.portrait}
          alt={character.name}
          className="w-48 h-48 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">{character.name}</h1>
              <p className="text-xl text-gray-400">{character.alias}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                CC {character.marketData.price.toLocaleString()}
              </p>
              <div className={`flex items-center justify-end space-x-1 ${
                character.marketData.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {character.marketData.change >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {character.marketData.change >= 0 ? '+' : ''}
                  {((character.marketData.change / character.marketData.price) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">First Appearance</p>
              <p className="font-medium text-white">{character.firstAppearance.issue}</p>
              <p className="text-sm text-gray-400">{character.firstAppearance.date}</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
              <p className="text-sm text-gray-400">Status</p>
              <p className={`font-medium ${
                character.status === 'active' ? 'text-green-400' :
                character.status === 'inactive' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {character.status.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Origin Section */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
        <h2 className="text-xl font-bold text-white mb-4">Origin</h2>
        <p className="text-gray-300 mb-4">{character.origin.narrative}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Powers & Abilities</h3>
            <ul className="space-y-1">
              {character.origin.powers.map((power, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-300">{power}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Relationships</h3>
            <div className="space-y-2">
              {character.relationships.teams.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400">Teams</p>
                  <div className="flex flex-wrap gap-2">
                    {character.relationships.teams.map((team, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-900/50 text-indigo-200 rounded-full text-sm">
                        {team}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Story Arcs Section */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
        <h2 className="text-xl font-bold text-white mb-4">Notable Story Arcs</h2>
        <div className="space-y-4">
          {character.storyArcs.map((arc, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-white">{arc.title}</h3>
                <span className="px-2 py-1 bg-indigo-900/50 text-indigo-200 rounded-full text-xs">
                  Significance: {arc.significance}/10
                </span>
              </div>
              <p className="text-gray-300 mt-2">{arc.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Market Data Section */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
        <h2 className="text-xl font-bold text-white mb-4">Market Data</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400">Market Cap</p>
            <p className="text-lg font-semibold text-white">
              CC {character.marketData.marketCap.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">24h Volume</p>
            <p className="text-lg font-semibold text-white">
              CC {character.marketData.volume.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Price Change</p>
            <p className={`text-lg font-semibold ${
              character.marketData.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {character.marketData.change >= 0 ? '+' : ''}
              {((character.marketData.change / character.marketData.price) * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```