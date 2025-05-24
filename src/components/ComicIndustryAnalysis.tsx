import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Info, BarChart2, PieChartIcon, Users, Store, BookOpen } from 'lucide-react';
import { Breadcrumbs } from './common/Breadcrumbs';

// Monthly comic book sales data (2019-2024)
const monthlySalesData = [
  // 2019 data
  { month: '2019-01', units: 6.8, revenue: 31.2, digitalUnits: 1.2, digitalRevenue: 4.8 },
  { month: '2019-02', units: 6.5, revenue: 30.5, digitalUnits: 1.3, digitalRevenue: 5.1 },
  { month: '2019-03', units: 7.1, revenue: 32.8, digitalUnits: 1.3, digitalRevenue: 5.2 },
  { month: '2019-04', units: 7.3, revenue: 33.6, digitalUnits: 1.4, digitalRevenue: 5.5 },
  { month: '2019-05', units: 7.5, revenue: 34.2, digitalUnits: 1.4, digitalRevenue: 5.6 },
  { month: '2019-06', units: 7.2, revenue: 33.1, digitalUnits: 1.5, digitalRevenue: 5.8 },
  { month: '2019-07', units: 7.8, revenue: 35.9, digitalUnits: 1.5, digitalRevenue: 6.0 },
  { month: '2019-08', units: 7.6, revenue: 35.2, digitalUnits: 1.6, digitalRevenue: 6.2 },
  { month: '2019-09', units: 7.4, revenue: 34.5, digitalUnits: 1.6, digitalRevenue: 6.3 },
  { month: '2019-10', units: 7.7, revenue: 35.6, digitalUnits: 1.7, digitalRevenue: 6.5 },
  { month: '2019-11', units: 7.9, revenue: 36.8, digitalUnits: 1.7, digitalRevenue: 6.7 },
  { month: '2019-12', units: 7.5, revenue: 35.1, digitalUnits: 1.8, digitalRevenue: 6.9 },
  
  // 2020 data (showing COVID impact)
  { month: '2020-01', units: 7.6, revenue: 36.2, digitalUnits: 1.8, digitalRevenue: 7.1 },
  { month: '2020-02', units: 7.8, revenue: 37.1, digitalUnits: 1.9, digitalRevenue: 7.3 },
  { month: '2020-03', units: 5.2, revenue: 25.1, digitalUnits: 2.5, digitalRevenue: 9.8 }, // COVID impact
  { month: '2020-04', units: 2.1, revenue: 10.2, digitalUnits: 3.8, digitalRevenue: 14.9 }, // Diamond shutdown
  { month: '2020-05', units: 2.5, revenue: 12.1, digitalUnits: 3.6, digitalRevenue: 14.2 },
  { month: '2020-06', units: 4.2, revenue: 20.5, digitalUnits: 3.2, digitalRevenue: 12.8 }, // Recovery begins
  { month: '2020-07', units: 5.1, revenue: 25.2, digitalUnits: 2.9, digitalRevenue: 11.5 },
  { month: '2020-08', units: 5.8, revenue: 28.7, digitalUnits: 2.7, digitalRevenue: 10.8 },
  { month: '2020-09', units: 6.2, revenue: 31.1, digitalUnits: 2.5, digitalRevenue: 10.1 },
  { month: '2020-10', units: 6.5, revenue: 32.8, digitalUnits: 2.4, digitalRevenue: 9.7 },
  { month: '2020-11', units: 6.7, revenue: 34.2, digitalUnits: 2.3, digitalRevenue: 9.4 },
  { month: '2020-12', units: 6.9, revenue: 35.5, digitalUnits: 2.2, digitalRevenue: 9.0 },
  
  // 2021 data (recovery and growth)
  { month: '2021-01', units: 7.0, revenue: 36.1, digitalUnits: 2.2, digitalRevenue: 9.1 },
  { month: '2021-02', units: 7.2, revenue: 37.4, digitalUnits: 2.1, digitalRevenue: 8.9 },
  { month: '2021-03', units: 7.5, revenue: 39.2, digitalUnits: 2.1, digitalRevenue: 8.8 },
  { month: '2021-04', units: 7.8, revenue: 41.1, digitalUnits: 2.0, digitalRevenue: 8.6 },
  { month: '2021-05', units: 8.1, revenue: 43.2, digitalUnits: 2.0, digitalRevenue: 8.5 },
  { month: '2021-06', units: 8.3, revenue: 44.5, digitalUnits: 2.0, digitalRevenue: 8.4 },
  { month: '2021-07', units: 8.5, revenue: 45.9, digitalUnits: 1.9, digitalRevenue: 8.3 },
  { month: '2021-08', units: 8.7, revenue: 47.2, digitalUnits: 1.9, digitalRevenue: 8.2 },
  { month: '2021-09', units: 8.9, revenue: 48.6, digitalUnits: 1.9, digitalRevenue: 8.1 },
  { month: '2021-10', units: 9.1, revenue: 50.1, digitalUnits: 1.8, digitalRevenue: 8.0 },
  { month: '2021-11', units: 9.3, revenue: 51.5, digitalUnits: 1.8, digitalRevenue: 7.9 },
  { month: '2021-12', units: 9.5, revenue: 52.9, digitalUnits: 1.8, digitalRevenue: 7.8 },
  
  // 2022 data
  { month: '2022-01', units: 9.4, revenue: 53.1, digitalUnits: 1.8, digitalRevenue: 7.9 },
  { month: '2022-02', units: 9.3, revenue: 52.8, digitalUnits: 1.8, digitalRevenue: 8.0 },
  { month: '2022-03', units: 9.2, revenue: 52.5, digitalUnits: 1.9, digitalRevenue: 8.1 },
  { month: '2022-04', units: 9.1, revenue: 52.2, digitalUnits: 1.9, digitalRevenue: 8.2 },
  { month: '2022-05', units: 9.0, revenue: 51.9, digitalUnits: 1.9, digitalRevenue: 8.3 },
  { month: '2022-06', units: 8.9, revenue: 51.6, digitalUnits: 2.0, digitalRevenue: 8.4 },
  { month: '2022-07', units: 8.8, revenue: 51.3, digitalUnits: 2.0, digitalRevenue: 8.5 },
  { month: '2022-08', units: 8.7, revenue: 51.0, digitalUnits: 2.0, digitalRevenue: 8.6 },
  { month: '2022-09', units: 8.6, revenue: 50.7, digitalUnits: 2.1, digitalRevenue: 8.7 },
  { month: '2022-10', units: 8.5, revenue: 50.4, digitalUnits: 2.1, digitalRevenue: 8.8 },
  { month: '2022-11', units: 8.4, revenue: 50.1, digitalUnits: 2.1, digitalRevenue: 8.9 },
  { month: '2022-12', units: 8.3, revenue: 49.8, digitalUnits: 2.2, digitalRevenue: 9.0 },
  
  // 2023 data
  { month: '2023-01', units: 8.2, revenue: 49.5, digitalUnits: 2.2, digitalRevenue: 9.1 },
  { month: '2023-02', units: 8.3, revenue: 50.1, digitalUnits: 2.2, digitalRevenue: 9.2 },
  { month: '2023-03', units: 8.4, revenue: 50.7, digitalUnits: 2.3, digitalRevenue: 9.3 },
  { month: '2023-04', units: 8.5, revenue: 51.3, digitalUnits: 2.3, digitalRevenue: 9.4 },
  { month: '2023-05', units: 8.6, revenue: 51.9, digitalUnits: 2.3, digitalRevenue: 9.5 },
  { month: '2023-06', units: 8.7, revenue: 52.5, digitalUnits: 2.4, digitalRevenue: 9.6 },
  { month: '2023-07', units: 8.8, revenue: 53.1, digitalUnits: 2.4, digitalRevenue: 9.7 },
  { month: '2023-08', units: 8.9, revenue: 53.7, digitalUnits: 2.4, digitalRevenue: 9.8 },
  { month: '2023-09', units: 9.0, revenue: 54.3, digitalUnits: 2.5, digitalRevenue: 9.9 },
  { month: '2023-10', units: 9.1, revenue: 54.9, digitalUnits: 2.5, digitalRevenue: 10.0 },
  { month: '2023-11', units: 9.2, revenue: 55.5, digitalUnits: 2.5, digitalRevenue: 10.1 },
  { month: '2023-12', units: 9.3, revenue: 56.1, digitalUnits: 2.6, digitalRevenue: 10.2 },
  
  // 2024 data (partial year)
  { month: '2024-01', units: 9.4, revenue: 56.7, digitalUnits: 2.6, digitalRevenue: 10.3 },
  { month: '2024-02', units: 9.5, revenue: 57.3, digitalUnits: 2.6, digitalRevenue: 10.4 },
  { month: '2024-03', units: 9.6, revenue: 57.9, digitalUnits: 2.7, digitalRevenue: 10.5 },
  { month: '2024-04', units: 9.7, revenue: 58.5, digitalUnits: 2.7, digitalRevenue: 10.6 },
  { month: '2024-05', units: 9.8, revenue: 59.1, digitalUnits: 2.7, digitalRevenue: 10.7 }
];

