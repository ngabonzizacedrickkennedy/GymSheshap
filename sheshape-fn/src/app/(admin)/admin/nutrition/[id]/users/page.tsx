// src/app/(admin)/admin/nutrition/[id]/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ArrowLeft, Mail, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { formatDate, getInitials } from '@/lib/utils';

// Interface for the nutrition plan details
interface NutritionPlan {
  id: number;
  title: string;
  description: string;
  durationDays: number;
  price: number;
  isActive: boolean;
  nutritionist: {
    username: string;
    profile?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

// Interface for user subscription to a nutrition plan
// src/app/(admin)/admin/nutrition/[id]/users/page.tsx (continued)
interface UserNutritionPlan {
    id: number;
    userId: number;
    planId: number;
    purchaseDate: string;
    expiryDate: string;
    status: string;
    user: {
      id: number;
      username: string;
      email: string;
      profile?: {
        firstName?: string;
        lastName?: string;
        profileImage?: string;
      };
    };
  }
  
  export default function NutritionPlanUsersPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [plan, setPlan] = useState<NutritionPlan | null>(null);
    const [subscribers, setSubscribers] = useState<UserNutritionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    // Fetch plan details and subscribers
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Fetch nutrition plan details
          const planResponse = await api.get(`/api/nutrition/plans/${params.id}`);
          setPlan(planResponse.data);
          
          // Fetch subscribers
          const subscribersResponse = await api.get(`/api/nutrition/plans/${params.id}/users`);
          setSubscribers(subscribersResponse.data);
        } catch (err) {
          console.error('Failed to fetch data:', err);
          setError('Failed to load data. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, [params.id]);
  
    // Update user subscription status
    const updateSubscriptionStatus = async (userId: number, currentStatus: string) => {
      const newStatus = currentStatus === 'ACTIVE' ? 'CANCELLED' : 'ACTIVE';
      
      try {
        await api.put(`/api/nutrition/users/${userId}/plans/${params.id}/status`, null, {
          params: { status: newStatus }
        });
        
        // Update local state
        setSubscribers(subscribers.map(sub => 
          sub.userId === userId 
            ? { ...sub, status: newStatus }
            : sub
        ));
        
        toast.success(`Subscription ${newStatus.toLowerCase()} successfully`);
      } catch (err) {
        console.error('Failed to update subscription status:', err);
        toast.error('Failed to update subscription status. Please try again.');
      }
    };
  
    // Render loading view
    if (isLoading) {
      return (
        <div className="space-y-6">
          <div className="flex items-center">
            <Button variant="ghost" asChild className="mr-4">
              <Link href="/admin/nutrition">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Nutrition Plans
              </Link>
            </Button>
            <Skeleton className="h-8 w-64" />
          </div>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-full max-w-md" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  
    // Render error view
    if (error || !plan) {
      return (
        <div className="space-y-6">
          <div className="flex items-center">
            <Button variant="ghost" asChild className="mr-4">
              <Link href="/admin/nutrition">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Nutrition Plans
              </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Nutrition Plan Subscribers</h2>
          </div>
          
          <Card className="p-6 text-center">
            <p className="text-red-500 mb-4">{error || 'Plan not found'}</p>
            <Button onClick={() => router.push('/admin/nutrition')}>
              Back to Nutrition Plans
            </Button>
          </Card>
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" asChild className="mr-4">
            <Link href="/admin/nutrition">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Nutrition Plans
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Nutrition Plan Subscribers</h2>
        </div>
  
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{plan.title}</span>
              <Badge 
                variant="outline" 
                className={plan.isActive 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : "bg-neutral-100 text-neutral-800 border-neutral-200"
                }
              >
                {plan.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm mt-2">
              <span className="block mb-1">{plan.description.substring(0, 150)}...</span>
              <span className="text-xs text-muted-foreground mt-1">
                Duration: {plan.durationDays} days | 
                Nutritionist: {plan.nutritionist.profile?.firstName 
                  ? `${plan.nutritionist.profile.firstName} ${plan.nutritionist.profile.lastName || ''}` 
                  : plan.nutritionist.username}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscribers.length === 0 ? (
              <div className="text-center py-12 border rounded-md bg-neutral-50">
                <p className="text-neutral-600 mb-4">No users have subscribed to this plan yet.</p>
                <Button asChild variant="outline">
                  <Link href="/admin/nutrition">Back to Nutrition Plans</Link>
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={sub.user.profile?.profileImage} />
                              <AvatarFallback>{getInitials(
                                sub.user.profile?.firstName && sub.user.profile.lastName
                                  ? `${sub.user.profile.firstName} ${sub.user.profile.lastName}`
                                  : sub.user.username
                              )}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {sub.user.profile?.firstName && sub.user.profile.lastName
                                  ? `${sub.user.profile.firstName} ${sub.user.profile.lastName}`
                                  : sub.user.username}
                              </p>
                              <p className="text-xs text-muted-foreground">ID: {sub.user.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            <span>{sub.user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            <span>{formatDate(sub.purchaseDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(sub.expiryDate)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={sub.status === 'ACTIVE' 
                              ? "bg-green-100 text-green-800 border-green-200" 
                              : sub.status === 'EXPIRED'
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => updateSubscriptionStatus(sub.userId, sub.status)}
                          >
                            {sub.status === 'ACTIVE' ? (
                              <>
                                <XCircle className="h-4 w-4 mr-1" />
                                <span>Cancel</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                <span>Activate</span>
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }