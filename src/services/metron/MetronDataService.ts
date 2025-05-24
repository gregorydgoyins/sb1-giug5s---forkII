import type { ComicIssue, Series, Publisher } from './types';

export class MetronDataService {
  private readonly BASE_URL = 'https://metron.cloud/api/';
  private readonly headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  public async searchComics(params: {
    series?: string;
    issueNumber?: string;
    publicationDate?: string;
    limit?: number;
  }): Promise<ComicIssue[]> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(`${this.BASE_URL}issue/?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch comic data');
      
      const data = await response.json();
      return this.transformComicData(data);
    } catch (error) {
      console.error('Comic search failed:', error);
      throw error;
    }
  }

  public async getSeries(id: string): Promise<Series> {
    try {
      const response = await fetch(`${this.BASE_URL}series/${id}/`);
      if (!response.ok) throw new Error('Failed to fetch series data');
      
      const data = await response.json();
      return this.transformSeriesData(data);
    } catch (error) {
      console.error('Series fetch failed:', error);
      throw error;
    }
  }

  public async getPublisher(id: string): Promise<Publisher> {
    try {
      const response = await fetch(`${this.BASE_URL}publisher/${id}/`);
      if (!response.ok) throw new Error('Failed to fetch publisher data');
      
      const data = await response.json();
      return this.transformPublisherData(data);
    } catch (error) {
      console.error('Publisher fetch failed:', error);
      throw error;
    }
  }

  private transformComicData(data: any[]): ComicIssue[] {
    return data.map(issue => ({
      id: issue.id,
      series: issue.series.name,
      issueNumber: issue.number,
      name: issue.name || '',
      coverDate: new Date(issue.cover_date),
      description: issue.desc || '',
      credits: this.parseCredits(issue.credits),
      price: this.calculatePrice(issue)
    }));
  }

  private transformSeriesData(data: any): Series {
    return {
      id: data.id,
      name: data.name,
      sortName: data.sort_name,
      volume: data.volume,
      yearBegan: data.year_began,
      yearEnd: data.year_end || null,
      description: data.desc || '',
      issueCount: data.issue_count,
      publisher: data.publisher.name
    };
  }

  private transformPublisherData(data: any): Publisher {
    return {
      id: data.id,
      name: data.name,
      foundingDate: data.founding_date ? new Date(data.founding_date) : null,
      description: data.desc || '',
      seriesCount: data.series_count,
      issueCount: data.total_issues
    };
  }

  private parseCredits(credits: any[]): Array<{role: string; name: string}> {
    return credits?.map(credit => ({
      role: credit.role,
      name: credit.creator.name
    })) || [];
  }

  private calculatePrice(issue: any): number {
    // Implement price calculation logic based on:
    // - Age of issue
    // - Rarity
    // - Historical sales data
    // This is a simplified placeholder
    const basePrice = 10;
    const ageMultiplier = this.calculateAgeMultiplier(issue.cover_date);
    const rarityMultiplier = this.calculateRarityMultiplier(issue);
    
    return basePrice * ageMultiplier * rarityMultiplier;
  }

  private calculateAgeMultiplier(coverDate: string): number {
    const age = new Date().getFullYear() - new Date(coverDate).getFullYear();
    return 1 + (age / 10); // 10% increase per decade
  }

  private calculateRarityMultiplier(issue: any): number {
    // Simplified rarity calculation
    // In a real implementation, this would consider:
    // - Print run numbers
    // - Surviving copies
    // - Historical sales data
    return 1.5;
  }
}