'use client';

import React, { useState } from 'react';
import { Filter, BookOpen, Star, Users, BarChart2 } from 'lucide-react';
import { CourseCard } from './CourseCard';
import { useCourses } from '../hooks/useCourses';
import type { Course, Difficulty } from '../types';

export function CourseList() {
  const { courses, isLoading } = useCourses();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCourses = courses.filter(course => 
    (selectedDifficulty === 'all' || course.difficulty === selectedDifficulty) &&
    (selectedCategory === 'all' || course.category === selectedCategory)
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-indigo-400" />
          <span className="text-gray-400">Filter by:</span>
        </div>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'all')}
          className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-700 text-white text-sm border-slate-600 rounded-lg px-3 py-2"
        >
          <option value="all">All Categories</option>
          <option value="market">Market Analysis</option>
          <option value="trading">Trading Strategies</option>
          <option value="portfolio">Portfolio Management</option>
          <option value="risk">Risk Management</option>
        </select>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No courses found matching your filters.</p>
        </div>
      )}
    </div>
  );
}