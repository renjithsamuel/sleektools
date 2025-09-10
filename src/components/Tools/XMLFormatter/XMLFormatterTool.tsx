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
  FormControl,
  FormLabel,
  Slider,
  FormControlLabel,
  Switch,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import { FaCopy, FaDownload, FaCode, FaTrash, FaPlay, FaCheck, FaTimes } from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';
import { XMLHighlighter } from '../../../components/common/CodeHighlighter';

interface XMLFormattingOptions {
  indentSize: number;
  preserveComments: boolean;
  sortAttributes: boolean;
  removeEmptyLines: boolean;
}

export const XMLFormatterTool = () => {
  const [inputXML, setInputXML] = useState('');
  const [formattedXML, setFormattedXML] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<XMLFormattingOptions>({
    indentSize: 2,
    preserveComments: true,
    sortAttributes: false,
    removeEmptyLines: true,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const formatXML = useCallback(
    (
      xml: string,
      options: XMLFormattingOptions
    ): { formatted: string; isValid: boolean; error?: string } => {
      if (!xml.trim()) {
        return { formatted: '', isValid: false, error: 'XML content is empty' };
      }

      try {
        // Basic XML validation and formatting
        const trimmed = xml.trim();

        // Check for basic XML structure
        if (!trimmed.startsWith('<')) {
          return { formatted: '', isValid: false, error: 'XML must start with an opening tag' };
        }

        // Simple XML parser and formatter
        let formatted = '';
        let indentLevel = 0;
        let inTag = false;
        let tagName = '';
        let i = 0;

        const addIndent = () => ' '.repeat(indentLevel * options.indentSize);

        while (i < trimmed.length) {
          const char = trimmed[i];

          if (char === '<') {
            // Start of tag
            if (formatted && !formatted.endsWith('\n') && !inTag) {
              formatted += '\n';
            }

            inTag = true;
            let tagStart = i;
            let tagEnd = trimmed.indexOf('>', i);

            if (tagEnd === -1) {
              return { formatted: '', isValid: false, error: 'Unclosed tag detected' };
            }

            const fullTag = trimmed.substring(tagStart, tagEnd + 1);

            // Check if it's a closing tag
            if (fullTag.startsWith('</')) {
              indentLevel = Math.max(0, indentLevel - 1);
              formatted += addIndent() + fullTag;
            }
            // Check if it's a self-closing tag
            else if (fullTag.endsWith('/>')) {
              formatted += addIndent() + fullTag;
            }
            // Check if it's a comment
            else if (fullTag.startsWith('<!--')) {
              if (options.preserveComments) {
                formatted += addIndent() + fullTag;
              }
            }
            // Regular opening tag
            else {
              formatted += addIndent() + fullTag;
              // Extract tag name
              const tagNameMatch = fullTag.match(/<([^\s>]+)/);
              if (tagNameMatch) {
                tagName = tagNameMatch[1];
                if (!['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tagName.toLowerCase())) {
                  indentLevel++;
                }
              }
            }

            i = tagEnd + 1;
            inTag = false;

            // Add newline after tag (except for text content)
            if (i < trimmed.length && trimmed[i] !== '<' && trimmed[i].trim()) {
              // There's text content, don't add newline yet
            } else {
              formatted += '\n';
            }
          } else {
            // Text content
            let textContent = '';
            while (i < trimmed.length && trimmed[i] !== '<') {
              textContent += trimmed[i];
              i++;
            }

            textContent = textContent.trim();
            if (textContent) {
              if (!formatted.endsWith('\n')) {
                formatted += textContent;
              } else {
                formatted += addIndent() + textContent + '\n';
              }
            }
          }
        }

        // Remove extra empty lines if requested
        if (options.removeEmptyLines) {
          formatted = formatted.replace(/\n\s*\n/g, '\n');
        }

        // Sort attributes if requested
        if (options.sortAttributes) {
          formatted = formatted.replace(/<([^>]+)>/g, (match, tagContent) => {
            if (tagContent.includes('=')) {
              const parts = tagContent.split(' ');
              const tagName = parts[0];
              const attributes = parts.slice(1).filter((part: string) => part.includes('='));
              const sortedAttributes = attributes.sort();
              return `<${tagName} ${sortedAttributes.join(' ')}>`;
            }
            return match;
          });
        }

        return { formatted: formatted.trim(), isValid: true };
      } catch (err) {
        return {
          formatted: '',
          isValid: false,
          error: 'XML parsing failed: ' + (err instanceof Error ? err.message : 'Unknown error'),
        };
      }
    },
    []
  );

  const handleFormat = useCallback(() => {
    if (!inputXML.trim()) {
      setFormattedXML('');
      setIsValid(null);
      setError('');
      return;
    }

    const result = formatXML(inputXML, options);
    setFormattedXML(result.formatted);
    setIsValid(result.isValid);
    setError(result.error || '');

    if (result.isValid) {
      setSnackbar({ open: true, message: 'XML formatted successfully!', severity: 'success' });
    } else {
      setSnackbar({
        open: true,
        message: result.error || 'XML formatting failed',
        severity: 'error',
      });
    }
  }, [inputXML, options, formatXML]);

  const saveToHistory = useCallback(() => {
    if (formattedXML && isValid) {
      HistoryManager.addToHistory({
        toolId: 'xml-formatter',
        input: inputXML.substring(0, 100) + (inputXML.length > 100 ? '...' : ''),
        output: formattedXML.substring(0, 100) + (formattedXML.length > 100 ? '...' : ''),
        title: 'XML Formatted',
      });
      setSnackbar({ open: true, message: 'Saved to history!', severity: 'success' });
    }
  }, [inputXML, formattedXML, isValid]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedXML);
      setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to copy', severity: 'error' });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formattedXML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbar({ open: true, message: 'XML downloaded!', severity: 'success' });
  };

  const clearAll = () => {
    setInputXML('');
    setFormattedXML('');
    setIsValid(null);
    setError('');
  };

  const loadSample = () => {
    const sampleXML = `<?xml version="1.0" encoding="UTF-8"?><root><users><user id="1" active="true"><name>John Doe</name><email>john@example.com</email><profile><age>30</age><city>New York</city></profile></user><user id="2" active="false"><name>Jane Smith</name><email>jane@example.com</email><profile><age>25</age><city>Los Angeles</city></profile></user></users><settings><theme>dark</theme><notifications enabled="true"><email>true</email><sms>false</sms></notifications></settings></root>`;
    setInputXML(sampleXML);
    setFormattedXML('');
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
          XML Formatter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Format and validate XML documents with beautiful syntax highlighting
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ minHeight: '600px' }}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', minHeight: '550px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                XML Input
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
              rows={10}
              value={inputXML}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputXML(e.target.value)}
              placeholder="Paste your XML here..."
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
                disabled={!inputXML.trim()}
                fullWidth
              >
                Format XML
              </Button>
            </Box>
          </Paper>

          {/* Options Panel */}
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Formatting Options
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel>Indentation Size: {options.indentSize} spaces</FormLabel>
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
            </FormControl>

            <Box display="flex" flexDirection="column" gap={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.preserveComments}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setOptions(prev => ({ ...prev, preserveComments: e.target.checked }))
                    }
                  />
                }
                label="Preserve Comments"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={options.sortAttributes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setOptions(prev => ({ ...prev, sortAttributes: e.target.checked }))
                    }
                  />
                }
                label="Sort Attributes"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={options.removeEmptyLines}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setOptions(prev => ({ ...prev, removeEmptyLines: e.target.checked }))
                    }
                  />
                }
                label="Remove Empty Lines"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Output Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', minHeight: '550px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Formatted XML
              </Typography>
              <Box display="flex" gap={1} alignItems="center">
                {isValid !== null && (
                  <Chip
                    icon={isValid ? <FaCheck /> : <FaTimes />}
                    label={isValid ? 'Valid' : 'Invalid'}
                    color={isValid ? 'success' : 'error'}
                    size="small"
                  />
                )}
                {formattedXML && (
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

            {!formattedXML ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 3,
                  color: 'text.secondary',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '500px',
                  height: 'calc(100% - 80px)', // Account for header space
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <FaCode size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  Formatted XML will appear here
                </Typography>
                <Typography variant="body2">
                  Enter XML content and click format to see the result
                </Typography>
              </Box>
            ) : (
              <XMLHighlighter code={formattedXML} />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Info Section */}
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          About XML Formatting
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          XML (Extensible Markup Language) formatting improves readability by adding proper
          indentation and structure. This tool validates XML syntax and applies consistent
          formatting rules.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="✓ Syntax validation" size="small" color="primary" />
          <Chip label="✓ Custom indentation" size="small" color="success" />
          <Chip label="✓ Attribute sorting" size="small" color="info" />
          <Chip label="✓ Comment preservation" size="small" color="secondary" />
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
