// src/app/(admin)/admin/nutrition/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

// Form schema
const nutritionPlanSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  durationDays: z.coerce.number().min(1, 'Duration must be at least 1 day'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  isActive: z.boolean().default(true),
});

type NutritionPlanFormValues = z.infer<typeof nutritionPlanSchema>;

export default function EditNutritionPlanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NutritionPlanFormValues>({
    resolver: zodResolver(nutritionPlanSchema),
    defaultValues: {
      title: '',
      description: '',
      durationDays: 30,
      price: 0,
      isActive: true,
    },
  });

  // Fetch plan details
  useEffect(() => {
    const fetchPlanDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/nutrition/plans/${params.id}`);
        const plan = response.data;
        
        reset({
          title: plan.title,
          description: plan.description,
          durationDays: plan.durationDays,
          price: plan.price,
          isActive: plan.isActive,
        });
      } catch (err) {
        console.error('Failed to fetch nutrition plan:', err);
        setError('Failed to load nutrition plan details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanDetails();
  }, [params.id, reset]);

  const onSubmit = async (data: NutritionPlanFormValues) => {
    setIsSubmitting(true);
    try {
      await api.put(`/api/nutrition/plans/${params.id}`, data);
      toast.success('Nutrition plan updated successfully');
      router.push('/admin/nutrition');
    } catch (error) {
      console.error('Failed to update nutrition plan:', error);
      toast.error('Failed to update nutrition plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" asChild className="mr-4">
          <Link href="/admin/nutrition">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Nutrition Plans
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Nutrition Plan</h2>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => router.push('/admin/nutrition')}>
              Back to Nutrition Plans
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Nutrition Plan Details</CardTitle>
              <CardDescription>
                Update the details of this nutrition plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., 30-Day Weight Loss Plan"
                  {...register('title')}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the nutrition plan..."
                  rows={5}
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="durationDays">
                    Duration (Days) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="durationDays"
                    type="number"
                    min={1}
                    {...register('durationDays')}
                    className={errors.durationDays ? 'border-red-500' : ''}
                  />
                  {errors.durationDays && (
                    <p className="text-red-500 text-sm">{errors.durationDays.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price ($) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step={0.01}
                    {...register('price')}
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isActive" {...register('isActive')} />
                <Label htmlFor="isActive">
                  Make this plan active and available for purchase
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/admin/nutrition')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}