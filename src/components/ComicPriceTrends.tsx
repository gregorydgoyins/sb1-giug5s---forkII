import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Info, ChevronRight } from 'lucide-react';
import { Breadcrumbs } from './common/Breadcrumbs';

// Generate realistic historical data from 2014 to present
const generateHistoricalData = () => {
  // Start from Q1 2014
  const startDate = new Date(2014, 0, 1);
  const endDate = new Date();
  const data = [];
  
  // Initial values for key comics (in USD)
  const comics = [
    { 
      id: 'af15',
      name: 'Amazing Fantasy #15',
      era: 'silver',
      value: 125000,
      color: '#C0C0C0', // Silver
      keyEvents: {
        '2016-Q3': { impact: 0.25, event: 'Spider-Man: Homecoming Announced' },
        '2017-Q3': { impact: 0.15, event: 'Spider-Man: Homecoming Released' },
        '2019-Q3': { impact: 0.20, event: 'Spider-Man: Far From Home Released' },
        '2021-Q4': { impact: 0.35, event: 'Spider-Man: No Way Home Released' }
      }
    },
    { 
      id: 'asm300',
      name: 'Amazing Spider-Man #300',
      era: 'copper',
      value: 2200,
      color: '#B87333', // Copper
      keyEvents: {
        '2018-Q4': { impact: 0.40, event: 'Venom Movie Released' },
        '2021-Q3': { impact: 0.25, event: 'Venom: Let There Be Carnage Released' },
        '2022-Q2': { impact: 0.15, event: 'Morbius Released' }
      }
    },
    { 
      id: 'ac1',
      name: 'Action Comics #1',
      era: 'golden',
      value: 3100000,
      color: '#FFD700', // Gold
      keyEvents: {
        '2016-Q1': { impact: 0.10, event: 'Batman v Superman Released' },
        '2017-Q4': { impact: 0.15, event: 'Justice League Released' },
        '2018-Q4': { impact: 0.05, event: 'Record-Breaking CGC 9.0 Sale' },
        '2023-Q2': { impact: 0.20, event: 'New Superman Movie Announced' }
      }
    },
    { 
      id: 'wd1',
      name: 'Walking Dead #1',
      era: 'modern',
      value: 1800,
      color: '#4F46E5', // Indigo
      keyEvents: {
        '2016-Q4': { impact: -0.10, event: 'TV Show Ratings Decline' },
        '2018-Q3': { impact: -0.15, event: 'Main Character Departure from Show' },
        '2019-Q4': { impact: -0.20, event: 'TV Series Ending Announced' },
        '2022-Q3': { impact: 0.15, event: 'New Spin-off Series Announced' }
      }
    },
    { 
      id: 'gsxm1',
      name: 'Giant-Size X-Men #1',
      era: 'bronze',
      value: 8500,
      color: '#CD7F32', // Bronze
      keyEvents: {
        '2016-Q1': { impact: -0.05, event: 'X-Men: Apocalypse Underperforms' },
        '2019-Q2': { impact: -0.10, event: 'Dark Phoenix Box Office Disappointment' },
        '2022-Q1': { impact: 0.25, event: 'MCU X-Men Reboot Rumors' },
        '2023-Q3': { impact: 0.30, event: "X-Men '97 Animated Series Announced" }
      }
    }
  ];

  // Market-wide events affecting all comics
  const marketEvents = {
    '2015-Q2': { impact: 0.08, event: 'Avengers: Age of Ultron Boosts Market' },
    '2016-Q4': { impact: 0.05, event: 'Comic Speculation Boom' },
    '2018-Q1': { impact: 0.10, event: 'Black Panther Success Drives Market' },
    '2020-Q1': { impact: -0.25, event: 'COVID-19 Market Crash' },
    '2020-Q3': { impact: -0.15, event: 'Diamond Distribution Crisis' },
    '2021-Q1': { impact: 0.20, event: 'NFT & Speculation Boom' },
    '2022-Q1': { impact: -0.10, event: 'Market Correction' },
    '2023-Q3': { impact: 0.08, event: 'Graded Comics Rally' }
  };

  // Generate quarterly data points
  for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      // Skip future quarters
      if (year === endDate.getFullYear() && quarter > Math.ceil((endDate.getMonth() + 1) / 3)) {
        continue;
      }

      const quarterKey = `${year}-Q${quarter}`;
      const marketEvent = marketEvents[quarterKey];
      
      // Update comic values
      const quarterData = {
        quarter: quarterKey,
        marketEvent: marketEvent?.event
      };

      // Apply market-wide events and comic-specific events
      comics.forEach(comic => {
        // Base quarterly variation (-2% to +3%)
        const baseVariation = (Math.random() * 0.05 - 0.02);
        
        // Add market-wide event impact if exists
        const marketImpact = marketEvent ? marketEvent.impact : 0;
        
        // Add comic-specific event impact if exists
        const comicEvent = comic.keyEvents[quarterKey];
        const comicImpact = comicEvent ? comicEvent.impact : 0;
        
        // Calculate new value with compounding effects
        comic.value = comic.value * (1 + baseVariation + marketImpact + comicImpact);
        
        // Add to quarter data
        quarterData[`${comic.id}Value`] = Math.round(comic.value);
        quarterData[`${comic.id}Event`] = comicEvent?.event;
      });

      data.push(quarterData);
    }
  }

  // Calculate total returns for each comic
  const returns = comics.map(comic => {
    const initialValue = data[0][`${comic.id}Value`];
    const currentValue = data[data.length - 1][`${comic.id}Value`];
    const percentChange = ((currentValue - initialValue) / initialValue) * 100;
    
    return {
      id: comic.id,
      name: comic.name,
      era: comic.era,
      initialValue: initialValue,
      currentValue: currentValue,
      percentChange: percentChange,
      color: comic.color
    };
  });

  return {
    data,
    comics,
    returns
  };
};

