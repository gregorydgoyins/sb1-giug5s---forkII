export interface CreatorBiography {
  id: string;
  name: string;
  birthDate: string;
  deathDate?: string;
  nationality: string;
  biography: string;
  notableWorks: string[];
  achievements: string[];
  style: {
    description: string;
    innovations: string[];
    influences: string[];
  };
  impact: {
    industry: string[];
    legacy: string[];
  };
  currentWork: {
    projects: string[];
    roles: string[];
  };
}

export interface CharacterBiography {
  id: string;
  name: string;
  alterEgo: string;
  firstAppearance: {
    issue: string;
    date: string;
    publisher: string;
    era: 'Golden Age' | 'Silver Age' | 'Bronze Age' | 'Modern Age';
    creators: string[];
  };
  origin: {
    narrative: string;
    powers: string[];
    motivation: string;
  };
  significance: {
    cultural: string;
    industry: string;
    impact: string;
  };
  keyStorylines: Array<{
    title: string;
    issue: string;
    significance: string;
  }>;
  relationships: {
    allies: string[];
    enemies: string[];
    teams: string[];
  };
}

export interface BiographySearchResult {
  creators: CreatorBiography[];
  characters: CharacterBiography[];
}