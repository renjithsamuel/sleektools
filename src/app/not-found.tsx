import { Metadata } from 'next';
import Link from 'next/link';
import { Container, Typography, Box, Button, Paper, Grid } from '@mui/material';
import { FaHome, FaTools, FaCode, FaFileAlt } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Page Not Found (404)',
  description:
    'The page you are looking for could not be found. Explore our developer tools and utilities.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  const popularTools = [
    { name: 'JSON Formatter', href: '/formatters/json', icon: <FaCode /> },
    { name: 'Base64 Converter', href: '/converters/base64', icon: <FaFileAlt /> },
    { name: 'UUID Generator', href: '/generators/uuid', icon: <FaTools /> },
    { name: 'All Tools', href: '/', icon: <FaHome /> },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h1"
          sx={{
            fontSize: '8rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
          Page Not Found
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Don&apos;t worry! You can still access all our developer tools and utilities.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, textAlign: 'center', mb: 3 }}>
          Popular Developer Tools
        </Typography>
        <Grid container spacing={2}>
          {popularTools.map(tool => (
            <Grid item xs={12} sm={6} md={3} key={tool.name}>
              <Button
                component={Link}
                href={tool.href}
                variant="outlined"
                fullWidth
                startIcon={tool.icon}
                sx={{
                  py: 2,
                  height: '80px',
                  flexDirection: 'column',
                  gap: 1,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                {tool.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Box textAlign="center">
        <Button
          component={Link}
          href="/"
          variant="contained"
          size="large"
          startIcon={<FaHome />}
          sx={{ px: 4, py: 1.5 }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
}
