// src/app/(admin)/admin/programs/edit/[id]/page.tsx
import { ProgramForm } from '@/components/admin/programs/ProgramForm';

export default function EditProgramPage({ params }: { params: { id: string } }) {
  return <ProgramForm mode="edit" programId={params.id} />;
}