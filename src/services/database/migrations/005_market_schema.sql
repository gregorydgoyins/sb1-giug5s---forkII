-- Market data schema

CREATE TABLE assets (
  id VARCHAR(36) PRIMARY KEY,
  symbol VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asset_prices (
  id SERIAL PRIMARY KEY,
  asset_id VARCHAR(36) REFERENCES assets(id),
  price DECIMAL(15,2) NOT NULL,
  volume INTEGER NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  metrics JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE market_snapshots (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  total_value DECIMAL(15,2) NOT NULL,
  total_volume INTEGER NOT NULL,
  top_gainers JSONB NOT NULL,
  top_losers JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_asset_prices_timestamp ON asset_prices(timestamp);
CREATE INDEX idx_asset_prices_asset_id ON asset_prices(asset_id);
CREATE INDEX idx_market_snapshots_timestamp ON market_snapshots(timestamp);

-- Cleanup function
CREATE OR REPLACE FUNCTION cleanup_market_data()
RETURNS void AS $$
BEGIN
  -- Keep last 90 days of price data
  DELETE FROM asset_prices 
  WHERE timestamp < NOW() - INTERVAL '90 days';
  
  -- Keep last 30 days of snapshots
  DELETE FROM market_snapshots 
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup
SELECT cron.schedule('0 0 * * *', $$SELECT cleanup_market_data()$$);