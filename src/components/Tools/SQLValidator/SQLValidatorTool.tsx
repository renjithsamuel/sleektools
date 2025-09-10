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
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCode,
  FaTrash,
  FaPlay,
} from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
  analysis: {
    statementType: string;
    tableCount: number;
    columnCount: number;
    hasJoins: boolean;
    hasSubqueries: boolean;
    hasAggregations: boolean;
  };
}

interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationWarning {
  line: number;
  message: string;
  suggestion: string;
}

export const SQLValidatorTool = () => {
  const [sql, setSql] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const validateSQL = useCallback((sqlQuery: string): ValidationResult => {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: string[] = [];

    // Basic SQL validation
    const trimmedSQL = sqlQuery.trim();

    if (!trimmedSQL) {
      return {
        isValid: false,
        errors: [{ line: 1, column: 1, message: 'SQL query is empty', severity: 'error' }],
        warnings: [],
        suggestions: ['Enter a SQL query to validate'],
        analysis: {
          statementType: 'unknown',
          tableCount: 0,
          columnCount: 0,
          hasJoins: false,
          hasSubqueries: false,
          hasAggregations: false,
        },
      };
    }

    // Check for basic SQL syntax
    const sqlUpper = trimmedSQL.toUpperCase();
    const lines = trimmedSQL.split('\n');

    // Check for statement type
    let statementType = 'unknown';
    if (sqlUpper.startsWith('SELECT')) statementType = 'SELECT';
    else if (sqlUpper.startsWith('INSERT')) statementType = 'INSERT';
    else if (sqlUpper.startsWith('UPDATE')) statementType = 'UPDATE';
    else if (sqlUpper.startsWith('DELETE')) statementType = 'DELETE';
    else if (sqlUpper.startsWith('CREATE')) statementType = 'CREATE';
    else if (sqlUpper.startsWith('ALTER')) statementType = 'ALTER';
    else if (sqlUpper.startsWith('DROP')) statementType = 'DROP';

    // Basic syntax checks
    const openParens = (trimmedSQL.match(/\(/g) || []).length;
    const closeParens = (trimmedSQL.match(/\)/g) || []).length;

    if (openParens !== closeParens) {
      errors.push({
        line: lines.length,
        column: 1,
        message: `Mismatched parentheses: ${openParens} opening, ${closeParens} closing`,
        severity: 'error',
      });
    }

    // Check for common syntax errors
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const lineTrimmed = line.trim();

      // Check for missing semicolon at end
      if (lineNum === lines.length && lineTrimmed && !lineTrimmed.endsWith(';')) {
        warnings.push({
          line: lineNum,
          message: 'Missing semicolon at end of statement',
          suggestion: 'Add a semicolon (;) at the end of your SQL statement',
        });
      }

      // Check for SQL injection patterns
      if (lineTrimmed.includes("'") && lineTrimmed.includes('OR') && lineTrimmed.includes('=')) {
        warnings.push({
          line: lineNum,
          message: 'Potential SQL injection pattern detected',
          suggestion: 'Use parameterized queries instead of string concatenation',
        });
      }

      // Check for SELECT without FROM (for non-database specific queries)
      if (
        lineTrimmed.toUpperCase().includes('SELECT') &&
        !sqlUpper.includes('FROM') &&
        !lineTrimmed.toUpperCase().includes('DUAL')
      ) {
        warnings.push({
          line: lineNum,
          message: 'SELECT statement without FROM clause',
          suggestion: 'Add a FROM clause or use SELECT with literal values',
        });
      }
    });

    // Analyze query structure
    const tableMatches = trimmedSQL.match(/FROM\s+(\w+)/gi) || [];
    const joinMatches = trimmedSQL.match(/\b(INNER|LEFT|RIGHT|FULL|CROSS)\s+JOIN\b/gi) || [];
    const subqueryMatches = trimmedSQL.match(/\(\s*SELECT/gi) || [];
    const aggregationMatches = trimmedSQL.match(/\b(COUNT|SUM|AVG|MIN|MAX|GROUP BY)\b/gi) || [];

    const columnMatches = trimmedSQL.match(/SELECT\s+(.*?)\s+FROM/i);
    let columnCount = 0;
    if (columnMatches && columnMatches[1]) {
      const columns = columnMatches[1].split(',').filter(col => col.trim() !== '*');
      columnCount = columns.length;
    }

    // Generate suggestions
    if (statementType === 'SELECT' && !joinMatches.length && tableMatches.length > 1) {
      suggestions.push(
        'Consider using explicit JOINs instead of comma-separated tables for better readability'
      );
    }

    if (sqlUpper.includes('SELECT *')) {
      suggestions.push(
        'Consider specifying column names instead of using SELECT * for better performance'
      );
    }

    if (aggregationMatches.length > 0 && !sqlUpper.includes('GROUP BY')) {
      suggestions.push('When using aggregate functions, consider using GROUP BY clause');
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      warnings,
      suggestions,
      analysis: {
        statementType,
        tableCount: tableMatches.length,
        columnCount,
        hasJoins: joinMatches.length > 0,
        hasSubqueries: subqueryMatches.length > 0,
        hasAggregations: aggregationMatches.length > 0,
      },
    };
  }, []);

  const handleValidation = useCallback(() => {
    if (!sql.trim()) {
      setValidationResult(null);
      return;
    }

    const result = validateSQL(sql);
    setValidationResult(result);

    // Save to history
    HistoryManager.addToHistory({
      toolId: 'sql-validator',
      input: sql.substring(0, 100) + (sql.length > 100 ? '...' : ''),
      output: result.isValid ? 'Valid SQL' : `${result.errors.length} errors found`,
      title: 'SQL Validated',
    });

    const message = result.isValid
      ? 'SQL is valid!'
      : `Found ${result.errors.length} error(s) and ${result.warnings.length} warning(s)`;

    setSnackbar({
      open: true,
      message,
      severity: result.isValid ? 'success' : 'error',
    });
  }, [sql, validateSQL]);

  const clearAll = () => {
    setSql('');
    setValidationResult(null);
  };

  const loadSampleQuery = () => {
    const sampleSQL = `SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2023-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 10;`;

    setSql(sampleSQL);
    setValidationResult(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          SQL Validator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Validate SQL syntax and get suggestions for improvement
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                SQL Query
              </Typography>
              <Box display="flex" gap={1}>
                <Button
                  onClick={loadSampleQuery}
                  startIcon={<FaCode />}
                  variant="outlined"
                  size="small"
                >
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
              value={sql}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSql(e.target.value)}
              placeholder="Enter your SQL query here..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Monaco, Consolas, monospace',
                  fontSize: '14px',
                },
              }}
            />

            <Box mt={2}>
              <Button
                onClick={handleValidation}
                variant="contained"
                startIcon={<FaPlay />}
                disabled={!sql.trim()}
                fullWidth
              >
                Validate SQL
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
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
                  Enter SQL to validate
                </Typography>
                <Typography variant="body2">
                  Paste your SQL query and click validate to check for syntax errors
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
                    {validationResult.isValid ? 'Valid SQL' : 'Invalid SQL'}
                  </Typography>
                </Box>

                {/* Query Analysis */}
                <Box mb={3}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Query Analysis
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    <Chip
                      label={`Type: ${validationResult.analysis.statementType}`}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={`Tables: ${validationResult.analysis.tableCount}`}
                      color="info"
                      size="small"
                    />
                    {validationResult.analysis.hasJoins && (
                      <Chip label="Has JOINs" color="success" size="small" />
                    )}
                    {validationResult.analysis.hasSubqueries && (
                      <Chip label="Has Subqueries" color="warning" size="small" />
                    )}
                    {validationResult.analysis.hasAggregations && (
                      <Chip label="Has Aggregations" color="secondary" size="small" />
                    )}
                  </Box>
                </Box>

                {/* Errors */}
                {validationResult.errors.length > 0 && (
                  <Box mb={3}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 600, color: 'error.main' }}
                    >
                      Errors ({validationResult.errors.length})
                    </Typography>
                    <List dense>
                      {validationResult.errors.map((error, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <FaTimesCircle color="red" />
                          </ListItemIcon>
                          <ListItemText
                            primary={error.message}
                            secondary={`Line ${error.line}, Column ${error.column}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Warnings */}
                {validationResult.warnings.length > 0 && (
                  <Box mb={3}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 600, color: 'warning.main' }}
                    >
                      Warnings ({validationResult.warnings.length})
                    </Typography>
                    <List dense>
                      {validationResult.warnings.map((warning, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <FaExclamationTriangle color="orange" />
                          </ListItemIcon>
                          <ListItemText primary={warning.message} secondary={warning.suggestion} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Suggestions */}
                {validationResult.suggestions.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 600, color: 'info.main' }}
                    >
                      Suggestions
                    </Typography>
                    <List dense>
                      {validationResult.suggestions.map((suggestion, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <FaCheckCircle color="blue" />
                          </ListItemIcon>
                          <ListItemText primary={suggestion} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Info Section */}
      <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          About SQL Validation
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This tool checks your SQL queries for syntax errors, potential issues, and provides
          suggestions for improvement. It supports common SQL operations and helps identify best
          practices.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Chip label="✓ Syntax checking" size="small" color="primary" />
          <Chip label="✓ Best practices" size="small" color="success" />
          <Chip label="✓ Query analysis" size="small" color="info" />
          <Chip label="✓ Security warnings" size="small" color="warning" />
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
