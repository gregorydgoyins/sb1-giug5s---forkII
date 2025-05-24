import React from 'react';
import { BookOpen, GraduationCap, TrendingUp, Users, Building2, BarChart2 } from 'lucide-react';
import { LEARNING_MODULES } from '../services/learning/config';

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
        {LEARNING_MODULES.map((module) => (
          <div key={module.id} className="card hover:scale-105 transition-transform">
            <div className="flex items-center space-x-3 mb-4">
              {module.id === 'market-fundamentals' && <BookOpen className="h-6 w-6 text-indigo-400" />}
              {module.id === 'portfolio-management' && <TrendingUp className="h-6 w-6 text-indigo-400" />}
              {module.id === 'options-trading' && <BarChart2 className="h-6 w-6 text-indigo-400" />}
              {module.id === 'creator-bonds' && <Users className="h-6 w-6 text-indigo-400" />}
              {module.id === 'market-analysis' && <Building2 className="h-6 w-6 text-indigo-400" />}
              <h2 className="text-xl font-bold text-white">{module.title}</h2>
            </div>

            <p className="text-gray-300 mb-4">{module.description}</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Difficulty</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  module.difficulty === 'beginner' ? 'bg-green-900/50 text-green-200' :
                  module.difficulty === 'intermediate' ? 'bg-yellow-900/50 text-yellow-200' :
                  'bg-red-900/50 text-red-200'
                }`}>
                  {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Estimated Time</span>
                <span className="text-white">{module.estimatedTime} minutes</span>
              </div>

              <div className="border-t border-slate-700/50 pt-4">
                <h3 className="text-sm font-medium text-white mb-2">Topics Covered</h3>
                <ul className="space-y-1">
                  {module.topics.map((topic) => (
                    <li key={topic} className="text-sm text-gray-400">
                      • {topic}
                    </li>
                  ))}
                </ul>
              </div>

              {module.prerequisites.length > 0 && (
                <div className="border-t border-slate-700/50 pt-4">
                  <h3 className="text-sm font-medium text-white mb-2">Prerequisites</h3>
                  <ul className="space-y-1">
                    {module.prerequisites.map((prereq) => (
                      <li key={prereq} className="text-sm text-gray-400">
                        • {LEARNING_MODULES.find(m => m.id === prereq)?.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors">
              Start Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}