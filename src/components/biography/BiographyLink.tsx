'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { BiographyService } from '@/services/biography/BiographyService';

interface BiographyLinkProps {
  creatorId: string;
  creatorName: string;
  className?: string;
  hasContent?: boolean;
}

export function BiographyLink({ creatorId, creatorName, className = '', hasContent = false }: BiographyLinkProps) {
  const bioService = BiographyService.getInstance();
  const biography = bioService.getCreatorBiography(creatorId);

  if (!biography) {
    return <span className={`text-gray-400 ${className}`}>{creatorName}</span>;
  }

  return (
    <Link
      href={`/creator/${creatorId}/biography`}
      className={`inline-flex items-center space-x-2 ${
        hasContent ? 'text-indigo-400 hover:text-indigo-300' : 'text-gray-400 hover:text-gray-300'
      } transition-colors ${className}`}
    >
      <span>{creatorName}</span>
      <ExternalLink className="h-4 w-4" />
    </Link>
  );
}