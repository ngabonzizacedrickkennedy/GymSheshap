// src/app/(admin)/admin/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminMetricCard } from '@/components/admin/AdminMetricCard';
import { Button } from '@/components/ui/button';
import { Download, Users, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { RevenueChart } from '@/components/admin/analytics/RevenueChart';
import { UserAcquisitionChart } from '@/components/admin/analytics/UserAcquisitionChart';
import { TopSellingProducts } from '@/components/admin/analytics/TopSellingProducts';
import { ContentEngagement } from '@/components/admin/analytics/ContentEngagement';
import { DateRangePicker } from '@/components/admin/analytics/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { generateMockAnalyticsData } from '@/services/analyticsMockServices';

export default function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ 
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
    to: new Date() 
  });
  
  // Handle date range changes safely
  const handleDateRangeChange = (range: DateRange) => {
    // Ensure we always have from/to dates by using defaults when undefined
    setDateRange({
      from: range.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: range.to || new Date()
    });
  };
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, using our mock service to generate data
        setTimeout(() => {
          // Ensure we have defined dates before calling the function
          const from = dateRange.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          const to = dateRange.to || new Date();
          const data = generateMockAnalyticsData(from, to);
          setAnalyticsData(data);
          setIsLoading(false);
        }, 800); // Simulate API delay
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [dateRange]);
  
  if (isLoading || !analyticsData) {
    return (
      <div className="flex h-full items-center justify-center min-h-[500px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of platform performance and business metrics
          </p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 md:mt-0">
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminMetricCard 
          title="Total Users"
          value={analyticsData.userMetrics.totalUsers.toLocaleString()}
          trend={`${analyticsData.userMetrics.userGrowthRate.toFixed(1)}%`}
          trendUp={analyticsData.userMetrics.userGrowthRate > 0}
          description="vs. previous period"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <AdminMetricCard 
          title="Revenue"
          value={`$${analyticsData.financialMetrics.totalRevenue.toLocaleString()}`}
          trend={`${analyticsData.financialMetrics.revenueGrowthRate.toFixed(1)}%`}
          trendUp={analyticsData.financialMetrics.revenueGrowthRate > 0}
          description="vs. previous period"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <AdminMetricCard 
          title="Orders"
          value={analyticsData.orderMetrics.totalOrders.toLocaleString()}
          trend={`${analyticsData.orderMetrics.orderGrowthRate.toFixed(1)}%`}
          trendUp={analyticsData.orderMetrics.orderGrowthRate > 0}
          description="vs. previous period"
          icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
        />
        <AdminMetricCard 
          title="Conversion Rate"
          value={`${analyticsData.conversionMetrics.conversionRate.toFixed(1)}%`}
          trend={`${analyticsData.conversionMetrics.conversionRateChange.toFixed(1)}%`}
          trendUp={analyticsData.conversionMetrics.conversionRateChange > 0}
          description="vs. previous period"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      {/* Dashboard Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">User Acquisition</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="content">Content Engagement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Revenue trends over the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <RevenueChart data={analyticsData.revenueData} />
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
                <CardDescription>Across all products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${analyticsData.financialMetrics.averageOrderValue.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
                <CardDescription>Average revenue per user</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${analyticsData.financialMetrics.lifetimeValue.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Checkout Completion</CardTitle>
                <CardDescription>Cart to checkout ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.conversionMetrics.checkoutCompletionRate.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Acquisition</CardTitle>
              <CardDescription>
                New user registrations over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <UserAcquisitionChart data={analyticsData.userAcquisitionData} />
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Monthly active users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.userMetrics.activeUsers.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Churn Rate</CardTitle>
                <CardDescription>Monthly user churn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.userMetrics.churnRate.toFixed(1)}%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Acquisition Cost</CardTitle>
                <CardDescription>Average cost per user</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${analyticsData.conversionMetrics.acquisitionCost.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>
                Best performing products by revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopSellingProducts data={analyticsData.topProducts} />
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Abandoned Carts</CardTitle>
                <CardDescription>Total abandoned carts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.orderMetrics.abandonedCarts.toLocaleString()}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Visit to purchase ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.orderMetrics.conversionRate.toFixed(1)}%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
                <CardDescription>For selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.orderMetrics.totalOrders.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Engagement</CardTitle>
              <CardDescription>
                Blog and program content performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentEngagement data={analyticsData.contentEngagement} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}