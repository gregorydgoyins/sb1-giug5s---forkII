import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useNewsData } from '@/hooks/useNewsData';

// Generate 40 detailed mock news stories with balanced impact
const generateMockNews = (): NewsItem[] => {
  const mockNews: NewsItem[] = [
    // Positive News
    {
      id: 'news-1',
      title: 'Marvel Announces New Spider-Man Series with Superstar Creative Team',
      impact: 'positive',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'comic',
        symbol: 'ASM300',
        name: 'Amazing Spider-Man #300'
      }
    },
    {
      id: 'news-2',
      title: 'DC Comics Reports Record Digital Sales Growth',
      impact: 'positive',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'publisher',
        symbol: 'DCCP',
        name: 'DC Comics'
      }
    },
    {
      id: 'news-3',
      title: 'Todd McFarlane Announces New Spawn Universe Expansion',
      impact: 'positive',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'creator',
        symbol: 'TMFS',
        name: 'Todd McFarlane'
      }
    },
    {
      id: 'news-4',
      title: 'Image Comics Reports 35% Growth in Quarterly Sales',
      impact: 'positive',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'publisher',
        symbol: 'IMGC',
        name: 'Image Comics'
      }
    },
    {
      id: 'news-5',
      title: 'Rare Copy of Action Comics #1 Sells for Record $5.3 Million',
      impact: 'positive',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'comic',
        symbol: 'AC1',
        name: 'Action Comics #1'
      }
    },
    {
      id: 'news-6',
      title: 'Jim Lee Announces Return to Monthly Comics with New Series',
      impact: 'positive',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'creator',
        symbol: 'JLES',
        name: 'Jim Lee'
      }
    },
    {
      id: 'news-7',
      title: 'CGC Announces New Grading Technology to Reduce Turnaround Times',
      impact: 'positive',
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000)
    },
    {
      id: 'news-8',
      title: 'New Superman Movie Announced with A-List Director',
      impact: 'positive',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'comic',
        symbol: 'AC1',
        name: 'Action Comics #1'
      }
    },
    {
      id: 'news-9',
      title: 'BOOM! Studios Signs Exclusive Distribution Deal',
      impact: 'positive',
      timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'publisher',
        symbol: 'BOOMB',
        name: 'BOOM! Studios'
      }
    },
    {
      id: 'news-10',
      title: 'Donny Cates Extends Marvel Exclusive Contract for Three Years',
      impact: 'positive',
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'creator',
        symbol: 'DCTS',
        name: 'Donny Cates'
      }
    },
    {
      id: 'news-11',
      title: 'Heritage Auctions Reports Record Comic Sales for Q2',
      impact: 'positive',
      timestamp: new Date(Date.now() - 11 * 60 * 60 * 1000)
    },
    {
      id: 'news-12',
      title: 'Stanley "Artgerm" Lau Announces New Cover Art Series',
      impact: 'positive',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'creator',
        symbol: 'ARTS',
        name: 'Stanley Artgerm Lau'
      }
    },
    {
      id: 'news-13',
      title: 'Dark Horse Comics Acquired by Major Media Conglomerate',
      impact: 'positive',
      timestamp: new Date(Date.now() - 13 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'publisher',
        symbol: 'DKHB',
        name: 'Dark Horse'
      }
    },
    {
      id: 'news-14',
      title: 'New Batman Series Announced with Record Pre-Orders',
      impact: 'positive',
      timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'comic',
        symbol: 'BAT457',
        name: 'Batman #457'
      }
    },
    {
      id: 'news-15',
      title: 'Comic Book Retailer Association Reports 12% Growth in Store Openings',
      impact: 'positive',
      timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000)
    },

    // Negative News
    {
      id: 'news-16',
      title: 'Major Publisher Delays Key Series Launch Due to Supply Chain Issues',
      impact: 'negative',
      timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'publisher',
        symbol: 'MRVL',
        name: 'Marvel Entertainment'
      }
    },
    {
      id: 'news-17',
      title: 'Comic Convention Circuit Faces Logistical Challenges and Cancellations',
      impact: 'negative',
      timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000)
    },
    {
      id: 'news-18',
      title: 'Paper Shortage Threatens Publishing Schedules Industry-Wide',
      impact: 'negative',
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000)
    },
    {
      id: 'news-19',
      title: 'Key Creator Leaves Major Project Amid Creative Differences',
      impact: 'negative',
      timestamp: new Date(Date.now() - 19 * 60 * 60 * 1000)
    },
    {
      id: 'news-20',
      title: 'Comic Grading Company Faces Backlash Over Quality Control Issues',
      impact: 'negative',
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000)
    },
    {
      id: 'news-21',
      title: 'Major Retailer Chain Reduces Comic Book Shelf Space',
      impact: 'negative',
      timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000)
    },
    {
      id: 'news-22',
      title: 'Shipping Costs Rise 15% for Comics Distribution Network',
      impact: 'negative',
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000)
    },
    {
      id: 'news-23',
      title: 'Anticipated Comic Adaptation Receives Poor Critical Reception',
      impact: 'negative',
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000)
    },
    {
      id: 'news-24',
      title: 'Industry Analysis Shows Declining Sales in Mid-Tier Titles',
      impact: 'negative',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 'news-25',
      title: 'Comic Book Speculation Market Shows Signs of Cooling',
      impact: 'negative',
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000)
    },

    // Neutral News
    {
      id: 'news-26',
      title: 'Industry Group Announces New Grading Standards for Comics',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000)
    },
    {
      id: 'news-27',
      title: 'Creator Transitions to Digital-First Publishing Model',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 27 * 60 * 60 * 1000),
      relatedSecurity: {
        type: 'creator',
        symbol: 'TMFS',
        name: 'Todd McFarlane'
      }
    },
    {
      id: 'news-28',
      title: 'Comic Book Retailers Adapt to Changing Market Conditions',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000)
    },
    {
      id: 'news-29',
      title: 'New Distribution Network Launches for Independent Publishers',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 29 * 60 * 60 * 1000)
    },
    {
      id: 'news-30',
      title: 'Industry Standards Committee Formed to Address Market Challenges',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000)
    },
    {
      id: 'news-31',
      title: 'Comic Book Preservation Society Announces Digital Archive Project',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 31 * 60 * 60 * 1000)
    },
    {
      id: 'news-32',
      title: 'International Comic Market Shows Shifting Regional Trends',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000)
    },
    {
      id: 'news-33',
      title: 'Comic Book Legal Defense Fund Announces New Initiative',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 33 * 60 * 60 * 1000)
    },
    {
      id: 'news-34',
      title: 'Industry Survey Reveals Changing Reader Demographics',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 34 * 60 * 60 * 1000)
    },
    {
      id: 'news-35',
      title: 'Comic Book Museum Announces Expansion Plans',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 35 * 60 * 60 * 1000)
    },
    {
      id: 'news-36',
      title: 'Digital Comics Platform Introduces New Reading Features',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000)
    },
    {
      id: 'news-37',
      title: 'Comic Book Scholarship Program Launched for Aspiring Creators',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 37 * 60 * 60 * 1000)
    },
    {
      id: 'news-38',
      title: 'Industry Conference Announces Dates for Next Year',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 38 * 60 * 60 * 1000)
    },
    {
      id: 'news-39',
      title: 'Comic Book Restoration Techniques Advance with New Technology',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 39 * 60 * 60 * 1000)
    },
    {
      id: 'news-40',
      title: 'Academic Study Examines Long-term Impact of Comic Book Culture',
      impact: 'neutral',
      timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000)
    }
  ];

  return mockNews.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const MOCK_NEWS = generateMockNews();

