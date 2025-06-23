// src/app/(admin)/admin/programs/page.tsx
'use client';

import dynamic from 'next/dynamic'
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Import the component with no SSR
const AdminProgramsContent = dynamic(
  () => import('@/components/admin/programs/AdminProgramsContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
);

export default function AdminProgramsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <AdminProgramsContent />
    </Suspense>
  );
}