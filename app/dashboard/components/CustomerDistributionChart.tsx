import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface CustomerDistributionChartProps {
  data: {
    typeDistribution: Record<string, number>;
    statusDistribution: Record<string, number>;
  };
}

export default function CustomerDistributionChart({ data }: CustomerDistributionChartProps) {
  const typeData = Object.entries(data.typeDistribution || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const statusData = Object.entries(data.statusDistribution || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={typeData}
          cx="30%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label
        >
          {typeData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Pie
          data={statusData}
          cx="70%"
          cy="50%"
          outerRadius={80}
          fill="#82ca9d"
          dataKey="value"
          nameKey="name"
          label
        >
          {statusData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
} 