export const LEARNING_MODULES = [
  {
    id: 'market-fundamentals',
    title: 'Market Fundamentals',
    description: 'Master the basics of comic book market mechanics and trading principles',
    prerequisites: [],
    difficulty: 'beginner',
    estimatedTime: 30,
    topics: [
      'Market Structure',
      'Price Discovery',
      'Trading Basics',
      'Comic Market Index',
      'Age Classifications'
    ]
  },
  {
    id: 'portfolio-management',
    title: 'Portfolio Management',
    description: 'Learn advanced portfolio construction and risk management techniques',
    prerequisites: ['market-fundamentals'],
    difficulty: 'intermediate',
    estimatedTime: 45,
    topics: [
      'Asset Allocation',
      'Risk Management',
      'Portfolio Rebalancing',
      'Performance Metrics',
      'Investment Strategies'
    ]
  },
  {
    id: 'options-trading',
    title: 'Options Trading',
    description: 'Master advanced derivatives and options trading strategies',
    prerequisites: ['market-fundamentals', 'portfolio-management'],
    difficulty: 'advanced',
    estimatedTime: 60,
    topics: [
      'Options Basics',
      'Greeks Explained',
      'Trading Strategies',
      'Risk Assessment',
      'Advanced Techniques'
    ]
  },
  {
    id: 'creator-bonds',
    title: 'Creator Bonds',
    description: 'Understanding creator-backed securities and valuation methods',
    prerequisites: ['market-fundamentals'],
    difficulty: 'intermediate',
    estimatedTime: 40,
    topics: [
      'Bond Fundamentals',
      'Creator Valuation',
      'Yield Analysis',
      'Risk Assessment',
      'Trading Strategies'
    ]
  },
  {
    id: 'market-analysis',
    title: 'Market Analysis',
    description: 'Learn technical and fundamental analysis techniques',
    prerequisites: ['market-fundamentals'],
    difficulty: 'intermediate',
    estimatedTime: 50,
    topics: [
      'Technical Analysis',
      'Fundamental Analysis',
      'Market Indicators',
      'Trend Analysis',
      'Volume Analysis'
    ]
  }
] as const;