'use client';
import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Paper,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  FaCopy,
  FaUpload,
  FaTrash,
  FaKey,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
} from 'react-icons/fa';
import { ExpandMore } from '@mui/icons-material';
import { HistoryManager } from '../../../utils/historyManager';

interface JWTPayload {
  [key: string]: any;
}

interface JWTHeader {
  [key: string]: any;
}

interface DecodedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  isValid: boolean;
  isExpired?: boolean;
  expiresAt?: Date;
  issuedAt?: Date;
}

export const JWTDecoderTool = () => {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const decodeJWT = useCallback((token: string): DecodedJWT | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
      }

      const [headerB64, payloadB64, signature] = parts;

      // Decode header
      const headerJson = atob(headerB64.replace(/-/g, '+').replace(/_/g, '/'));
      const header = JSON.parse(headerJson);

      // Decode payload
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp ? payload.exp < now : false;
      const expiresAt = payload.exp ? new Date(payload.exp * 1000) : undefined;
      const issuedAt = payload.iat ? new Date(payload.iat * 1000) : undefined;

      return {
        header,
        payload,
        signature,
        isValid: true,
        isExpired,
        expiresAt,
        issuedAt,
      };
    } catch (err) {
      return null;
    }
  }, []);

  const processJWT = useCallback(() => {
    if (!input.trim()) {
      setDecoded(null);
      setError('');
      return;
    }

    const result = decodeJWT(input.trim());
    if (result) {
      setDecoded(result);
      setError('');

      // Save to history
      HistoryManager.addToHistory({
        toolId: 'jwt-decoder',
        input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
        output: `Decoded JWT - Subject: ${result.payload.sub || 'N/A'}, Expires: ${result.expiresAt?.toLocaleString() || 'Never'}`,
        title: 'JWT Decoded',
      });
    } else {
      setDecoded(null);
      setError('Invalid JWT token. Please check the format and try again.');
    }
  }, [input, decodeJWT]);

  useEffect(() => {
    const timeoutId = setTimeout(processJWT, 300);
    return () => clearTimeout(timeoutId);
  }, [processJWT]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to copy', severity: 'error' });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as string;
        setInput(content.trim());
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setInput('');
    setDecoded(null);
    setError('');
  };

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const renderTable = (data: any, title: string) => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Claim</strong>
            </TableCell>
            <TableCell>
              <strong>Value</strong>
            </TableCell>
            <TableCell>
              <strong>Description</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(data).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell sx={{ fontFamily: 'Monaco, Consolas, monospace', fontSize: '13px' }}>
                {key}
              </TableCell>
              <TableCell sx={{ fontFamily: 'Monaco, Consolas, monospace', fontSize: '13px' }}>
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </TableCell>
              <TableCell sx={{ fontSize: '12px', color: 'text.secondary' }}>
                {getClaimDescription(key)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const getClaimDescription = (claim: string): string => {
    const descriptions: { [key: string]: string } = {
      iss: 'Issuer - identifies who issued the JWT',
      sub: 'Subject - identifies the subject of the JWT',
      aud: 'Audience - identifies the recipients that the JWT is intended for',
      exp: 'Expiration Time - identifies the expiration time after which the JWT must not be accepted',
      nbf: 'Not Before - identifies the time before which the JWT must not be accepted',
      iat: 'Issued At - identifies the time at which the JWT was issued',
      jti: 'JWT ID - provides a unique identifier for the JWT',
      alg: 'Algorithm - identifies the cryptographic algorithm used to secure the JWT',
      typ: 'Type - declares the media type of the JWT',
      kid: 'Key ID - hint indicating which key was used to secure the JWT',
    };
    return descriptions[claim] || 'Custom claim';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            JWT Decoder & Validator
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Decode, validate, and inspect JSON Web Tokens (JWT)
          </Typography>

          {decoded && (
            <Box display="flex" justifyContent="center" gap={2} mb={2}>
              <Chip icon={<FaCheckCircle />} label="Valid JWT" color="success" size="small" />
              {decoded.isExpired && (
                <Chip icon={<FaExclamationTriangle />} label="Expired" color="error" size="small" />
              )}
              {decoded.expiresAt && (
                <Chip
                  icon={<FaClock />}
                  label={`Expires: ${decoded.expiresAt.toLocaleString()}`}
                  color={decoded.isExpired ? 'error' : 'default'}
                  size="small"
                />
              )}
            </Box>
          )}
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                JWT Token Input
              </Typography>
              <Box display="flex" gap={1}>
                <input
                  type="file"
                  accept=".txt,.jwt"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <IconButton component="span" color="primary">
                    <FaUpload />
                  </IconButton>
                </label>
                <IconButton onClick={clearAll} color="error">
                  <FaTrash />
                </IconButton>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={20}
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder="Paste your JWT token here..."
              variant="outlined"
              error={!!error}
              helperText={error}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Monaco, Consolas, monospace',
                  fontSize: '14px',
                },
              }}
            />
          </Paper>
        </Grid>

        {/* Output Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Decoded Information
              </Typography>
              {decoded && (
                <IconButton
                  onClick={() =>
                    handleCopy(formatJSON({ header: decoded.header, payload: decoded.payload }))
                  }
                  color="primary"
                >
                  <FaCopy />
                </IconButton>
              )}
            </Box>

            {!decoded && !error ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary',
                }}
              >
                <FaKey size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  No JWT Token Provided
                </Typography>
                <Typography variant="body2">Paste a JWT token to decode and validate it</Typography>
              </Box>
            ) : decoded ? (
              <Box sx={{ maxHeight: '500px', overflow: 'auto' }}>
                {/* Header */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Header
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>{renderTable(decoded.header, 'Header')}</AccordionDetails>
                </Accordion>

                {/* Payload */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Payload
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>{renderTable(decoded.payload, 'Payload')}</AccordionDetails>
                </Accordion>

                {/* Raw JSON */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Raw JSON
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      fullWidth
                      multiline
                      rows={10}
                      value={formatJSON({ header: decoded.header, payload: decoded.payload })}
                      InputProps={{ readOnly: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: 'Monaco, Consolas, monospace',
                          fontSize: '12px',
                        },
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
              </Box>
            ) : null}
          </Paper>
        </Grid>
      </Grid>

      {/* Security Notice */}
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          🔒 Security Notice
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This tool only decodes JWT tokens and does not verify signatures. All processing happens
          in your browser - tokens are never sent to any server. Do not paste sensitive JWT tokens
          from production environments.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="✓ Client-side only" size="small" color="success" />
          <Chip label="✓ No server communication" size="small" color="success" />
          <Chip label="⚠ No signature verification" size="small" color="warning" />
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity as any}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
