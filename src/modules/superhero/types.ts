```typescript
export type CharacterType = 'superhero' | 'villain' | 'sidekick' | 'henchman';
export type CharacterStatus = 'active' | 'inactive' | 'deceased';

export interface SuperheroCharacter {
  id: string;
  name: string;
  alias: string;
  type: CharacterType;
  status: CharacterStatus;
  firstAppearance: {
    issue: string;
    date: string;
    publisher: string;
  };
  origin: {
    narrative: string;
    powers: string[];
    motivation: string;
  };
  relationships: {
    teams: string[];
    allies: string[];
    enemies: string[];
    mentors: string[];
  };
  storyArcs: {
    title: string;
    description: string;
    significance: number;
  }[];
  images: {
    portrait: string;
    action: string[];
  };
  marketData: {
    price: number;
    change: number;
    volume: number;
    marketCap: number;
  };
}

export interface CharacterSearchParams {
  name?: string;
  type?: CharacterType;
  status?: CharacterStatus;
  publisher?: string;
  limit?: number;
  offset?: number;
}
```