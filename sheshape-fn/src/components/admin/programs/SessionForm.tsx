// src/components/admin/programs/SessionForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

// Define form schema with Zod
const sessionSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  videoUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  durationMinutes: z.string().refine(val => !val || !isNaN(parseInt(val)), {
    message: 'Duration must be a valid number'
  }).transform(val => val ? parseInt(val) : undefined),
  sessionOrder: z.string().transform(val => parseInt(val)),
});

type SessionFormValues = z.infer<typeof sessionSchema>;

// Interface for the component props
interface SessionFormProps {
  programId: string;
  sessionId?: string;
  mode: 'create' | 'edit';
}

export function SessionForm({ programId, sessionId, mode }: SessionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(mode === 'edit');
  const router = useRouter();

  // Find the next available session order for new sessions
  const [nextSessionOrder, setNextSessionOrder] = useState<number>(1);

  // Initialize form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: '',
      description: '',
      videoUrl: '',
      durationMinutes: 1,
      sessionOrder: 1,
    },
  });

  // If editing, fetch session data
  useEffect(() => {
    if (mode === 'edit' && sessionId) {
      const fetchSession = async () => {
        try {
          setIsInitialLoading(true);
          const response = await api.get(`/api/gym/sessions/${sessionId}`);
          const session = response.data;
          
          // Set form values
          reset({
            title: session.title,
            description: session.description || '',
            videoUrl: session.videoUrl || '',
            durationMinutes: session.durationMinutes?.toString() || '',
            sessionOrder: session.sessionOrder.toString(),
          });
        } catch (err) {
          console.error('Error fetching session:', err);
          setError('Failed to load session data. Please try again.');
        } finally {
          setIsInitialLoading(false);
        }
      };
      
      fetchSession();
    } else if (mode === 'create') {
      // For new sessions, determine the next session order
      const fetchSessionsCount = async () => {
        try {
          const response = await api.get(`/api/gym/programs/${programId}/sessions`);
          const sessions = response.data;
          
          // Set the next order number
          if (sessions.length > 0) {
            const maxOrder = Math.max(...sessions.map((s: any) => s.sessionOrder));
            setNextSessionOrder(maxOrder + 1);
            setValue('sessionOrder', (maxOrder + 1));
          } else {
            setNextSessionOrder(1);
            setValue('sessionOrder', 1);
          }
        } catch (err) {
          console.error('Error fetching sessions count:', err);
          // Default to 1 if there's an error
          setNextSessionOrder(1);
          setValue('sessionOrder', 1);
        }
      };
      
      fetchSessionsCount();
    }
  }, [programId, sessionId, mode, reset, setValue]);

  // Handle form submission
  const onSubmit = async (data: SessionFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Format data for API
      const formattedData = {
        ...data,
        sessionOrder: parseInt(data.sessionOrder.toString()),
        durationMinutes: data.durationMinutes,
        // Convert empty strings to null
        videoUrl: data.videoUrl === '' ? null : data.videoUrl,
        description: data.description === '' ? null : data.description,
      };
      
      if (mode === 'edit' && sessionId) {
        // Update existing session
        await api.put(`/api/gym/sessions/${sessionId}`, formattedData);
        toast.success('Session updated successfully');
      } else {
        // Create new session
        await api.post(`/api/gym/programs/${programId}/sessions`, formattedData);
        toast.success('Session created successfully');
      }
      
      // Navigate back to program details
      router.push(`/admin/programs/view/${programId}`);
    } catch (err: any) {
      console.error('Error saving session:', err);
      setError(err.response?.data?.message || 'Failed to save session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle session deletion
  const deleteSession = async () => {
    if (!sessionId) return;
    
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/api/gym/sessions/${sessionId}`);
      toast.success('Session deleted successfully');
      router.push(`/admin/programs/view/${programId}`);
    } catch (err) {
      console.error('Error deleting session:', err);
      toast.error('Failed to delete session');
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push(`/admin/programs/view/${programId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Program
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Add New Session' : 'Edit Session'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Session Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Session Title</Label>
                <Input 
                  id="title" 
                  {...register('title')} 
                  disabled={isLoading}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  {...register('description')} 
                  disabled={isLoading}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Video URL (Optional)</Label>
                  <Input 
                    id="videoUrl" 
                    {...register('videoUrl')} 
                    disabled={isLoading}
                    placeholder="https://example.com/video"
                    className={errors.videoUrl ? 'border-red-500' : ''}
                  />
                  {errors.videoUrl && (
                    <p className="text-red-500 text-sm">{errors.videoUrl.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="durationMinutes">Duration in Minutes (Optional)</Label>
                  <Input 
                    id="durationMinutes" 
                    type="number"
                    {...register('durationMinutes')} 
                    disabled={isLoading}
                    min="1"
                    className={errors.durationMinutes ? 'border-red-500' : ''}
                  />
                  {errors.durationMinutes && (
                    <p className="text-red-500 text-sm">{errors.durationMinutes.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionOrder">Session Order</Label>
                <Input 
                  id="sessionOrder" 
                  type="number"
                  {...register('sessionOrder')} 
                  disabled={isLoading}
                  min="1"
                  className={errors.sessionOrder ? 'border-red-500' : ''}
                />
                {errors.sessionOrder && (
                  <p className="text-red-500 text-sm">{errors.sessionOrder.message}</p>
                )}
                <p className="text-sm text-neutral-500">
                  The order in which this session appears in the program.
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => router.push(`/admin/programs/view/${programId}`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <div className="flex space-x-2">
              {mode === 'edit' && (
                <Button 
                  variant="destructive" 
                  type="button"
                  disabled={isLoading}
                  onClick={deleteSession}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                <Save className="mr-2 h-4 w-4" />
                {mode === 'create' ? 'Create Session' : 'Save Changes'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}