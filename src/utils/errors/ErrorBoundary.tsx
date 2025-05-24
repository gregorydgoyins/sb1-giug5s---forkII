'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ErrorLogger } from './ErrorLogger';
import type { ErrorLevel } from './types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: ErrorLevel;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  private logger: ErrorLogger;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
    this.logger = ErrorLogger.getInstance();
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error
    this.logger.error(error, {
      componentStack: errorInfo.componentStack,
      reactError: true,
      level: this.props.level || 'error'
    });

    // Update state with error info
    this.setState({ errorInfo });

    // Call onError callback if provided
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
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

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                  <p className="text-red-400 mb-2">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="text-gray-400 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={this.handleRetry}
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

    return this.props.children;
  }
}