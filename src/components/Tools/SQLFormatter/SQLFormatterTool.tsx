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
  FormControlLabel,
  Switch,
  Slider,
} from '@mui/material';
import {
  FaCopy,
  FaUpload,
  FaDownload,
  FaTrash,
  FaDatabase,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';
import { SQLHighlighter } from '../../../components/common/CodeHighlighter';

interface SQLFormatterOptions {
  uppercase: boolean;
  indent: number;
  commaBreaks: boolean;
}

export const SQLFormatterTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [options, setOptions] = useState<SQLFormatterOptions>({
    uppercase: true,
    indent: 2,
    commaBreaks: true,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Basic SQL formatter (simplified version)
  const formatSQL = useCallback((sql: string, opts: SQLFormatterOptions): string => {
    if (!sql.trim()) return '';

    let formatted = sql.trim();

    // Basic SQL keywords to uppercase
    if (opts.uppercase) {
      const keywords = [
        'SELECT',
        'FROM',
        'WHERE',
        'JOIN',
        'INNER JOIN',
        'LEFT JOIN',
        'RIGHT JOIN',
        'ON',
        'AND',
        'OR',
        'ORDER BY',
        'GROUP BY',
        'HAVING',
        'INSERT',
        'UPDATE',
        'DELETE',
        'CREATE',
        'ALTER',
        'DROP',
        'TABLE',
        'INDEX',
        'VIEW',
        'AS',
        'DISTINCT',
        'COUNT',
        'SUM',
        'AVG',
        'MIN',
        'MAX',
        'CASE',
        'WHEN',
        'THEN',
        'ELSE',
        'END',
        'IF',
        'EXISTS',
        'IN',
        'LIKE',
        'BETWEEN',
        'IS',
        'NULL',
        'NOT',
        'UNION',
        'ALL',
        'LIMIT',
        'OFFSET',
        'DESC',
        'ASC',
      ];

      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formatted = formatted.replace(regex, keyword);
      });
    }

    // Basic indentation and line breaks
    const indent = ' '.repeat(opts.indent);

    // Add line breaks after major keywords
    formatted = formatted
      .replace(/\bSELECT\b/gi, '\nSELECT')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bJOIN\b/gi, '\nJOIN')
      .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
      .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
      .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
      .replace(/\bORDER BY\b/gi, '\nORDER BY')
      .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
      .replace(/\bHAVING\b/gi, '\nHAVING')
      .replace(/\bUNION\b/gi, '\nUNION');

    // Handle comma breaks
    if (opts.commaBreaks) {
      formatted = formatted.replace(/,/g, ',\n' + indent);
    }

    // Clean up extra whitespace
    formatted = formatted
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index) => {
        if (index === 0) return line;
        if (line.startsWith(',')) return indent + line;
        return line;
      })
      .join('\n');

    return formatted;
  }, []);

  const processSQL = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      setIsValid(null);
      return;
    }

    try {
      // Basic SQL validation (very simple)
      const hasValidKeywords = /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/i.test(input);

      if (hasValidKeywords) {
        const formatted = formatSQL(input, options);
        setOutput(formatted);
        setIsValid(true);
        setError('');
      } else {
        setIsValid(false);
        setError('No valid SQL keywords detected');
        setOutput('');
      }
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Failed to format SQL');
      setOutput('');
    }
  }, [input, options, formatSQL]);

  const saveToHistory = useCallback(() => {
    if (output && isValid) {
      HistoryManager.addToHistory({
        toolId: 'sql-formatter',
        input: input.substring(0, 200) + (input.length > 200 ? '...' : ''),
        output: output.substring(0, 200) + (output.length > 200 ? '...' : ''),
        title: 'SQL Formatted',
      });
      setSnackbar({ open: true, message: 'Saved to history!', severity: 'success' });
    }
  }, [input, output, isValid]);

  useEffect(() => {
    const timeoutId = setTimeout(processSQL, 300);
    return () => clearTimeout(timeoutId);
  }, [processSQL]);

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

    const blob = new Blob([output], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted-query.sql';
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
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          SQL Formatter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Format and beautify your SQL queries with beautiful syntax highlighting
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
              ? 'Valid SQL detected'
              : isValid === false
                ? 'Invalid or no SQL'
                : 'Enter SQL to format'
          }
          color={isValid === true ? 'success' : isValid === false ? 'error' : 'default'}
          sx={{ mb: 2 }}
        />
      </Box>

      <Grid container spacing={4} sx={{ minHeight: '600px' }}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', minHeight: '550px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                SQL Input
              </Typography>
              <Box display="flex" gap={1}>
                <input
                  type="file"
                  accept=".sql,.txt"
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
              placeholder="Paste or type your SQL query here..."
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
          <Paper elevation={3} sx={{ p: 3, height: '100%', minHeight: '550px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Formatted SQL
              </Typography>
              <Box display="flex" gap={1}>
                <IconButton onClick={() => handleCopy(output)} disabled={!output} color="primary">
                  <FaCopy />
                </IconButton>
                <IconButton onClick={handleDownload} disabled={!output} color="primary">
                  <FaDownload />
                </IconButton>
                {output && (
                  <Button onClick={saveToHistory} variant="outlined" size="small" sx={{ ml: 1 }}>
                    Save to History
                  </Button>
                )}
              </Box>
            </Box>

            {!output ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 3,
                  color: 'text.secondary',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  minHeight: '500px',
                  height: 'calc(100% - 80px)', // Account for header space
                  width: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FaDatabase size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  Formatted SQL will appear here
                </Typography>
                <Typography variant="body2">Enter SQL query to see formatted result</Typography>
              </Box>
            ) : (
              <SQLHighlighter code={output} />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Options Panel */}
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Formatting Options
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={options.uppercase}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOptions(prev => ({ ...prev, uppercase: e.target.checked }))
                  }
                />
              }
              label="Uppercase Keywords"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={options.commaBreaks}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setOptions(prev => ({ ...prev, commaBreaks: e.target.checked }))
                  }
                />
              }
              label="Break After Commas"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
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
        </Grid>
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
