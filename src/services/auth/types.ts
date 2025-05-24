export type AccountStatus = 
  | 'pending_verification' 
  | 'active' 
  | 'suspended' 
  | 'deleted';

export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  name: string;
  date_of_birth: string;
  status: AccountStatus;
  two_factor_enabled: boolean;
  two_factor_secret: string | null;
  two_factor_temp_secret: string | null;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface LoginAttempt {
  id: string;
  username: string;
  ip_address: string;
  success: boolean;
  created_at: Date;
}

export interface VerificationToken {
  id: string;
  user_id: string;
  token: string;
  type: 'email_verification' | 'password_reset' | 'account_recovery';
  expires_at: Date;
  created_at: Date;
}

export interface AuthToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  revoked: boolean;
  revoked_at: Date | null;
  created_at: Date;
}

export interface RefreshToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  revoked: boolean;
  revoked_at: Date | null;
  created_at: Date;
}

export interface TwoFactorBackupCode {
  id: string;
  user_id: string;
  code_hash: string;
  used: boolean;
  used_at: Date | null;
  created_at: Date;
}

export interface LoginHistory {
  id: string;
  user_id: string;
  ip_address: string;
  user_agent: string;
  created_at: Date;
}

export interface PlayerStatistics {
  id: string;
  user_id: string;
  balance: number;
  total_trades: number;
  win_rate: number;
  created_at: Date;
  updated_at: Date;
}