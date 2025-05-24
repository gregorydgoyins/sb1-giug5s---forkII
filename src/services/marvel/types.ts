export interface MarvelApiConfig {
  publicKey: string;
  privateKey: string;
  baseUrl: string;
  rateLimit: {
    maxRequests: number;
    perMilliseconds: number;
  };
}

export interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  modified: string;
  resourceURI: string;
  urls: Array<{
    type: string;
    url: string;
  }>;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  stories: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
  };
  events: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  series: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
}

export interface MarvelComic {
  id: number;
  digitalId: number;
  title: string;
  issueNumber: number;
  variantDescription: string;
  description: string;
  modified: string;
  isbn: string;
  upc: string;
  diamondCode: string;
  format: string;
  pageCount: number;
  prices: Array<{
    type: string;
    price: number;
  }>;
  thumbnail: {
    path: string;
    extension: string;
  };
  images: Array<{
    path: string;
    extension: string;
  }>;
  creators: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
      role: string;
    }>;
  };
  characters: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
}

export interface MarvelSeries {
  id: number;
  title: string;
  description: string;
  startYear: number;
  endYear: number;
  rating: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  creators: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
      role: string;
    }>;
  };
}

export interface MarvelEvent {
  id: number;
  title: string;
  description: string;
  resourceURI: string;
  urls: Array<{
    type: string;
    url: string;
  }>;
  modified: string;
  start: string;
  end: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  creators: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
      role: string;
    }>;
  };
  characters: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  stories: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
  };
}

export interface MarvelApiResponse<T> {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: T[];
  };
  etag: string;
}

export interface MarvelApiError {
  code: number;
  status: string;
  message: string;
}