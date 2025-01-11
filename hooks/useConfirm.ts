import React, { useState } from 'react';
import type { DialogProps } from '@mui/material/Dialog';
import type { ButtonProps } from '@mui/material/Button';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<ConfirmDialogProps>({
    title: '',
    message: '',
  });
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = (props: ConfirmDialogProps): Promise<boolean> => {
    setDialogProps(props);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolveRef(() => resolve);
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    resolveRef?.(false);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolveRef?.(true);
  };

  const ConfirmDialog: React.FC = () => {
    const dialogHandleClose: DialogProps['onClose'] = (event, reason) => {
      handleClose();
    };

    return (
      <Dialog 
        open={isOpen} 
        onClose={dialogHandleClose}
      >
        <DialogTitle>{dialogProps.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogProps.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
          >
            {dialogProps.cancelLabel || 'Cancel'}
          </Button>
          <Button 
            onClick={handleConfirm} 
            variant="contained" 
            autoFocus
          >
            {dialogProps.confirmLabel || 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return {
    confirm,
    ConfirmDialog,
  };
} 