import { Container, Typography, Box, Grid, Card, CardContent, Chip } from '@mui/material';
import Link from 'next/link';
import { FaExchangeAlt, FaClock, FaCode, FaCompress } from 'react-icons/fa';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Converters - SleekTools',
  description:
    'Convert between different data formats and encodings. Base64, timestamps, image compression and more conversion tools.',
  keywords: 'converter, Base64 converter, timestamp converter, image compressor, data conversion',
};

const converters = [
  {
    title: 'Base64 Converter',
    description: 'Encode and decode Base64 strings and files',
    href: '/converters/base64',
    icon: <FaCode />,
    color: 'primary',
  },
  {
    title: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and dates',
    href: '/converters/timestamp',
    icon: <FaClock />,
    color: 'secondary',
  },
  {
    title: 'Image Compressor',
    description: 'Compress and optimize images while maintaining quality',
    href: '/converters/image',
    icon: <FaCompress />,
    color: 'success',
  },
];

export default function ConvertersPage() {
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
          Data Converters
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Convert between different formats and encodings
        </Typography>
        <Chip label={`${converters.length} Converters Available`} color="info" />
      </Box>

      <Grid container spacing={4}>
        {converters.map((converter, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              component={Link}
              href={converter.href}
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
                    color: `${converter.color}.main`,
                    mb: 2,
                  }}
                >
                  {converter.icon}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {converter.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {converter.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
