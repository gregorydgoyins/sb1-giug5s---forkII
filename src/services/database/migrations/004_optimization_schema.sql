-- Optimization reports schema

CREATE TABLE optimization_reports (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  metrics JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_optimization_reports_timestamp ON optimization_reports(timestamp);
CREATE INDEX idx_optimization_reports_status ON optimization_reports(status);

-- Function to clean up old reports
CREATE OR REPLACE FUNCTION cleanup_old_reports()
RETURNS void AS $$
BEGIN
  DELETE FROM optimization_reports 
  WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup job
SELECT cron.schedule('0 0 * * 0', $$SELECT cleanup_old_reports()$$);