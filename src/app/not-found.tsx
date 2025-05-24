import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-lg max-w-lg w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
          <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        </div>
        <p className="text-gray-300 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a 
          href="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}