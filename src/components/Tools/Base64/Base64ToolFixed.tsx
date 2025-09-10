'use client';
import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Alert,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  FaCopy,
  FaUpload,
  FaDownload,
  FaTrash,
  FaLock,
  FaUnlock,
  FaFileAlt,
  FaImage,
} from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';

export const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const processBase64 = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
        setError('');

        HistoryManager.addToHistory({
          toolId: 'base64-encoder',
          input: input.substring(0, 200) + (input.length > 200 ? '...' : ''),
          output: encoded.substring(0, 200) + (encoded.length > 200 ? '...' : ''),
          title: 'Base64 Encoded',
        });
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
        setError('');

        HistoryManager.addToHistory({
          toolId: 'base64-encoder',
          input: input.substring(0, 200) + (input.length > 200 ? '...' : ''),
          output: decoded.substring(0, 200) + (decoded.length > 200 ? '...' : ''),
          title: 'Base64 Decoded',
        });
      }
    } catch (err) {
      setError(mode === 'encode' ? 'Failed to encode text' : 'Invalid Base64 string');
      setOutput('');
    }
  }, [input, mode]);

  useEffect(() => {
    const timeoutId = setTimeout(processBase64, 300);
    return () => clearTimeout(timeoutId);
  }, [processBase64]);

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
        setInput(content);
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const swapInputOutput = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setMode(mode === 'encode' ? 'decode' : 'encode');
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
            Base64 Encoder & Decoder
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Encode text to Base64 or decode Base64 strings back to text
          </Typography>

          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_: any, newMode: any) => newMode && setMode(newMode)}
            sx={{ mb: 2 }}
          >
            <ToggleButton value="encode" sx={{ px: 3 }}>
              <FaLock style={{ marginRight: 8 }} />
              Encode
            </ToggleButton>
            <ToggleButton value="decode" sx={{ px: 3 }}>
              <FaUnlock style={{ marginRight: 8 }} />
              Decode
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
              </Typography>
              <Box display="flex" gap={1}>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <IconButton component="span" color="primary">
                    <FaFileAlt />
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
              rows={15}
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder={
                mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'
              }
              variant="outlined"
              error={!!error}
              helperText={error}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: mode === 'decode' ? 'Monaco, Consolas, monospace' : 'inherit',
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
                {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
              </Typography>
              <Box display="flex" gap={1}>
                <IconButton onClick={() => handleCopy(output)} disabled={!output} color="primary">
                  <FaCopy />
                </IconButton>
                <Button
                  onClick={swapInputOutput}
                  disabled={!output}
                  variant="outlined"
                  size="small"
                  sx={{ fontSize: '12px' }}
                >
                  Swap
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={15}
              value={output}
              placeholder={
                mode === 'encode'
                  ? 'Base64 encoded text will appear here...'
                  : 'Decoded text will appear here...'
              }
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: mode === 'encode' ? 'Monaco, Consolas, monospace' : 'inherit',
                  fontSize: '14px',
                  backgroundColor: output ? 'rgba(76, 175, 80, 0.05)' : 'inherit',
                },
              }}
            />

            {output && (
              <Box mt={2} display="flex" gap={2}>
                <Chip label={`${output.length} characters`} size="small" color="primary" />
                {mode === 'encode' && (
                  <Chip
                    label={`${Math.ceil((output.length * 3) / 4)} bytes`}
                    size="small"
                    color="secondary"
                  />
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Info Section */}
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          About Base64 Encoding
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string
          format. It's commonly used for encoding data in email systems, data URLs, and storing
          binary data in text-based formats like JSON or XML.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="✓ Safe for URLs" size="small" color="success" />
          <Chip label="✓ Email compatible" size="small" color="success" />
          <Chip label="✓ No special characters" size="small" color="success" />
          <Chip label="✓ Reversible encoding" size="small" color="success" />
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
