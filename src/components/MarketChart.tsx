import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

// Generate realistic historical data over 20 years
const generateHistoricalData = () => {
  const startDate = new Date(2004, 0, 1);
  const endDate = new Date();
  const data = [];
  let value = 8500; // Starting value in 2004

  // Key events affecting the market with realistic impacts
  const events = {
    '2005-06': { change: 2.5, reason: 'First Iron Man Movie Announced' },
    '2006-12': { change: 1.8, reason: 'Rise of Online Comic Sales' },
    '2008-05': { change: 5.2, reason: 'Iron Man Release' },
    '2008-10': { change: -12.5, reason: 'Financial Crisis Impact' },
    '2009-08': { change: -8.3, reason: 'Industry Contraction' },
    '2010-06': { change: 6.7, reason: 'Digital Comics Boom' },
    '2011-07': { change: 4.2, reason: 'Comic Movie Renaissance' },
    '2012-05': { change: 9.2, reason: 'Avengers Movie Release' },
    '2013-11': { change: 3.8, reason: 'Collector Market Expansion' },
    '2014-08': { change: 2.4, reason: 'Guardians of the Galaxy' },
    '2015-05': { change: 4.1, reason: 'Age of Ultron Release' },
    '2016-03': { change: -3.2, reason: 'Market Correction' },
    '2017-06': { change: 5.5, reason: 'Wonder Woman Success' },
    '2018-02': { change: 8.3, reason: 'Black Panther Impact' },
    '2018-04': { change: 7.2, reason: 'Infinity War Release' },
    '2019-07': { change: 4.5, reason: 'Comic Speculation Boom' },
    '2020-03': { change: -15.8, reason: 'COVID-19 Impact' },
    '2020-06': { change: -7.3, reason: 'Diamond Distribution Crisis' },
    '2021-01': { change: 9.2, reason: 'NFT Speculation' },
    '2021-07': { change: 11.3, reason: 'Post-COVID Boom' },
    '2022-02': { change: -7.8, reason: 'Market Correction' },
    '2022-08': { change: 2.4, reason: 'Movie Announcements' },
    '2023-03': { change: -5.2, reason: 'Economic Uncertainty' },
    '2023-09': { change: 4.1, reason: 'Graded Comics Rally' },
    '2024-01': { change: 2.8, reason: 'Strong Auction Results' }
  };

  // Calculate monthly data points
  for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
    const dateKey = date.toISOString().slice(0, 7);
    const event = events[dateKey];
    
    // Base monthly variation (-1% to +1%)
    const baseVariation = (Math.random() * 2 - 1) / 100;
    
    // Add event impact if exists
    const eventImpact = event ? event.change / 100 : 0;
    
    // Calculate new value
    value = value * (1 + baseVariation + eventImpact);

    data.push({
      date: dateKey,
      value: Math.round(value),
      event: event?.reason
    });
  }

  // Calculate YTD returns for each year
  const yearlyReturns = {};
  let previousYearEnd = data[0].value;
  
  data.forEach(point => {
    const year = point.date.substring(0, 4);
    const month = point.date.substring(5, 7);
    
    if (month === '12') {
      const yearReturn = ((point.value - previousYearEnd) / previousYearEnd) * 100;
      yearlyReturns[year] = parseFloat(yearReturn.toFixed(1));
      previousYearEnd = point.value;
    }
  });

  // Calculate current year YTD
  const currentYear = new Date().getFullYear().toString();
  const firstDayOfYear = data.find(d => d.date.startsWith(currentYear + '-01'));
  const latestDay = data[data.length - 1];
  
  if (firstDayOfYear && latestDay) {
    const ytdReturn = ((latestDay.value - firstDayOfYear.value) / firstDayOfYear.value) * 100;
    yearlyReturns[currentYear] = parseFloat(ytdReturn.toFixed(1));
  }

  return {
    data,
    yearlyReturns
  };
};

