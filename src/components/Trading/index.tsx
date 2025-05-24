'use client';

import React from 'react';
import { TradingInterface } from './Interface';
import { EducationSection } from './Education';
import { PortfolioSection } from './Portfolio';
import { TradingProvider } from './context/TradingContext';

export function Trading() {
  return (
    <TradingProvider>
      <div className="space-y-8">
        <TradingInterface />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PortfolioSection />
          <EducationSection />
        </div>
      </div>
    </TradingProvider>
  );
}