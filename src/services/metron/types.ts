export interface ComicIssue {
  id: string;
  series: string;
  issueNumber: string;
  name: string;
  coverDate: Date;
  description: string;
  credits: Array<{
    role: string;
    name: string;
  }>;
  price: number;
}

export interface Series {
  id: string;
  name: string;
  sortName: string;
  volume: number;
  yearBegan: number;
  yearEnd: number | null;
  description: string;
  issueCount: number;
  publisher: string;
}

export interface Publisher {
  id: string;
  name: string;
  foundingDate: Date | null;
  description: string;
  seriesCount: number;
  issueCount: number;
}