const { data: mockHistoricalData, yearlyReturns } = generateHistoricalData();

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-slate-800/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-slate-700/50">
        <p className="text-sm text-gray-400 mb-1">{new Date(label).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
        <p className="text-lg font-bold text-white">Index Value: {dataPoint.value.toLocaleString()}</p>
        
        {dataPoint.event && (
          <div className="mt-2 pt-2 border-t border-slate-700/50">
            <p className="text-sm font-medium text-indigo-400">Market Event:</p>
            <p className="text-sm text-gray-300">{dataPoint.event}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function MarketChart() {
  const [timeRange, setTimeRange] = useState('1y');
  const [showEvents, setShowEvents] = useState(true);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Filter data based on selected time range
  const getFilteredData = () => {
    if (timeRange === 'all') return mockHistoricalData;
    
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '1y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case '5y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 5));
        break;
      case '10y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 10));
        break;
      default:
        return mockHistoricalData;
    }
    
    const startDateStr = startDate.toISOString().slice(0, 7);
    return mockHistoricalData.filter(item => item.date >= startDateStr);
  };

  const filteredData = getFilteredData();
  
  // Calculate current value and change
  const currentValue = mockHistoricalData[mockHistoricalData.length - 1].value;
  const previousValue = mockHistoricalData[mockHistoricalData.length - 2].value;
  const changeValue = currentValue - previousValue;
  const changePercent = (changeValue / previousValue) * 100;

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Comic Market Index</h2>
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
      
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
            <p className="text-sm text-gray-400">Current Value</p>
            <p className="text-xl font-bold text-white">{currentValue.toLocaleString()}</p>
          </div>
          
          <div className={`p-3 rounded-lg border ${
            changeValue >= 0 
              ? 'bg-green-900/30 border-green-700/30' 
              : 'bg-red-900/30 border-red-700/30'
          }`}>
            <p className="text-sm text-gray-400">Daily Change</p>
            <div className="flex items-center">
              {changeValue >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
              )}
              <p className={`text-xl font-bold ${
                changeValue >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {changeValue >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => {
                // Show year only for better readability
                return date.substring(0, 4);
              }}
              stroke="#94a3b8"
            />
            <YAxis 
              stroke="#94a3b8"
              tickFormatter={(value) => value.toLocaleString()}
              domain={[0, 16000]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#818cf8" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#818cf8' }}
            />
            
            {/* Market Events */}
            {showEvents && filteredData.map((entry, index) => {
              if (entry.event) {
                return (
                  <ReferenceLine 
                    key={`event-${index}`}
                    x={entry.date} 
                    stroke="#9333ea" 
                    strokeDasharray="3 3"
                    label={{ 
                      value: entry.event, 
                      position: 'insideTopRight',
                      fill: '#9333ea',
                      fontSize: 10
                    }}
                  />
                );
              }
              return null;
            })}
            
            {/* Market crisis periods */}
            <ReferenceArea 
              x1="2008-09" 
              x2="2009-03" 
              fill="#ef4444" 
              fillOpacity={0.1} 
              stroke="#ef4444"
              strokeOpacity={0.3}
            />
            <ReferenceArea 
              x1="2020-03" 
              x2="2020-08" 
              fill="#ef4444" 
              fillOpacity={0.1} 
              stroke="#ef4444"
              strokeOpacity={0.3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 border-t border-slate-700/50 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Historical Annual Returns</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Object.entries(yearlyReturns).slice(-10).map(([year, returnValue]) => (
            <div 
              key={year} 
              className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50 hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all cursor-pointer"
              onClick={() => setSelectedCard(selectedCard === year ? null : year)}
              style={{
                boxShadow: selectedCard === year ? '0 0 15px rgba(255,255,0,0.9)' : '',
                transform: selectedCard === year ? 'translateY(-2px)' : ''
              }}
            >
              <p className="text-sm text-gray-400">{year}</p>
              <p className={`text-lg font-semibold ${returnValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {returnValue >= 0 ? '+' : ''}{returnValue}%
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Link 
          to="/market-index"
          className="inline-flex items-center space-x-2 bg-[#00B140] hover:bg-[#009935] text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Calendar className="h-5 w-5" />
          <span>View Detailed Market Analysis</span>
        </Link>
      </div>
    </div>
  );
}