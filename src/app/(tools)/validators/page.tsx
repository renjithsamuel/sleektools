import { Container, Typography, Box, Grid, Card, CardContent, Chip } from '@mui/material';
import Link from 'next/link';
import { FaCheckCircle, FaDatabase, FaFileCode, FaKey, FaEye } from 'react-icons/fa';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Validators - SleekTools',
  description:
    'Validate code syntax and data formats. Free online validation tools for SQL, YAML, JSON, JWT and more.',
  keywords:
    'validator, SQL validator, YAML validator, JSON validator, JWT decoder, code validation',
};

const validators = [
  {
    title: 'SQL Validator',
    description: 'Validate SQL syntax and get improvement suggestions',
    href: '/validators/sql',
    icon: <FaDatabase />,
    color: 'primary',
  },
  {
    title: 'YAML Validator',
    description: 'Validate YAML syntax and structure',
    href: '/validators/yaml',
    icon: <FaFileCode />,
    color: 'secondary',
  },
  {
    title: 'JWT Decoder',
    description: 'Decode and validate JSON Web Tokens',
    href: '/validators/jwt',
    icon: <FaKey />,
    color: 'success',
  },
  {
    title: 'Swagger Viewer',
    description: 'View and validate OpenAPI/Swagger specifications',
    href: '/validators/swagger',
    icon: <FaEye />,
    color: 'info',
  },
];

export default function ValidatorsPage() {
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
          Code & Data Validators
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Validate syntax and catch errors before deployment
        </Typography>
        <Chip
          label={`${validators.length} Validators Available`}
          sx={{
            backgroundColor: 'success.main',
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
        {validators.map((validator, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              component={Link}
              href={validator.href}
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
                    color: `${validator.color}.main`,
                    mb: 2,
                  }}
                >
                  {validator.icon}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {validator.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {validator.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
