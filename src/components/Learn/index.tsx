import React from 'react';
import { GraduationCap } from 'lucide-react';
import { LearningModule } from './LearningModule';
import { LEARNING_MODULES } from '@/services/learning/config';

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
          <LearningModule key={module.id} module={module} />
        ))}
      </div>
    </div>
  );
}