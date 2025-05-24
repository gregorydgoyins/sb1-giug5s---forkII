export interface LinkStatus {
  exists: boolean;
  hasContent: boolean;
  lastUpdated?: Date;
  source?: 'marvel' | 'isbndb' | 'internal';
}

export interface LinkValidationResult {
  symbol: string;
  type: 'stock' | 'bond' | 'option' | 'person';
  status: LinkStatus;
  alternateUrls?: string[];
}