import bcrypt from 'bcryptjs';
import { ErrorHandler } from '../../utils/errors';

export class PasswordService {
  private errorHandler: ErrorHandler;
  private readonly SALT_ROUNDS = 12;

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  public async hashPassword(password: string): Promise<string> {
    return this.errorHandler.withErrorHandling(async () => {
      return bcrypt.hash(password, this.SALT_ROUNDS);
    }, {
      context: 'PasswordService',
      operation: 'hashPassword'
    });
  }

  public async verifyPassword(password: string, hash: string): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      return bcrypt.compare(password, hash);
    }, {
      context: 'PasswordService',
      operation: 'verifyPassword'
    });
  }

  public generateRandomPassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    
    // Ensure at least one of each required character type
    password += this.getRandomChar('abcdefghijklmnopqrstuvwxyz');
    password += this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    password += this.getRandomChar('0123456789');
    password += this.getRandomChar('!@#$%^&*()_+');
    
    // Fill the rest with random characters
    for (let i = password.length; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the password
    return this.shuffleString(password);
  }

  private getRandomChar(charset: string): string {
    return charset.charAt(Math.floor(Math.random() * charset.length));
  }

  private shuffleString(str: string): string {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  }

  public validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number;
  } {
    const errors: string[] = [];
    let score = 0;
    
    // Length check
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else {
      score += Math.min(2, Math.floor(password.length / 4));
    }
    
    // Character type checks
    if (!/[a-z]/.test(password)) {
      errors.push('Password must include at least one lowercase letter');
    } else {
      score += 1;
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must include at least one uppercase letter');
    } else {
      score += 1;
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must include at least one number');
    } else {
      score += 1;
    }
    
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Password must include at least one special character');
    } else {
      score += 1;
    }
    
    // Check for common patterns
    if (/^123/.test(password) || /password/i.test(password) || /qwerty/i.test(password)) {
      errors.push('Password contains common patterns');
      score -= 1;
    }
    
    // Ensure score is between 0 and 5
    score = Math.max(0, Math.min(5, score));
    
    return {
      isValid: errors.length === 0,
      errors,
      score
    };
  }
}