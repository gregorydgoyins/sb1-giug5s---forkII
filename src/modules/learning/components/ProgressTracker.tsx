'use client';

import React from 'react';
import { Target, Award, TrendingUp } from 'lucide-react';
import type { LearningProgress } from '../types';

interface ProgressTrackerProps {
  progress: LearningProgress;
}

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  const calculateLevelProgress = () => {
    const xpForNextLevel = progress.xpRequiredForNextLevel;
    const currentLevelXp = progress.currentXp - progress.xpForCurrentLevel;
    return (currentLevelXp / xpForNextLevel) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Level {progress.currentLevel}</span>
          <span className="text-indigo-400">{progress.currentXp} XP</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${calculateLevelProgress()}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-500">
            {progress.xpForCurrentLevel} XP
          </span>
          <span className="text-gray-500">
            {progress.xpRequiredForNextLevel} XP
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
          <div className="flex items-center space-x-2 mb-1">
            <Target className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-gray-400">Courses</span>
          </div>
          <p className="text-xl font-bold text-white">{progress.completedCourses}</p>
        </div>

        <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
          <div className="flex items-center space-x-2 mb-1">
            <Award className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-gray-400">Achievements</span>
          </div>
          <p className="text-xl font-bold text-white">{progress.unlockedAchievements}</p>
        </div>
      </div>

      {/* Next Milestone */}
      <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-700/30">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="h-5 w-5 text-indigo-400" />
          <h3 className="text-white font-medium">Next Milestone</h3>
        </div>
        <p className="text-sm text-gray-300">{progress.nextMilestone}</p>
      </div>
    </div>
  );
}