import React from 'react';
import { GraduationCap } from 'lucide-react';

export function Learn() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Learning Center</h1>
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-indigo-400" />
          <span className="text-gray-400">Track your progress and earn rewards</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Learning modules will go here */}
        <div className="card p-6 hover:scale-105 transition-transform">
          <h2 className="text-xl font-bold text-white mb-4">Market Fundamentals</h2>
          <p className="text-gray-300 mb-4">Learn the basics of comic book market mechanics and trading principles</p>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors">
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
}