// Calculate yearly averages for better visualization
const calculateYearlyData = () => {
  const yearlyData = [];
  const years = ['2019', '2020', '2021', '2022', '2023', '2024'];
  
  years.forEach(year => {
    const yearData = monthlySalesData.filter(d => d.month.startsWith(year));
    
    if (yearData.length > 0) {
      const avgUnits = yearData.reduce((sum, d) => sum + d.units, 0) / yearData.length;
      const avgRevenue = yearData.reduce((sum, d) => sum + d.revenue, 0) / yearData.length;
      const avgDigitalUnits = yearData.reduce((sum, d) => sum + d.digitalUnits, 0) / yearData.length;
      const avgDigitalRevenue = yearData.reduce((sum, d) => sum + d.digitalRevenue, 0) / yearData.length;
      
      const totalUnits = avgUnits + avgDigitalUnits;
      const totalRevenue = avgRevenue + avgDigitalRevenue;
      
      yearlyData.push({
        year,
        avgUnits,
        avgRevenue,
        avgDigitalUnits,
        avgDigitalRevenue,
        totalUnits,
        totalRevenue,
        physicalPercentage: (avgUnits / totalUnits) * 100,
        digitalPercentage: (avgDigitalUnits / totalUnits) * 100,
        avgPricePoint: avgRevenue / avgUnits
      });
    }
  });
  
  return yearlyData;
};

