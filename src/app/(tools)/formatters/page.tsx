import { Container, Typography, Box, Grid, Card, CardContent, Chip } from '@mui/material';
import Link from 'next/link';
import { FaCode, FaFileAlt, FaDatabase, FaPaintBrush } from 'react-icons/fa';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formatters - SleekTools',
  description:
    'Professional code and data formatting tools. Format JSON, XML, SQL, CSS and more with our free online formatters.',
  keywords:
    'formatter, JSON formatter, XML formatter, SQL formatter, CSS formatter, code formatter',
};

const formatters = [
  {
    title: 'JSON Formatter',
    description: 'Format, validate and beautify JSON data',
    href: '/formatters/json',
    icon: <FaCode />,
    color: 'primary',
  },
  {
    title: 'XML Formatter',
    description: 'Format and validate XML documents',
    href: '/formatters/xml',
    icon: <FaFileAlt />,
    color: 'secondary',
  },
  {
    title: 'SQL Formatter',
    description: 'Format SQL queries with syntax highlighting',
    href: '/formatters/sql',
    icon: <FaDatabase />,
    color: 'success',
  },
  {
    title: 'CSS Formatter',
    description: 'Format and beautify CSS code with custom options',
    href: '/formatters/css',
    icon: <FaPaintBrush />,
    color: 'info',
  },
];

export default function FormattersPage() {
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
          Code & Data Formatters
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Professional formatting tools for developers and data analysts
        </Typography>
        <Chip label={`${formatters.length} Formatters Available`} color="primary" />
      </Box>

      <Grid container spacing={4}>
        {formatters.map((formatter, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              component={Link}
              href={formatter.href}
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
                    color: `${formatter.color}.main`,
                    mb: 2,
                  }}
                >
                  {formatter.icon}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {formatter.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {formatter.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
