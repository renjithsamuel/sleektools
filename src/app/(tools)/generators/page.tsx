import { Container, Typography, Box, Grid, Card, CardContent, Chip } from '@mui/material';
import Link from 'next/link';
import { FaKey, FaBarcode, FaHashtag, FaFont } from 'react-icons/fa';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generators - SleekTools',
  description:
    'Free online generators for passwords, UUIDs, barcodes, hashes and more. Create secure and unique identifiers instantly.',
  keywords:
    'generator, password generator, UUID generator, hash generator, barcode generator, Lorem Ipsum',
};

const generators = [
  {
    title: 'UUID Generator',
    description: 'Generate unique identifiers (UUIDs)',
    href: '/generators/uuid',
    icon: <FaBarcode />,
    color: 'primary',
  },
  {
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text with various themes and styles',
    href: '/generators/lorem',
    icon: <FaFont />,
    color: 'info',
  },
];

export default function GeneratorsPage() {
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
          Generators
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Generate unique identifiers and random data
        </Typography>
        <Chip
          label={`${generators.length} Generators Available`}
          sx={{
            backgroundColor: 'warning.main',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.875rem',
            px: 2,
            py: 0.5,
            borderRadius: 2,
            boxShadow: 'none',
          }}
        />
      </Box>

      <Grid container spacing={4}>
        {generators.map((generator, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              component={Link}
              href={generator.href}
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
                    color: `${generator.color}.main`,
                    mb: 2,
                  }}
                >
                  {generator.icon}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {generator.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {generator.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
