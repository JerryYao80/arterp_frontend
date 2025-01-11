import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface ResourceUtilizationChartProps {
  data: {
    typeDistribution: Record<string, number>;
    statusDistribution: Record<string, number>;
    qualityDistribution: Record<string, number>;
  };
}

export default function ResourceUtilizationChart({ data }: ResourceUtilizationChartProps) {
  const chartData = Object.entries(data.typeDistribution || {}).map(([type, total]) => {
    const available = data.statusDistribution?.['Available'] || 0;
    const quality = Object.entries(data.qualityDistribution || {}).reduce(
      (acc, [grade, count]) => acc + (grade === 'A' ? count : 0),
      0
    );

    return {
      type,
      total,
      available,
      quality,
      utilization: total > 0 ? ((total - available) * 100) / total : 0,
      qualityRatio: total > 0 ? (quality * 100) / total : 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="type" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar
          name="Utilization Rate (%)"
          dataKey="utilization"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name="Quality Rate (%)"
          dataKey="qualityRatio"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Tooltip />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
} 