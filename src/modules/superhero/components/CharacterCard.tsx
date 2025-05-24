```typescript
'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Users, Zap } from 'lucide-react';
import type { SuperheroCharacter } from '../types';

interface CharacterCardProps {
  character: SuperheroCharacter;
  onSelect: (character: SuperheroCharacter) => void;
}

export function CharacterCard({ character, onSelect }: CharacterCardProps) {
  return (
    <div 
      className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer"
      onClick={() => onSelect(character)}
    >
      <div className="flex space-x-4">
        <img
          src={character.images.portrait}
          alt={character.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-white">{character.name}</h3>
              <p className="text-sm text-gray-400">{character.alias}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              character.type === 'superhero' ? 'bg-green-900/50 text-green-200 border border-green-700/50' :
              character.type === 'villain' ? 'bg-red-900/50 text-red-200 border border-red-700/50' :
              'bg-yellow-900/50 text-yellow-200 border border-yellow-700/50'
            }`}>
              {character.type}
            </span>
          </div>

          <div className="mt-2 flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-gray-300">
                {character.relationships.teams[0]}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-300">
                {character.origin.powers[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-600/50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Market Price</p>
            <p className="text-lg font-semibold text-white">
              CC {character.marketData.price.toLocaleString()}
            </p>
          </div>
          <div className={character.marketData.change >= 0 ? 'text-green-400' : 'text-red-400'}>
            <div className="flex items-center space-x-1">
              {character.marketData.change >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {character.marketData.change >= 0 ? '+' : ''}
                {((character.marketData.change / character.marketData.price) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```