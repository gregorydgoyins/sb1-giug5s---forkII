'use client';

import React from 'react';
import { GraduationCap, BookOpen, Award, Target } from 'lucide-react';
import { CourseList } from './CourseList';
import { ProgressTracker } from './ProgressTracker';
import { AchievementPanel } from './achievements/AchievementPanel';
import { useLearningProgress } from '../hooks/useLearningProgress';
import { useAchievements } from '../hooks/useAchievements';

export function LearningCenter() {
  const { progress, updateProgress } = useLearningProgress();
  const { achievements, unlockAchievement } = useAchievements();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <GraduationCap className="h-10 w-10" />
            <h1 className="text-4xl font-bold">Learning Center</h1>
          </div>
          <p className="text-lg text-white/90">
            Master the art of comic investing through interactive courses, real-world scenarios,
            and expert-guided tutorials.
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Your Progress</h2>
          </div>
          <ProgressTracker progress={progress} />
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Achievements</h2>
          </div>
          <AchievementPanel achievements={achievements} />
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Learning Path</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Current Level</span>
              <span className="text-white font-semibold">{progress.currentLevel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Courses Completed</span>
              <span className="text-white font-semibold">{progress.completedCourses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Next Milestone</span>
              <span className="text-indigo-400 font-semibold">{progress.nextMilestone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course List */}
      <CourseList />
    </div>
  );
}