'use client';
import { Box, Typography, Button, useTheme } from '@mui/material';
import Link from 'next/link';

const Custom404 = () => {
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
        <Typography variant="h2">404 - Page Not Found</Typography>
        <Typography variant="h5" color={theme.palette.text.primary}>
          The page you are looking for doesnt exist.
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
            Go to Home
          </Button>
        </Link>
      </Box>
    </>
  );
};

export default Custom404;
