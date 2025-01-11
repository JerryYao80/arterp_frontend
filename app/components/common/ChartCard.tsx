import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, IconButton, Box, SxProps, Theme } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

interface ChartCardProps {
  title: string;
  subheader?: string;
  children: ReactNode;
  action?: ReactNode;
  sx?: SxProps<Theme>;
}

export default function ChartCard({ title, subheader, children, action, sx }: ChartCardProps) {
  return (
    <Card sx={{ height: '100%', ...sx }}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          action || (
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          )
        }
      />
      <CardContent>
        <Box sx={{ width: '100%', height: 300 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
} 