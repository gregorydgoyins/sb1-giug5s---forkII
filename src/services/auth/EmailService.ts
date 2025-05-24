import { ErrorHandler } from '../../utils/errors';

export class EmailService {
  private errorHandler: ErrorHandler;
  private readonly FROM_EMAIL = 'noreply@panelprofits.com';
  private readonly SITE_NAME = 'Panel Profits';
  private readonly BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://panelprofits.com';

  constructor() {
    this.errorHandler = ErrorHandler.getInstance();
  }

  public async sendVerificationEmail(
    to: string,
    username: string,
    token: string
  ): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      const verificationUrl = `${this.BASE_URL}/verify-email?token=${token}`;
      
      const subject = `${this.SITE_NAME} - Verify Your Email`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Welcome to ${this.SITE_NAME}!</h2>
          <p>Hi ${username},</p>
          <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verify Email
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>Best regards,<br>The ${this.SITE_NAME} Team</p>
        </div>
      `;
      
      // In a real implementation, this would send an actual email
      // For now, we'll just log it
      console.log(`Sending verification email to ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`URL: ${verificationUrl}`);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    }, {
      context: 'EmailService',
      operation: 'sendVerificationEmail',
      recipient: to
    });
  }

  public async sendPasswordResetEmail(
    to: string,
    username: string,
    token: string
  ): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      const resetUrl = `${this.BASE_URL}/reset-password?token=${token}`;
      
      const subject = `${this.SITE_NAME} - Password Reset Request`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>Hi ${username},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The ${this.SITE_NAME} Team</p>
        </div>
      `;
      
      // In a real implementation, this would send an actual email
      // For now, we'll just log it
      console.log(`Sending password reset email to ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`URL: ${resetUrl}`);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    }, {
      context: 'EmailService',
      operation: 'sendPasswordResetEmail',
      recipient: to
    });
  }

  public async sendTwoFactorBackupCodesEmail(
    to: string,
    username: string,
    backupCodes: string[]
  ): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      const subject = `${this.SITE_NAME} - Your Two-Factor Authentication Backup Codes`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Your Two-Factor Authentication Backup Codes</h2>
          <p>Hi ${username},</p>
          <p>You have successfully enabled two-factor authentication for your account. Here are your backup codes:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; font-family: monospace; margin: 20px 0;">
            ${backupCodes.map(code => `<div>${code}</div>`).join('')}
          </div>
          <p><strong>Important:</strong> Keep these codes in a safe place. Each code can only be used once.</p>
          <p>If you lose access to your authentication app, you can use one of these codes to sign in.</p>
          <p>Best regards,<br>The ${this.SITE_NAME} Team</p>
        </div>
      `;
      
      // In a real implementation, this would send an actual email
      // For now, we'll just log it
      console.log(`Sending 2FA backup codes email to ${to}`);
      console.log(`Subject: ${subject}`);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    }, {
      context: 'EmailService',
      operation: 'sendTwoFactorBackupCodesEmail',
      recipient: to
    });
  }

  public async sendAccountLockedEmail(
    to: string,
    username: string
  ): Promise<boolean> {
    return this.errorHandler.withErrorHandling(async () => {
      const subject = `${this.SITE_NAME} - Account Temporarily Locked`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Account Security Alert</h2>
          <p>Hi ${username},</p>
          <p>We've detected multiple failed login attempts to your account, and have temporarily locked it for your security.</p>
          <p>Your account will be automatically unlocked after 30 minutes, or you can reset your password to unlock it immediately.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${this.BASE_URL}/forgot-password" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If you didn't attempt to log in, we recommend changing your password immediately.</p>
          <p>Best regards,<br>The ${this.SITE_NAME} Team</p>
        </div>
      `;
      
      // In a real implementation, this would send an actual email
      // For now, we'll just log it
      console.log(`Sending account locked email to ${to}`);
      console.log(`Subject: ${subject}`);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    }, {
      context: 'EmailService',
      operation: 'sendAccountLockedEmail',
      recipient: to
    });
  }
}