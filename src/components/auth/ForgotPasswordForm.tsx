import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
    } catch (error) {
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-slate-700/50">
        <div className="flex items-center justify-center mb-6 text-green-400">
          <CheckCircle className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-4">Check Your Email</h2>
        <p className="text-gray-300 text-center mb-6">
          We've sent a password reset link to <span className="font-semibold">{email}</span>. 
          Please check your inbox and follow the instructions to reset your password.
        </p>
        <p className="text-gray-400 text-center text-sm mb-6">
          If you don't see the email, please check your spam folder.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-slate-700/50">
      <div className="flex items-center justify-center mb-6 text-indigo-400">
        <Mail className="h-16 w-16" />
      </div>
      <h2 className="text-2xl font-bold text-white text-center mb-4">Forgot Your Password?</h2>
      <p className="text-gray-300 text-center mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      {error && (
        <div className="bg-red-900/50 p-4 rounded-lg border border-red-700/50 mb-6 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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