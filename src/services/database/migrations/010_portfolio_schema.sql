```sql
-- Portfolio Management Schema

-- Portfolios
CREATE TABLE portfolios (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  tier VARCHAR(20) NOT NULL,
  balance DECIMAL(15,2) NOT NULL,
  brokers JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Brokers
CREATE TABLE brokers (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  personality JSONB NOT NULL,
  accuracy DECIMAL(4,3) NOT NULL,
  fee_rate DECIMAL(4,2) NOT NULL,
  specialties TEXT[] NOT NULL,
  total_trades INTEGER DEFAULT 0,
  successful_trades INTEGER DEFAULT 0,
  total_profit_loss DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Easter Eggs
CREATE TABLE easter_eggs (
  id UUID PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id),
  type VARCHAR(50) NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  duration INTEGER NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  discovered BOOLEAN DEFAULT false,
  activated BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trades
CREATE TABLE portfolio_trades (
  id UUID PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id),
  broker_id UUID REFERENCES brokers(id),
  symbol VARCHAR(10) NOT NULL,
  type VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  fees DECIMAL(15,2) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_portfolios_user ON portfolios(user_id);
CREATE INDEX idx_easter_eggs_portfolio ON easter_eggs(portfolio_id);
CREATE INDEX idx_portfolio_trades_portfolio ON portfolio_trades(portfolio_id);
CREATE INDEX idx_portfolio_trades_broker ON portfolio_trades(broker_id);
CREATE INDEX idx_portfolio_trades_timestamp ON portfolio_trades(timestamp);

-- Triggers
CREATE TRIGGER update_portfolios_timestamp
    BEFORE UPDATE ON portfolios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brokers_timestamp
    BEFORE UPDATE ON brokers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```