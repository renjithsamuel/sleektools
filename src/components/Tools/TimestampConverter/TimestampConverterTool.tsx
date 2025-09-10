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
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { FaCopy, FaTrash, FaClock, FaCalendarAlt, FaSync } from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';

type ConversionMode = 'toTimestamp' | 'fromTimestamp';

export const TimestampConverterTool = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ConversionMode>('fromTimestamp');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [convertedResult, setConvertedResult] = useState<Date | null>(null);

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setError('');
      setConvertedResult(null);
      return;
    }

    try {
      if (mode === 'fromTimestamp') {
        // Convert timestamp to date
        const timestamp = parseInt(input.trim());
        if (isNaN(timestamp)) {
          setError('Invalid timestamp. Please enter a valid number.');
          setConvertedResult(null);
          return;
        }

        // Handle both seconds and milliseconds
        const date =
          timestamp.toString().length === 10 ? new Date(timestamp * 1000) : new Date(timestamp);

        if (isNaN(date.getTime())) {
          setError('Invalid timestamp. Please check the value.');
          setConvertedResult(null);
          return;
        }

        setError('');
        setConvertedResult(date);
      } else {
        // Convert date string to timestamp
        const date = new Date(input.trim());
        if (isNaN(date.getTime())) {
          setError('Invalid date format. Try formats like "2023-12-25" or "December 25, 2023".');
          setConvertedResult(null);
          return;
        }

        setError('');
        setConvertedResult(date);
      }
    } catch (err) {
      setError('Conversion failed. Please check your input.');
      setConvertedResult(null);
    }
  }, [input, mode]);

  // Update conversion when input or mode changes
  useEffect(() => {
    handleConvert();
  }, [handleConvert]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to copy', severity: 'error' });
    }
  };

  const clearAll = () => {
    setInput('');
    setError('');
  };

  const useCurrentTime = () => {
    const now = new Date();
    if (mode === 'fromTimestamp') {
      setInput(Math.floor(now.getTime() / 1000).toString());
    } else {
      setInput(now.toISOString());
    }
  };

  const saveConversion = () => {
    if (convertedResult) {
      HistoryManager.addToHistory({
        toolId: 'timestamp-converter',
        input: input,
        output:
          mode === 'fromTimestamp'
            ? convertedResult.toISOString()
            : Math.floor(convertedResult.getTime() / 1000).toString(),
        title: `Timestamp ${mode === 'fromTimestamp' ? 'Decoded' : 'Encoded'}`,
      });
      setSnackbar({ open: true, message: 'Conversion saved to history!', severity: 'success' });
    }
  };

  const formatTimestamp = (date: Date) => {
    const unixSeconds = Math.floor(date.getTime() / 1000);
    const unixMilliseconds = date.getTime();

    return {
      unixSeconds,
      unixMilliseconds,
      iso8601: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toString(),
      localDate: date.toLocaleDateString(),
      localTime: date.toLocaleTimeString(),
      relative: getRelativeTime(date),
    };
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (Math.abs(diffDays) > 0) {
      return diffDays > 0 ? `${diffDays} days ago` : `in ${Math.abs(diffDays)} days`;
    } else if (Math.abs(diffHours) > 0) {
      return diffHours > 0 ? `${diffHours} hours ago` : `in ${Math.abs(diffHours)} hours`;
    } else if (Math.abs(diffMinutes) > 0) {
      return diffMinutes > 0 ? `${diffMinutes} minutes ago` : `in ${Math.abs(diffMinutes)} minutes`;
    } else {
      return 'just now';
    }
  };

  const currentTimeFormatted = formatTimestamp(currentTime);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Timestamp Converter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Convert between Unix timestamps and human-readable dates
        </Typography>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_: any, newMode: any) => newMode && setMode(newMode)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="fromTimestamp" sx={{ px: 3 }}>
            <FaClock style={{ marginRight: 8 }} />
            Timestamp → Date
          </ToggleButton>
          <ToggleButton value="toTimestamp" sx={{ px: 3 }}>
            <FaCalendarAlt style={{ marginRight: 8 }} />
            Date → Timestamp
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {mode === 'fromTimestamp' ? 'Unix Timestamp' : 'Date/Time Input'}
              </Typography>
              <Box display="flex" gap={1}>
                <Button
                  onClick={useCurrentTime}
                  startIcon={<FaSync />}
                  variant="outlined"
                  size="small"
                >
                  Current Time
                </Button>
                <IconButton onClick={clearAll} color="error">
                  <FaTrash />
                </IconButton>
              </Box>
            </Box>

            <TextField
              fullWidth
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder={
                mode === 'fromTimestamp'
                  ? 'Enter Unix timestamp (e.g., 1703548800)'
                  : 'Enter date (e.g., 2023-12-25 or December 25, 2023)'
              }
              variant="outlined"
              error={!!error}
              helperText={error}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: mode === 'fromTimestamp' ? 'Monaco, Consolas, monospace' : 'inherit',
                  fontSize: '16px',
                },
              }}
            />

            {convertedResult && (
              <Box mt={2}>
                <Button onClick={saveConversion} variant="contained" size="small" sx={{ mr: 1 }}>
                  Save Conversion
                </Button>
              </Box>
            )}
          </Paper>

          {/* Current Time Display */}
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Current Time
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip
                label={`Unix: ${currentTimeFormatted.unixSeconds}`}
                onClick={() => handleCopy(currentTimeFormatted.unixSeconds.toString())}
                clickable
                size="small"
              />
              <Chip
                label={currentTimeFormatted.localDate}
                onClick={() => handleCopy(currentTimeFormatted.iso8601)}
                clickable
                size="small"
              />
              <Chip
                label={currentTimeFormatted.localTime}
                onClick={() => handleCopy(currentTimeFormatted.localTime)}
                clickable
                size="small"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Output Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Converted Result
            </Typography>

            {!convertedResult ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary',
                }}
              >
                <FaClock size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  Enter {mode === 'fromTimestamp' ? 'a timestamp' : 'a date'} to convert
                </Typography>
                <Typography variant="body2">
                  {mode === 'fromTimestamp'
                    ? 'Unix timestamps are seconds since January 1, 1970 UTC'
                    : 'Try formats like "2023-12-25" or "December 25, 2023"'}
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Format</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Value</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Action</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(formatTimestamp(convertedResult)).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: ['unixSeconds', 'unixMilliseconds', 'iso8601'].includes(key)
                              ? 'Monaco, Consolas, monospace'
                              : 'inherit',
                            fontSize: '14px',
                          }}
                        >
                          {value.toString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleCopy(value.toString())}
                            size="small"
                            color="primary"
                          >
                            <FaCopy />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Info Section */}
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          About Unix Timestamps
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Unix timestamps represent the number of seconds that have elapsed since January 1, 1970,
          00:00:00 UTC. They are widely used in programming and databases for storing and comparing
          dates.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="✓ UTC based" size="small" color="primary" />
          <Chip label="✓ Timezone independent" size="small" color="success" />
          <Chip label="✓ Easy to calculate" size="small" color="info" />
          <Chip label="✓ Widely supported" size="small" color="secondary" />
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
