import { Container, Typography, Box, Grid, Card, CardContent, Chip } from '@mui/material';
import Link from 'next/link';
import { FaEye, FaFileCode } from 'react-icons/fa';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Viewers - SleekTools',
  description:
    'View and parse API documentation and data formats. Swagger/OpenAPI viewer and more.',
  keywords: 'viewer, Swagger viewer, OpenAPI viewer, API documentation',
};

const viewers = [
  {
    title: 'Swagger/OpenAPI Viewer',
    description: 'Parse and visualize API documentation',
    href: '/viewers/swagger',
    icon: <FaFileCode />,
    color: 'primary',
  },
];

export default function ViewersPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Document Viewers
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          View and parse documentation and data formats
        </Typography>
        <Chip label={`${viewers.length} Viewers Available`} color="info" />
      </Box>

      <Grid container spacing={4}>
        {viewers.map((viewer, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              component={Link}
              href={viewer.href}
              sx={{
                textDecoration: 'none',
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                    fontSize: '3rem',
                    color: `${viewer.color}.main`,
                    mb: 2,
                  }}
                >
                  {viewer.icon}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {viewer.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {viewer.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
