import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { PortfolioSummary } from './PortfolioSummary';
import { PortfolioPositions } from './PortfolioPositions';
import { PortfolioTransactions } from './PortfolioTransactions';
import { Breadcrumbs } from './common/Breadcrumbs';

export function PortfolioOverview() {
  const [activeTab, setActiveTab] = useState('summary');
  
  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <h1 className="text-3xl font-bold text-white mb-6">Portfolio Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 p-1 rounded-lg">
          <TabsTrigger 
            value="summary" 
            className={`px-4 py-2 rounded-md ${
              activeTab === 'summary' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Summary
          </TabsTrigger>
          <TabsTrigger 
            value="positions" 
            className={`px-4 py-2 rounded-md ${
              activeTab === 'positions' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Positions
          </TabsTrigger>
          <TabsTrigger 
            value="transactions" 
            className={`px-4 py-2 rounded-md ${
              activeTab === 'transactions' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Transactions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <PortfolioSummary />
        </TabsContent>
        
        <TabsContent value="positions">
          <PortfolioPositions />
        </TabsContent>
        
        <TabsContent value="transactions">
          <PortfolioTransactions />
        </TabsContent>
      </Tabs>
    </div>
  );
}