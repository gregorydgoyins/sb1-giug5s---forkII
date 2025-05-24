import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../../utils/errors';
import { DatabaseService } from '../database/DatabaseService';
import crypto from 'crypto';

export class TokenService {
  private errorHandler: ErrorHandler;
  private db: DatabaseService;
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'panel-profits-secret-key';
  private readonly ACCESS_TOKEN_EXPIRY = '1h';
  private readonly REFRESH_TOKEN_EXPIRY = '7d';

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.db = DatabaseService.getInstance();
  }

  public generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  public async generateAuthToken(userId: string): Promise<string> {
    return this.errorHandler.withErrorHandling(async () => {
      // Generate JWT token
      const token = jwt.sign(
        { userId },
        this.JWT_SECRET,
        { expiresIn: this.ACCESS_TOKEN_EXPIRY }
      );
      
      // Store token in database for tracking
      await this.db.query(
        `INSERT INTO auth_tokens (
          user_id, token, expires_at, created_at
        ) VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '1 hour', CURRENT_TIMESTAMP)`,
        [userId, token]
      );
      
      return token;
    }, {
      context: 'TokenService',
      operation: 'generateAuthToken'
    });
  }

  public async generateRefreshToken(userId: string): Promise<string> {
    return this.errorHandler.withErrorHandling(async () => {
      // Generate refresh token
      const refreshToken = this.generateToken();
      
      // Store refresh token in database
      await this.db.query(
        `INSERT INTO refresh_tokens (
          user_id, token, expires_at, created_at
        ) VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '7 days', CURRENT_TIMESTAMP)`,
        [userId, refreshToken]
      );
      
      return refreshToken;
    }, {
      context: 'TokenService',
      operation: 'generateRefreshToken'
    });
  }

  public async verifyToken(token: string): Promise<{ userId: string } | null> {
    return this.errorHandler.withErrorHandling(async () => {
      try {
        // Verify JWT token
        const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };
        
        // Check if token exists in database and is not revoked
        const result = await this.db.query(
          `SELECT user_id FROM auth_tokens 
           WHERE token = $1 AND revoked = false AND expires_at > CURRENT_TIMESTAMP`,
          [token]
        );
        
        if (result.rows.length === 0) {
          return null;
        }
        
        return { userId: decoded.userId };
      } catch (error) {
        return null;
      }
    }, {
      context: 'TokenService',
      operation: 'verifyToken'
    });
  }

  public async refreshAccessToken(refreshToken: string): Promise<{ token: string; userId: string }> {
    return this.errorHandler.withErrorHandling(async () => {
      // Find refresh token in database
      const result = await this.db.query(
        `SELECT user_id, expires_at FROM refresh_tokens 
         WHERE token = $1 AND revoked = false`,
        [refreshToken]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Invalid refresh token');
      }
      
      const { user_id, expires_at } = result.rows[0];
      
      // Check if token is expired
      if (new Date(expires_at) < new Date()) {
        throw new Error('Refresh token has expired');
      }
      
      // Generate new access token
      const newToken = await this.generateAuthToken(user_id);
      
      return { token: newToken, userId: user_id };
    }, {
      context: 'TokenService',
      operation: 'refreshAccessToken'
    });
  }

  public async revokeToken(token: string): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      // Revoke token in database
      const result = await this.db.query(
        `UPDATE auth_tokens SET 
         revoked = true, 
         revoked_at = CURRENT_TIMESTAMP
         WHERE token = $1`,
        [token]
      );
      
      return result.rowCount > 0;
    }, {
      context: 'TokenService',
      operation: 'revokeToken'
    });
  }

  public async revokeRefreshToken(token: string): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      // Revoke refresh token in database
      const result = await this.db.query(
        `UPDATE refresh_tokens SET 
         revoked = true, 
         revoked_at = CURRENT_TIMESTAMP
         WHERE token = $1`,
        [token]
      );
      
      return result.rowCount > 0;
    }, {
      context: 'TokenService',
      operation: 'revokeRefreshToken'
    });
  }

  public async invalidateUserTokens(userId: string): Promise<void> {
    return this.errorHandler.withErrorHandling(async () => {
      // Revoke all tokens for user
      await this.db.query(
        `UPDATE auth_tokens SET 
         revoked = true, 
         revoked_at = CURRENT_TIMESTAMP
         WHERE user_id = $1 AND revoked = false`,
        [userId]
      );
      
      // Revoke all refresh tokens for user
      await this.db.query(
        `UPDATE refresh_tokens SET 
         revoked = true, 
         revoked_at = CURRENT_TIMESTAMP
         WHERE user_id = $1 AND revoked = false`,
        [userId]
      );
    }, {
      context: 'TokenService',
      operation: 'invalidateUserTokens'
    });
  }

  public async cleanupExpiredTokens(): Promise<void> {
    return this.errorHandler.withErrorHandling(async () => {
      // Delete expired tokens
      await this.db.query(
        `DELETE FROM auth_tokens WHERE expires_at < CURRENT_TIMESTAMP`
      );
      
      // Delete expired refresh tokens
      await this.db.query(
        `DELETE FROM refresh_tokens WHERE expires_at < CURRENT_TIMESTAMP`
      );
    }, {
      context: 'TokenService',
      operation: 'cleanupExpiredTokens'
    });
  }
}