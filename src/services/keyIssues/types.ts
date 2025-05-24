export interface MajorKeyIssue {
  id: string;
  seriesName: string;
  issueNumber: string;
  publicationDate: Date;
  keyEvent: string;
  importanceRating: 'A' | 'B' | 'C';
  marketValue: number;
  conditionGrade?: string;
  historicalSignificance: string;
}

export interface MinorKeyIssue {
  id: string;
  seriesName: string;
  issueNumber: string;
  publicationDate: Date;
  significanceNotes: string;
  keyDesignation: 'M1' | 'M2' | 'M3';
  marketValue: number;
  conditionGrade?: string;
  collectorInterestScore: number;
}

export interface KeyIssueValuation {
  id?: string;
  majorKeyId?: string;
  minorKeyId?: string;
  valuationDate: Date;
  price: number;
  source?: string;
  notes?: string;
}

export interface KeyIssueSearchParams {
  seriesName?: string;
  issueNumber?: string;
  importanceRating?: 'A' | 'B' | 'C';
  keyDesignation?: 'M1' | 'M2' | 'M3';
  minValue?: number;
  maxValue?: number;
  limit?: number;
  offset?: number;
}