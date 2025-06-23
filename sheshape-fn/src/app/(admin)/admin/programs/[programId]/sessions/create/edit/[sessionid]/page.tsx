// src/app/(admin)/admin/programs/[programId]/sessions/edit/[sessionId]/page.tsx
'use client';

import { SessionForm } from '@/components/admin/programs/SessionForm';

export default function EditSessionPage({ params }: { 
  params: { programId: string, sessionId: string } 
}) {
  return <SessionForm 
    mode="edit" 
    programId={params.programId} 
    sessionId={params.sessionId}
  />;
}