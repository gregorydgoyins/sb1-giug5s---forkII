import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Lock } from 'lucide-react';

export function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (error) {
      setError(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (requiresTwoFactor) {
      await handleTwoFactorSubmit();
      return;
    }
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate a successful login with 2FA
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate 2FA requirement
      setRequiresTwoFactor(true);
      
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleTwoFactorSubmit = async () => {
    if (!twoFactorCode) {
      setError('Please enter your verification code');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate a successful 2FA verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard
      navigate('/');
      
    } catch (error) {
      setError('Invalid verification code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-slate-700/50">
      <h2 className="text-2xl font-bold text-white mb-6">Sign In to Your Account</h2>
      
      {error && (
        <div className="bg-red-900/50 p-4 rounded-lg border border-red-700/50 mb-6 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {!requiresTwoFactor ? (
          <>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Forgot password?
              </button>
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center justify-center mb-6 text-indigo-400">
              <Lock className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-semibold text-white text-center mb-4">Two-Factor Authentication</h3>
            <p className="text-gray-300 text-center mb-6">
              Please enter the verification code from your authenticator app.
            </p>
            
            <div>
              <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-300 mb-1">
                Verification Code
              </label>
              <input
                id="twoFactorCode"
                name="twoFactorCode"
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/recovery-code')}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Use recovery code
              </button>
            </div>
          </div>
        )}
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting 
              ? 'Signing In...' 
              : requiresTwoFactor 
                ? 'Verify' 
                : 'Sign In'}
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Create Account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}