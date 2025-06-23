// src/components/admin/programs/ProgramForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Trash2, Save, ArrowLeft } from 'lucide-react';

// Define form schema with Zod
const programSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  difficultyLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  durationDays: z.string().transform(val => parseInt(val)),
  price: z.string().transform(val => parseFloat(val)),
  isActive: z.boolean().default(true),
});

type ProgramFormValues = z.infer<typeof programSchema>;

// Interface for the component props
interface ProgramFormProps {
  programId?: string;
  mode: 'create' | 'edit';
}

export function ProgramForm({ programId, mode }: ProgramFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(mode === 'edit');
  const router = useRouter();

  // Initialize form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      title: '',
      description: '',
      difficultyLevel: 'BEGINNER',
      durationDays: 30,
      price: 0,
      isActive: true,
    },
  });

  // Current values from the form
  const watchIsActive = watch('isActive');
  const watchDifficultyLevel = watch('difficultyLevel');

  // If editing, fetch program data
  useEffect(() => {
    if (mode === 'edit' && programId) {
      const fetchProgram = async () => {
        try {
          setIsInitialLoading(true);
          const response = await api.get(`/api/gym/programs/${programId}`);
          const program = response.data;
          
          // Set form values
          reset({
            title: program.title,
            description: program.description || '',
            difficultyLevel: program.difficultyLevel,
            durationDays: program.durationDays.toString(),
            price: program.price.toString(),
            isActive: program.isActive,
          });
        } catch (err) {
          console.error('Error fetching program:', err);
          setError('Failed to load program data. Please try again.');
        } finally {
          setIsInitialLoading(false);
        }
      };
      
      fetchProgram();
    }
  }, [programId, mode, reset]);

  // Handle form submission
  const onSubmit = async (data: ProgramFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Format data for API
      const formattedData = {
        ...data,
        durationDays: parseInt(data.durationDays.toString()),
        price: parseFloat(data.price.toString()),
      };
      
      if (mode === 'edit' && programId) {
        // Update existing program
        await api.put(`/api/gym/programs/${programId}`, formattedData);
        toast.success('Program updated successfully');
      } else {
        // Create new program
        await api.post(`/api/gym/programs`, formattedData);
        toast.success('Program created successfully');
      }
      
      // Navigate back to programs list
      router.push('/admin/programs');
    } catch (err: any) {
      console.error('Error saving program:', err);
      setError(err.response?.data?.message || 'Failed to save program. Please try again.');
    } finally {
      setIsLoading(false);
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
        <Button variant="outline" onClick={() => router.push('/admin/programs')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Programs
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Create New Program' : 'Edit Program'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Program Title</Label>
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
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  {...register('description')} 
                  disabled={isLoading}
                  className={errors.description ? 'border-red-500' : ''}
                  rows={6}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* Program Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Program Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                  <Select 
                    value={watchDifficultyLevel}
                    onValueChange={(value) => setValue('difficultyLevel', value as any)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="durationDays">Duration (days)</Label>
                  <Input 
                    id="durationDays" 
                    type="number"
                    {...register('durationDays')} 
                    disabled={isLoading}
                    min="1"
                    className={errors.durationDays ? 'border-red-500' : ''}
                  />
                  {errors.durationDays && (
                    <p className="text-red-500 text-sm">{errors.durationDays.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Pricing and Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing and Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number"
                    step="0.01"
                    {...register('price')} 
                    disabled={isLoading}
                    min="0"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="isActive" className="block mb-2">Program Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={watchIsActive}
                      onCheckedChange={(checked) => setValue('isActive', checked)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      {watchIsActive ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                  <p className="text-sm text-neutral-500">
                    {watchIsActive 
                      ? 'Program is visible to users and available for purchase.' 
                      : 'Program is hidden from users and cannot be purchased.'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => router.push('/admin/programs')}
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
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
                      api.delete(`/api/gym/programs/${programId}`)
                        .then(() => {
                          toast.success('Program deleted successfully');
                          router.push('/admin/programs');
                        })
                        .catch(err => {
                          console.error('Error deleting program:', err);
                          toast.error('Failed to delete program. It may have active users.');
                        });
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              )}
              <Button type="submit" disabled={isLoading}>
                {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                <Save className="mr-2 h-4 w-4" />
                {mode === 'create' ? 'Create Program' : 'Save Changes'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}