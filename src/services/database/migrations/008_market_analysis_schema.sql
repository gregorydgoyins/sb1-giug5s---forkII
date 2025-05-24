-- Market Analysis Schema

CREATE TABLE market_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP NOT NULL,
  sentiment JSONB NOT NULL,
  volatility DECIMAL(5,4) NOT NULL,
  momentum DECIMAL(5,4) NOT NULL,
  trends JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asset_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(10) NOT NULL,
  market_analysis_id UUID REFERENCES market_analysis(id),
  metrics JSONB NOT NULL,
  correlations JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE correlation_matrices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assets JSONB NOT NULL,
  values JSONB NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_market_analysis_timestamp ON market_analysis(timestamp);
CREATE INDEX idx_asset_analysis_symbol ON asset_analysis(symbol);
CREATE INDEX idx_asset_analysis_timestamp ON asset_analysis(timestamp);
CREATE INDEX idx_correlation_matrices_timestamp ON correlation_matrices(timestamp);

-- Cleanup function
CREATE OR REPLACE FUNCTION cleanup_analysis_data()
RETURNS void AS $$
BEGIN
  -- Keep last 90 days of analysis data
  DELETE FROM asset_analysis 
  WHERE timestamp < NOW() - INTERVAL '90 days';
  
  DELETE FROM market_analysis 
  WHERE timestamp < NOW() - INTERVAL '90 days';
  
  DELETE FROM correlation_matrices 
  WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup
SELECT cron.schedule('0 0 * * 0', $$SELECT cleanup_analysis_data()$$);