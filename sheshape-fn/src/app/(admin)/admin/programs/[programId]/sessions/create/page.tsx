// src/app/(admin)/admin/programs/[programId]/sessions/create/page.tsx
'use client';

import { SessionForm } from '@/components/admin/programs/SessionForm';

export default function CreateSessionPage({ params }: { params: { programId: string } }) {
  return <SessionForm mode="create" programId={params.programId} />;
}