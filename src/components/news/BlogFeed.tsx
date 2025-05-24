import React from 'react';
import { Calendar, Clock, Tag, ExternalLink } from 'lucide-react';
import type { BlogPost } from '../../services/news/types';

interface BlogFeedProps {
  posts: BlogPost[];
}

export function BlogFeed({ posts }: BlogFeedProps) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-slate-700/50 border border-slate-600/50 rounded-lg overflow-hidden">
          {post.images?.[0] && (
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.timestamp.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.metadata.readingTime} min read</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-indigo-900/50 text-indigo-200 rounded-full text-xs">
                  {post.category}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
            <p className="text-gray-300 mb-4">{post.content}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex space-x-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-sm text-gray-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <button className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
                <span className="mr-1">Read More</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}