import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface FinancialOverviewChartProps {
  data: {
    monthlyRevenue: number;
    revenueGrowth: number;
    typeDistribution: Record<string, number>;
    statusDistribution: Record<string, number>;
    paymentMethodDistribution: Record<string, number>;
  };
}

export default function FinancialOverviewChart({ data }: FinancialOverviewChartProps) {
  // Transform data for the chart
  const chartData = [
    {
      name: 'Revenue',
      value: data.monthlyRevenue,
      growth: data.revenueGrowth,
    },
    ...Object.entries(data.typeDistribution || {}).map(([type, value]) => ({
      name: type,
      value,
      growth: 0,
    })),
  ];

  // Calculate percentage distribution
  const total = Object.values(data.typeDistribution || {}).reduce((a, b) => a + b, 0);
  const percentageData = chartData.map(item => ({
    ...item,
    percentage: total > 0 ? (item.value * 100) / total : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={percentageData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="value"
          name="Amount"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="percentage"
          name="Percentage"
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="growth"
          name="Growth"
          stroke="#ffc658"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 