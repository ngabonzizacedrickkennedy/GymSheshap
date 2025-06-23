// src/app/(admin)/admin/programs/view/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign,
  Play,
  Info
} from 'lucide-react';
import { api } from '@/lib/api';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatDate, formatPrice } from '@/lib/utils';
import { SessionsList } from '@/components/admin/programs/SessionList';
import { UsersList } from '@/components/admin/programs/UsersList';

// Program interface
interface GymProgram {
  id: number;
  title: string;
  description?: string;
  difficultyLevel: string;
  durationDays: number;
  price: number;
  isActive: boolean;
  trainerId: number;
  trainer?: {
    id: number;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ViewProgramPage({ params }: { params: { id: string } }) {
  const [program, setProgram] = useState<GymProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch program details
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/gym/programs/${params.id}`);
        setProgram(response.data);
      } catch (err) {
        console.error('Error fetching program details:', err);
        setError('Failed to load program details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgram();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.push('/admin/programs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
        </Button>
        
        <Alert variant="destructive">
          <AlertDescription>
            {error || 'Program not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" onClick={() => router.push('/admin/programs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
        </Button>
        
        <div className="flex space-x-2">
          <Button onClick={() => router.push(`/admin/programs/edit/${program.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Program
          </Button>
        </div>
      </div>
      
      {/* Program Info Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{program.title}</CardTitle>
              <CardDescription className="mt-2">
                Program ID: {program.id}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Badge variant={program.isActive ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                {program.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline" className={
                program.difficultyLevel === 'BEGINNER' ? 'border-green-500 text-green-700 bg-green-50' :
                program.difficultyLevel === 'INTERMEDIATE' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                'border-red-500 text-red-700 bg-red-50'
              }>
                {program.difficultyLevel.charAt(0) + program.difficultyLevel.slice(1).toLowerCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Program Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-lg">
              <Calendar className="h-5 w-5 text-primary mb-2" />
              <span className="text-sm text-neutral-500">Duration</span>
              <span className="font-medium">{program.durationDays} days</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary mb-2" />
              <span className="text-sm text-neutral-500">Price</span>
              <span className="font-medium">{formatPrice(program.price)}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-lg">
              <Clock className="h-5 w-5 text-primary mb-2" />
              <span className="text-sm text-neutral-500">Created</span>
              <span className="font-medium">{formatDate(program.createdAt)}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 rounded-lg">
              <Users className="h-5 w-5 text-primary mb-2" />
              <span className="text-sm text-neutral-500">Trainer</span>
              <span className="font-medium">{program.trainer?.username || 'Unknown'}</span>
            </div>
          </div>
          
          <Separator />
          
          {/* Program Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="whitespace-pre-line">{program.description || 'No description provided.'}</p>
          </div>
          
          <Separator />
          
          {/* Tabs for Sessions and Users */}
          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="users">Enrolled Users</TabsTrigger>
            </TabsList>
            <TabsContent value="sessions" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Program Sessions</h3>
                <Button size="sm" onClick={() => router.push(`/admin/programs/${program.id}/sessions/create`)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Session
                </Button>
              </div>
              <SessionsList programId={program.id} />
            </TabsContent>
            <TabsContent value="users" className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Enrolled Users</h3>
              <UsersList programId={program.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}