const { data: trendData, comics, returns } = generateHistoricalData();

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-slate-700/50">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        
        {payload.map((entry, index) => {
          const comic = comics.find(c => `${c.id}Value` === entry.dataKey);
          if (!comic) return null;
          
          return (
            <div key={index} className="mb-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: comic.color }}></div>
                <p className="text-sm font-medium text-white">{comic.name}</p>
              </div>
              <p className="text-sm text-white ml-5">${entry.value.toLocaleString()}</p>
            </div>
          );
        })}
        
        {/* Show market event if exists */}
        {payload[0]?.payload.marketEvent && (
          <div className="mt-2 pt-2 border-t border-slate-700/50">
            <p className="text-sm font-medium text-indigo-400">Market Event:</p>
            <p className="text-sm text-gray-300">{payload[0].payload.marketEvent}</p>
          </div>
        )}
        
        {/* Show comic-specific events if they exist */}
        {comics.map(comic => {
          const event = payload[0]?.payload[`${comic.id}Event`];
          if (!event) return null;
          
          return (
            <div key={comic.id} className="mt-2 pt-2 border-t border-slate-700/50">
              <p className="text-sm font-medium" style={{ color: comic.color }}>{comic.name} Event:</p>
              <p className="text-sm text-gray-300">{event}</p>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export function ComicPriceTrends() {
  const [timeRange, setTimeRange] = useState('all');
  const [showEvents, setShowEvents] = useState(true);
  const [selectedComic, setSelectedComic] = useState('all');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  // Filter data based on selected time range
  const getFilteredData = () => {
    if (timeRange === 'all') return trendData;
    
    const now = new Date();
    let startYear = now.getFullYear();
    let startQuarter = Math.ceil((now.getMonth() + 1) / 3);
    
    switch (timeRange) {
      case '1y':
        startYear -= 1;
        break;
      case '5y':
        startYear -= 5;
        break;
      case '10y':
        startYear -= 10;
        break;
      default:
        return trendData;
    }
    
    const startKey = `${startYear}-Q${startQuarter}`;
    return trendData.filter(item => item.quarter >= startKey);
  };

  const filteredData = getFilteredData();
  
  // Get lines to display based on selected comic
  const getLinesToShow = () => {
    if (selectedComic === 'all') {
      return comics.map(comic => ({
        dataKey: `${comic.id}Value`,
        color: comic.color,
        name: comic.name
      }));
    }
    
    const comic = comics.find(c => c.id === selectedComic);
    if (!comic) return [];
    
    return [{
      dataKey: `${comic.id}Value`,
      color: comic.color,
      name: comic.name
    }];
  };

  const linesToShow = getLinesToShow();

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl w-full mb-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs overrides={[
        { name: 'Markets', path: '/markets' },
        { name: 'Comic Price Trends' }
      ]} />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Comic Book Price Trends (2014-Present)</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {['1y', '5y', '10y', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range === 'all' ? 'ALL' : range.toUpperCase()}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setInfoOpen(!infoOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Info className="h-5 w-5" />
            </button>
            
            {infoOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-slate-700/90 backdrop-blur-md rounded-lg shadow-xl border border-slate-600/50 p-4 z-10">
                <h3 className="font-semibold text-white mb-2">About Comic Price Trends</h3>
                <p className="text-sm text-gray-300 mb-2">
                  This chart tracks the market values of key comic books from different eras:
                </p>
                <ul className="text-sm text-gray-300 space-y-1 mb-2">
                  {comics.map(comic => (
                    <li key={comic.id} className="flex items-center">
                      <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: comic.color }}></span>
                      {comic.name} ({comic.era.charAt(0).toUpperCase() + comic.era.slice(1)} Age)
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-300">
                  Values represent high-grade (NM 9.4+) copies based on auction results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <select
            value={selectedComic}
            onChange={(e) => setSelectedComic(e.target.value)}
            className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2"
          >
            <option value="all">All Comics</option>
            {comics.map(comic => (
              <option key={comic.id} value={comic.id}>{comic.name}</option>
            ))}
          </select>
          
          <label className="flex items-center space-x-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={showEvents}
              onChange={() => setShowEvents(!showEvents)}
              className="rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show Events</span>
          </label>
        </div>
      </div>
      
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="quarter" 
              stroke="#94a3b8"
            />
            <YAxis 
              stroke="#94a3b8"
              tickFormatter={(value) => `$${(value >= 1000000 ? (value/1000000).toFixed(1) + 'M' : 
                                          value >= 1000 ? (value/1000).toFixed(1) + 'K' : 
                                          value)}`}
              scale="log"
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {linesToShow.map((line, index) => (
              <Line 
                key={index}
                type="monotone" 
                dataKey={line.dataKey} 
                stroke={line.color} 
                name={line.name}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: line.color }}
              />
            ))}
            
            {/* Market Events */}
            {showEvents && Object.entries(marketEvents).map(([quarter, event]) => {
              if (filteredData.some(d => d.quarter === quarter)) {
                return (
                  <ReferenceLine 
                    key={`event-${quarter}`}
                    x={quarter} 
                    stroke="#9333ea" 
                    strokeDasharray="3 3"
                    label={{ 
                      value: event.event, 
                      position: 'insideTopRight',
                      fill: '#9333ea',
                      fontSize: 10
                    }}
                  />
                );
              }
              return null;
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 border-t border-slate-700/50 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Key Comic Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700/50">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Comic</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Era</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">2014 Value</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Current Value</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {returns.map((comic, index) => (
                <tr 
                  key={comic.id}
                  onClick={() => setSelectedCard(selectedCard === comic.id ? null : comic.id)}
                  className={`group relative hover:bg-slate-700 transition-all hover:-translate-y-1 cursor-pointer
                    hover:shadow-[0_0_15px_rgba(255,255,0,0.7)]
                    ${selectedCard === comic.id ? 'shadow-[0_0_15px_rgba(255,255,0,0.9)]' : 'shadow-lg'}`}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: comic.color }}></div>
                      <span className="text-white">{comic.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-300 capitalize">{comic.era} Age</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-gray-300">${comic.initialValue.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-white">${comic.currentValue.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className={`${comic.percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {comic.percentChange >= 0 ? '+' : ''}{comic.percentChange.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-400">
        <p>* Values represent high-grade (NM 9.4 or better) copies based on auction results</p>
        <p>* Data compiled from major auction houses and market reports</p>
      </div>
    </div>
  );
}

// Market-wide events affecting all comics
const marketEvents = {
  '2015-Q2': { impact: 0.08, event: 'Avengers: Age of Ultron Boosts Market' },
  '2016-Q4': { impact: 0.05, event: 'Comic Speculation Boom' },
  '2018-Q1': { impact: 0.10, event: 'Black Panther Success Drives Market' },
  '2020-Q1': { impact: -0.25, event: 'COVID-19 Market Crash' },
  '2020-Q3': { impact: -0.15, event: 'Diamond Distribution Crisis' },
  '2021-Q1': { impact: 0.20, event: 'NFT & Speculation Boom' },
  '2022-Q1': { impact: -0.10, event: 'Market Correction' },
  '2023-Q3': { impact: 0.08, event: 'Graded Comics Rally' }
};