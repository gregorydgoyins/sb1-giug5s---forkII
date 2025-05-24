-- Key Issues Classification Schema

-- Major Key Issues
CREATE TABLE major_key_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_name VARCHAR(255) NOT NULL,
  issue_number VARCHAR(50) NOT NULL,
  publication_date DATE NOT NULL,
  key_event TEXT NOT NULL,
  importance_rating CHAR(1) CHECK (importance_rating IN ('A', 'B', 'C')),
  market_value DECIMAL(15,2) NOT NULL,
  condition_grade VARCHAR(10),
  historical_significance TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Minor Key Issues
CREATE TABLE minor_key_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series_name VARCHAR(255) NOT NULL,
  issue_number VARCHAR(50) NOT NULL,
  publication_date DATE NOT NULL,
  significance_notes TEXT NOT NULL,
  key_designation VARCHAR(2) CHECK (key_designation IN ('M1', 'M2', 'M3')),
  market_value DECIMAL(15,2) NOT NULL,
  condition_grade VARCHAR(10),
  collector_interest_score INTEGER CHECK (collector_interest_score BETWEEN 1 AND 100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Cross-reference tables
CREATE TABLE key_issue_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  major_key_id UUID REFERENCES major_key_issues(id),
  minor_key_id UUID REFERENCES minor_key_issues(id),
  reference_type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE key_issue_valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  major_key_id UUID REFERENCES major_key_issues(id),
  minor_key_id UUID REFERENCES minor_key_issues(id),
  valuation_date DATE NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  source VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_major_key_series ON major_key_issues(series_name, issue_number);
CREATE INDEX idx_minor_key_series ON minor_key_issues(series_name, issue_number);
CREATE INDEX idx_key_valuations_date ON key_issue_valuations(valuation_date);

-- Triggers
CREATE TRIGGER update_major_key_timestamp
    BEFORE UPDATE ON major_key_issues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_minor_key_timestamp
    BEFORE UPDATE ON minor_key_issues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();