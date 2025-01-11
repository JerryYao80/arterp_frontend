import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BusinessProcessChartProps {
  data: {
    typeDistribution: Record<string, number>;
    statusDistribution: Record<string, number>;
  };
}

export default function BusinessProcessChart({ data }: BusinessProcessChartProps) {
  const chartData = Object.entries(data.statusDistribution || {}).map(([status, count]) => ({
    status,
    count,
    type: Object.entries(data.typeDistribution || {}).reduce((acc, [type, typeCount]) => {
      acc[type] = typeCount;
      return acc;
    }, {} as Record<string, number>),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Total" fill="#8884d8" />
        {Object.keys(data.typeDistribution || {}).map((type, index) => (
          <Bar
            key={type}
            dataKey={`type.${type}`}
            name={type}
            fill={`hsl(${(index * 360) / Object.keys(data.typeDistribution || {}).length}, 70%, 50%)`}
            stackId="type"
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
} 