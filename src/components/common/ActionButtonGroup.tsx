'use client';

import React from 'react';
import { ActionButton } from './ActionButton';
import { useRouter } from 'next/navigation';

export function ActionButtonGroup() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <ActionButton
        variant="trade"
        onClick={() => router.push('/trading')}
      />
      <ActionButton
        variant="learn"
        onClick={() => router.push('/learn')}
      />
      <ActionButton
        variant="portfolio"
        onClick={() => router.push('/portfolio')}
      />
    </div>
  );
}