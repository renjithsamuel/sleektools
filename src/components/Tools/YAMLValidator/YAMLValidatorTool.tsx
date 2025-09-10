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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCode,
  FaTrash,
  FaPlay,
  FaInfo,
  FaTree,
  FaCopy,
} from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';
import { YAMLHighlighter } from '../../../components/common/CodeHighlighter';

interface YAMLValidationResult {
  isValid: boolean;
  errors: YAMLError[];
  structure: any;
  statistics: {
    lines: number;
    keys: number;
    arrays: number;
    objects: number;
    depth: number;
  };
}

interface YAMLError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'structure' | 'warning';
}

export const YAMLValidatorTool = () => {
  const [yaml, setYaml] = useState('');
  const [validationResult, setValidationResult] = useState<YAMLValidationResult | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const validateYAML = useCallback((yamlText: string): YAMLValidationResult => {
    const errors: YAMLError[] = [];
    const lines = yamlText.split('\n');

    if (!yamlText.trim()) {
      return {
        isValid: false,
        errors: [{ line: 1, column: 1, message: 'YAML content is empty', type: 'syntax' }],
        structure: null,
        statistics: { lines: 0, keys: 0, arrays: 0, objects: 0, depth: 0 },
      };
    }

    let structure: any = null;
    let isValid = true;

    try {
      // Simple YAML parser - in production you'd use js-yaml
      // For demo purposes, we'll implement basic validation

      // Check for basic YAML syntax issues
      lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith('#')) return;

        // Check for tabs (YAML doesn't allow tabs for indentation)
        if (line.includes('\t')) {
          errors.push({
            line: lineNum,
            column: line.indexOf('\t') + 1,
            message: 'YAML does not allow tabs for indentation. Use spaces instead.',
            type: 'syntax',
          });
          isValid = false;
        }

        // Check for consistent indentation
        const leadingSpaces = line.length - line.trimStart().length;
        if (leadingSpaces % 2 !== 0) {
          errors.push({
            line: lineNum,
            column: 1,
            message: 'Inconsistent indentation. Use 2 or 4 spaces consistently.',
            type: 'warning',
          });
        }

        // Check for proper key-value format
        if (trimmedLine.includes(':')) {
          const colonIndex = trimmedLine.indexOf(':');
          const afterColon = trimmedLine.substring(colonIndex + 1).trim();

          if (afterColon && !afterColon.startsWith(' ') && colonIndex > 0) {
            // This is already handled by trimming
          }
        }

        // Check for unquoted strings that might need quotes
        if (trimmedLine.includes(': ')) {
          const value = trimmedLine.split(': ')[1];
          if (
            value &&
            (value.includes('#') ||
              value.includes(':') ||
              value.includes('[') ||
              value.includes('{'))
          ) {
            // Might need quotes, but this is just a warning
          }
        }
      });

      // Try to parse as JSON first to see if it's valid YAML structure
      try {
        // Convert simple YAML to JSON for parsing
        const jsonLike = yamlText.replace(/(\w+):\s*(.+)/g, '"$1": "$2"').replace(/"/g, '"');

        // This is a very simplified approach - real YAML parsing is complex
        structure = parseSimpleYAML(yamlText);
      } catch (parseError) {
        errors.push({
          line: 1,
          column: 1,
          message:
            'Invalid YAML structure: ' +
            (parseError instanceof Error ? parseError.message : 'Parse error'),
          type: 'syntax',
        });
        isValid = false;
      }
    } catch (error) {
      errors.push({
        line: 1,
        column: 1,
        message:
          'YAML parsing failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
        type: 'syntax',
      });
      isValid = false;
    }

    const statistics = calculateStatistics(yamlText, structure);

    return {
      isValid: isValid && errors.filter(e => e.type === 'syntax').length === 0,
      errors,
      structure,
      statistics,
    };
  }, []);

  const parseSimpleYAML = (yamlText: string): any => {
    // This is a very basic YAML parser for demo purposes
    // In production, use a proper library like js-yaml
    const result: any = {};
    const lines = yamlText.split('\n');
    let currentObj = result;
    const stack: any[] = [result];
    let lastIndent = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) return;

      const indent = line.length - line.trimStart().length;

      if (trimmedLine.includes(':')) {
        const [key, ...valueParts] = trimmedLine.split(':');
        const value = valueParts.join(':').trim();

        // Handle indentation changes
        if (indent > lastIndent) {
          // Going deeper
        } else if (indent < lastIndent) {
          // Going back up
          while (stack.length > 1 && indent < lastIndent) {
            stack.pop();
            lastIndent -= 2; // Assuming 2-space indentation
          }
          currentObj = stack[stack.length - 1];
        }

        if (value) {
          // Simple value
          currentObj[key.trim()] = value.replace(/^["']|["']$/g, '');
        } else {
          // Object or array
          currentObj[key.trim()] = {};
          stack.push(currentObj[key.trim()]);
          currentObj = currentObj[key.trim()];
        }

        lastIndent = indent;
      }
    });

    return result;
  };

  const calculateStatistics = (yamlText: string, structure: any) => {
    const lines = yamlText.split('\n').filter(line => line.trim()).length;
    let keys = 0;
    let arrays = 0;
    let objects = 0;
    let depth = 0;

    const traverse = (obj: any, currentDepth: number = 0) => {
      if (!obj || typeof obj !== 'object') return;

      depth = Math.max(depth, currentDepth);

      if (Array.isArray(obj)) {
        arrays++;
        obj.forEach(item => traverse(item, currentDepth + 1));
      } else {
        objects++;
        Object.entries(obj).forEach(([key, value]) => {
          keys++;
          traverse(value, currentDepth + 1);
        });
      }
    };

    if (structure) {
      traverse(structure);
    }

    return { lines, keys, arrays, objects, depth };
  };

  const handleValidation = useCallback(() => {
    if (!yaml.trim()) {
      setValidationResult(null);
      return;
    }

    const result = validateYAML(yaml);
    setValidationResult(result);

    const message = result.isValid
      ? 'YAML is valid!'
      : `Found ${result.errors.filter(e => e.type === 'syntax').length} error(s) and ${result.errors.filter(e => e.type === 'warning').length} warning(s)`;

    setSnackbar({
      open: true,
      message,
      severity: result.isValid ? 'success' : 'error',
    });
  }, [yaml, validateYAML]);

  const saveToHistory = useCallback(() => {
    if (validationResult) {
      HistoryManager.addToHistory({
        toolId: 'yaml-validator',
        input: yaml.substring(0, 100) + (yaml.length > 100 ? '...' : ''),
        output: validationResult.isValid
          ? 'Valid YAML'
          : `${validationResult.errors.length} issues found`,
        title: 'YAML Validated',
      });
      setSnackbar({ open: true, message: 'Saved to history!', severity: 'success' });
    }
  }, [yaml, validationResult]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to copy', severity: 'error' });
    }
  };

  const clearAll = () => {
    setYaml('');
    setValidationResult(null);
  };

  const loadSample = () => {
    const sampleYAML = `# Sample YAML Configuration
app:
  name: "My Application"
  version: "1.0.0"
  debug: true
  
database:
  host: "localhost"
  port: 5432
  name: "mydb"
  credentials:
    username: "admin"
    password: "secret"

features:
  - authentication
  - logging
  - caching
  - monitoring

server:
  host: "0.0.0.0"
  port: 8080
  ssl:
    enabled: false
    cert_path: "/path/to/cert"
    
logging:
  level: "info"
  format: "json"
  outputs:
    - type: "console"
    - type: "file"
      path: "/var/log/app.log"`;

    setYaml(sampleYAML);
    setValidationResult(null);
  };

  const renderStructure = (obj: any, depth: number = 0): React.ReactElement => {
    if (!obj || typeof obj !== 'object') {
      return <span>{JSON.stringify(obj)}</span>;
    }

    return (
      <Box sx={{ ml: depth * 2 }}>
        {Object.entries(obj).map(([key, value], index) => (
          <Box key={index} sx={{ mb: 0.5 }}>
            <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
              {key}:
            </Typography>
            {typeof value === 'object' ? (
              <Box sx={{ ml: 2 }}>{renderStructure(value, depth + 1)}</Box>
            ) : (
              <Typography variant="body2" component="span" sx={{ ml: 1, color: 'text.secondary' }}>
                {JSON.stringify(value)}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
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
          YAML Validator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Validate YAML syntax and structure with beautiful highlighting
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                YAML Content
              </Typography>
              <Box display="flex" gap={1}>
                <Button onClick={loadSample} startIcon={<FaCode />} variant="outlined" size="small">
                  Sample
                </Button>
                <Button
                  onClick={handleCopy}
                  startIcon={<FaCopy />}
                  variant="outlined"
                  size="small"
                  disabled={!yaml.trim()}
                >
                  Copy
                </Button>
                <Button onClick={clearAll} startIcon={<FaTrash />} color="error" size="small">
                  Clear
                </Button>
              </Box>
            </Box>

            {yaml ? (
              <Box sx={{ mb: 2 }}>
                <YAMLHighlighter code={yaml} maxHeight="300px" />
              </Box>
            ) : (
              <TextField
                fullWidth
                multiline
                rows={12}
                value={yaml}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYaml(e.target.value)}
                placeholder="Enter your YAML content here..."
                variant="outlined"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'Monaco, Consolas, monospace',
                    fontSize: '14px',
                  },
                }}
              />
            )}

            {yaml && (
              <TextField
                fullWidth
                multiline
                rows={8}
                value={yaml}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYaml(e.target.value)}
                placeholder="Edit your YAML content here..."
                variant="outlined"
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'Monaco, Consolas, monospace',
                    fontSize: '14px',
                  },
                }}
              />
            )}

            <Box display="flex" gap={2}>
              <Button
                onClick={handleValidation}
                variant="contained"
                startIcon={<FaPlay />}
                disabled={!yaml.trim()}
                sx={{ flex: 1 }}
              >
                Validate YAML
              </Button>
              {validationResult && (
                <Button onClick={saveToHistory} variant="outlined" size="medium">
                  Save to History
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, maxHeight: '600px', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Validation Results
            </Typography>

            {!validationResult ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  color: 'text.secondary',
                }}
              >
                <FaCode size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  Enter YAML to validate
                </Typography>
                <Typography variant="body2">
                  Paste your YAML content and click validate to check for syntax errors
                </Typography>
              </Box>
            ) : (
              <Box>
                {/* Overall Status */}
                <Box display="flex" alignItems="center" mb={3}>
                  {validationResult.isValid ? (
                    <FaCheckCircle color="green" size={24} />
                  ) : (
                    <FaTimesCircle color="red" size={24} />
                  )}
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                    {validationResult.isValid ? 'Valid YAML' : 'Invalid YAML'}
                  </Typography>
                </Box>

                {/* Statistics */}
                <Box mb={3}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    <FaInfo style={{ marginRight: 8 }} />
                    Statistics
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      label={`${validationResult.statistics.lines} lines`}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={`${validationResult.statistics.keys} keys`}
                      color="info"
                      size="small"
                    />
                    <Chip
                      label={`${validationResult.statistics.objects} objects`}
                      color="success"
                      size="small"
                    />
                    <Chip
                      label={`${validationResult.statistics.arrays} arrays`}
                      color="warning"
                      size="small"
                    />
                    <Chip
                      label={`${validationResult.statistics.depth} max depth`}
                      color="secondary"
                      size="small"
                    />
                  </Box>
                </Box>

                {/* Errors and Warnings */}
                {validationResult.errors.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                      Issues ({validationResult.errors.length})
                    </Typography>
                    <List dense>
                      {validationResult.errors.map((error, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            {error.type === 'syntax' ? (
                              <FaTimesCircle color="red" />
                            ) : (
                              <FaInfo color="orange" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box>
                                <Chip
                                  label={error.type}
                                  color={error.type === 'syntax' ? 'error' : 'warning'}
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                                {error.message}
                              </Box>
                            }
                            secondary={`Line ${error.line}, Column ${error.column}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Structure Preview */}
                {validationResult.isValid && validationResult.structure && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        <FaTree style={{ marginRight: 8 }} />
                        Structure Preview
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          fontFamily: 'Monaco, Consolas, monospace',
                          fontSize: '14px',
                          maxHeight: '200px',
                          overflow: 'auto',
                        }}
                      >
                        {renderStructure(validationResult.structure)}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Info Section */}
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          About YAML Validation
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          YAML (Yet Another Markup Language) is a human-readable data serialization standard. This
          tool validates YAML syntax and provides insights into the document structure.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="✓ Syntax checking" size="small" color="primary" />
          <Chip label="✓ Structure analysis" size="small" color="success" />
          <Chip label="✓ Indentation validation" size="small" color="info" />
          <Chip label="✓ Best practices" size="small" color="warning" />
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
