'use client';

import React, { createContext, useContext, useState } from 'react';
import type { SuperheroCharacter } from '../types';

interface CharacterContextType {
  selectedCharacter: SuperheroCharacter | null;
  setSelectedCharacter: (character: SuperheroCharacter | null) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [selectedCharacter, setSelectedCharacter] = useState<SuperheroCharacter | null>(null);

  return (
    <CharacterContext.Provider value={{ selectedCharacter, setSelectedCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacterContext() {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacterContext must be used within a CharacterProvider');
  }
  return context;
}