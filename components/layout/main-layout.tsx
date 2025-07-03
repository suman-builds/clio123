'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarCollapsed } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50">
      <Sidebar />
      
      <div
        className={cn(
          'transition-all duration-200 ease-in-out',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <Header />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}