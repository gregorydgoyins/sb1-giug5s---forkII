import React, { useEffect, useState } from 'react';
import { BlogFeed } from './BlogFeed';
import { BlogFeedParser } from '../../services/news/BlogFeedParser';
import type { BlogPost } from '../../services/news/types';

export function NewsFeed() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const parser = new BlogFeedParser();
        const blogPosts = await parser.parseBlogFeed();
        setPosts(blogPosts);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-6 animate-pulse">
            <div className="h-48 bg-slate-600 rounded-lg mb-4"></div>
            <div className="h-6 bg-slate-600 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-600 rounded w-full"></div>
              <div className="h-4 bg-slate-600 rounded w-5/6"></div>
              <div className="h-4 bg-slate-600 rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <BlogFeed posts={posts} />;
}