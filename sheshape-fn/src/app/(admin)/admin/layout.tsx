'use client';

import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ScrollToTop } from '@/components/common/ScrollToTop';
import { RouteGuard } from '@/components/common/RouteGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard 
      requireAuth={true} 
      requireRole="ADMIN"
    >
      <div className="flex h-screen bg-neutral-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
        <ScrollToTop />
      </div>
    </RouteGuard>
  );
}