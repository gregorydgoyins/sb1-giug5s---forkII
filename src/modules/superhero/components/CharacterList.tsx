```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { CharacterCard } from './CharacterCard';
import { CharacterService } from '../services/CharacterService';
import type { SuperheroCharacter, CharacterType, CharacterSearchParams } from '../types';

export function CharacterList() {
  const [characters, setCharacters] = useState<SuperheroCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<CharacterSearchParams>({
    limit: 20
  });

  const characterService = CharacterService.getInstance();

  useEffect(() => {
    loadCharacters();
  }, [searchParams]);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      const results = await characterService.searchCharacters(searchParams);
      setCharacters(results);
    } catch (error) {
      console.error('Failed to load characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchParams(prev => ({
      ...prev,
      name: query || undefined
    }));
  };

  const handleTypeFilter = (type: CharacterType) => {
    setSearchParams(prev => ({
      ...prev,
      type: type === prev.type ? undefined : type
    }));
  };

  const handleCharacterSelect = (character: SuperheroCharacter) => {
    // Implement character selection logic
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading characters...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search characters..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          {(['superhero', 'villain', 'sidekick', 'henchman'] as CharacterType[]).map(type => (
            <button
              key={type}
              onClick={() => handleTypeFilter(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                searchParams.type === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {characters.map(character => (
          <CharacterCard
            key={character.id}
            character={character}
            onSelect={handleCharacterSelect}
          />
        ))}
      </div>

      {characters.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No characters found</p>
        </div>
      )}
    </div>
  );
}
```