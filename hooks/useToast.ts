import { useSnackbar } from 'notistack';

export function useToast() {
  const { enqueueSnackbar } = useSnackbar();

  const showSuccess = (message: string) => {
    enqueueSnackbar(message, { variant: 'success' });
  };

  const showError = (message: string) => {
    enqueueSnackbar(message, { variant: 'error' });
  };

  const showWarning = (message: string) => {
    enqueueSnackbar(message, { variant: 'warning' });
  };

  const showInfo = (message: string) => {
    enqueueSnackbar(message, { variant: 'info' });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
} 