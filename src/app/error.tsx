'use client';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';

const CustomError = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        gap={4}
      >
        <Typography variant="h2">500 - Internal Server Error</Typography>
        <Typography variant="h5" color={theme.palette.text.primary}>
          Something Went Wrong.
        </Typography>
        <Link href="/">
          <Button
            variant="contained"
            sx={{
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.secondary.main,
              '&:hover': {
                backgroundColor: theme.palette.secondary.main,
              },
            }}
          >
            Refresh
          </Button>
        </Link>
      </Box>
    </>
  );
};

export default CustomError;
