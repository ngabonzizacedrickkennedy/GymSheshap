// src/components/admin/nutrition/NutritionPlanDetailsCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';

interface NutritionPlanDetailsCardProps {
  plan: {
    id: number;
    title: string;
    description: string;
    durationDays: number;
    price: number;
    isActive: boolean;
    nutritionist?: {
      username: string;
      profile?: {
        firstName?: string;
        lastName?: string;
      };
    };
  };
}

export function NutritionPlanDetailsCard({ plan }: NutritionPlanDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{plan.title}</CardTitle>
          <Badge 
            variant="outline" 
            className={plan.isActive 
              ? "bg-green-100 text-green-800 border-green-200" 
              : "bg-neutral-100 text-neutral-800 border-neutral-200"
            }
          >
            {plan.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <CardDescription>ID: {plan.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Duration</p>
            <p className="text-sm">{plan.durationDays} days</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Price</p>
            <p className="text-sm">{formatPrice(plan.price)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Nutritionist</p>
            <p className="text-sm">
              {plan.nutritionist?.profile?.firstName
                ? `${plan.nutritionist.profile.firstName} ${plan.nutritionist.profile.lastName || ''}`
                : plan.nutritionist?.username || 'Unknown'}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Description</p>
          <p className="text-sm">{plan.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}