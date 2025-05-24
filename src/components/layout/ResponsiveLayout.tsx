import React from 'react';
import { Container } from './Container';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function ResponsiveLayout({ children, sidebar }: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex flex-col lg:flex-row">
        {sidebar && (
          <aside className="w-full lg:w-64 lg:fixed lg:inset-y-0 bg-slate-800 border-r border-slate-700/50">
            <div className="h-full overflow-y-auto p-4">
              {sidebar}
            </div>
          </aside>
        )}
        <main className={`flex-1 ${sidebar ? 'lg:ml-64' : ''}`}>
          <Container>
            <div className="py-6">
              {children}
            </div>
          </Container>
        </main>
      </div>
    </div>
  );
}