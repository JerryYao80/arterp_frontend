import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';

interface ChartCardProps {
  title: string;
  subheader?: string;
  children: React.ReactNode;
}

export default function ChartCard({ title, subheader, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
} 