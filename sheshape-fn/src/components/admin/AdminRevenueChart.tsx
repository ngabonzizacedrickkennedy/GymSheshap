'use client';

import { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Sample data
const sampleData = [
  { name: 'Mar 1', revenue: 4000, orders: 24 },
  { name: 'Mar 5', revenue: 3000, orders: 18 },
  { name: 'Mar 10', revenue: 2000, orders: 22 },
  { name: 'Mar 15', revenue: 2780, orders: 30 },
  { name: 'Mar 20', revenue: 1890, orders: 20 },
  { name: 'Mar 25', revenue: 2390, orders: 24 },
  { name: 'Mar 30', revenue: 3490, orders: 36 },
];

export function AdminRevenueChart() {
  // In a real app, this would fetch from API
  const [data, setData] = useState<typeof sampleData>([]);
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setData(sampleData);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="revenue"
          stroke="#0B5B47"
          activeDot={{ r: 8 }}
        />
        <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#FFAE9C" />
      </LineChart>
    </ResponsiveContainer>
  );
}