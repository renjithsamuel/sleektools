'use client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

export const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  fileName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{
        sx: {
          bgcolor: '#fff',
          borderRadius: 3,
          p: 2,
          textAlign: 'center',
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0,0,0,0.3)',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" color="error">
          Confirm Deletion
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete <strong style={{ color: '#0c2465' }}>{fileName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} sx={{ color: '#727D90', fontWeight: 600 }} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
