'use client';

import React from 'react';
import { Award, Lock } from 'lucide-react';
import type { Achievement } from '../../types';

interface AchievementPanelProps {
  achievements: Achievement[];
}

export function AchievementPanel({ achievements }: AchievementPanelProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">Progress</span>
        <span className="text-white">{unlockedCount}/{totalCount}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {achievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`p-3 rounded-lg border ${
              achievement.unlocked
                ? 'bg-indigo-900/50 border-indigo-700/50'
                : 'bg-slate-800/50 border-slate-700/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              {achievement.unlocked ? (
                <Award className="h-4 w-4 text-indigo-400" />
              ) : (
                <Lock className="h-4 w-4 text-gray-500" />
              )}
              <span className={`text-sm font-medium ${
                achievement.unlocked ? 'text-white' : 'text-gray-400'
              }`}>
                {achievement.name}
              </span>
            </div>
            {achievement.unlocked && (
              <p className="text-xs text-gray-400 mt-1">
                {achievement.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}