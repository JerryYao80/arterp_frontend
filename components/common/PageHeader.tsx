import { Box, Typography, Button } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography variant="h5" gutterBottom={!!subtitle}>
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