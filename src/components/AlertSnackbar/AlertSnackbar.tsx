import React, { FC } from 'react';
import { Snackbar } from '@mui/material';

export interface AlertSnackbarProps {
  open: boolean;
  autoHideDuration?: number;
  onClose?: () => void;
  children: React.ReactElement;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

export const AlertSnackbar: FC<AlertSnackbarProps> = ({
  children,
  anchorOrigin = {
    vertical: 'top',
    horizontal: 'right',
  },
  autoHideDuration = 4000,
  ...props
}) => {
  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
      sx={{
        '@media (max-width: 600px)': {
          width: '100vw',
          left: 0,
          bottom: 0,
          '& > div': {
            width: '100vw',
            borderRadius: 0,
          },
        },
      }}
      {...props}
    >
      {children}
    </Snackbar>
  );
};
