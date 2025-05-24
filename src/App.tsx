import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Markets } from './components/Markets';
import { Portfolio } from './components/Portfolio';
import { Trading } from './components/Trading';
import { News } from './components/News';
import { NewsArticle } from './components/NewsArticle';
import { Learn } from './components/Learn';
import { ResearchReport } from './components/research/ResearchReport';
import { ComicMarketIndex } from './components/ComicMarketIndex';
import { ComicPriceTrends } from './components/ComicPriceTrends';
import { ComicMarketIndexGlow } from './components/ComicMarketIndexGlow';
import { ComicMarketIndexTrend } from './components/ComicMarketIndexTrend';
import { PortfolioOverview } from './components/PortfolioOverview';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/market-index" element={<ComicMarketIndexTrend />} />
        <Route path="/price-trends" element={<ComicPriceTrends />} />
        <Route path="/portfolio" element={<PortfolioOverview />} />
        <Route path="/trading" element={<Trading />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsArticle />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/research" element={<ResearchReport />} />
      </Routes>
    </Layout>
  );
}

export default App;