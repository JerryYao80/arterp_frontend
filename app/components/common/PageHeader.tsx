import { ReactNode } from 'react';
import { Box, Typography, Button, SxProps, Theme } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
  };
  sx?: SxProps<Theme>;
}

export default function PageHeader({ title, subtitle, action, sx }: PageHeaderProps) {
  return (
    <Box
      sx={{
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...sx,
      }}
    >
      <Box>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="subtitle1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Button
          variant="contained"
          startIcon={action.icon}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
} 