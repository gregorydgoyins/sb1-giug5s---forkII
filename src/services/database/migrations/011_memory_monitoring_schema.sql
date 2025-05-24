-- Memory Monitoring Schema

CREATE TABLE memory_stats (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  heap_used BIGINT NOT NULL,
  heap_total BIGINT NOT NULL,
  usage_percentage DECIMAL(5,4) NOT NULL,
  rss BIGINT NOT NULL,
  external BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE memory_alerts (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  usage_percentage DECIMAL(5,4) NOT NULL,
  heap_used BIGINT NOT NULL,
  heap_total BIGINT NOT NULL,
  action_taken TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_memory_stats_timestamp ON memory_stats(timestamp);
CREATE INDEX idx_memory_alerts_timestamp ON memory_alerts(timestamp);

-- Cleanup function
CREATE OR REPLACE FUNCTION cleanup_memory_stats()
RETURNS void AS $$
BEGIN
  DELETE FROM memory_stats 
  WHERE timestamp < NOW() - INTERVAL '7 days';
  
  DELETE FROM memory_alerts 
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup
SELECT cron.schedule('0 0 * * *', $$SELECT cleanup_memory_stats()$$);