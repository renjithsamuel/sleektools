'use client';
import { useState, useCallback, useMemo } from 'react';
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
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  FaCopy,
  FaUpload,
  FaTrash,
  FaEquals,
  FaExchangeAlt,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { HistoryManager } from '../../../utils/historyManager';

interface DiffResult {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  lineNumber?: number;
}

export const TextCompareTool = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [compareMode, setCompareMode] = useState<'line' | 'word' | 'char'>('line');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Simple diff algorithm
  const calculateDiff = useCallback((text1: string, text2: string, mode: string): DiffResult[] => {
    let items1: string[], items2: string[];

    switch (mode) {
      case 'line':
        items1 = text1.split('\n');
        items2 = text2.split('\n');
        break;
      case 'word':
        items1 = text1.split(/\s+/).filter(w => w);
        items2 = text2.split(/\s+/).filter(w => w);
        break;
      case 'char':
        items1 = text1.split('');
        items2 = text2.split('');
        break;
      default:
        items1 = text1.split('\n');
        items2 = text2.split('\n');
    }

    const result: DiffResult[] = [];
    const maxLength = Math.max(items1.length, items2.length);

    for (let i = 0; i < maxLength; i++) {
      const item1 = items1[i] || '';
      const item2 = items2[i] || '';

      if (item1 === item2) {
        if (item1) {
          result.push({ type: 'unchanged', value: item1, lineNumber: i + 1 });
        }
      } else {
        if (item1) {
          result.push({ type: 'removed', value: item1, lineNumber: i + 1 });
        }
        if (item2) {
          result.push({ type: 'added', value: item2, lineNumber: i + 1 });
        }
      }
    }

    return result;
  }, []);

  const diffResult = useMemo(() => {
    if (!text1 && !text2) return [];
    return calculateDiff(text1, text2, compareMode);
  }, [text1, text2, compareMode, calculateDiff]);

  const stats = useMemo(() => {
    const added = diffResult.filter(d => d.type === 'added').length;
    const removed = diffResult.filter(d => d.type === 'removed').length;
    const unchanged = diffResult.filter(d => d.type === 'unchanged').length;

    return { added, removed, unchanged, total: added + removed + unchanged };
  }, [diffResult]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to copy', severity: 'error' });
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    textSetter: (text: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as string;
        textSetter(content);
      };
      reader.readAsText(file);
    }
  };

  const clearAll = () => {
    setText1('');
    setText2('');
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  const saveComparison = () => {
    if (text1 || text2) {
      HistoryManager.addToHistory({
        toolId: 'text-compare',
        input: `Text 1: ${text1.substring(0, 100)}${text1.length > 100 ? '...' : ''}\nText 2: ${text2.substring(0, 100)}${text2.length > 100 ? '...' : ''}`,
        output: `Differences: +${stats.added} -${stats.removed} =${stats.unchanged}`,
        title: 'Text Comparison',
      });
      setSnackbar({ open: true, message: 'Comparison saved to history!', severity: 'success' });
    }
  };

  const MotionPaper = motion(Paper);

  const renderDiffLine = (diff: DiffResult, index: number) => {
    const getBackgroundColor = () => {
      switch (diff.type) {
        case 'added':
          return 'rgba(76, 175, 80, 0.1)';
        case 'removed':
          return 'rgba(244, 67, 54, 0.1)';
        default:
          return 'transparent';
      }
    };

    const getBorderLeft = () => {
      switch (diff.type) {
        case 'added':
          return '3px solid #4CAF50';
        case 'removed':
          return '3px solid #F44336';
        default:
          return '3px solid transparent';
      }
    };

    return (
      <Box
        key={index}
        sx={{
          backgroundColor: getBackgroundColor(),
          borderLeft: getBorderLeft(),
          padding: '4px 8px',
          fontFamily: 'Monaco, Consolas, monospace',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          display: 'flex',
          alignItems: 'flex-start',
          minHeight: '20px',
        }}
      >
        {showLineNumbers && (
          <Box
            sx={{
              minWidth: '40px',
              color: 'text.secondary',
              fontSize: '12px',
              marginRight: 2,
              userSelect: 'none',
            }}
          >
            {diff.lineNumber}
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          {diff.type === 'added' && <span style={{ color: '#4CAF50', marginRight: 4 }}>+</span>}
          {diff.type === 'removed' && <span style={{ color: '#F44336', marginRight: 4 }}>-</span>}
          {diff.value}
        </Box>
      </Box>
    );
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
            Text Compare Tool
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Compare two text blocks and visualize the differences
          </Typography>

          {/* Controls */}
          <Box display="flex" justifyContent="center" gap={2} mb={2} flexWrap="wrap">
            <ToggleButtonGroup
              value={compareMode}
              exclusive
              onChange={(_: any, newMode: any) => newMode && setCompareMode(newMode)}
              size="small"
            >
              <ToggleButton value="line">Line by Line</ToggleButton>
              <ToggleButton value="word">Word by Word</ToggleButton>
              <ToggleButton value="char">Character</ToggleButton>
            </ToggleButtonGroup>

            <Button
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              startIcon={showLineNumbers ? <FaEyeSlash /> : <FaEye />}
              variant="outlined"
              size="small"
            >
              Line Numbers
            </Button>
          </Box>

          {/* Stats */}
          {stats.total > 0 && (
            <Box display="flex" justifyContent="center" gap={2} mb={2}>
              <Chip label={`${stats.added} added`} color="success" size="small" />
              <Chip label={`${stats.removed} removed`} color="error" size="small" />
              <Chip label={`${stats.unchanged} unchanged`} color="default" size="small" />
            </Box>
          )}
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* Text Input 1 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Text 1 (Original)
              </Typography>
              <Box display="flex" gap={1}>
                <input
                  type="file"
                  accept=".txt"
                  onChange={e => handleFileUpload(e, setText1)}
                  style={{ display: 'none' }}
                  id="file-upload-1"
                />
                <label htmlFor="file-upload-1">
                  <IconButton component="span" color="primary">
                    <FaUpload />
                  </IconButton>
                </label>
                <IconButton onClick={() => handleCopy(text1)} disabled={!text1} color="primary">
                  <FaCopy />
                </IconButton>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={15}
              value={text1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText1(e.target.value)}
              placeholder="Paste or type the first text here..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Monaco, Consolas, monospace',
                  fontSize: '14px',
                },
              }}
            />
          </Paper>
        </Grid>

        {/* Text Input 2 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Text 2 (Modified)
              </Typography>
              <Box display="flex" gap={1}>
                <input
                  type="file"
                  accept=".txt"
                  onChange={e => handleFileUpload(e, setText2)}
                  style={{ display: 'none' }}
                  id="file-upload-2"
                />
                <label htmlFor="file-upload-2">
                  <IconButton component="span" color="primary">
                    <FaUpload />
                  </IconButton>
                </label>
                <IconButton onClick={() => handleCopy(text2)} disabled={!text2} color="primary">
                  <FaCopy />
                </IconButton>
              </Box>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={15}
              value={text2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText2(e.target.value)}
              placeholder="Paste or type the second text here..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontFamily: 'Monaco, Consolas, monospace',
                  fontSize: '14px',
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="center" gap={2} mt={3}>
        <Button
          onClick={swapTexts}
          startIcon={<FaExchangeAlt />}
          variant="outlined"
          disabled={!text1 && !text2}
        >
          Swap Texts
        </Button>
        <Button onClick={saveComparison} variant="contained" disabled={!text1 && !text2}>
          Save Comparison
        </Button>
        <Button
          onClick={clearAll}
          startIcon={<FaTrash />}
          variant="outlined"
          color="error"
          disabled={!text1 && !text2}
        >
          Clear All
        </Button>
      </Box>

      {/* Diff Results */}
      {diffResult.length > 0 && (
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Comparison Results
          </Typography>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              maxHeight: '400px',
              overflow: 'auto',
            }}
          >
            {diffResult.map((diff, index) => renderDiffLine(diff, index))}
          </Box>
        </Paper>
      )}

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