export function NewsTicker() {
  const { data: news, isLoading, error } = useNewsData();
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [speed, setSpeed] = useState(1);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tickerRef.current) {
      // Increase speed by 20% by reducing animation duration
      tickerRef.current.style.animationDuration = `${40 / speed}s`; // Changed from 50s to 40s (20% faster)
    }
  }, [speed]);

  if (isLoading || !news?.length) {
    return null;
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border-b border-red-700/50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center text-red-200">
            Failed to load news feed. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  const getImpactStyles = (impact: string) => {
    const styles = {
      positive: {
        dot: 'bg-[#00C853]',
        text: 'text-[#00C853]',
        bg: 'bg-green-900/20'
      },
      negative: {
        dot: 'bg-[#D50000]',
        text: 'text-[#D50000]',
        bg: 'bg-red-900/20'
      },
      neutral: {
        dot: 'bg-[#FFD600]',
        text: 'text-[#FFD600]',
        bg: 'bg-yellow-900/20'
      }
    };
    return styles[impact as keyof typeof styles] || styles.neutral;
  };

  // Use mock news in development
  const displayNews = process.env.NODE_ENV === 'development' ? MOCK_NEWS : news;

  return (
    <div 
      className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50"
      role="complementary"
      aria-label="Market News Ticker"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 flex items-center justify-between">
          <div className="flex-1 overflow-hidden relative">
            <div 
              ref={tickerRef}
              className={`flex whitespace-nowrap ${!isPaused ? 'animate-marquee' : ''}`}
              style={{ animationDuration: `${40 / speed}s` }} // Changed from 50s to 40s (20% faster)
            >
              {displayNews.map((item) => (
                <Link 
                  key={item.id}
                  to={`/news/${item.id}`}
                  className={`inline-flex items-center space-x-4 px-4 py-1 mx-2 rounded-lg ${
                    getImpactStyles(item.impact).bg
                  } hover:bg-opacity-75 transition-colors`}
                  onClick={(e) => {
                    if (isPaused) {
                      e.preventDefault();
                      return;
                    }
                  }}
                  role="article"
                >
                  <span 
                    className={`h-2 w-2 rounded-full ${getImpactStyles(item.impact).dot}`}
                    aria-hidden="true"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-[16px] font-medium text-white">
                      {item.title}
                    </span>
                    {item.impact === 'positive' ? (
                      <TrendingUp className={`h-4 w-4 ${getImpactStyles(item.impact).text}`} />
                    ) : item.impact === 'negative' ? (
                      <TrendingDown className={`h-4 w-4 ${getImpactStyles(item.impact).text}`} />
                    ) : null}
                    <span className="text-sm text-gray-400">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-4 border-l border-slate-700/50 pl-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSpeed(speed === 1 ? 0.5 : speed === 0.5 ? 2 : 1)}
                className="text-gray-400 hover:text-white transition-colors px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={`Current speed: ${speed}x. Click to change.`}
              >
                {speed}x
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={isPaused ? 'Resume news ticker' : 'Pause news ticker'}
              >
                {isPaused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label={isMuted ? 'Enable sound' : 'Disable sound'}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}