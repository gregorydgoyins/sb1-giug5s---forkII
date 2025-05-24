import { ErrorHandler } from '../../utils/errors';
import { DatabaseService } from '../database/DatabaseService';
import { MarketDataService } from '../market/MarketDataService';
import type { Portfolio, Position, Transaction, PortfolioSummary } from './types';

export class PortfolioTracker {
  private static instance: PortfolioTracker;
  private errorHandler: ErrorHandler;
  private db: DatabaseService;
  private marketData: MarketDataService;

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.db = DatabaseService.getInstance();
    this.marketData = MarketDataService.getInstance();
  }

  public static getInstance(): PortfolioTracker {
    if (!PortfolioTracker.instance) {
      PortfolioTracker.instance = new PortfolioTracker();
    }
    return PortfolioTracker.instance;
  }

  public async getPortfolio(userId: string): Promise<Portfolio> {
    return this.errorHandler.withErrorHandling(async () => {
      // Get portfolio data
      const portfolioResult = await this.db.query(
        `SELECT * FROM portfolios WHERE user_id = $1`,
        [userId]
      );
      
      if (portfolioResult.rows.length === 0) {
        // Create new portfolio if it doesn't exist
        return this.createPortfolio(userId);
      }
      
      const portfolio = portfolioResult.rows[0];
      
      // Get positions
      const positions = await this.getPositions(portfolio.id);
      
      // Get transactions
      const transactions = await this.getTransactions(portfolio.id);
      
      return {
        id: portfolio.id,
        userId: portfolio.user_id,
        balance: portfolio.balance,
        positions,
        transactions,
        lastUpdated: portfolio.updated_at
      };
    }, {
      context: 'PortfolioTracker',
      operation: 'getPortfolio',
      userId
    });
  }

  private async createPortfolio(userId: string): Promise<Portfolio> {
    const result = await this.db.query(
      `INSERT INTO portfolios (user_id, balance, created_at, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id`,
      [userId, 2000000] // Start with 2M CC
    );
    
    return {
      id: result.rows[0].id,
      userId,
      balance: 2000000,
      positions: [],
      transactions: [],
      lastUpdated: new Date()
    };
  }

  private async getPositions(portfolioId: string): Promise<Position[]> {
    const result = await this.db.query(
      `SELECT * FROM positions WHERE portfolio_id = $1`,
      [portfolioId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      symbol: row.symbol,
      quantity: row.quantity,
      averagePrice: row.average_price,
      currentPrice: row.current_price,
      value: row.quantity * row.current_price,
      unrealizedPnL: (row.current_price - row.average_price) * row.quantity,
      lastUpdated: row.updated_at
    }));
  }

  private async getTransactions(portfolioId: string): Promise<Transaction[]> {
    const result = await this.db.query(
      `SELECT * FROM transactions 
       WHERE portfolio_id = $1
       ORDER BY created_at DESC`,
      [portfolioId]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      portfolioId: row.portfolio_id,
      symbol: row.symbol,
      type: row.type,
      side: row.side,
      quantity: row.quantity,
      price: row.price,
      total: row.total,
      fees: row.fees,
      timestamp: row.created_at
    }));
  }

  public async executeTransaction(
    userId: string,
    transaction: Omit<Transaction, 'id' | 'portfolioId' | 'timestamp'>
  ): Promise<Transaction> {
    return this.errorHandler.withErrorHandling(async () => {
      // Get portfolio
      const portfolio = await this.getPortfolio(userId);
      
      // Validate transaction
      await this.validateTransaction(portfolio, transaction);
      
      // Execute transaction
      return this.db.transaction(async (trx) => {
        // Insert transaction record
        const transactionResult = await trx.query(
          `INSERT INTO transactions (
            portfolio_id, symbol, type, side, quantity, price, total, fees, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
          RETURNING *`,
          [
            portfolio.id,
            transaction.symbol,
            transaction.type,
            transaction.side,
            transaction.quantity,
            transaction.price,
            transaction.total,
            transaction.fees
          ]
        );
        
        const newTransaction = transactionResult.rows[0];
        
        // Update portfolio balance
        const balanceChange = transaction.side === 'buy' ? -transaction.total : transaction.total;
        await trx.query(
          `UPDATE portfolios 
           SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [balanceChange, portfolio.id]
        );
        
        // Update position
        await this.updatePosition(
          trx,
          portfolio.id,
          transaction.symbol,
          transaction.quantity,
          transaction.price,
          transaction.side
        );
        
        return {
          id: newTransaction.id,
          portfolioId: newTransaction.portfolio_id,
          symbol: newTransaction.symbol,
          type: newTransaction.type,
          side: newTransaction.side,
          quantity: newTransaction.quantity,
          price: newTransaction.price,
          total: newTransaction.total,
          fees: newTransaction.fees,
          timestamp: newTransaction.created_at
        };
      });
    }, {
      context: 'PortfolioTracker',
      operation: 'executeTransaction',
      userId,
      transaction
    });
  }

  private async validateTransaction(
    portfolio: Portfolio,
    transaction: Omit<Transaction, 'id' | 'portfolioId' | 'timestamp'>
  ): Promise<void> {
    // Check if user has enough balance for buy
    if (transaction.side === 'buy' && transaction.total > portfolio.balance) {
      throw new Error('Insufficient funds');
    }
    
    // Check if user has enough shares for sell
    if (transaction.side === 'sell') {
      const position = portfolio.positions.find(p => p.symbol === transaction.symbol);
      if (!position || position.quantity < transaction.quantity) {
        throw new Error('Insufficient shares');
      }
    }
    
    // Additional validations can be added here
  }

  private async updatePosition(
    trx: any,
    portfolioId: string,
    symbol: string,
    quantity: number,
    price: number,
    side: 'buy' | 'sell'
  ): Promise<void> {
    // Check if position exists
    const positionResult = await trx.query(
      `SELECT * FROM positions WHERE portfolio_id = $1 AND symbol = $2`,
      [portfolioId, symbol]
    );
    
    const quantityChange = side === 'buy' ? quantity : -quantity;
    
    if (positionResult.rows.length === 0) {
      // Create new position
      if (side === 'buy') {
        await trx.query(
          `INSERT INTO positions (
            portfolio_id, symbol, quantity, average_price, current_price, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [portfolioId, symbol, quantity, price, price]
        );
      } else {
        throw new Error('Cannot sell a position that does not exist');
      }
    } else {
      // Update existing position
      const position = positionResult.rows[0];
      const newQuantity = position.quantity + quantityChange;
      
      if (newQuantity <= 0) {
        // Close position
        await trx.query(
          `DELETE FROM positions WHERE id = $1`,
          [position.id]
        );
      } else {
        // Update position
        const newAveragePrice = side === 'buy'
          ? (position.average_price * position.quantity + price * quantity) / newQuantity
          : position.average_price;
        
        await trx.query(
          `UPDATE positions 
           SET quantity = $1, average_price = $2, current_price = $3, updated_at = CURRENT_TIMESTAMP
           WHERE id = $4`,
          [newQuantity, newAveragePrice, price, position.id]
        );
      }
    }
  }

  public async getPortfolioSummary(userId: string): Promise<PortfolioSummary> {
    return this.errorHandler.withErrorHandling(async () => {
      const portfolio = await this.getPortfolio(userId);
      
      // Calculate total value
      const totalValue = portfolio.positions.reduce(
        (sum, position) => sum + position.value,
        0
      );
      
      // Calculate total unrealized P&L
      const totalUnrealizedPnL = portfolio.positions.reduce(
        (sum, position) => sum + position.unrealizedPnL,
        0
      );
      
      // Calculate total realized P&L
      const totalRealizedPnL = await this.calculateRealizedPnL(portfolio.id);
      
      // Calculate asset allocation
      const assetAllocation = this.calculateAssetAllocation(portfolio.positions);
      
      return {
        portfolioId: portfolio.id,
        userId: portfolio.userId,
        balance: portfolio.balance,
        totalValue: totalValue + portfolio.balance,
        totalUnrealizedPnL,
        totalRealizedPnL,
        assetAllocation,
        positionCount: portfolio.positions.length,
        lastUpdated: portfolio.lastUpdated
      };
    }, {
      context: 'PortfolioTracker',
      operation: 'getPortfolioSummary',
      userId
    });
  }

  private async calculateRealizedPnL(portfolioId: string): Promise<number> {
    // This would typically involve complex calculations based on transaction history
    // For simplicity, we'll just sum up the realized P&L from closed positions
    const result = await this.db.query(
      `SELECT SUM(realized_pnl) as total FROM closed_positions WHERE portfolio_id = $1`,
      [portfolioId]
    );
    
    return result.rows[0]?.total || 0;
  }

  private calculateAssetAllocation(positions: Position[]): Record<string, number> {
    const totalValue = positions.reduce((sum, position) => sum + position.value, 0);
    
    if (totalValue === 0) {
      return {};
    }
    
    // Group positions by asset type (first 3 characters of symbol)
    const allocation: Record<string, number> = {};
    
    positions.forEach(position => {
      const assetType = this.getAssetType(position.symbol);
      allocation[assetType] = (allocation[assetType] || 0) + (position.value / totalValue);
    });
    
    return allocation;
  }

  private getAssetType(symbol: string): string {
    // Determine asset type based on symbol
    if (symbol.endsWith('C') || symbol.endsWith('P')) {
      return 'Options';
    }
    
    if (['MRVL', 'DCCP', 'IMGC'].includes(symbol)) {
      return 'Publisher';
    }
    
    if (['TMFS', 'JLES', 'DCTS', 'ARTS'].includes(symbol)) {
      return 'Creator';
    }
    
    return 'Comic';
  }

  public async updatePositionPrices(): Promise<void> {
    return this.errorHandler.withErrorHandling(async () => {
      // Get all positions
      const result = await this.db.query(
        `SELECT id, symbol FROM positions`
      );
      
      // Update each position with current market price
      for (const position of result.rows) {
        const marketData = this.marketData.getMarketData(position.symbol);
        if (!marketData) continue;
        
        const currentPrice = marketData.data[marketData.data.length - 1].price;
        
        await this.db.query(
          `UPDATE positions 
           SET current_price = $1, updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [currentPrice, position.id]
        );
      }
    }, {
      context: 'PortfolioTracker',
      operation: 'updatePositionPrices'
    });
  }
}