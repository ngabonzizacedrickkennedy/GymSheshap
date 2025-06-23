// src/components/admin/analytics/RevenueChart.tsx
'use client';

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

interface RevenueChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip formatter={(value) => ['$' + value.toLocaleString()]} />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="revenue"
          stroke="#0B5B47"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line 
          yAxisId="right" 
          type="monotone" 
          dataKey="orders" 
          stroke="#FFAE9C" 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}