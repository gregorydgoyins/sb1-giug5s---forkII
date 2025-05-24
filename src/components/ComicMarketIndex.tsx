import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Info } from 'lucide-react';

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

  // Key issues from different eras
  const keyIssues = [
    { date: '2005-03', name: 'Action Comics #1 (Golden Age)', value: 12000, era: 'golden' },
    { date: '2008-11', name: 'Amazing Fantasy #15 (Silver Age)', value: 15000, era: 'silver' },
    { date: '2012-07', name: 'Giant-Size X-Men #1 (Bronze Age)', value: 18000, era: 'bronze' },
    { date: '2016-05', name: 'Teenage Mutant Ninja Turtles #1 (Copper Age)', value: 21000, era: 'copper' },
    { date: '2019-10', name: 'Walking Dead #1 (Modern Age)', value: 24000, era: 'modern' },
    { date: '2021-12', name: 'Amazing Spider-Man #300 (Copper Age)', value: 27000, era: 'copper' }
  ];

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

    // Find key issue for this month
    const keyIssue = keyIssues.find(issue => issue.date === dateKey);

    data.push({
      date: dateKey,
      value: Math.round(value),
      event: event?.reason,
      keyIssue: keyIssue?.name,
      keyIssueEra: keyIssue?.era,
      keyIssueValue: keyIssue?.value
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
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm text-gray-500 mb-1">{new Date(label).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
        <p className="text-lg font-bold">Index Value: {dataPoint.value.toLocaleString()}</p>
        
        {dataPoint.event && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-sm font-medium text-indigo-600">Market Event:</p>
            <p className="text-sm">{dataPoint.event}</p>
          </div>
        )}
        
        {dataPoint.keyIssue && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-sm font-medium text-indigo-600">Key Issue:</p>
            <p className="text-sm">{dataPoint.keyIssue}</p>
            <p className="text-sm text-gray-500">Value: {dataPoint.keyIssueValue?.toLocaleString()}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Era color mapping
const eraColors = {
  golden: '#FFD700',  // Gold
  silver: '#C0C0C0',  // Silver
  bronze: '#CD7F32',  // Bronze
  copper: '#B87333',  // Copper
  modern: '#4F46E5'   // Indigo
};

export function ComicMarketIndex() {
  const [timeRange, setTimeRange] = useState('all');
  const [showEvents, setShowEvents] = useState(true);
  const [showKeyIssues, setShowKeyIssues] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);

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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Comic Market Index (2004-2024)</h2>
        </div>
        <div className="relative">
          <button 
            onClick={() => setInfoOpen(!infoOpen)}
            className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <Info className="h-5 w-5" />
          </button>
          
          {infoOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10">
              <h3 className="font-semibold mb-2">About the Comic Market Index</h3>
              <p className="text-sm text-gray-600 mb-2">
                This index tracks the performance of key comic books across all five major ages:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mb-2">
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                  Golden Age (1938-1956)
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
                  Silver Age (1956-1970)
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-amber-700 mr-2"></span>
                  Bronze Age (1970-1984)
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-amber-600 mr-2"></span>
                  Copper Age (1984-1991)
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></span>
                  Modern Age (1991-Present)
                </li>
              </ul>
              <p className="text-sm text-gray-600">
                The index is weighted by age, significance, and market activity.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex space-x-2 mb-2 sm:mb-0">
          <button
            onClick={() => setTimeRange('1y')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '1y' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            1Y
          </button>
          <button
            onClick={() => setTimeRange('5y')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '5y' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            5Y
          </button>
          <button
            onClick={() => setTimeRange('10y')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '10y' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            10Y
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
        </div>
        
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showEvents}
              onChange={() => setShowEvents(!showEvents)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show Events</span>
          </label>
          
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showKeyIssues}
              onChange={() => setShowKeyIssues(!showKeyIssues)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Show Key Issues</span>
          </label>
        </div>
      </div>
      
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => {
                // Show year only for better readability
                return date.substring(0, 4);
              }}
              stroke="#6b7280"
            />
            <YAxis 
              stroke="#6b7280"
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4f46e5" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#4f46e5' }}
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
            
            {/* Key Issues */}
            {showKeyIssues && filteredData.map((entry, index) => {
              if (entry.keyIssue) {
                return (
                  <ReferenceLine 
                    key={`issue-${index}`}
                    x={entry.date} 
                    stroke={eraColors[entry.keyIssueEra] || '#4f46e5'} 
                    strokeWidth={2}
                    label={{ 
                      value: entry.keyIssue, 
                      position: 'insideBottomRight',
                      fill: eraColors[entry.keyIssueEra] || '#4f46e5',
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Current Value</p>
          <p className="text-xl font-bold">{currentValue.toLocaleString()}</p>
          <div className="flex items-center mt-1">
            {changeValue >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={`text-sm ${changeValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {changeValue >= 0 ? '+' : ''}{changeValue.toLocaleString()} ({changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">YTD Change</p>
          <p className={`text-xl font-bold ${yearlyReturns[new Date().getFullYear()] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {yearlyReturns[new Date().getFullYear()] >= 0 ? '+' : ''}{yearlyReturns[new Date().getFullYear()]}%
          </p>
          <p className="text-sm text-gray-500 mt-1">Year to Date</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">20-Year CAGR</p>
          <p className="text-xl font-bold text-indigo-600">8.7%</p>
          <p className="text-sm text-gray-500 mt-1">Compound Annual Growth</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Market Volatility</p>
          <p className="text-xl font-bold">Medium</p>
          <p className="text-sm text-gray-500 mt-1">Current Conditions</p>
        </div>
      </div>
      
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold mb-4">Historical Annual Returns</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Object.entries(yearlyReturns).slice(-10).map(([year, returnValue]) => (
            <div key={year} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">{year}</p>
              <p className={`text-lg font-semibold ${returnValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {returnValue >= 0 ? '+' : ''}{returnValue}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}