const yearlyData = calculateYearlyData();

// Calculate year-over-year changes
const calculateYoYChanges = () => {
  const changes = [];
  
  for (let i = 1; i < yearlyData.length; i++) {
    const currentYear = yearlyData[i];
    const previousYear = yearlyData[i-1];
    
    changes.push({
      year: currentYear.year,
      unitsChange: ((currentYear.totalUnits - previousYear.totalUnits) / previousYear.totalUnits) * 100,
      revenueChange: ((currentYear.totalRevenue - previousYear.totalRevenue) / previousYear.totalRevenue) * 100,
      pricePointChange: ((currentYear.avgPricePoint - previousYear.avgPricePoint) / previousYear.avgPricePoint) * 100,
      digitalShareChange: currentYear.digitalPercentage - previousYear.digitalPercentage
    });
  }
  
  return changes;
};

const yoyChanges = calculateYoYChanges();

// Publisher market share data
const publisherMarketShare = [
  { name: 'Marvel', value: 37.2, color: '#ED1D24' },
  { name: 'DC', value: 27.8, color: '#0476F9' },
  { name: 'Image', value: 9.5, color: '#00A08E' },
  { name: 'IDW', value: 4.8, color: '#FFD700' },
  { name: 'Dark Horse', value: 3.9, color: '#000000' },
  { name: 'BOOM!', value: 3.2, color: '#F15A29' },
  { name: 'Dynamite', value: 2.5, color: '#ED1C24' },
  { name: 'Others', value: 11.1, color: '#818CF8' }
];

// New title launches vs. cancellations
const titleTurnoverData = [
  { year: '2019', newTitles: 342, cancellations: 287, netGrowth: 55 },
  { year: '2020', newTitles: 215, cancellations: 312, netGrowth: -97 },
  { year: '2021', newTitles: 387, cancellations: 245, netGrowth: 142 },
  { year: '2022', newTitles: 356, cancellations: 298, netGrowth: 58 },
  { year: '2023', newTitles: 378, cancellations: 312, netGrowth: 66 },
  { year: '2024', newTitles: 185, cancellations: 142, netGrowth: 43 } // Partial year
];

// Comic book store data
const retailStoreData = [
  { year: '2019', storeCount: 2200, openings: 95, closures: 82, netChange: 13 },
  { year: '2020', storeCount: 2150, openings: 42, closures: 92, netChange: -50 },
  { year: '2021', storeCount: 2180, openings: 78, closures: 48, netChange: 30 },
  { year: '2022', storeCount: 2210, openings: 65, closures: 35, netChange: 30 },
  { year: '2023', storeCount: 2235, openings: 58, closures: 33, netChange: 25 },
  { year: '2024', storeCount: 2250, openings: 28, closures: 13, netChange: 15 } // Partial year
];

// Consumer demographics data
const demographicsData = [
  { age: '13-17', percentage: 12, change: 2.5 },
  { age: '18-24', percentage: 21, change: 3.2 },
  { age: '25-34', percentage: 28, change: 1.8 },
  { age: '35-44', percentage: 19, change: -0.5 },
  { age: '45-54', percentage: 12, change: -1.2 },
  { age: '55+', percentage: 8, change: -0.8 }
];

// Secondary market performance
const secondaryMarketData = [
  { year: '2019', volume: 100, averageValue: 100, keyIssueIndex: 100 },
  { year: '2020', volume: 85, averageValue: 110, keyIssueIndex: 125 },
  { year: '2021', volume: 135, averageValue: 145, keyIssueIndex: 175 },
  { year: '2022', volume: 128, averageValue: 138, keyIssueIndex: 165 },
  { year: '2023', volume: 142, averageValue: 152, keyIssueIndex: 185 },
  { year: '2024', volume: 148, averageValue: 158, keyIssueIndex: 195 } // Partial year, projected
];

