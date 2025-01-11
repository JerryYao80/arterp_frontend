import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve: ((value: boolean) => void) | null;
}

export function useConfirm() {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    resolve: null,
  });

  const confirm = useCallback(
    ({ title, message, confirmLabel, cancelLabel }: ConfirmOptions) => {
      return new Promise<boolean>((resolve) => {
        setConfirmState({
          isOpen: true,
          title,
          message,
          confirmLabel,
          cancelLabel,
          resolve,
        });
      });
    },
    []
  );

  const handleClose = useCallback(
    (value: boolean) => {
      if (confirmState.resolve) {
        confirmState.resolve(value);
      }
      setConfirmState((prev) => ({ ...prev, isOpen: false }));
    },
    [confirmState]
  );

  return {
    confirm,
    confirmState,
    handleClose,
  };
} 