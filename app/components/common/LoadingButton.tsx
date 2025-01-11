import { ReactNode } from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface LoadingButtonProps extends Omit<ButtonProps, 'loading'> {
  loading?: boolean;
  startIcon?: ReactNode;
  children: ReactNode;
}

export default function LoadingButton({
  loading = false,
  startIcon,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={loading || disabled}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
    >
      {children}
    </Button>
  );
} 