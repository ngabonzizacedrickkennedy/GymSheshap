// src/services/analyticsMockService.ts
/**
 * Mock service for analytics data
 * In a real application, this would be fetched from the backend API
 */

// Generate random data based on date range
export const generateMockAnalyticsData = (fromDate: Date | undefined, toDate: Date | undefined) => {
    // Use default dates if undefined
    const from = fromDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const to = toDate || new Date();
    // Helper to generate random number within range
    const randomInRange = (min: number, max: number) => 
      Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Generate dates between from and to
    const generateDatesBetween = (start: Date, end: Date, maxPoints = 14) => {
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const step = Math.max(1, Math.floor(days / maxPoints));
      
      const dates = [];
      let currentDate = new Date(start);
      
      while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + step);
      }
      
      return dates;
    };
    
    // Format date as string
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    // Generate dates
    const dates = generateDatesBetween(from, to);
    
    // Generate daily revenue and order data
    const revenueData = dates.map(date => {
      const revenue = randomInRange(1500, 8000);
      const orders = randomInRange(15, 50);
      
      return {
        date: formatDate(date),
        revenue,
        orders
      };
    });
    
    // Generate user acquisition data
    const userAcquisitionData = dates.map(date => ({
      date: formatDate(date),
      newUsers: randomInRange(10, 100)
    }));
    
    // Generate top products
    const topProducts = [
      {
        id: 1,
        name: "Premium Yoga Mat",
        imageUrl: "/images/products/yoga-mat.jpg",
        category: "Equipment",
        totalSales: randomInRange(80, 150),
        revenue: randomInRange(2000, 5000),
        growth: randomInRange(-5, 15),
        quantity: randomInRange(80, 150),
      },
      {
        id: 2,
        name: "Resistance Bands Set",
        imageUrl: "/images/products/resistance-bands.jpg",
        category: "Equipment",
        totalSales: randomInRange(90, 180),
        revenue: randomInRange(1800, 4000),
        growth: randomInRange(10, 25),
        quantity: randomInRange(90, 180),
      },
      {
        id: 3,
        name: "SheShape Water Bottle",
        imageUrl: "/images/products/water-bottle.jpg",
        category: "Accessories",
        totalSales: randomInRange(100, 200),
        revenue: randomInRange(1500, 3000),
        growth: randomInRange(8, 20),
        quantity: randomInRange(100, 200),
      },
      {
        id: 4,
        name: "Fitness Tracker",
        imageUrl: "/images/products/fitness-tracker.jpg",
        category: "Electronics",
        totalSales: randomInRange(40, 80),
        revenue: randomInRange(4000, 8000),
        growth: randomInRange(-10, 5),
        quantity: randomInRange(40, 80),
      },
      {
        id: 5,
        name: "Protein Powder",
        imageUrl: "/images/products/protein-powder.jpg",
        category: "Nutrition",
        totalSales: randomInRange(60, 120),
        revenue: randomInRange(2500, 5000),
        growth: randomInRange(5, 15),
        quantity: randomInRange(60, 120),
      },
    ];
    
    // Generate metrics
    const previousPeriodDays = toDate.getTime() - fromDate.getTime();
    // /admin/blog/[action]/[id]
    return {
      userMetrics: {
        totalUsers: randomInRange(10000, 15000),
        userGrowthRate: randomInRange(-5, 15),
        activeUsers: randomInRange(4000, 8000),
        churnRate: randomInRange(2, 8),
      },
      financialMetrics: {
        totalRevenue: revenueData.reduce((sum, day) => sum + day.revenue, 0),
        revenueGrowthRate: randomInRange(-3, 12),
        averageOrderValue: randomInRange(65, 120),
        lifetimeValue: randomInRange(250, 500),
      },
      orderMetrics: {
        totalOrders: revenueData.reduce((sum, day) => sum + day.orders, 0),
        orderGrowthRate: randomInRange(-2, 10),
        conversionRate: randomInRange(2, 5),
        abandonedCarts: randomInRange(150, 300),
      },
      conversionMetrics: {
        conversionRate: randomInRange(2.5, 4.5),
        conversionRateChange: randomInRange(-0.5, 1.5),
        checkoutCompletionRate: randomInRange(60, 75),
        acquisitionCost: randomInRange(15, 30),
      },
      revenueData,
      userAcquisitionData,
      topProducts,
      contentEngagement: {
        topBlogs: [
          { id: 1, title: "10 Essential Exercises for Women", views: randomInRange(1000, 5000) },
          { id: 2, title: "Nutrition Guide for Muscle Building", views: randomInRange(800, 4000) },
          { id: 3, title: "How to Stay Motivated in Your Fitness Journey", views: randomInRange(700, 3500) },
        ],
        topPrograms: [
          { id: 1, title: "30-Day Total Body Transformation", enrollments: randomInRange(100, 300) },
          { id: 2, title: "Yoga for Beginners", enrollments: randomInRange(80, 250) },
          { id: 3, title: "HIIT Cardio Challenge", enrollments: randomInRange(50, 200) },
        ],
      },
    };
  };