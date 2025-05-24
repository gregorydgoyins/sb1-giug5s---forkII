```typescript
export interface IssueSynopsis {
  id: string;
  title: string;
  issueNumber: string;
  publicationDate: string;
  creativeTeam: {
    writer: string[];
    artist: string[];
    coverArtist: string[];
    editor: string[];
  };
  plotSummary: string;
  storyBeats: StoryBeat[];
  characters: Character[];
  revelations: string[];
  statusQuoChanges: string[];
  continuityLinks: ContinuityLink[];
  universeImpact: string[];
  tags: string[];
}

export interface StoryBeat {
  sequence: number;
  description: string;
  significance: number;
  characters: string[];
  location?: string;
}

export interface Character {
  id: string;
  name: string;
  role: 'hero' | 'villain' | 'sidekick' | 'henchman' | 'supporting';
  significance: number;
  developments: string[];
  firstAppearance?: boolean;
}

export interface ContinuityLink {
  issueId: string;
  title: string;
  type: 'sequel_to' | 'prequel_to' | 'references' | 'crossover';
  description: string;
  significance: number;
  impact: string;
}
```