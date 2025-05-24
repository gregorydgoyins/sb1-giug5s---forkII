'use client';

import React, { useState } from 'react';
import { Newspaper, TrendingUp, ChevronDown, AlertCircle } from 'lucide-react';
import { NewsSourceDropdown } from './NewsSourceDropdown';
import { MarketEventsList } from './MarketEventsList';
import { ImpactIndicator } from './ImpactIndicator';
import { Container } from '../layout/Container';
import { Flex } from '../layout/Flex';

export function NewsNavigation() {
  const [activeSource, setActiveSource] = useState<string | null>(null);

  return (
    <nav className="sticky top-16 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50">
      <Container>
        <div className="h-14">
          <Flex justify="between" align="center" className="h-full">
            {/* News Sources Section */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Newspaper className="h-6 w-6 text-indigo-400" />
                <span className="text-lg font-medium text-white">News Sources</span>
              </div>
              
              <NewsSourceDropdown 
                activeSource={activeSource}
                onSourceSelect={setActiveSource}
              />
            </div>

            {/* Market Events Section */}
            <div className="flex items-center space-x-4">
              <ImpactIndicator />
              <MarketEventsList />
            </div>
          </Flex>
        </div>
      </Container>
    </nav>
  );
}