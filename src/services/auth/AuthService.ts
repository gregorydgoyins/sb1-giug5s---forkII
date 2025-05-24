import { ErrorHandler } from '../../utils/errors';
import { DatabaseService } from '../database/DatabaseService';
import { RateLimiter } from '../../utils/security/RateLimiter';
import { EmailService } from './EmailService';
import { TwoFactorService } from './TwoFactorService';
import { PasswordService } from './PasswordService';
import { TokenService } from './TokenService';
import type { User, LoginAttempt, VerificationToken, AccountStatus } from './types';

export class AuthService {
  private static instance: AuthService;
  private errorHandler: ErrorHandler;
  private db: DatabaseService;
  private rateLimiter: RateLimiter;
  private emailService: EmailService;
  private twoFactorService: TwoFactorService;
  private passwordService: PasswordService;
  private tokenService: TokenService;
  
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly VERIFICATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance();
    this.db = DatabaseService.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.emailService = new EmailService();
    this.twoFactorService = new TwoFactorService();
    this.passwordService = new PasswordService();
    this.tokenService = new TokenService();
    
    // Initialize rate limiters
    this.rateLimiter.createLimiter('login', 10, 60 * 1000); // 10 attempts per minute
    this.rateLimiter.createLimiter('register', 5, 60 * 1000); // 5 attempts per minute
    this.rateLimiter.createLimiter('password-reset', 3, 60 * 1000); // 3 attempts per minute
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async register(userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    dateOfBirth: string;
  }): Promise<{ userId: string; verificationToken: string }> {
    return this.errorHandler.withErrorHandling(async () => {
      // Check rate limit
      await this.rateLimiter.consume('register');
      
      // Validate input
      this.validateRegistrationData(userData);
      
      // Check if username or email already exists
      await this.checkUserExists(userData.username, userData.email);
      
      // Hash password
      const hashedPassword = await this.passwordService.hashPassword(userData.password);
      
      // Create user
      const userId = await this.createUser({
        ...userData,
        password: hashedPassword,
        status: 'pending_verification'
      });
      
      // Generate verification token
      const verificationToken = await this.createVerificationToken(userId);
      
      // Send verification email
      await this.emailService.sendVerificationEmail(
        userData.email,
        userData.username,
        verificationToken
      );
      
      return { userId, verificationToken };
    }, {
      context: 'AuthService',
      operation: 'register'
    });
  }

  private validateRegistrationData(userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    dateOfBirth: string;
  }): void {
    // Username validation
    if (!userData.username || userData.username.length < 4) {
      throw new Error('Username must be at least 4 characters long');
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }
    
    // Email validation
    if (!userData.email || !this.isValidEmail(userData.email)) {
      throw new Error('Please provide a valid email address');
    }
    
    // Password validation
    if (!userData.password || userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(userData.password)) {
      throw new Error('Password must include uppercase, lowercase, number, and special character');
    }
    
    // Name validation
    if (!userData.name || userData.name.trim().length === 0) {
      throw new Error('Name is required');
    }
    
    // Date of birth validation
    if (!userData.dateOfBirth) {
      throw new Error('Date of birth is required');
    }
    
    const dob = new Date(userData.dateOfBirth);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear();
    
    if (isNaN(dob.getTime()) || age < 13) {
      throw new Error('You must be at least 13 years old to register');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async checkUserExists(username: string, email: string): Promise<void> {
    const result = await this.db.query(
      `SELECT username, email FROM users WHERE username = $1 OR email = $2`,
      [username, email]
    );
    
    if (result.rows.length > 0) {
      const existingUser = result.rows[0];
      if (existingUser.username === username) {
        throw new Error('Username already taken');
      }
      if (existingUser.email === email) {
        throw new Error('Email already registered');
      }
    }
  }

  private async createUser(userData: {
    username: string;
    email: string;
    password: string;
    name: string;
    dateOfBirth: string;
    status: AccountStatus;
  }): Promise<string> {
    const result = await this.db.query(
      `INSERT INTO users (
        username, email, password_hash, name, date_of_birth, status, 
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id`,
      [
        userData.username,
        userData.email,
        userData.password,
        userData.name,
        userData.dateOfBirth,
        userData.status
      ]
    );
    
    // Initialize player statistics
    await this.db.query(
      `INSERT INTO player_statistics (
        user_id, balance, created_at, updated_at
      ) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [result.rows[0].id, 2000000] // Start with 2M CC
    );
    
    return result.rows[0].id;
  }

  private async createVerificationToken(userId: string): Promise<string> {
    const token = this.tokenService.generateToken();
    const expiresAt = new Date(Date.now() + this.VERIFICATION_EXPIRY);
    
    await this.db.query(
      `INSERT INTO verification_tokens (
        user_id, token, type, expires_at, created_at
      ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
      [userId, token, 'email_verification', expiresAt]
    );
    
    return token;
  }

  public async verifyEmail(token: string): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      // Find token
      const result = await this.db.query(
        `SELECT user_id, expires_at FROM verification_tokens 
         WHERE token = $1 AND type = $2`,
        [token, 'email_verification']
      );
      
      if (result.rows.length === 0) {
        throw new Error('Invalid verification token');
      }
      
      const { user_id, expires_at } = result.rows[0];
      
      // Check if token is expired
      if (new Date(expires_at) < new Date()) {
        throw new Error('Verification token has expired');
      }
      
      // Update user status
      await this.db.query(
        `UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        ['active', user_id]
      );
      
      // Delete used token
      await this.db.query(
        `DELETE FROM verification_tokens WHERE token = $1`,
        [token]
      );
      
      return true;
    }, {
      context: 'AuthService',
      operation: 'verifyEmail'
    });
  }

  public async login(username: string, password: string, ip: string): Promise<{
    userId: string;
    token: string;
    requiresTwoFactor: boolean;
  }> {
    return this.errorHandler.withErrorHandling(async () => {
      // Check rate limit
      await this.rateLimiter.consume('login', 1, ip);
      
      // Check if account is locked
      await this.checkAccountLock(username);
      
      // Find user
      const user = await this.findUserByUsername(username);
      
      if (!user) {
        await this.recordFailedLogin(username, ip);
        throw new Error('Invalid username or password');
      }
      
      // Check account status
      if (user.status === 'pending_verification') {
        throw new Error('Please verify your email before logging in');
      }
      
      if (user.status === 'suspended') {
        throw new Error('Your account has been suspended. Please contact support.');
      }
      
      // Verify password
      const isPasswordValid = await this.passwordService.verifyPassword(
        password,
        user.password_hash
      );
      
      if (!isPasswordValid) {
        await this.recordFailedLogin(username, ip);
        throw new Error('Invalid username or password');
      }
      
      // Reset failed login attempts
      await this.resetFailedLogins(username);
      
      // Record login
      await this.recordSuccessfulLogin(user.id, ip);
      
      // Check if 2FA is enabled
      const requiresTwoFactor = user.two_factor_enabled;
      
      // Generate auth token if 2FA not required
      const token = requiresTwoFactor ? '' : await this.tokenService.generateAuthToken(user.id);
      
      return {
        userId: user.id,
        token,
        requiresTwoFactor
      };
    }, {
      context: 'AuthService',
      operation: 'login'
    });
  }

  private async checkAccountLock(username: string): Promise<void> {
    const result = await this.db.query(
      `SELECT COUNT(*) as attempts, MAX(created_at) as last_attempt
       FROM login_attempts
       WHERE username = $1 AND success = false
       AND created_at > CURRENT_TIMESTAMP - INTERVAL '30 minutes'`,
      [username]
    );
    
    const { attempts, last_attempt } = result.rows[0];
    
    if (attempts >= this.MAX_LOGIN_ATTEMPTS) {
      const lockoutTime = new Date(last_attempt);
      lockoutTime.setTime(lockoutTime.getTime() + this.LOCKOUT_DURATION);
      
      if (new Date() < lockoutTime) {
        const minutesLeft = Math.ceil((lockoutTime.getTime() - Date.now()) / (60 * 1000));
        throw new Error(`Account locked. Try again in ${minutesLeft} minutes.`);
      }
    }
  }

  private async findUserByUsername(username: string): Promise<User | null> {
    const result = await this.db.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    
    return result.rows[0] || null;
  }

  private async recordFailedLogin(username: string, ip: string): Promise<void> {
    await this.db.query(
      `INSERT INTO login_attempts (
        username, ip_address, success, created_at
      ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
      [username, ip, false]
    );
  }

  private async resetFailedLogins(username: string): Promise<void> {
    await this.db.query(
      `DELETE FROM login_attempts 
       WHERE username = $1 AND success = false`,
      [username]
    );
  }

  private async recordSuccessfulLogin(userId: string, ip: string): Promise<void> {
    await this.db.query(
      `INSERT INTO login_history (
        user_id, ip_address, created_at
      ) VALUES ($1, $2, CURRENT_TIMESTAMP)`,
      [userId, ip]
    );
    
    await this.db.query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [userId]
    );
  }

  public async verifyTwoFactor(userId: string, code: string): Promise<string> {
    return this.errorHandler.withErrorHandling(async () => {
      // Verify 2FA code
      const isValid = await this.twoFactorService.verifyCode(userId, code);
      
      if (!isValid) {
        throw new Error('Invalid two-factor authentication code');
      }
      
      // Generate auth token
      return this.tokenService.generateAuthToken(userId);
    }, {
      context: 'AuthService',
      operation: 'verifyTwoFactor'
    });
  }

  public async requestPasswordReset(email: string): Promise<void> {
    return this.errorHandler.withErrorHandling(async () => {
      // Check rate limit
      await this.rateLimiter.consume('password-reset');
      
      // Find user by email
      const result = await this.db.query(
        `SELECT id, username FROM users WHERE email = $1`,
        [email]
      );
      
      if (result.rows.length === 0) {
        // Don't reveal if email exists or not
        return;
      }
      
      const { id: userId, username } = result.rows[0];
      
      // Generate reset token
      const token = this.tokenService.generateToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      await this.db.query(
        `INSERT INTO verification_tokens (
          user_id, token, type, expires_at, created_at
        ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        [userId, token, 'password_reset', expiresAt]
      );
      
      // Send password reset email
      await this.emailService.sendPasswordResetEmail(
        email,
        username,
        token
      );
    }, {
      context: 'AuthService',
      operation: 'requestPasswordReset'
    });
  }

  public async resetPassword(token: string, newPassword: string): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      // Find token
      const result = await this.db.query(
        `SELECT user_id, expires_at FROM verification_tokens 
         WHERE token = $1 AND type = $2`,
        [token, 'password_reset']
      );
      
      if (result.rows.length === 0) {
        throw new Error('Invalid password reset token');
      }
      
      const { user_id, expires_at } = result.rows[0];
      
      // Check if token is expired
      if (new Date(expires_at) < new Date()) {
        throw new Error('Password reset token has expired');
      }
      
      // Validate new password
      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(newPassword)) {
        throw new Error('Password must include uppercase, lowercase, number, and special character');
      }
      
      // Hash new password
      const hashedPassword = await this.passwordService.hashPassword(newPassword);
      
      // Update user password
      await this.db.query(
        `UPDATE users SET 
         password_hash = $1, 
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [hashedPassword, user_id]
      );
      
      // Delete used token
      await this.db.query(
        `DELETE FROM verification_tokens WHERE token = $1`,
        [token]
      );
      
      // Invalidate all existing sessions
      await this.tokenService.invalidateUserTokens(user_id);
      
      return true;
    }, {
      context: 'AuthService',
      operation: 'resetPassword'
    });
  }

  public async enableTwoFactor(userId: string): Promise<{ secret: string; qrCode: string }> {
    return this.errorHandler.withErrorHandling(async () => {
      // Get user
      const user = await this.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Generate 2FA secret
      const { secret, qrCode } = await this.twoFactorService.generateSecret(
        user.username
      );
      
      // Store secret temporarily
      await this.db.query(
        `UPDATE users SET 
         two_factor_temp_secret = $1, 
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [secret, userId]
      );
      
      return { secret, qrCode };
    }, {
      context: 'AuthService',
      operation: 'enableTwoFactor'
    });
  }

  public async verifyAndEnableTwoFactor(userId: string, code: string): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      // Get user with temp secret
      const result = await this.db.query(
        `SELECT two_factor_temp_secret FROM users WHERE id = $1`,
        [userId]
      );
      
      if (result.rows.length === 0 || !result.rows[0].two_factor_temp_secret) {
        throw new Error('Two-factor setup not initiated');
      }
      
      const { two_factor_temp_secret } = result.rows[0];
      
      // Verify code against temp secret
      const isValid = this.twoFactorService.verifyCodeWithSecret(
        code,
        two_factor_temp_secret
      );
      
      if (!isValid) {
        throw new Error('Invalid verification code');
      }
      
      // Enable 2FA
      await this.db.query(
        `UPDATE users SET 
         two_factor_secret = $1,
         two_factor_temp_secret = NULL,
         two_factor_enabled = true,
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [two_factor_temp_secret, userId]
      );
      
      return true;
    }, {
      context: 'AuthService',
      operation: 'verifyAndEnableTwoFactor'
    });
  }

  public async disableTwoFactor(userId: string, password: string): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      // Get user
      const user = await this.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Verify password
      const isPasswordValid = await this.passwordService.verifyPassword(
        password,
        user.password_hash
      );
      
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      
      // Disable 2FA
      await this.db.query(
        `UPDATE users SET 
         two_factor_secret = NULL,
         two_factor_enabled = false,
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [userId]
      );
      
      return true;
    }, {
      context: 'AuthService',
      operation: 'disableTwoFactor'
    });
  }

  public async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      // Get user
      const user = await this.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Verify current password
      const isPasswordValid = await this.passwordService.verifyPassword(
        currentPassword,
        user.password_hash
      );
      
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }
      
      // Validate new password
      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(newPassword)) {
        throw new Error('Password must include uppercase, lowercase, number, and special character');
      }
      
      // Check if new password is the same as current
      if (await this.passwordService.verifyPassword(newPassword, user.password_hash)) {
        throw new Error('New password must be different from current password');
      }
      
      // Hash new password
      const hashedPassword = await this.passwordService.hashPassword(newPassword);
      
      // Update password
      await this.db.query(
        `UPDATE users SET 
         password_hash = $1, 
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [hashedPassword, userId]
      );
      
      return true;
    }, {
      context: 'AuthService',
      operation: 'changePassword'
    });
  }

  public async updateProfile(userId: string, profileData: {
    name?: string;
    email?: string;
  }): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      // Get user
      const user = await this.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Check if email is being changed
      let emailChanged = false;
      if (profileData.email && profileData.email !== user.email) {
        // Validate email
        if (!this.isValidEmail(profileData.email)) {
          throw new Error('Please provide a valid email address');
        }
        
        // Check if email is already in use
        const emailExists = await this.isEmailTaken(profileData.email);
        if (emailExists) {
          throw new Error('Email already in use');
        }
        
        emailChanged = true;
      }
      
      // Update profile
      await this.db.query(
        `UPDATE users SET 
         ${profileData.name ? 'name = $1, ' : ''}
         ${profileData.email ? 'email = $2, ' : ''}
         ${emailChanged ? 'status = $3, ' : ''}
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [
          profileData.name || null,
          profileData.email || null,
          emailChanged ? 'pending_verification' : null,
          userId
        ].filter(param => param !== null)
      );
      
      // If email changed, send verification email
      if (emailChanged && profileData.email) {
        const verificationToken = await this.createVerificationToken(userId);
        await this.emailService.sendVerificationEmail(
          profileData.email,
          user.username,
          verificationToken
        );
      }
      
      return true;
    }, {
      context: 'AuthService',
      operation: 'updateProfile'
    });
  }

  private async isEmailTaken(email: string): Promise<boolean> {
    const result = await this.db.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );
    
    return result.rows.length > 0;
  }

  public async deleteAccount(userId: string, password: string): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      // Get user
      const user = await this.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Verify password
      const isPasswordValid = await this.passwordService.verifyPassword(
        password,
        user.password_hash
      );
      
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      
      // Delete user data (or mark as deleted)
      await this.db.transaction(async (trx) => {
        // Anonymize user data
        await trx.query(
          `UPDATE users SET 
           username = $1,
           email = $2,
           password_hash = $3,
           name = 'Deleted User',
           status = 'deleted',
           updated_at = CURRENT_TIMESTAMP
           WHERE id = $4`,
          [
            `deleted_${Date.now()}_${userId.substring(0, 8)}`,
            `deleted_${Date.now()}@example.com`,
            'DELETED',
            userId
          ]
        );
        
        // Invalidate all tokens
        await this.tokenService.invalidateUserTokens(userId);
      });
      
      return true;
    }, {
      context: 'AuthService',
      operation: 'deleteAccount'
    });
  }

  public async exportUserData(userId: string): Promise<any> {
    return this.errorHandler.withErrorHandling(async () => {
      // Get user data
      const user = await this.getUserById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Get user statistics
      const statistics = await this.getUserStatistics(userId);
      
      // Get login history
      const loginHistory = await this.getLoginHistory(userId);
      
      // Compile data for export
      const exportData = {
        profile: {
          username: user.username,
          email: user.email,
          name: user.name,
          dateOfBirth: user.date_of_birth,
          createdAt: user.created_at,
          lastLogin: user.last_login
        },
        statistics,
        loginHistory: loginHistory.map(entry => ({
          timestamp: entry.created_at,
          ipAddress: entry.ip_address
        }))
      };
      
      return exportData;
    }, {
      context: 'AuthService',
      operation: 'exportUserData'
    });
  }

  private async getUserById(userId: string): Promise<User | null> {
    const result = await this.db.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );
    
    return result.rows[0] || null;
  }

  private async getUserStatistics(userId: string): Promise<any> {
    const result = await this.db.query(
      `SELECT * FROM player_statistics WHERE user_id = $1`,
      [userId]
    );
    
    return result.rows[0] || null;
  }

  private async getLoginHistory(userId: string): Promise<any[]> {
    const result = await this.db.query(
      `SELECT * FROM login_history 
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );
    
    return result.rows;
  }
}