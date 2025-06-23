// src/app/(admin)/admin/nutrition/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users, 
  EyeOff, 
  Eye,
  SlidersHorizontal,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'react-toastify';

// Define the nutrition plan interface
interface NutritionPlan {
  id: number;
  title: string;
  description: string;
  durationDays: number;
  price: number;
  isActive: boolean;
  nutritionistId: number;
  nutritionist: {
    username: string;
    profile?: {
      firstName?: string;
      lastName?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminNutritionPage() {
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<NutritionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState<string | null>(null);

  // Fetch all nutrition plans
  const fetchNutritionPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/nutrition/plans/all');
      setPlans(response.data);
      setFilteredPlans(response.data);
    } catch (err) {
      console.error('Failed to fetch nutrition plans:', err);
      setError('Failed to load nutrition plans. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load plans on component mount
  useEffect(() => {
    fetchNutritionPlans();
  }, []);

  // Filter plans based on search query and active tab
  useEffect(() => {
    let result = [...plans];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (plan) => 
          plan.title.toLowerCase().includes(query) || 
          plan.description.toLowerCase().includes(query) ||
          plan.nutritionist.username.toLowerCase().includes(query) ||
          (plan.nutritionist.profile?.firstName?.toLowerCase().includes(query)) ||
          (plan.nutritionist.profile?.lastName?.toLowerCase().includes(query))
      );
    }
    
    // Filter by active status
    if (activeTab === 'active') {
      result = result.filter(plan => plan.isActive);
    } else if (activeTab === 'inactive') {
      result = result.filter(plan => !plan.isActive);
    }
    
    setFilteredPlans(result);
  }, [plans, searchQuery, activeTab]);

  // Toggle plan active status
  const togglePlanStatus = async (planId: number, currentStatus: boolean) => {
    try {
      const endpoint = currentStatus 
        ? `/api/nutrition/plans/${planId}/deactivate` 
        : `/api/nutrition/plans/${planId}/activate`;
      
      await api.put(endpoint);
      
      // Update local state to reflect the change
      setPlans(plans.map(plan => 
        plan.id === planId 
          ? { ...plan, isActive: !currentStatus } 
          : plan
      ));
      
      toast.success(`Plan ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      console.error('Failed to update plan status:', err);
      toast.error('Failed to update plan status. Please try again.');
    }
  };

  // Delete a plan
  const deletePlan = async (planId: number) => {
    if (!window.confirm('Are you sure you want to delete this nutrition plan? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/api/nutrition/plans/${planId}`);
      
      // Remove the deleted plan from state
      setPlans(plans.filter(plan => plan.id !== planId));
      toast.success('Nutrition plan deleted successfully');
    } catch (err) {
      console.error('Failed to delete nutrition plan:', err);
      toast.error('Failed to delete nutrition plan. It may be associated with active users.');
    }
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(5).fill(null).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Nutrition Plans</h2>
          <p className="text-muted-foreground">
            Manage nutrition plans for the platform
          </p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/admin/nutrition/create">
            <Plus className="mr-2 h-4 w-4" /> Add Nutrition Plan
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-center text-red-800">
            <span>{error}</span>
            <Button 
              variant="outline" 
              className="ml-4 text-red-800 border-red-300 hover:bg-red-100"
              onClick={fetchNutritionPlans}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-96 mb-4 md:mb-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plans, nutritionists..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full md:w-auto"
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
              </Tabs>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuItem>Newest First</DropdownMenuItem>
                  <DropdownMenuItem>Oldest First</DropdownMenuItem>
                  <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                  <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Nutritionist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  renderSkeletons()
                ) : filteredPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No nutrition plans found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="font-medium">{plan.title}</div>
                      </TableCell>
                      <TableCell>{plan.durationDays} days</TableCell>
                      <TableCell>{formatPrice(plan.price)}</TableCell>
                      <TableCell>
                        {plan.nutritionist.profile?.firstName
                          ? `${plan.nutritionist.profile.firstName} ${plan.nutritionist.profile.lastName || ''}`
                          : plan.nutritionist.username}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={plan.isActive 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : "bg-neutral-100 text-neutral-800 border-neutral-200"
                          }
                        >
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/nutrition/edit/${plan.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/nutrition/${plan.id}/users`}>
                                <Users className="mr-2 h-4 w-4" />
                                <span>View Subscribers</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => togglePlanStatus(plan.id, plan.isActive)}>
                              {plan.isActive ? (
                                <>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  <span>Deactivate</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>Activate</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => deletePlan(plan.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}