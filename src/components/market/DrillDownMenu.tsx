import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useMarketStore } from '../../store/marketStore';
import type { MarketCategory, MarketLevel } from './types';

interface DrillDownMenuProps {
  onSelect?: (category: string, level: string) => void;
}

const MARKET_HIERARCHY: MarketCategory[] = [
  {
    id: 'comics',
    name: 'Comic Books',
    levels: [
      {
        id: 'age',
        name: 'By Age',
        items: [
          { id: 'golden', name: 'Golden Age', value: 3200000, change: 5.2 },
          { id: 'silver', name: 'Silver Age', value: 2800000, change: 3.8 },
          { id: 'bronze', name: 'Bronze Age', value: 2100000, change: -2.1 },
          { id: 'copper', name: 'Copper Age', value: 1500000, change: 1.5 },
          { id: 'modern', name: 'Modern Age', value: 950000, change: 4.2 }
        ]
      },
      {
        id: 'publisher',
        name: 'By Publisher',
        items: [
          { id: 'marvel', name: 'Marvel Comics', value: 4200000, change: 3.5 },
          { id: 'dc', name: 'DC Comics', value: 3800000, change: -1.8 },
          { id: 'image', name: 'Image Comics', value: 1200000, change: 2.4 },
          { id: 'dark-horse', name: 'Dark Horse', value: 850000, change: 1.2 }
        ]
      }
    ]
  },
  {
    id: 'creators',
    name: 'Creators',
    levels: [
      {
        id: 'role',
        name: 'By Role',
        items: [
          { id: 'writers', name: 'Writers', value: 2500000, change: 4.1 },
          { id: 'artists', name: 'Artists', value: 2200000, change: 3.2 },
          { id: 'cover-artists', name: 'Cover Artists', value: 1800000, change: -1.5 },
          { id: 'editors', name: 'Editors', value: 1200000, change: 2.1 }
        ]
      },
      {
        id: 'era',
        name: 'By Era',
        items: [
          { id: 'classic', name: 'Classic Era', value: 3100000, change: 2.8 },
          { id: 'modern', name: 'Modern Era', value: 2400000, change: 4.5 },
          { id: 'contemporary', name: 'Contemporary', value: 1900000, change: -2.1 }
        ]
      }
    ]
  },
  {
    id: 'publishers',
    name: 'Publishers',
    levels: [
      {
        id: 'market-cap',
        name: 'By Market Cap',
        items: [
          { id: 'large-cap', name: 'Large Cap', value: 5200000, change: 2.4 },
          { id: 'mid-cap', name: 'Mid Cap', value: 2800000, change: 3.1 },
          { id: 'small-cap', name: 'Small Cap', value: 1500000, change: -1.8 }
        ]
      },
      {
        id: 'region',
        name: 'By Region',
        items: [
          { id: 'north-america', name: 'North America', value: 4800000, change: 3.2 },
          { id: 'europe', name: 'Europe', value: 2100000, change: 1.8 },
          { id: 'asia', name: 'Asia', value: 1800000, change: 4.5 }
        ]
      }
    ]
  }
];

export function DrillDownMenu({ onSelect }: DrillDownMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    try {
      setSelectedCategory(categoryId);
      setSelectedLevel(null);
      onSelect?.(categoryId, '');
    } catch (error) {
      setError('Failed to load category');
      console.error('Category selection error:', error);
    }
  };

  const handleLevelSelect = (levelId: string) => {
    try {
      setSelectedLevel(levelId);
      onSelect?.(selectedCategory!, levelId);
    } catch (error) {
      setError('Failed to load level');
      console.error('Level selection error:', error);
    }
  };

  const handleBack = () => {
    if (selectedLevel) {
      setSelectedLevel(null);
    } else {
      setSelectedCategory(null);
    }
    setError(null);
  };

  const renderCategoryList = () => (
    <div className="space-y-2" role="menu">
      {MARKET_HIERARCHY.map(category => (
        <button
          key={category.id}
          onClick={() => handleCategorySelect(category.id)}
          className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          role="menuitem"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">{category.name}</span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </button>
      ))}
    </div>
  );

  const renderLevelList = () => {
    const category = MARKET_HIERARCHY.find(c => c.id === selectedCategory);
    if (!category) return null;

    return (
      <div className="space-y-2" role="menu">
        {category.levels.map(level => (
          <button
            key={level.id}
            onClick={() => handleLevelSelect(level.id)}
            className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            role="menuitem"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">{level.name}</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderItemList = () => {
    const category = MARKET_HIERARCHY.find(c => c.id === selectedCategory);
    const level = category?.levels.find(l => l.id === selectedLevel);
    if (!category || !level) return null;

    return (
      <div className="space-y-2" role="menu">
        {level.items.map(item => (
          <div
            key={item.id}
            className="p-4 bg-slate-700/50 border border-slate-600/50 rounded-lg"
            role="menuitem"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-white">{item.name}</span>
              <div className={`flex items-center space-x-1 ${
                item.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {item.change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{item.change >= 0 ? '+' : ''}{item.change}%</span>
              </div>
            </div>
            <div className="text-gray-300">
              CC {item.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="card" role="navigation" aria-label="Market navigation">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {(selectedCategory || selectedLevel) && (
            <button
              onClick={handleBack}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h2 className="text-xl font-bold text-white">
            {selectedLevel ? 
              MARKET_HIERARCHY.find(c => c.id === selectedCategory)?.levels.find(l => l.id === selectedLevel)?.name :
              selectedCategory ? 
                MARKET_HIERARCHY.find(c => c.id === selectedCategory)?.name :
                'Markets'
            }
          </h2>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700/50 rounded-lg flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {!selectedCategory && renderCategoryList()}
        {selectedCategory && !selectedLevel && renderLevelList()}
        {selectedCategory && selectedLevel && renderItemList()}
      </div>
    </div>
  );
}