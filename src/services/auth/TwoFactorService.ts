import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { ErrorHandler } from '../../utils/errors';
import { DatabaseService } from '../database/DatabaseService';
import crypto from 'crypto';

export class TwoFactorService {
  private errorHandler: ErrorHandler;
  private db: DatabaseService;
  private readonly APP_NAME = 'Panel Profits';
  private readonly BACKUP_CODES_COUNT = 10;
  private readonly BACKUP_CODE_LENGTH = 10;

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.db = DatabaseService.getInstance();
  }

  public async generateSecret(username: string): Promise<{ secret: string; qrCode: string }> {
    return this.errorHandler.withErrorHandling(async () => {
      // Generate secret
      const secret = authenticator.generateSecret();
      
      // Generate QR code
      const otpauth = authenticator.keyuri(username, this.APP_NAME, secret);
      const qrCode = await QRCode.toDataURL(otpauth);
      
      return { secret, qrCode };
    }, {
      context: 'TwoFactorService',
      operation: 'generateSecret'
    });
  }

  public verifyCodeWithSecret(token: string, secret: string): boolean {
    try {
      return authenticator.verify({ token, secret });
    } catch (error) {
      return false;
    }
  }

  public async verifyCode(userId: string, token: string): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      // Get user's 2FA secret
      const result = await this.db.query(
        `SELECT two_factor_secret FROM users WHERE id = $1 AND two_factor_enabled = true`,
        [userId]
      );
      
      if (result.rows.length === 0 || !result.rows[0].two_factor_secret) {
        throw new Error('Two-factor authentication not enabled');
      }
      
      const { two_factor_secret } = result.rows[0];
      
      // Check if token is a backup code
      const isBackupCode = await this.verifyBackupCode(userId, token);
      if (isBackupCode) {
        return true;
      }
      
      // Verify TOTP code
      return this.verifyCodeWithSecret(token, two_factor_secret);
    }, {
      context: 'TwoFactorService',
      operation: 'verifyCode'
    });
  }

  public async generateBackupCodes(userId: string): Promise<string[]> {
    return this.errorHandler.withErrorHandling(async () => {
      // Generate backup codes
      const backupCodes: string[] = [];
      for (let i = 0; i < this.BACKUP_CODES_COUNT; i++) {
        backupCodes.push(this.generateBackupCode());
      }
      
      // Store hashed backup codes
      await this.db.transaction(async (trx) => {
        // Delete existing backup codes
        await trx.query(
          `DELETE FROM two_factor_backup_codes WHERE user_id = $1`,
          [userId]
        );
        
        // Insert new backup codes
        for (const code of backupCodes) {
          const hashedCode = await this.hashBackupCode(code);
          await trx.query(
            `INSERT INTO two_factor_backup_codes (
              user_id, code_hash, used, created_at
            ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
            [userId, hashedCode, false]
          );
        }
      });
      
      return backupCodes;
    }, {
      context: 'TwoFactorService',
      operation: 'generateBackupCodes'
    });
  }

  private generateBackupCode(): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < this.BACKUP_CODE_LENGTH; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Format as XXXX-XXXX-XX
    return `${code.substring(0, 4)}-${code.substring(4, 8)}-${code.substring(8, 10)}`;
  }

  private async hashBackupCode(code: string): Promise<string> {
    // Remove formatting
    const cleanCode = code.replace(/-/g, '');
    
    // Use simple hash for backup codes
    return crypto.createHash('sha256').update(cleanCode).digest('hex');
  }

  private async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    // Remove formatting
    const cleanCode = code.replace(/-/g, '');
    
    // Hash the code
    const hashedCode = await this.hashBackupCode(cleanCode);
    
    // Check if code exists and is unused
    const result = await this.db.query(
      `SELECT id FROM two_factor_backup_codes 
       WHERE user_id = $1 AND code_hash = $2 AND used = false`,
      [userId, hashedCode]
    );
    
    if (result.rows.length === 0) {
      return false;
    }
    
    // Mark code as used
    await this.db.query(
      `UPDATE two_factor_backup_codes SET 
       used = true, 
       used_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [result.rows[0].id]
    );
    
    return true;
  }

  public async getRemainingBackupCodes(userId: string): Promise<number> {
    return this.errorHandler.withErrorHandling(async () => {
      const result = await this.db.query(
        `SELECT COUNT(*) as count FROM two_factor_backup_codes 
         WHERE user_id = $1 AND used = false`,
        [userId]
      );
      
      return parseInt(result.rows[0].count, 10);
    }, {
      context: 'TwoFactorService',
      operation: 'getRemainingBackupCodes'
    });
  }
}