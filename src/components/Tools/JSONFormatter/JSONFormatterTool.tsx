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
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Slider,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  FaCopy,
  FaUpload,
  FaDownload,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExpand,
  FaCompress,
  FaHistory,
  FaCog,
} from 'react-icons/fa';
import { JSONHighlighter } from '../../common/CodeHighlighter';
import { HistoryManager } from '../../../utils/historyManager';
import { HistoryItem } from '../../../types/tools';

interface JSONFormatterOptions {
  indent: number;
  sortKeys: boolean;
  compact: boolean;
}

export const JSONFormatterTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [options, setOptions] = useState<JSONFormatterOptions>({
    indent: 2,
    sortKeys: false,
    compact: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    // Load history on component mount
    setHistory(HistoryManager.getHistoryByTool('json-formatter'));
  }, []);

  const formatJSON = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      setIsValid(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setIsValid(true);
      setError('');

      let formatted: string;
      if (options.compact) {
        formatted = JSON.stringify(parsed);
      } else {
        const replacer = options.sortKeys
          ? (key: string, value: any) => {
              if (value && typeof value === 'object' && !Array.isArray(value)) {
                return Object.keys(value)
                  .sort()
                  .reduce((sorted: any, k) => {
                    sorted[k] = value[k];
                    return sorted;
                  }, {});
              }
              return value;
            }
          : null;

        formatted = JSON.stringify(parsed, replacer as any, options.indent);
      }

      setOutput(formatted);

      // Save to history
      if (formatted !== input) {
        HistoryManager.addToHistory({
          toolId: 'json-formatter',
          input: input.substring(0, 500) + (input.length > 500 ? '...' : ''),
          output: formatted.substring(0, 500) + (formatted.length > 500 ? '...' : ''),
          title: 'JSON Formatted',
        });
        setHistory(HistoryManager.getHistoryByTool('json-formatter'));
      }
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setOutput('');
    }
  }, [input, options]);

  useEffect(() => {
    const timeoutId = setTimeout(formatJSON, 300);
    return () => clearTimeout(timeoutId);
  }, [formatJSON]);

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

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
    setIsValid(null);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setInput(item.input);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          JSON Formatter & Validator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Format, validate, and beautify your JSON data with advanced options
        </Typography>
        <Chip
          icon={
            isValid === true ? (
              <FaCheckCircle />
            ) : isValid === false ? (
              <FaExclamationTriangle />
            ) : undefined
          }
          label={
            isValid === true
              ? 'Valid JSON'
              : isValid === false
                ? 'Invalid JSON'
                : 'Enter JSON to validate'
          }
          color={isValid === true ? 'success' : isValid === false ? 'error' : 'default'}
          sx={{ mb: 2 }}
        />
      </Box>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="center" gap={2} mb={4}>
        <Button variant="outlined" startIcon={<FaCog />} onClick={() => setSettingsOpen(true)}>
          Settings
        </Button>
        {history.length > 0 && (
          <Button variant="outlined" startIcon={<FaHistory />} onClick={() => setHistoryOpen(true)}>
            History ({history.length})
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Input JSON
              </Typography>
              <Box display="flex" gap={1}>
                <input
                  type="file"
                  accept=".json"
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
              placeholder="Paste or type your JSON here..."
              variant="outlined"
              error={isValid === false}
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
                Formatted JSON
              </Typography>
              <Box display="flex" gap={1}>
                <Tooltip title="Copy to clipboard">
                  <IconButton onClick={() => handleCopy(output)} disabled={!output} color="primary">
                    <FaCopy />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download as file">
                  <IconButton onClick={handleDownload} disabled={!output} color="primary">
                    <FaDownload />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {!output ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaCheckCircle size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  Formatted JSON will appear here
                </Typography>
                <Typography variant="body2">
                  Enter valid JSON in the left panel to see the formatted output
                </Typography>
              </Box>
            ) : (
              <JSONHighlighter
                code={output}
                onCopy={() =>
                  setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' })
                }
                maxHeight="500px"
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Formatting Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography gutterBottom>Indentation</Typography>
              <Slider
                value={options.indent}
                onChange={(_: any, value: any) =>
                  setOptions(prev => ({ ...prev, indent: value as number }))
                }
                min={0}
                max={8}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.sortKeys}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setOptions(prev => ({ ...prev, sortKeys: e.target.checked }))
                    }
                  />
                }
                label="Sort Keys"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.compact}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setOptions(prev => ({ ...prev, compact: e.target.checked }))
                    }
                  />
                }
                label="Compact Mode"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Recent History ({history.length})</DialogTitle>
        <DialogContent>
          {history.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {history.slice(0, 10).map(item => (
                <Grid item xs={12} sm={6} key={item.id}>
                  <Paper
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={() => {
                      loadFromHistory(item);
                      setHistoryOpen(false);
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {new Date(item.timestamp).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.input}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={4}>
              <FaHistory size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
              <Typography variant="h6" gutterBottom>
                No History Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your formatting history will appear here
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

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
