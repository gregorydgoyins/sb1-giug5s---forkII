'use client';

import React from 'react';
import { CharacterList } from './CharacterList';
import { CharacterProvider } from '../context/CharacterContext';

export function SuperheroModule() {
  return (
    <CharacterProvider>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Superhero Stocks</h1>
        <CharacterList />
      </div>
    </CharacterProvider>
  );
}