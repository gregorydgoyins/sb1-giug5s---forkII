export interface MarvelCreator {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  resourceURI: string;
  urls: Array<{
    type: string;
    url: string;
  }>;
}

export interface MarvelCharacter {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  resourceURI: string;
  comics: {
    available: number;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  urls: Array<{
    type: string;
    url: string;
  }>;
}