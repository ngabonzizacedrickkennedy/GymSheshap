// src/components/admin/analytics/UserAcquisitionChart.tsx
'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface UserAcquisitionChartProps {
  data: Array<{
    date: string;
    newUsers: number;
    source?: string;
  }>;
}

export function UserAcquisitionChart({ data }: UserAcquisitionChartProps) {
  // Generate colors based on the SheShape color palette
  const barColors = [
    '#0B5B47', // primary
    '#2FA572', // secondary
    '#7ACAA9', // lighter green
    '#B3E0CB', // very light green
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748B' }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748B' }}
        />
        <Tooltip 
          formatter={(value) => [`${value} users`, 'New Sign-ups']}
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Bar dataKey="newUsers" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={barColors[index % barColors.length]} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}