// src/components/admin/nutrition/NutritionPlanForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Save } from 'lucide-react';

// Form schema
const nutritionPlanSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  durationDays: z.coerce.number().min(1, 'Duration must be at least 1 day'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  isActive: z.boolean().default(true),
});

export type NutritionPlanFormValues = z.infer<typeof nutritionPlanSchema>;

interface NutritionPlanFormProps {
  defaultValues?: Partial<NutritionPlanFormValues>;
  isSubmitting: boolean;
  onSubmit: (data: NutritionPlanFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function NutritionPlanForm({
  defaultValues,
  isSubmitting,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: NutritionPlanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NutritionPlanFormValues>({
    resolver: zodResolver(nutritionPlanSchema),
    defaultValues: {
      title: '',
      description: '',
      durationDays: 30,
      price: 0,
      isActive: true,
      ...defaultValues,
    },
  });

  // Watch the isActive value
  const isActiveWatch = watch('isActive');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <p className="text-sm text-red-500">{errors.title.message}</p>
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
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
        <p className="text-xs text-neutral-500">
          Describe what this plan includes and who it's for
        </p>
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
            <p className="text-sm text-red-500">{errors.durationDays.message}</p>
          )}
          <p className="text-xs text-neutral-500">
            How many days this plan will last
          </p>
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
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
          <p className="text-xs text-neutral-500">
            Set a price for this nutrition plan
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox 
          id="isActive"
          checked={isActiveWatch}
          onCheckedChange={(checked) => setValue('isActive', !!checked)}
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor="isActive">
            Make this plan active and available for purchase
          </Label>
          <p className="text-xs text-neutral-500">
            Inactive plans will not be visible to users
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
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
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}