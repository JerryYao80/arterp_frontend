import { ReactNode } from 'react';
import { Card, CardContent, Typography, Box, SxProps, Theme } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  sx?: SxProps<Theme>;
}

export default function StatsCard({ title, value, icon, trend, sx }: StatsCardProps) {
  return (
    <Card sx={{ height: '100%', ...sx }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {trend && (
              <Typography
                variant="body2"
                color={trend.value >= 0 ? 'success.main' : 'error.main'}
                sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
              >
                {trend.value >= 0 ? '+' : ''}{trend.value}%
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {trend.label}
                </Typography>
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                backgroundColor: 'primary.light',
                borderRadius: 2,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
} 