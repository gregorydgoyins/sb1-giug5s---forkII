'use client';

import React from 'react';
import { BookOpen, Clock, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="card hover:scale-105 transition-transform duration-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 rounded-lg ${
          course.difficulty === 'beginner' ? 'bg-green-900/50 text-green-400' :
          course.difficulty === 'intermediate' ? 'bg-yellow-900/50 text-yellow-400' :
          'bg-red-900/50 text-red-400'
        }`}>
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{course.title}</h3>
          <p className="text-gray-400">{course.category}</p>
        </div>
      </div>

      <p className="text-gray-300 mb-4">{course.description}</p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration} minutes</span>
          </div>
          <div className="flex items-center text-gray-400">
            <Award className="h-4 w-4 mr-1" />
            <span>{course.xp} XP</span>
          </div>
        </div>

        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white">Skills you'll gain:</h4>
        <div className="flex flex-wrap gap-2">
          {course.skills.map((skill, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-slate-700/50 text-indigo-300 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <Link
        href={`/learn/course/${course.id}`}
        className="mt-6 flex items-center justify-between bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        <span>Start Learning</span>
        <ChevronRight className="h-5 w-5" />
      </Link>
    </div>
  );
}