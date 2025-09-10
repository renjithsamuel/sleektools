'use client';
import { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  List,
  ListItem,
  ListItemText,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { FaCopy, FaRedo, FaTrash, FaIdCard, FaList, FaDownload } from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';

type UUIDVersion = 'v1' | 'v4';

export const UUIDGeneratorTool = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<UUIDVersion>('v4');
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Simple UUID v4 generator (for demo purposes)
  const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Simple UUID v1 generator (timestamp-based, simplified)
  const generateUUIDv1 = (): string => {
    const timestamp = Date.now();
    const hex = timestamp.toString(16).padStart(12, '0');
    const random = Math.random().toString(16).substr(2, 14);
    return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-1${hex.substr(12, 3)}-${random.substr(0, 4)}-${random.substr(4, 12)}`;
  };

  const generateUUIDs = useCallback(() => {
    const newUuids: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const uuid = version === 'v4' ? generateUUIDv4() : generateUUIDv1();
      newUuids.push(uuid);
    }
    setUuids(newUuids);

    // Save to history
    HistoryManager.addToHistory({
      toolId: 'uuid-generator',
      input: `Generated ${quantity} UUID${quantity > 1 ? 's' : ''} (${version})`,
      output: newUuids.join('\n'),
      title: `${quantity} UUID${quantity > 1 ? 's' : ''} Generated`,
    });
  }, [version, quantity]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to copy', severity: 'error' });
    }
  };

  const copyAllUUIDs = async () => {
    if (uuids.length > 0) {
      await handleCopy(uuids.join('\n'));
    }
  };

  const downloadUUIDs = () => {
    if (uuids.length === 0) return;

    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearUUIDs = () => {
    setUuids([]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            UUID Generator
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Generate universally unique identifiers (UUIDs) in various formats
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* Controls */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Generator Settings
            </Typography>

            {/* Version Selection */}
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                UUID Version
              </Typography>
              <ToggleButtonGroup
                value={version}
                exclusive
                onChange={(_: any, newVersion: any) => newVersion && setVersion(newVersion)}
                fullWidth
                size="small"
              >
                <ToggleButton value="v4">Version 4 (Random)</ToggleButton>
                <ToggleButton value="v1">Version 1 (Timestamp)</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Quantity */}
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                Quantity
              </Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const num = parseInt(e.target.value);
                  if (num >= 1 && num <= 100) {
                    setQuantity(num);
                  }
                }}
                inputProps={{ min: 1, max: 100 }}
                fullWidth
                size="small"
              />
            </Box>

            {/* Generate Button */}
            <Button
              variant="contained"
              onClick={generateUUIDs}
              startIcon={<FaIdCard />}
              fullWidth
              size="large"
              sx={{ mb: 2 }}
            >
              Generate UUIDs
            </Button>

            {uuids.length > 0 && (
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  onClick={copyAllUUIDs}
                  startIcon={<FaCopy />}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  Copy All
                </Button>
                <Button
                  variant="outlined"
                  onClick={downloadUUIDs}
                  startIcon={<FaDownload />}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  Download
                </Button>
                <IconButton onClick={clearUUIDs} color="error" size="small">
                  <FaTrash />
                </IconButton>
              </Box>
            )}
          </Paper>

          {/* Info */}
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              About UUIDs
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {version === 'v4'
                ? 'Version 4 UUIDs are generated using random numbers and are the most commonly used type.'
                : 'Version 1 UUIDs are generated using timestamp and MAC address, providing temporal uniqueness.'}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip label="128-bit" size="small" color="primary" />
              <Chip label="Globally Unique" size="small" color="success" />
              <Chip label="Standardized" size="small" color="info" />
            </Box>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Generated UUIDs ({uuids.length})
              </Typography>
              {uuids.length > 0 && (
                <Button
                  onClick={generateUUIDs}
                  startIcon={<FaRedo />}
                  variant="outlined"
                  size="small"
                >
                  Regenerate
                </Button>
              )}
            </Box>

            {uuids.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary',
                }}
              >
                <FaIdCard size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  No UUIDs Generated Yet
                </Typography>
                <Typography variant="body2">
                  Click "Generate UUIDs" to create unique identifiers
                </Typography>
              </Box>
            ) : (
              <List dense sx={{ maxHeight: '400px', overflow: 'auto' }}>
                {uuids.map((uuid, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleCopy(uuid)} size="small">
                        <FaCopy />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={uuid}
                      primaryTypographyProps={{
                        fontFamily: 'Monaco, Consolas, monospace',
                        fontSize: '14px',
                      }}
                      secondary={`${index + 1} of ${uuids.length}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

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
