import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle, Key } from 'lucide-react';

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  
  useEffect(() => {
    // Extract token from URL query parameters
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      // In a real app, we would validate the token here
      validateToken(tokenParam);
    } else {
      setIsTokenValid(false);
    }
  }, [location]);
  
  const validateToken = async (token: string) => {
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate a valid token
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTokenValid(true);
    } catch (error) {
      setIsTokenValid(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number, and special character';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate a successful password reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setErrors({
        form: 'Failed to reset password. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getPasswordStrength = () => {
    if (!formData.password) return { text: '', color: '' };
    
    let score = 0;
    
    // Length check
    if (formData.password.length >= 8) score += 1;
    if (formData.password.length >= 12) score += 1;
    
    // Character type checks
    if (/[a-z]/.test(formData.password)) score += 1;
    if (/[A-Z]/.test(formData.password)) score += 1;
    if (/\d/.test(formData.password)) score += 1;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) score += 1;
    
    // Deduct for common patterns
    if (/^123/.test(formData.password) || /password/i.test(formData.password) || /qwerty/i.test(formData.password)) {
      score -= 2;
    }
    
    // Ensure score is between 0 and 5
    score = Math.max(0, Math.min(5, score));
    
    const strengthMap = [
      { text: 'Very Weak', color: 'bg-red-500' },
      { text: 'Weak', color: 'bg-orange-500' },
      { text: 'Fair', color: 'bg-yellow-500' },
      { text: 'Good', color: 'bg-blue-500' },
      { text: 'Strong', color: 'bg-green-500' },
      { text: 'Very Strong', color: 'bg-green-600' }
    ];
    
    return strengthMap[score];
  };
  
  const passwordStrength = getPasswordStrength();

  if (!isTokenValid) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-slate-700/50">
        <div className="flex items-center justify-center mb-6 text-red-400">
          <AlertCircle className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-4">Invalid or Expired Link</h2>
        <p className="text-gray-300 text-center mb-6">
          The password reset link is invalid or has expired. Please request a new password reset link.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/forgot-password')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-slate-700/50">
        <div className="flex items-center justify-center mb-6 text-green-400">
          <CheckCircle className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-4">Password Reset Successful!</h2>
        <p className="text-gray-300 text-center mb-6">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <p className="text-gray-400 text-center text-sm mb-6">
          Redirecting you to the login page...
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-slate-700/50">
      <div className="flex items-center justify-center mb-6 text-indigo-400">
        <Key className="h-16 w-16" />
      </div>
      <h2 className="text-2xl font-bold text-white text-center mb-4">Reset Your Password</h2>
      <p className="text-gray-300 text-center mb-6">
        Please create a new password for your account.
      </p>
      
      {errors.form && (
        <div className="bg-red-900/50 p-4 rounded-lg border border-red-700/50 mb-6 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
          <p className="text-sm text-red-200">{errors.form}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-slate-700/50 border ${errors.password ? 'border-red-500' : 'border-slate-600/50'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password}</p>
          )}
          
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Password Strength:</span>
                <span className="text-xs font-medium" style={{ color: passwordStrength.color.replace('bg-', 'text-') }}>
                  {passwordStrength.text}
                </span>
              </div>
              <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${passwordStrength.color}`} 
                  style={{ width: `${(passwordStrength.text ? parseInt(passwordStrength.color.match(/\d+/)?.[0] || '0') : 0) / 6 * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full bg-slate-700/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-600/50'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
          )}
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}