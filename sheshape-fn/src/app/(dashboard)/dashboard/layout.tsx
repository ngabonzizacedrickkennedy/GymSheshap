'use client';

import { Sidebar } from '@/components/dashboard/SideBar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { RouteGuard } from '@/components/common/RouteGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard 
      requireAuth={true} 
      requireCompleteProfile={true}
    >
      <div className="flex h-screen bg-neutral-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
        <ScrollToTop />
      </div>
    </RouteGuard>
  );
}