'use client';

import React from 'react';
import { BookOpen, GraduationCap } from 'lucide-react';

export function EducationSection() {
  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <BookOpen className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Trading Education</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center space-x-2 mb-2">
            <GraduationCap className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Quick Guides</h3>
          </div>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                Understanding Market Orders
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                Limit Order Strategies
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-indigo-400 transition-colors">
                Risk Management Basics
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <h3 className="text-lg font-semibold text-white mb-2">Market Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Daily Volume</p>
              <p className="text-lg font-semibold text-white">CC 1.2M</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Traders</p>
              <p className="text-lg font-semibold text-white">850</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}