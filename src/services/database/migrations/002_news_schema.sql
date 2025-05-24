-- News schema for PostgreSQL

CREATE TABLE news_sources (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  reliability DECIMAL(4,3) NOT NULL,
  last_fetch TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news_items (
  id VARCHAR(36) PRIMARY KEY,
  source_id VARCHAR(36) REFERENCES news_sources(id),
  title TEXT NOT NULL,
  content TEXT,
  url TEXT,
  published_at TIMESTAMP NOT NULL,
  fetched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  impact VARCHAR(20),
  sentiment DECIMAL(4,3),
  category VARCHAR(50),
  related_symbols TEXT[],
  tags TEXT[],
  metadata JSONB
);

CREATE TABLE market_impacts (
  id VARCHAR(36) PRIMARY KEY,
  news_id VARCHAR(36) REFERENCES news_items(id),
  symbol VARCHAR(20),
  impact_score DECIMAL(4,3),
  price_change DECIMAL(15,2),
  volume_change DECIMAL(15,2),
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_news_published_at ON news_items(published_at);
CREATE INDEX idx_news_impact ON news_items(impact);
CREATE INDEX idx_news_category ON news_items(category);
CREATE INDEX idx_market_impacts_symbol ON market_impacts(symbol);
CREATE INDEX idx_market_impacts_timestamp ON market_impacts(timestamp);

-- Function to update timestamp on record changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_news_sources_timestamp
    BEFORE UPDATE ON news_sources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();