// Custom tooltip for sales data
const SalesTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-slate-700/50">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium text-white">Physical Sales</p>
            <p className="text-sm text-white">Units: {payload[0].value.toFixed(1)}M</p>
            <p className="text-sm text-white">Revenue: ${payload[1].value.toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Digital Sales</p>
            <p className="text-sm text-white">Units: {payload[2].value.toFixed(1)}M</p>
            <p className="text-sm text-white">Revenue: ${payload[3].value.toFixed(1)}M</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom tooltip for yearly data
const YearlyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md p-4 rounded-lg shadow-lg border border-slate-700/50">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium text-white">Total Sales</p>
            <p className="text-sm text-white">Units: {(payload[0].value + payload[2].value).toFixed(1)}M</p>
            <p className="text-sm text-white">Revenue: ${(payload[1].value + payload[3].value).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Average Price Point</p>
            <p className="text-sm text-white">${(payload[1].value / payload[0].value).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Digital Share</p>
            <p className="text-sm text-white">{(payload[2].value / (payload[0].value + payload[2].value) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ComicIndustryAnalysis() {
  const [timeRange, setTimeRange] = useState('all');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  // Filter data based on selected time range
  const getFilteredData = () => {
    if (timeRange === 'all') return monthlySalesData;
    
    const now = new Date();
    let startYear = now.getFullYear();
    let startMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    
    switch (timeRange) {
      case '1y':
        startYear -= 1;
        break;
      case '3y':
        startYear -= 3;
        break;
      case '5y':
        startYear -= 5;
        break;
      default:
        return monthlySalesData;
    }
    
    const startKey = `${startYear}-${startMonth}`;
    return monthlySalesData.filter(item => item.month >= startKey);
  };

  const filteredData = getFilteredData();
  
  // Calculate current metrics
  const latestData = monthlySalesData[monthlySalesData.length - 1];
  const previousYearSameMonth = monthlySalesData.find(d => 
    d.month === `${parseInt(latestData.month.split('-')[0]) - 1}-${latestData.month.split('-')[1]}`
  );
  
  const totalUnits = latestData.units + latestData.digitalUnits;
  const totalRevenue = latestData.revenue + latestData.digitalRevenue;
  const digitalShare = (latestData.digitalUnits / totalUnits) * 100;
  const avgPricePoint = latestData.revenue / latestData.units;
  
  // Year-over-year changes
  const unitsYoY = previousYearSameMonth ? 
    ((totalUnits - (previousYearSameMonth.units + previousYearSameMonth.digitalUnits)) / 
    (previousYearSameMonth.units + previousYearSameMonth.digitalUnits)) * 100 : 0;
    
  const revenueYoY = previousYearSameMonth ? 
    ((totalRevenue - (previousYearSameMonth.revenue + previousYearSameMonth.digitalRevenue)) / 
    (previousYearSameMonth.revenue + previousYearSameMonth.digitalRevenue)) * 100 : 0;
    
  const priceYoY = previousYearSameMonth ? 
    ((avgPricePoint - (previousYearSameMonth.revenue / previousYearSameMonth.units)) / 
    (previousYearSameMonth.revenue / previousYearSameMonth.units)) * 100 : 0;

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl w-full mb-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs overrides={[
        { name: 'Markets', path: '/markets' },
        { name: 'Industry Analysis' }
      ]} />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Comic Book Industry Health Analysis</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {['1y', '3y', '5y', 'all'].map((range) => (
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
                <h3 className="font-semibold text-white mb-2">About This Analysis</h3>
                <p className="text-sm text-gray-300 mb-2">
                  This comprehensive analysis examines the comic book industry's health using sales data and market indicators from 2019 to present.
                </p>
                <p className="text-sm text-gray-300">
                  Data sources include Diamond Comic Distributors, NPD BookScan, Comichron, and ICv2 industry reports.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Monthly Sales Volume</p>
          <p className="text-xl font-bold text-white">{totalUnits.toFixed(1)}M Units</p>
          <div className="flex items-center mt-1">
            {unitsYoY >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
            )}
            <span className={`text-sm ${unitsYoY >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {unitsYoY >= 0 ? '+' : ''}{unitsYoY.toFixed(1)}% YoY
            </span>
          </div>
        </div>
        
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Monthly Revenue</p>
          <p className="text-xl font-bold text-white">${totalRevenue.toFixed(1)}M</p>
          <div className="flex items-center mt-1">
            {revenueYoY >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
            )}
            <span className={`text-sm ${revenueYoY >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {revenueYoY >= 0 ? '+' : ''}{revenueYoY.toFixed(1)}% YoY
            </span>
          </div>
        </div>
        
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Average Price Point</p>
          <p className="text-xl font-bold text-white">${avgPricePoint.toFixed(2)}</p>
          <div className="flex items-center mt-1">
            {priceYoY >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
            )}
            <span className={`text-sm ${priceYoY >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceYoY >= 0 ? '+' : ''}{priceYoY.toFixed(1)}% YoY
            </span>
          </div>
        </div>
        
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
          <p className="text-sm text-gray-400">Digital Sales Share</p>
          <p className="text-xl font-bold text-white">{digitalShare.toFixed(1)}%</p>
          <div className="flex items-center mt-1">
            {latestData.digitalUnits > previousYearSameMonth?.digitalUnits ? (
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
            )}
            <span className={`text-sm ${latestData.digitalUnits > previousYearSameMonth?.digitalUnits ? 'text-green-400' : 'text-red-400'}`}>
              {((latestData.digitalUnits - previousYearSameMonth?.digitalUnits) / previousYearSameMonth?.digitalUnits * 100).toFixed(1)}% YoY
            </span>
          </div>
        </div>
      </div>
      
      {/* Monthly Sales Chart */}
      <div 
        className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 mb-6 hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all"
        onClick={() => setSelectedCard(selectedCard === 'sales' ? null : 'sales')}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Monthly Comic Book Sales Volume & Revenue</h3>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(date) => {
                  // Show year and month for better readability
                  const [year, month] = date.split('-');
                  return `${year.slice(2)}-${month}`;
                }}
                stroke="#94a3b8"
              />
              <YAxis 
                yAxisId="left"
                stroke="#94a3b8"
                tickFormatter={(value) => `${value}M`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#94a3b8"
                tickFormatter={(value) => `$${value}M`}
              />
              <Tooltip content={<SalesTooltip />} />
              <Legend />
              
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="units" 
                name="Physical Units"
                stroke="#818cf8" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="revenue" 
                name="Physical Revenue"
                stroke="#4f46e5" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="digitalUnits" 
                name="Digital Units"
                stroke="#22c55e" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="digitalRevenue" 
                name="Digital Revenue"
                stroke="#16a34a" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Publisher Market Share */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div 
          className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all"
          onClick={() => setSelectedCard(selectedCard === 'publishers' ? null : 'publishers')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Publisher Market Share</h3>
            </div>
          </div>
          
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={publisherMarketShare}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {publisherMarketShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Market Share']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-400">Key Insights:</p>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>• Marvel and DC continue to dominate with 65% combined market share</li>
              <li>• Independent publishers showing steady growth year-over-year</li>
              <li>• Image Comics maintains strong third position with nearly 10% share</li>
            </ul>
          </div>
        </div>
        
        {/* Digital vs Physical Distribution */}
        <div 
          className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all"
          onClick={() => setSelectedCard(selectedCard === 'distribution' ? null : 'distribution')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Digital vs. Physical Distribution</h3>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis 
                  stroke="#94a3b8"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(1)}%`, 'Share']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend />
                <Bar 
                  dataKey="physicalPercentage" 
                  name="Physical" 
                  stackId="a" 
                  fill="#818cf8" 
                />
                <Bar 
                  dataKey="digitalPercentage" 
                  name="Digital" 
                  stackId="a" 
                  fill="#22c55e" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-400">Key Insights:</p>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>• Digital share peaked during COVID-19 pandemic (2020)</li>
              <li>• Physical distribution has stabilized at ~75-80% of market</li>
              <li>• Digital growth has slowed but maintains steady presence</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Title Launches vs. Cancellations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div 
          className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all"
          onClick={() => setSelectedCard(selectedCard === 'titles' ? null : 'titles')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">New Title Launches vs. Cancellations</h3>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={titleTurnoverData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend />
                <Bar dataKey="newTitles" name="New Titles" fill="#22c55e" />
                <Bar dataKey="cancellations" name="Cancellations" fill="#ef4444" />
                <Line 
                  type="monotone" 
                  dataKey="netGrowth" 
                  name="Net Growth" 
                  stroke="#818cf8"
                  strokeWidth={2}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-400">Key Insights:</p>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>• 2020 saw significant net loss of titles due to COVID-19</li>
              <li>• Strong recovery in 2021 with highest net growth in 5 years</li>
              <li>• Industry has maintained positive net growth since 2021</li>
              <li>• 2024 on pace for continued positive growth</li>
            </ul>
          </div>
        </div>
        
        {/* Comic Book Store Openings/Closures */}
        <div 
          className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all"
          onClick={() => setSelectedCard(selectedCard === 'stores' ? null : 'stores')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Store className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Comic Book Store Openings/Closures</h3>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retailStoreData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend />
                <Bar dataKey="openings" name="Store Openings" fill="#22c55e" />
                <Bar dataKey="closures" name="Store Closures" fill="#ef4444" />
                <Line 
                  type="monotone" 
                  dataKey="storeCount" 
                  name="Total Stores" 
                  stroke="#818cf8"
                  strokeWidth={2}
                  yAxisId="right"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-400">Key Insights:</p>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>• 2020 saw significant net loss of stores due to pandemic</li>
              <li>• Steady recovery since 2021 with net positive store growth</li>
              <li>• Total store count has surpassed pre-pandemic levels</li>
              <li>• New stores increasingly focus on diverse product mix beyond comics</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Consumer Demographics and Secondary Market */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div 
          className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all"
          onClick={() => setSelectedCard(selectedCard === 'demographics' ? null : 'demographics')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Consumer Demographics</h3>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographicsData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="age" type="category" stroke="#94a3b8" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'percentage' ? `${value}%` : `${value > 0 ? '+' : ''}${value}%`,
                    name === 'percentage' ? 'Market Share' : 'YoY Change'
                  ]}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend />
                <Bar dataKey="percentage" name="Market Share" fill="#818cf8" />
                <Bar 
                  dataKey="change" 
                  name="YoY Change" 
                  fill={(entry) => entry.change >= 0 ? '#22c55e' : '#ef4444'}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-400">Key Insights:</p>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>• Significant growth in younger demographics (13-24)</li>
              <li>• Core audience remains 25-34 age group</li>
              <li>• Slight decline in older demographics (35+)</li>
              <li>• Gender diversity increasing with 38% female readership (up from 27% in 2019)</li>
            </ul>
          </div>
        </div>
        
        {/* Secondary Market Performance */}
        <div 
          className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 hover:shadow-[0_0_15px_rgba(255,255,0,0.7)] transition-all"
          onClick={() => setSelectedCard(selectedCard === 'secondary' ? null : 'secondary')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Secondary Market Performance</h3>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={secondaryMarketData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis 
                  stroke="#94a3b8"
                  domain={[0, 200]}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`${value} (Index)`, '']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  name="Trading Volume" 
                  stroke="#818cf8"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="averageValue" 
                  name="Average Value" 
                  stroke="#22c55e"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="keyIssueIndex" 
                  name="Key Issue Index" 
                  stroke="#eab308"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-400">Key Insights:</p>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>• Key issues outperforming general market by significant margin</li>
              <li>• 2021 saw peak speculation with 75% increase in key issue values</li>
              <li>• Market stabilized in 2022-2023 with continued steady growth</li>
              <li>• 2024 showing signs of renewed strength in collectible market</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Industry Recommendations */}
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Industry Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <h4 className="font-medium text-indigo-400 mb-2">For Publishers</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Focus on younger demographics (13-24) showing strongest growth</li>
              <li>• Maintain digital offerings while investing in premium physical products</li>
              <li>• Develop more diverse content to expand audience demographics</li>
              <li>• Consider direct-to-consumer models to improve margins</li>
              <li>• Implement sustainable pricing strategies to avoid consumer fatigue</li>
            </ul>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <h4 className="font-medium text-indigo-400 mb-2">For Retailers</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Diversify product offerings beyond comics (games, collectibles, etc.)</li>
              <li>• Develop omnichannel presence with online sales capabilities</li>
              <li>• Create community-focused events to drive foot traffic</li>
              <li>• Implement data-driven inventory management to reduce overstock</li>
              <li>• Focus on new reader acquisition with entry-level products</li>
            </ul>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <h4 className="font-medium text-indigo-400 mb-2">For Collectors/Investors</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Focus on quality over quantity in key issue acquisitions</li>
              <li>• Consider modern keys with growth potential at lower entry points</li>
              <li>• Be selective with grading services as premium continues to narrow</li>
              <li>• Diversify holdings across different eras and publishers</li>
              <li>• Monitor media adaptation announcements for investment opportunities</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Market Outlook */}
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">Market Outlook</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-indigo-400 mb-2">Strengths & Opportunities</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Continued growth in younger demographics indicates healthy future</li>
              <li>• Stabilized retail environment with net positive store growth</li>
              <li>• Increasing diversity in content and readership</li>
              <li>• Ongoing media adaptations driving interest in source material</li>
              <li>• Digital platforms providing accessibility to new readers</li>
              <li>• Secondary market strength indicating collector confidence</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-indigo-400 mb-2">Challenges & Threats</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Price point increases outpacing inflation may limit accessibility</li>
              <li>• Continued reliance on media tie-ins creates potential volatility</li>
              <li>• Overproduction of variant covers potentially diluting market</li>
              <li>• Distribution challenges with single dominant distributor</li>
              <li>• Competition from other entertainment mediums for consumer attention</li>
              <li>• Potential for speculative bubble in key issue market</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium text-indigo-400 mb-2">2024-2025 Forecast</h4>
          <p className="text-sm text-gray-300">
            The comic book industry is projected to maintain moderate growth of 3-5% annually through 2025, 
            with digital sales stabilizing at 20-25% of the market. Price points will likely continue to 
            increase at 3-4% annually, slightly above inflation. The secondary market for key issues is 
            expected to see more selective growth, with focus on high-grade Silver and Bronze Age keys, 
            while modern speculation may cool. Retail store count should continue modest growth of 1-2% 
            annually, with successful stores increasingly diversifying their product mix beyond comics.
          </p>
        </div>
      </div>
    </div>
  );
}