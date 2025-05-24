-- Monitoring schema for PostgreSQL

CREATE TABLE performance_metrics (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  response_time INTEGER NOT NULL,
  cpu_usage JSONB NOT NULL,
  memory_usage JSONB NOT NULL,
  disk_usage JSONB NOT NULL,
  error_rate DECIMAL(5,4) NOT NULL,
  active_users INTEGER NOT NULL,
  requests_per_minute INTEGER NOT NULL
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  metrics_id INTEGER REFERENCES performance_metrics(id),
  timestamp TIMESTAMP NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
  id UUID PRIMARY KEY,
  time_range_start TIMESTAMP NOT NULL,
  time_range_end TIMESTAMP NOT NULL,
  metrics JSONB NOT NULL,
  alerts JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_performance_metrics_timestamp ON performance_metrics(timestamp);
CREATE INDEX idx_alerts_timestamp ON alerts(timestamp);
CREATE INDEX idx_reports_time_range ON reports(time_range_start, time_range_end);

-- Function to clean up old metrics
CREATE OR REPLACE FUNCTION cleanup_old_metrics()
RETURNS void AS $$
BEGIN
  DELETE FROM performance_metrics 
  WHERE timestamp < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('0 0 * * *', $$SELECT cleanup_old_metrics()$$);