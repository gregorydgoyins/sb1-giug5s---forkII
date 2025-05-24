import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreatorNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-lg max-w-lg w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
          <h2 className="text-2xl font-bold text-white">Creator Not Found</h2>
        </div>
        <p className="text-gray-300 mb-6">
          The creator you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}