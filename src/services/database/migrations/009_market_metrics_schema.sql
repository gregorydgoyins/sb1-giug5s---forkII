```sql
-- Market Metrics Schema

CREATE TABLE market_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP NOT NULL,
  snapshot JSONB NOT NULL,
  sentiment DECIMAL(5,4) NOT NULL,
  volatility DECIMAL(5,4) NOT NULL,
  momentum DECIMAL(5,4) NOT NULL,
  trends JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asset_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(10) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  volume INTEGER NOT NULL,
  market_cap DECIMAL(15,2) NOT NULL,
  volatility DECIMAL(5,4) NOT NULL,
  momentum DECIMAL(5,4) NOT NULL,
  sentiment DECIMAL(5,4) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historical_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  value DECIMAL(15,4) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_market_metrics_timestamp ON market_metrics(timestamp);
CREATE INDEX idx_asset_metrics_symbol_timestamp ON asset_metrics(symbol, timestamp);
CREATE INDEX idx_historical_metrics_date ON historical_metrics(metric_date);

-- Cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_metrics()
RETURNS void AS $$
BEGIN
  -- Keep last 30 days of detailed metrics
  DELETE FROM market_metrics 
  WHERE timestamp < NOW() - INTERVAL '30 days';
  
  DELETE FROM asset_metrics 
  WHERE timestamp < NOW() - INTERVAL '30 days';
  
  -- Keep historical metrics indefinitely
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup
SELECT cron.schedule('0 0 * * 0', $$SELECT cleanup_old_metrics()$$);
```