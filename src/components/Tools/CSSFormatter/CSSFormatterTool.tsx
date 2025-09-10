'use client';
import { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Paper,
  Alert,
  Snackbar,
  Button,
  Chip,
  IconButton,
  FormControlLabel,
  Switch,
  Slider,
} from '@mui/material';
import {
  FaCopy,
  FaDownload,
  FaCode,
  FaTrash,
  FaPlay,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';
import { CodeHighlighter } from '../../../components/common/CodeHighlighter';

interface CSSFormattingOptions {
  indentSize: number;
  insertNewlineBeforeClosingBrace: boolean;
  insertNewlineAfterSemicolon: boolean;
  removeUnnecessaryWhitespace: boolean;
  sortProperties: boolean;
}

export const CSSFormatterTool = () => {
  const [inputCSS, setInputCSS] = useState('');
  const [formattedCSS, setFormattedCSS] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<CSSFormattingOptions>({
    indentSize: 2,
    insertNewlineBeforeClosingBrace: true,
    insertNewlineAfterSemicolon: true,
    removeUnnecessaryWhitespace: true,
    sortProperties: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const formatCSS = useCallback(
    (
      css: string,
      options: CSSFormattingOptions
    ): { formatted: string; isValid: boolean; error?: string } => {
      if (!css.trim()) {
        return { formatted: '', isValid: false, error: 'CSS content is empty' };
      }

      try {
        let formatted = css.trim();
        const indent = ' '.repeat(options.indentSize);

        // Remove unnecessary whitespace
        if (options.removeUnnecessaryWhitespace) {
          formatted = formatted.replace(/\s+/g, ' ');
          formatted = formatted.replace(/\s*{\s*/g, ' {');
          formatted = formatted.replace(/\s*}\s*/g, '}');
          formatted = formatted.replace(/\s*;\s*/g, ';');
          formatted = formatted.replace(/\s*:\s*/g, ': ');
          formatted = formatted.replace(/\s*,\s*/g, ', ');
        }

        // Basic CSS parsing and formatting
        let indentLevel = 0;
        let result = '';
        let i = 0;
        let inRule = false;

        while (i < formatted.length) {
          const char = formatted[i];

          if (char === '{') {
            result += char;
            if (options.insertNewlineBeforeClosingBrace) {
              result += '\n';
            }
            indentLevel++;
            inRule = true;
          } else if (char === '}') {
            if (options.insertNewlineBeforeClosingBrace && result[result.length - 1] !== '\n') {
              result += '\n';
            }
            if (indentLevel > 0) {
              indentLevel--;
            }
            result += indent.repeat(indentLevel) + char;
            if (i < formatted.length - 1) {
              result += '\n\n';
            }
            inRule = false;
          } else if (char === ';' && inRule) {
            result += char;
            if (options.insertNewlineAfterSemicolon && i < formatted.length - 1) {
              result += '\n' + indent.repeat(indentLevel);
            }
          } else if (char === '\n' || char === '\r') {
            // Skip existing newlines, we'll add our own
          } else {
            // Add proper indentation at the start of lines
            if (result.length === 0 || result[result.length - 1] === '\n') {
              if (char !== ' ') {
                result += indent.repeat(indentLevel);
              }
            }
            result += char;
          }
          i++;
        }

        // Clean up extra newlines
        result = result.replace(/\n{3,}/g, '\n\n');
        result = result.trim();

        // Sort properties if requested (simplified)
        if (options.sortProperties) {
          result = result.replace(/([^{}]+{[^}]+})/g, match => {
            const [selector, ...ruleParts] = match.split('{');
            const ruleBody = ruleParts.join('{');
            const rules = ruleBody
              .replace('}', '')
              .split(';')
              .filter(rule => rule.trim());
            const sortedRules = rules.sort((a, b) => a.trim().localeCompare(b.trim()));
            return (
              selector +
              '{\n' +
              indent +
              sortedRules.join(';\n' + indent) +
              (sortedRules.length > 0 ? ';\n' : '') +
              '}'
            );
          });
        }

        return { formatted: result, isValid: true };
      } catch (err) {
        return {
          formatted: '',
          isValid: false,
          error: 'CSS parsing failed: ' + (err instanceof Error ? err.message : 'Unknown error'),
        };
      }
    },
    []
  );

  const handleFormat = useCallback(() => {
    if (!inputCSS.trim()) {
      setFormattedCSS('');
      setIsValid(null);
      setError('');
      return;
    }

    const result = formatCSS(inputCSS, options);
    setFormattedCSS(result.formatted);
    setIsValid(result.isValid);
    setError(result.error || '');

    if (result.isValid) {
      setSnackbar({ open: true, message: 'CSS formatted successfully!', severity: 'success' });
    } else {
      setSnackbar({
        open: true,
        message: result.error || 'CSS formatting failed',
        severity: 'error',
      });
    }
  }, [inputCSS, options, formatCSS]);

  const saveToHistory = useCallback(() => {
    if (formattedCSS && isValid) {
      HistoryManager.addToHistory({
        toolId: 'css-formatter',
        input: inputCSS.substring(0, 100) + (inputCSS.length > 100 ? '...' : ''),
        output: formattedCSS.substring(0, 100) + (formattedCSS.length > 100 ? '...' : ''),
        title: 'CSS Formatted',
      });
      setSnackbar({ open: true, message: 'Saved to history!', severity: 'success' });
    }
  }, [inputCSS, formattedCSS, isValid]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedCSS);
      setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to copy', severity: 'error' });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formattedCSS], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbar({ open: true, message: 'CSS downloaded!', severity: 'success' });
  };

  const clearAll = () => {
    setInputCSS('');
    setFormattedCSS('');
    setIsValid(null);
    setError('');
  };

  const loadSample = () => {
    const sampleCSS = `body{margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f5f5}.container{max-width:1200px;margin:0 auto;padding:20px}.header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:2rem;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1)}.header h1{margin:0;font-size:2.5rem;font-weight:700}.nav{display:flex;justify-content:space-between;align-items:center;padding:1rem 0}.nav ul{list-style:none;display:flex;gap:2rem;margin:0;padding:0}.nav a{color:white;text-decoration:none;font-weight:500;transition:opacity 0.3s ease}.nav a:hover{opacity:0.8}.card{background:white;border-radius:12px;padding:2rem;box-shadow:0 2px 10px rgba(0,0,0,0.1);margin-bottom:2rem}@media (max-width:768px){.container{padding:10px}.header h1{font-size:2rem}.nav{flex-direction:column;gap:1rem}}`;
    setInputCSS(sampleCSS);
    setFormattedCSS('');
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
          CSS Formatter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Format and beautify CSS code with customizable options
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                CSS Input
              </Typography>
              <Box display="flex" gap={1}>
                <Button onClick={loadSample} startIcon={<FaCode />} variant="outlined" size="small">
                  Sample
                </Button>
                <Button onClick={clearAll} startIcon={<FaTrash />} color="error" size="small">
                  Clear
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={12}
              value={inputCSS}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputCSS(e.target.value)}
              placeholder="Paste your CSS here..."
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

            <Box mt={2}>
              <Button
                onClick={handleFormat}
                variant="contained"
                startIcon={<FaPlay />}
                disabled={!inputCSS.trim()}
                fullWidth
              >
                Format CSS
              </Button>
            </Box>
          </Paper>

          {/* Options Panel */}
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Formatting Options
            </Typography>

            <Box mb={3}>
              <Typography gutterBottom>Indentation Size: {options.indentSize} spaces</Typography>
              <Slider
                value={options.indentSize}
                onChange={(_: any, newValue: any) =>
                  setOptions(prev => ({ ...prev, indentSize: newValue }))
                }
                min={1}
                max={8}
                step={1}
                marks={[
                  { value: 2, label: '2' },
                  { value: 4, label: '4' },
                  { value: 6, label: '6' },
                  { value: 8, label: '8' },
                ]}
              />
            </Box>

            <Box display="flex" flexDirection="column" gap={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.insertNewlineBeforeClosingBrace}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setOptions(prev => ({
                        ...prev,
                        insertNewlineBeforeClosingBrace: e.target.checked,
                      }))
                    }
                  />
                }
                label="Newline Before Closing Brace"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={options.insertNewlineAfterSemicolon}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setOptions(prev => ({
                        ...prev,
                        insertNewlineAfterSemicolon: e.target.checked,
                      }))
                    }
                  />
                }
                label="Newline After Semicolon"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={options.removeUnnecessaryWhitespace}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setOptions(prev => ({
                        ...prev,
                        removeUnnecessaryWhitespace: e.target.checked,
                      }))
                    }
                  />
                }
                label="Remove Extra Whitespace"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={options.sortProperties}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setOptions(prev => ({ ...prev, sortProperties: e.target.checked }))
                    }
                  />
                }
                label="Sort Properties"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Output Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Formatted CSS
              </Typography>
              <Box display="flex" gap={1} alignItems="center">
                {isValid !== null && (
                  <Chip
                    icon={isValid ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    label={isValid ? 'Valid' : 'Invalid'}
                    color={isValid ? 'success' : 'error'}
                    size="small"
                  />
                )}
                {formattedCSS && (
                  <>
                    <IconButton onClick={handleCopy} color="primary" size="small">
                      <FaCopy />
                    </IconButton>
                    <IconButton onClick={handleDownload} color="primary" size="small">
                      <FaDownload />
                    </IconButton>
                    <Button onClick={saveToHistory} variant="outlined" size="small" sx={{ ml: 1 }}>
                      Save to History
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            {!formattedCSS ? (
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
                <FaCode size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  Formatted CSS will appear here
                </Typography>
                <Typography variant="body2">
                  Enter CSS content and click format to see the result
                </Typography>
              </Box>
            ) : (
              <CodeHighlighter code={formattedCSS} language="css" />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Info Section */}
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          About CSS Formatting
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          CSS formatting improves code readability by adding consistent indentation, spacing, and
          structure. This tool helps maintain clean, professional CSS code that's easy to read and
          maintain.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="✓ Consistent indentation" size="small" color="primary" />
          <Chip label="✓ Property organization" size="small" color="success" />
          <Chip label="✓ Whitespace cleanup" size="small" color="info" />
          <Chip label="✓ Customizable rules" size="small" color="secondary" />
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
