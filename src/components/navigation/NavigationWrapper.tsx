'use client';

import React from 'react';
import { MainNavigation } from './MainNavigation';
import { MarketNewsBar } from './MarketNewsBar';

export function NavigationWrapper() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <MainNavigation />
      <MarketNewsBar />
    </div>
  );
}