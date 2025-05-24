-- Portfolio Management Schema

-- Portfolios table
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  balance DECIMAL(15,2) NOT NULL DEFAULT 2000000, -- Starting with 2M CC
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Positions table
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id),
  symbol VARCHAR(20) NOT NULL,
  quantity DECIMAL(15,6) NOT NULL,
  average_price DECIMAL(15,2) NOT NULL,
  current_price DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT positive_quantity CHECK (quantity > 0)
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id),
  symbol VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL,
  side VARCHAR(10) NOT NULL,
  quantity DECIMAL(15,6) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  fees DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_type CHECK (type IN ('market', 'limit')),
  CONSTRAINT valid_side CHECK (side IN ('buy', 'sell')),
  CONSTRAINT positive_quantity CHECK (quantity > 0),
  CONSTRAINT positive_price CHECK (price > 0)
);

-- Closed positions table (for tracking realized P&L)
CREATE TABLE closed_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id),
  symbol VARCHAR(20) NOT NULL,
  quantity DECIMAL(15,6) NOT NULL,
  entry_price DECIMAL(15,2) NOT NULL,
  exit_price DECIMAL(15,2) NOT NULL,
  realized_pnl DECIMAL(15,2) NOT NULL,
  entry_date TIMESTAMP NOT NULL,
  exit_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT positive_quantity CHECK (quantity > 0)
);

-- Watchlist table
CREATE TABLE watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  symbol VARCHAR(20) NOT NULL,
  price_alert DECIMAL(15,2),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_watchlist_item UNIQUE (user_id, symbol)
);

-- Alerts table
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  symbol VARCHAR(20) NOT NULL,
  target_price DECIMAL(15,2) NOT NULL,
  condition VARCHAR(10) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  triggered_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_condition CHECK (condition IN ('above', 'below'))
);

-- Indexes
CREATE INDEX idx_positions_portfolio ON positions(portfolio_id);
CREATE INDEX idx_positions_symbol ON positions(symbol);
CREATE INDEX idx_transactions_portfolio ON transactions(portfolio_id);
CREATE INDEX idx_transactions_symbol ON transactions(symbol);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_closed_positions_portfolio ON closed_positions(portfolio_id);
CREATE INDEX idx_closed_positions_symbol ON closed_positions(symbol);
CREATE INDEX idx_watchlist_user ON watchlist_items(user_id);
CREATE INDEX idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_symbol ON price_alerts(symbol);

-- Triggers for updated_at
CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON portfolios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at
    BEFORE UPDATE ON positions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_watchlist_items_updated_at
    BEFORE UPDATE ON watchlist_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();