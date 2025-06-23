'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  UserPlus,
  Package,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminMetricCard } from '@/components/admin/AdminMetricCard';
import { AdminRevenueChart } from '@/components/admin/AdminRevenueChart';
import { AdminRecentOrders } from '@/components/admin/AdminRecentOrders';
import { AdminActiveUsers } from '@/components/admin/AdminActiveUsers';
import { AdminAlerts } from '@/components/admin/AdminAlerts';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your business performance
          </p>
        </div>
        <div className="mt-4 flex space-x-2 md:mt-0">
          <Button variant="outline">Download Report</Button>
          <Button>View Analytics</Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminMetricCard 
          title="Total Customers"
          value="2,953"
          trend="+12.5%"
          trendUp={true}
          description="vs. previous month"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <AdminMetricCard 
          title="Total Revenue"
          value="$48,395"
          trend="+8.2%"
          trendUp={true}
          description="vs. previous month"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <AdminMetricCard 
          title="Total Orders"
          value="682"
          trend="+6.8%"
          trendUp={true}
          description="vs. previous month"
          icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
        />
        <AdminMetricCard 
          title="Conversion Rate"
          value="3.2%"
          trend="-0.4%"
          trendUp={false}
          description="vs. previous month"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Revenue chart - wider */}
            <Card className="col-span-7 lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>
                  Revenue for the past 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <AdminRevenueChart />
              </CardContent>
            </Card>
            
            {/* Recent activity card */}
            <Card className="col-span-7 lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Recent system activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <UserPlus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-muted-foreground">
                        Sarah Johnson created an account
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      5m ago
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New order placed</p>
                      <p className="text-xs text-muted-foreground">
                        Order #1234 for $89.99
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      15m ago
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New product added</p>
                      <p className="text-xs text-muted-foreground">
                        Resistance Bands Set added to inventory
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      1h ago
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <CheckSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Order fulfilled</p>
                      <p className="text-xs text-muted-foreground">
                        Order #1230 has been shipped
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      2h ago
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-accent1/10">
                      <AlertTriangle className="h-5 w-5 text-accent1" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Low stock alert</p>
                      <p className="text-xs text-muted-foreground">
                        Yoga mats (5 remaining)
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      3h ago
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View all activity</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent orders */}
            <Card className="col-span-7 lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Recent customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminRecentOrders />
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/admin/orders">View all orders</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Active users */}
            <Card className="col-span-7 lg:col-span-3">
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>
                  Users currently online
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminActiveUsers />
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/admin/users">View all users</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* System alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Notifications requiring your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminAlerts />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Dismiss all alerts</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="p-6 bg-white rounded-lg border">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              Detailed analytics content will be displayed here
            </p>
            <Button>Generate analytics report</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="p-6 bg-white rounded-lg border">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Reports Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              Custom reports will be displayed here
            </p>
            <Button>Create new report</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="p-6 bg-white rounded-lg border">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Notification Settings</h3>
            <p className="text-muted-foreground mb-4">
              Manage your notification preferences here
            </p>
            <Button>Update notification settings</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}