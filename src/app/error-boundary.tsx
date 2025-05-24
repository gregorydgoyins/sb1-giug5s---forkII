'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle } from 'lucide-react';

function ErrorFallback({ error, resetErrorBoundary }: { 
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-lg max-w-lg w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300">
            We apologize for the inconvenience. The application has encountered an unexpected error.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
              <p className="text-red-400">{error.message}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={resetErrorBoundary}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}