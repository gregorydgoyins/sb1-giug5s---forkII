export interface Character {
  id: string;
  name: string;
  alias?: string;
  firstAppearance: string;
  debutDate: Date;
  originStory: string;
  alignment: 'hero' | 'villain' | 'antihero';
  status: 'active' | 'inactive' | 'deceased';
  powers: string[];
  teams: string[];
  publisher: string;
}

export interface Creator {
  id: string;
  name: string;
  birthDate?: Date;
  deathDate?: Date;
  nationality?: string;
  primaryRole: string;
  activeSince: Date;
  works: CreatorWork[];
}

export interface CreatorWork {
  id: string;
  title: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  significance: number;
  publisher: string;
}

export interface Publisher {
  id: string;
  name: string;
  foundedDate?: Date;
  description: string;
  marketCap: number;
  characterCount: number;
  teamCount: number;
  storyArcCount: number;
}

export interface Team {
  id: string;
  name: string;
  foundedDate?: Date;
  headquarters?: string;
  status: 'active' | 'inactive' | 'disbanded';
  members: TeamMember[];
  publisher: string;
}

export interface TeamMember {
  characterId: string;
  joinDate: Date;
  leaveDate?: Date;
  role: string;
}

export interface StoryArc {
  id: string;
  title: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  significance: number;
  characters: Array<{
    id: string;
    role: string;
    significance: number;
  }>;
  publisher: string;
}