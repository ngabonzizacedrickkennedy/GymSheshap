'use client';

import { useState } from 'react';
import { 
  AlertCircle, 
  AlertTriangle,
  ShoppingBag, 
  Package,
  ServerOff,
  CreditCard,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Sample alerts data
const systemAlerts = [
  {
    id: 1,
    type: 'error',
    title: 'Payment Gateway Issue',
    description: 'The payment gateway is experiencing connectivity issues. Some transactions may fail.',
    time: '10 minutes ago',
    icon: CreditCard,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Low Stock Alert',
    description: 'Several products are running low on inventory. Please check the inventory report.',
    time: '30 minutes ago',
    icon: Package,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Abandoned Carts Increasing',
    description: '15 shopping carts were abandoned in the last hour, which is 25% above normal.',
    time: '1 hour ago',
    icon: ShoppingBag,
  },
  {
    id: 4,
    type: 'error',
    title: 'Server Performance Degraded',
    description: 'The application server is experiencing high load. Performance may be affected.',
    time: '2 hours ago',
    icon: ServerOff,
  },
];

export function AdminAlerts() {
  // In a real app, this would fetch from an API
  const [alerts, setAlerts] = useState(systemAlerts);

  // Function to dismiss an alert
  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // Function to get alert styles based on type
  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-800';
    }
  };

  // If no alerts, show a success message
  if (alerts.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">All Clear</AlertTitle>
        <AlertDescription className="text-green-700">
          There are no system alerts at this time. Everything is running smoothly.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Alert key={alert.id} className={cn(getAlertStyle(alert.type))}>
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <alert.icon className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>
                  {alert.description}
                  <p className="text-xs mt-1 opacity-70">{alert.time}</p>
                </AlertDescription>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => dismissAlert(alert.id)}
              className="h-6 px-2 text-xs"
            >
              Dismiss
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
}