// src/components/admin/programs/SessionsList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal, Play, Video } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Session interface
interface GymSession {
  id: number;
  title: string;
  description?: string;
  videoUrl?: string;
  durationMinutes?: number;
  sessionOrder: number;
  programId: number;
  createdAt: string;
  updatedAt: string;
}

interface SessionsListProps {
  programId: number;
}

export function SessionsList({ programId }: SessionsListProps) {
  const [sessions, setSessions] = useState<GymSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/gym/programs/${programId}/sessions`);
        setSessions(response.data);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [programId]);

  // Delete session
  const deleteSession = async (sessionId: number) => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/api/gym/sessions/${sessionId}`);
      
      // Remove from local state
      setSessions(sessions.filter(s => s.id !== sessionId));
      
      toast.success('Session deleted successfully');
    } catch (err) {
      console.error('Error deleting session:', err);
      toast.error('Failed to delete session');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 border rounded bg-red-50 text-red-600">
        {error}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center p-8 border rounded bg-neutral-50">
        <Video className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
        <h4 className="font-medium mb-2">No Sessions Yet</h4>
        <p className="text-neutral-500 mb-4">This program doesn't have any sessions yet.</p>
        <Button size="sm" onClick={() => router.push(`/admin/programs/${programId}/sessions/create`)}>
          Add First Session
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Video</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.sort((a, b) => a.sessionOrder - b.sessionOrder).map((session) => (
            <TableRow key={session.id}>
              <TableCell className="font-medium">{session.sessionOrder}</TableCell>
              <TableCell>{session.title}</TableCell>
              <TableCell>{session.durationMinutes || '-'} min</TableCell>
              <TableCell>
                {session.videoUrl ? (
                  <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                    <a href={session.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Play className="h-4 w-4 mr-1" /> View
                    </a>
                  </Button>
                ) : (
                  <span className="text-neutral-400">No video</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/admin/programs/${programId}/sessions/edit/${session.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => deleteSession(session.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}