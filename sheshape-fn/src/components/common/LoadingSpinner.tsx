import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-white/70 border-t-white',
        {
          'h-4 w-4 border-2': size === 'sm',
          'h-8 w-8 border-[3px]': size === 'md',
          'h-12 w-12 border-4': size === 'lg',
        },
        className
      )}
    />
  );
}