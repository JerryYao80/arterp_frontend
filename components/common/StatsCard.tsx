import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  const isPositiveTrend = trend && trend.value >= 0;

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
          <Box sx={{ color: 'primary.main', '& svg': { fontSize: 40 } }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" component="div" gutterBottom>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>
        {trend && (
          <Box display="flex" alignItems="center">
            {isPositiveTrend ? (
              <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
            ) : (
              <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
            )}
            <Typography
              variant="body2"
              sx={{ color: isPositiveTrend ? 'success.main' : 'error.main' }}
            >
              {isPositiveTrend ? '+' : ''}
              {trend.value.toFixed(1)}% {trend.label}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
} 