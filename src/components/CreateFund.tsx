import React, { useState } from 'react';
import { PlusCircle, Info } from 'lucide-react';

export function CreateFund() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <PlusCircle className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Create Your Fund</h2>
        </div>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="text-gray-400 hover:text-indigo-600 transition-colors"
        >
          <Info className="h-5 w-5" />
        </button>
      </div>

      {showInfo && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg text-sm text-indigo-700">
          <p className="mb-2">Create your own mutual fund by selecting:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Comic books from different ages</li>
            <li>Creator bonds and options</li>
            <li>Publisher securities</li>
            <li>Character-based derivatives</li>
          </ul>
          <p className="mt-2">Set your own weightings and rebalancing rules!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="btn btn-primary">
          Create Superhero Fund
        </button>
        <button className="btn btn-primary">
          Create Villain Fund
        </button>
        <button className="btn btn-primary">
          Create Publisher Fund
        </button>
        <button className="btn btn-primary">
          Create Custom Fund
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Learn more about:</p>
        <div className="mt-2 space-y-2">
          <a href="#" className="block text-indigo-600 hover:underline">
            → How fund creation works
          </a>
          <a href="#" className="block text-indigo-600 hover:underline">
            → Understanding derivatives and options
          </a>
          <a href="#" className="block text-indigo-600 hover:underline">
            → Risk management strategies
          </a>
        </div>
      </div>
    </div>
  );
}