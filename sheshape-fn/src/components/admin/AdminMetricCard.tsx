import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminMetricCardProps {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  description: string;
  icon?: ReactNode;
}

export function AdminMetricCard({
  title,
  value,
  trend,
  trendUp,
  description,
  icon,
}: AdminMetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center">
            {icon && (
              <div className="mr-2 h-5 w-5 text-muted-foreground">
                {icon}
              </div>
            )}
            <div className="text-sm font-medium text-muted-foreground">
              {title}
            </div>
          </div>
          <div
            className={cn(
              "flex items-center rounded-full px-2 py-1 text-xs font-medium",
              trendUp ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            )}
          >
            {trendUp ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {trend}
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}