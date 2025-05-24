-- Initial database schema for Panel Profits

-- Users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  role VARCHAR(20) NOT NULL DEFAULT 'user'
);

-- Portfolio table
CREATE TABLE portfolios (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_value DECIMAL(15,2) NOT NULL DEFAULT 0,
  cash_balance DECIMAL(15,2) NOT NULL DEFAULT 0
);

-- Assets table
CREATE TABLE assets (
  id VARCHAR(36) PRIMARY KEY,
  symbol VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  current_price DECIMAL(15,2),
  market_cap DECIMAL(20,2),
  volume DECIMAL(15,2)
);

-- Positions table
CREATE TABLE positions (
  id VARCHAR(36) PRIMARY KEY,
  portfolio_id VARCHAR(36) NOT NULL REFERENCES portfolios(id),
  asset_id VARCHAR(36) NOT NULL REFERENCES assets(id),
  quantity DECIMAL(15,6) NOT NULL,
  average_price DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  realized_pnl DECIMAL(15,2) NOT NULL DEFAULT 0,
  unrealized_pnl DECIMAL(15,2) NOT NULL DEFAULT 0
);

-- Trades table
CREATE TABLE trades (
  id VARCHAR(36) PRIMARY KEY,
  portfolio_id VARCHAR(36) NOT NULL REFERENCES portfolios(id),
  asset_id VARCHAR(36) NOT NULL REFERENCES assets(id),
  type VARCHAR(20) NOT NULL,
  side VARCHAR(10) NOT NULL,
  quantity DECIMAL(15,6) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  fees DECIMAL(15,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL,
  executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_positions_portfolio ON positions(portfolio_id);
CREATE INDEX idx_positions_asset ON positions(asset_id);
CREATE INDEX idx_trades_portfolio ON trades(portfolio_id);
CREATE INDEX idx_trades_asset ON trades(asset_id);
CREATE INDEX idx_trades_executed_at ON trades(executed_at);

-- Add audit timestamps trigger
CREATE TRIGGER update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
END;