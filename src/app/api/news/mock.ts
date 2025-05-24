export const MOCK_NEWS = [
  {
    id: '1',
    title: 'Marvel Announces New Spider-Man Series',
    impact: 'positive',
    timestamp: new Date(),
    summary: 'Major creative team reveals plans for groundbreaking storyline',
    source: 'Marvel Entertainment',
    relatedSecurity: {
      type: 'comic',
      symbol: 'ASM300',
      name: 'Amazing Spider-Man #300'
    }
  },
  {
    id: '2',
    title: 'DC Comics Reports Record Sales',
    impact: 'positive',
    timestamp: new Date(Date.now() - 3600000),
    summary: 'Q1 earnings exceed expectations with digital sales surge',
    source: 'DC Comics',
    relatedSecurity: {
      type: 'publisher',
      symbol: 'DCCP',
      name: 'DC Comics'
    }
  },
  {
    id: '3',
    title: 'Todd McFarlane Announces New Project',
    impact: 'positive',
    timestamp: new Date(Date.now() - 7200000),
    summary: 'Legendary creator reveals upcoming series',
    source: 'Industry News',
    relatedSecurity: {
      type: 'creator',
      symbol: 'TMFS',
      name: 'Todd McFarlane'
    }
  }
];